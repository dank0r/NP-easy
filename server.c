#include <stdio.h>
#include <stdlib.h>
#include <netinet/in.h>
#include <sys/types.h>
#include <arpa/inet.h>
#include <string.h>
#include <unistd.h>
#include <setjmp.h>
#include <signal.h>

const unsigned int port = 1100; //порт для связи
const int VERY_BIG = 1024 * 1024;
const int MAX_LEN = 1024;

int socConnectFD;

char* concat(const char *s1, const char *s2)
{
	char *result = malloc(strlen(s1) + strlen(s2) + 1);
	strcpy(result, s1);
    	strcat(result, s2);
	return result;
}

void signalEndHandler(int signum)
{
	shutdown(socConnectFD, SHUT_RDWR);
	close(socConnectFD);
	printf("\nExiting...\n");
	exit(signum);
}



int main()
{
	signal(SIGINT, signalEndHandler);
	char buf[VERY_BIG]; //буфер для получения данных
	char name[MAX_LEN];
	char actionId[2];
	char solutionId[MAX_LEN];
	struct sockaddr_in stSockAddr;
	stSockAddr.sin_family = PF_INET;
	stSockAddr.sin_port = htons (port); 
	stSockAddr.sin_addr.s_addr = htonl(INADDR_ANY);
	int mySocket = socket(PF_INET, SOCK_STREAM, IPPROTO_TCP);
	if (mySocket == -1)
	{
		perror("Error while creating socket!\n");
		return -1;
	}
	if (bind(mySocket, (struct sockaddr*) &stSockAddr, sizeof(stSockAddr)) < 0)
	{
		printf("Error binding socket!\n");
		close(mySocket);
		return -2;
	}
	if (listen(mySocket, 10) == -1)
	{
		printf("Error listen socket!\n");
		close(mySocket);
		return -3;
	}

	for (;;)
	{
		struct sockaddr_in client_addr; 
		int cl_size = sizeof(client_addr);
		socConnectFD = accept(mySocket, (struct sockaddr*) &client_addr, (socklen_t*)&cl_size);
		if (socConnectFD < 0)
		{
			printf("Error accepting data!\n");
			close(socConnectFD);
			return -4;
		}
                //printf ("%d/", ntohs(client_addr.sin_addr.s_addr));
		read(socConnectFD, solutionId, sizeof(solutionId));
		printf("\nsolutionId %s\n", solutionId);
		write(socConnectFD, "OK", sizeof("OK"));
		read(socConnectFD, actionId, sizeof(actionId));
		printf("\nactionId %s\n", actionId);
		switch (actionId[0])
		{
			case '0':
			{
				write(socConnectFD, "OK", sizeof("OK"));
				int resultMkdir = system(concat("mkdir ", solutionId));
				read(socConnectFD, name, sizeof(name));
				write(socConnectFD, "OK", sizeof("OK"));
				read(socConnectFD, buf, sizeof(buf));
				write(socConnectFD, "OK", sizeof("OK"));
				if (resultMkdir == -1)
					break;
				char fpPath[MAX_LEN];
				sprintf(fpPath, "./%s/%s%c", solutionId, name, '\0');
				FILE *fp = fopen(fpPath, "wb");
				fprintf(fp, "%s", buf);
				fclose(fp);
				char runCommand[MAX_LEN];
				sprintf(runCommand, "./docker.sh %s %s &%c", solutionId, name, '\0');
				//sprintf(runCommand, "./docker.sh %s %s", solutionId, name);
				system(runCommand);
				break;
			}
			case '1':
			{
				char returnCodePath[MAX_LEN];
				sprintf(returnCodePath, "./%s/return_code%c", solutionId, '\0');
				char returnCode[MAX_LEN];
				FILE *returnCodeFile = fopen(returnCodePath, "r");
				int returnCodeSize = fscanf(returnCodeFile, "%s", returnCode);
				fclose(returnCodeFile);
				if (returnCodeSize == -1)
				{
					write(socConnectFD, "WAIT", sizeof("WAIT"));
				}
				else
				{
					if (returnCode[0] == '0') 
					{
						write(socConnectFD, "END", sizeof("END"));
					}
					else
					{
						write(socConnectFD, "CE", sizeof("CE"));
					}
				}
				break;
			}
			case '2':
			{
				char outputPath[MAX_LEN];
				sprintf(outputPath, "./%s/output%c", solutionId, '\0');
				FILE *outputFile = fopen(outputPath, "r");
				char *outputBuf;
				ssize_t outputSize;
				ssize_t tmp;
				outputSize = getline(&outputBuf, &tmp, outputFile);
				if (outputSize == 0)
				{
					write(socConnectFD, "NO_OUTPUT", sizeof("NO_OUTPUT"));
				}
				else
				{
					write(socConnectFD, outputBuf, outputSize);
				}
				free(outputBuf);
				char rmCommand[MAX_LEN];
				sprintf(rmCommand, "rm -r ./%s", solutionId);
				system(rmCommand);
				fclose(outputFile);
				break;
			}
			default:
			{
				write(socConnectFD, "ERROR", sizeof("ERROR"));
			}
		}
		shutdown(socConnectFD, SHUT_RDWR);
		close(socConnectFD);
	}
	return 0;
}
