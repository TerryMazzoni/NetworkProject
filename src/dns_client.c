#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>

#define PORT 8889

int main() {
    int sock;
    struct sockaddr_in server;
    char message[256], server_reply[256];

    sock = socket(AF_INET, SOCK_STREAM, 0);
    server.sin_addr.s_addr = inet_addr("127.0.0.1");
    server.sin_family = AF_INET;
    server.sin_port = htons(PORT);

    if (connect(sock, (struct sockaddr*)&server, sizeof(server)) < 0) {
        perror("Connect failed");
        return 1;
    }

    printf("Enter query:\n");
    printf("Read: (R,www.domain.com)\n");
    printf("Write: (W,www.domain.com,111.111.111.111)\n");
    fgets(message, sizeof(message), stdin);

    send(sock, message, strlen(message), 0);

    memset(server_reply, 0, sizeof(server_reply));
    recv(sock, server_reply, sizeof(server_reply), 0);
    printf("Server reply: %s\n", server_reply);

    close(sock);
    return 0;
}
