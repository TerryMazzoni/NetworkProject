#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>

int main() {
    int sock;
    struct sockaddr_in server;
    char message[100], server_reply[200];

    sock = socket(AF_INET, SOCK_STREAM, 0);
    server.sin_addr.s_addr = inet_addr("127.0.0.1");
    server.sin_family = AF_INET;
    server.sin_port = htons(8888);

    connect(sock, (struct sockaddr *)&server, sizeof(server));

    printf("Enter arithmetic expression: ");
    fgets(message, sizeof(message), stdin);
    send(sock, message, strlen(message), 0);

    recv(sock, server_reply, sizeof(server_reply), 0);
    printf("Server response: %s\n", server_reply);

    close(sock);
    return 0;
}