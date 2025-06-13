#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <ctype.h>

int is_valid(const char *expr) {
    while (*expr) {
        if (!isdigit(*expr) && !strchr("+-*/(). ", *expr)) return 0;
        expr++;
    }
    return 1;
}

int main() {
    int socket_desc, client_sock;
    struct sockaddr_in server, client;
    socklen_t c = sizeof(struct sockaddr_in);
    char client_message[200];

    socket_desc = socket(AF_INET, SOCK_STREAM, 0);
    server.sin_family = AF_INET;
    server.sin_addr.s_addr = INADDR_ANY;
    server.sin_port = htons(8888);

    bind(socket_desc, (struct sockaddr *)&server, sizeof(server));
    listen(socket_desc, 3);
    client_sock = accept(socket_desc, (struct sockaddr *)&client, &c);

    recv(client_sock, client_message, sizeof(client_message), 0);

    if (!is_valid(client_message)) {
        send(client_sock, "Error: Invalid expression", 25, 0);
    } else {
        char command[300];
        snprintf(command, sizeof(command), "echo 'scale=2; %s' | bc", client_message);
        FILE *fp = popen(command, "r");
        char result[100] = {0};
        fgets(result, sizeof(result), fp);
        pclose(fp);
        send(client_sock, result, strlen(result), 0);
    }
    close(client_sock);
    close(socket_desc);
    return 0;
}