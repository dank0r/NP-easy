#include <stdio.h>
#include <stdlib.h>
#include <netinet/in.h>
#include <sys/types.h>
#include <arpa/inet.h>
#include <string.h>
#include <unistd.h>

const unsigned int port = 1100; //порт для связи
const int VERY_BIG = 1024 * 1024;

char* concat(const char *s1, const char *s2)
{
    char *result = malloc(strlen(s1) + strlen(s2) + 1);
    strcpy(result, s1);
    strcat(result, s2);
    return result;
}

int main()
{
	char buf[VERY_BIG]; //буфер для получения данных
	char name[1024];
	char actionId[2];
	char outputBuf[VERY_BIG];
	char solutionId[1024];
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
		struct  sockaddr_in client_addr; 
		int cl_size = sizeof(client_addr);
		int socConnectFD = accept(mySocket, (struct sockaddr*) &client_addr, (socklen_t*)&cl_size);
		if (socConnectFD < 0)
		{
			printf("Error accepting data!\n");
			close(socConnectFD);
			return -4;
		}
                //printf ("%d/", ntohs(client_addr.sin_addr.s_addr));
		try:
		{
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
					system(concat("mkdir ", solutionId));
					read(socConnectFD, name, sizeof(name));
					write(socConnectFD, "OK", sizeof("OK"));
					read(socConnectFD, buf, sizeof(buf));
					write(socConnectFD, "OK", sizeof("OK"));
					char fpPath[1024];
					sprintf(fpPath, "./%s/%s", solutionId, name);
					FILE *fp = fopen(fpPath, "wb");
					fprintf(fp, "%s", buf);
					fclose(fp);
					char runCommand[1024];
					sprintf(runCommand, "./docker.sh %s %s &", solutionId, name);
					//sprintf(runCommand, "./docker.sh %s %s", solutionId, name);
					system(runCommand);
					system("disown");
					break;
				}
				case '1':
				{
					char checkCommand[1024];
					sprintf(checkCommand, "docker ps -a | grep \"solution_%s \" > ./%s/%s", solutionId, solutionId, solutionId);
					system(checkCommand);
					char psPath[1024];
					sprintf(psPath, "./%s/%s", solutionId, solutionId);
					FILE *psFile = fopen(psPath, "r");
					fseek(psFile, 0, SEEK_END);
					long int psSize = ftell(psFile);
					fclose(psFile);
					printf("\npsSize %ld\n", psSize);
					if (psSize < 3)
						write(socConnectFD, "END", sizeof("END"));
					else
						write(socConnectFD, "WAIT", sizeof("WAIT"));
					break;
				}
				case '2':
				{
					char outputPath[1024];
					sprintf(outputPath, "./%s/output", solutionId);
					FILE *outputFile = fopen(outputPath, "w+");
					fseek(outputFile, 0, SEEK_END);
					long int outputSize = ftell(outputFile);
					printf("%ld", outputSize);
					rewind(outputFile);
					if (outputSize == 0)
						write(socConnectFD, "NO_OUTPUT", sizeof("NO_OUTPUT"));
					else
					{
						fread(outputBuf, 1, outputSize, outputFile);
						write(socConnectFD, outputBuf, sizeof(outputBuf));
					}
					char rmCommand[1024];
					sscanf(rmCommand, "rm -r %s", solutionId);
					system(rmCommand);
					fclose(outputFile);
					break;
				}
				default:
				{
					write(socConnectFD, "ERROR", sizeof("ERROR"));
				}
			}
			//for (int i = 0; i < sizeof(name); i++) printf("%c\n", name[i]);
			shutdown(socConnectFD, SHUT_RDWR);
			close(socConnectFD);
		}
	}
	return 0;
}


