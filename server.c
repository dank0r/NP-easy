#include <stdio.h>
#include <stdlib.h>
#include <netinet/in.h>
#include <sys/types.h>
#include <arpa/inet.h>
#include <string.h>
#include <unistd.h>
#include <setjmp.h>
#include <signal.h>

#define PORT 1100
#define VERY_BIG 1024 * 1024
#define MAX_LEN 1024
#define MAX_CONTAINERS 2

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
	char buf[VERY_BIG]; 
	char name[MAX_LEN];
	char actionId[2];
	int currentContainers = 0;
	char solutionId[MAX_LEN];
	struct sockaddr_in stSockAddr;
	stSockAddr.sin_family = PF_INET;
	stSockAddr.sin_port = htons (PORT); 
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
	printf("Server started normally.\n");
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
		read(socConnectFD, solutionId, sizeof(solutionId));
		printf("SolutionId %s\n", solutionId);
		write(socConnectFD, "OK", sizeof("OK"));
		printf("OK\n");
		read(socConnectFD, actionId, sizeof(actionId));
		printf("ActionId %s\n", actionId);
		switch (actionId[0])
		{
			case '0':
			{
				write(socConnectFD, "OK", sizeof("OK"));
				printf("OK\n");
				int resultMkdir = system(concat("mkdir ", solutionId));
				read(socConnectFD, name, sizeof(name));
				int end_name = 0;
				while (name[end_name] != '\0')
					end_name++;
				write(socConnectFD, "OK", sizeof("OK"));
				printf("OK\n");
				read(socConnectFD, buf, sizeof(buf));
				write(socConnectFD, "OK", sizeof("OK"));
				printf("OK\n");
				shutdown(socConnectFD, SHUT_RDWR);
				close(socConnectFD);
				if (resultMkdir == -1)
					break;
				char fpPath[MAX_LEN];
				sprintf(fpPath, "/root/sandbox/%s/%s%c", solutionId, name, '\0');
				FILE *fp = fopen(fpPath, "wb");
				fprintf(fp, "%s", buf);
				fclose(fp);
				char runCommand[MAX_LEN];
				if (name[end_name - 1] == 'y')
					sprintf(runCommand, "/root/sandbox/python_docker.sh %s %s &%c", solutionId, name, '\0');
				else
					sprintf(runCommand, "/root/sandbox/cpp_docker.sh %s %s &%c", solutionId, name, '\0');
				system(runCommand);
				currentContainers++;
				break;
			}
			case '1':
			{
				char returnCodePath[MAX_LEN];
				sprintf(returnCodePath, "/root/sandbox/%s/return_code%c", solutionId, '\0');
				char returnCode[MAX_LEN];
				FILE *returnCodeFile = fopen(returnCodePath, "r");
				if (returnCodeFile == NULL)
				{
					write(socConnectFD, "NO", sizeof("NO"));
					printf("NO\n");
					break;
				}
				int returnCodeSize = fscanf(returnCodeFile, "%s", returnCode);
				fclose(returnCodeFile);
				if (returnCodeSize == -1)
				{
					write(socConnectFD, "WAIT", sizeof("WAIT"));
					printf("WAIT\n");
				}
				else
				{
					if (returnCode[0] == '0') 
					{
						write(socConnectFD, "END", sizeof("END"));
						printf("END\n");
						currentContainers--;
					}
					else
					{
						write(socConnectFD, "CE", sizeof("CE"));
						printf("CE\n");
						currentContainers--;
						char rmCommand[MAX_LEN];
						sprintf(rmCommand, "rm -r /root/sandbox/%s", solutionId);
						system(rmCommand);
					}
				}
				shutdown(socConnectFD, SHUT_RDWR);
				close(socConnectFD);
				break;
			}
			case '2':
			{
				char outputPath[MAX_LEN];
				sprintf(outputPath, "/root/sandbox/%s/output%c", solutionId, '\0');
				FILE *outputFile = fopen(outputPath, "r");
				FILE *inputFile = fopen("/root/sandbox/input", "r");
				int n;
				char empty;
				fscanf(inputFile, "%d", &n);
				fscanf(inputFile, "%c", &empty);
				int * ans = malloc(n * sizeof(int));
				float ** matrix = malloc(n * sizeof(float *));
				for (int i = 0; i < n; i++)
				{
					matrix[i] = malloc(n * sizeof(float));
				}
				for (int i = 0; i < n; i++)
				{
					if (fscanf(outputFile, "%d", &ans[i]) < 0)
					{
						write(socConectFD, "NO_OUTPUT\0", sizeof("NO_OUTPUT\0"));
						printf("NO_OUTPUT\n");
						shutdown(socConnectFD, SHUT_RDWR);
						close(socConnectFD);
						break;
					}
				}
				fclose(outputFile);
				for (int i = 0; i < n; i++)
				{
					for (int j = 0; j < n; j++)
						fscanf(inputFile, "%f", &matrix[i][j]);
					fscanf(inputFile, "%c", &empty);
				}
				fclose(inputFile);
				float end = 0;
				for (int i = 1; i < n; i++)
					end += matrix[ans[i - 1]][ans[i]];
				char endMessage[MAX_LEN];
				sprintf(endMessage, "%f%c", end, '\0');
				int len = 0;
				while (endMessage[len] != '\0')
				{
					len++;
				}
				write(socConnectFD, endMessage, len);
				printf("ANSWER %f\n", end);
				for (int  i = 0; i < n; i++)
				{
					if (matrix[i] != NULL)
					{
						free(matrix[i]);
					}
				}
				if (matrix != NULL)
				{
					free(matrix);
				}
				if (ans != NULL)
				{
					free(ans);
				}
				char rmCommand[MAX_LEN];
				sprintf(rmCommand, "rm -r /root/sandbox/%s", solutionId);
				system(rmCommand);
				shutdown(socConnectFD, SHUT_RDWR);
				close(socConnectFD);
				break;
			}
			default:
			{
				write(socConnectFD, "ERROR", sizeof("ERROR"));
				printf("ERROR\n");
				shutdown(socConnectFD, SHUT_RDWR);
				close(socConnectFD);
			}
		}
	}
	return 0;
}
