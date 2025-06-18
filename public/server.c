#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <ctype.h>

int is_valid(const char *expr) {
    while (*expr) {
        if (!isdigit(*expr) && !strchr("+-*/(). ", *expr)) {
            printf("Invalid character detected: %c\n", *expr);
            return 0;
        }
        expr++;
    }
    return 1;
}

void handle_client(int client_sock) {
    char client_message[200];
    memset(client_message, 0, sizeof(client_message));
    recv(client_sock, client_message, sizeof(client_message), 0);

    // Trim newline characters from the received message
    client_message[strcspn(client_message, "\n")] = 0;

    printf("Received expression: %s\n", client_message); // Debugging
    if (!is_valid(client_message)) {
        send(client_sock, "Error: Invalid expression", 25, 0);
    } else {
        char command[300];
        snprintf(command, sizeof(command), "echo 'scale=2; %s' | bc", client_message);
        printf("Command sent to bc: %s\n", command); // Debugging
        FILE *fp = popen(command, "r");
        if (fp == NULL) {
            send(client_sock, "Error: Unable to process expression", 35, 0);
        } else {
            char result[100] = {0};
            fgets(result, sizeof(result), fp);
            pclose(fp);
            send(client_sock, result, strlen(result), 0);
        }
    }
    close(client_sock);
}

int main() {
    int socket_desc, client_sock;
    struct sockaddr_in server, client;
    socklen_t c = sizeof(struct sockaddr_in);

    socket_desc = socket(AF_INET, SOCK_STREAM, 0);
    if (socket_desc == -1) {
        perror("Could not create socket");
        return 1;
    }

    int opt = 1;
    if (setsockopt(socket_desc, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt)) < 0) {
        perror("setsockopt failed");
        return 1;
    }

    server.sin_family = AF_INET;
    server.sin_addr.s_addr = INADDR_ANY;
    server.sin_port = htons(8888);

    if (bind(socket_desc, (struct sockaddr *)&server, sizeof(server)) < 0) {
        perror("Bind failed");
        return 1;
    }

    listen(socket_desc, 3);
    printf("Server listening on port 8888...\n");

    while (1) {
        client_sock = accept(socket_desc, (struct sockaddr *)&client, &c);
        if (client_sock < 0) {
            perror("Accept failed");
            continue;
        }
        printf("Client connected.\n");

        // Handle client in a child process
        if (fork() == 0) {
            handle_client(client_sock);
            exit(0); // Exit child process after handling client
        }
        close(client_sock); // Parent closes the client socket
    }

    close(socket_desc);
    return 0;
}