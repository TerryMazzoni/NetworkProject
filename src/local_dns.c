#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>

#define PORT 8889
#define MAX 5

typedef struct {
    char domain[100];
    char ip[20];
} DNSRecord;

DNSRecord db[MAX] = {
    {"www.google.com", "222.222.22.2"},
    {"www.facebook.com", "111.111.11.1"},
    {"www.github.com", "123.123.123.123"},
    {"www.stackoverflow.com", "234.234.234.234"},
    {"www.myhome.com", "192.168.1.1"}
};

int find_index(const char *domain) {
    for (int i = 0; i < MAX; i++) {
        if (strcmp(db[i].domain, domain) == 0)
            return i;
    }
    return -1;
}

int main() {
    int sockfd, client_sock;
    struct sockaddr_in server_addr, client_addr;
    socklen_t addr_len = sizeof(client_addr);
    char buffer[256];

    sockfd = socket(AF_INET, SOCK_STREAM, 0);

    server_addr.sin_family = AF_INET;
    server_addr.sin_addr.s_addr = INADDR_ANY;
    server_addr.sin_port = htons(PORT);

    bind(sockfd, (struct sockaddr*)&server_addr, sizeof(server_addr));
    listen(sockfd, 5);

    printf("Local DNS server started on port %d\n", PORT);

    while (1) {
        client_sock = accept(sockfd, (struct sockaddr*)&client_addr, &addr_len);
        memset(buffer, 0, sizeof(buffer));
        recv(client_sock, buffer, sizeof(buffer), 0);

        // Expected message format:
        // (R,www.domain.com)
        // (W,www.domain.com,111.111.111.111)
        printf("Received: %s\n", buffer);

        if (buffer[0] == 'R') {
            // Read request
            char domain[100];
            sscanf(buffer, "(R,%99[^)])", domain);

            int idx = find_index(domain);
            if (idx != -1) {
                send(client_sock, db[idx].ip, strlen(db[idx].ip), 0);
            } else {
                // Here you could implement contacting upper DNS server (optional)
                char *msg = "Error: Domain not found";
                send(client_sock, msg, strlen(msg), 0);
            }

        } else if (buffer[0] == 'W') {
            // Write request
            char domain[100], ip[20];
            sscanf(buffer, "(W,%99[^,],%19[^)])", domain, ip);

            int idx = find_index(domain);
            if (idx != -1) {
                char *msg = "Error: Domain already exists";
                send(client_sock, msg, strlen(msg), 0);
            } else {
                // Add to first empty slot or overwrite last
                int added = 0;
                for (int i = 0; i < MAX; i++) {
                    if (strlen(db[i].domain) == 0) {
                        strcpy(db[i].domain, domain);
                        strcpy(db[i].ip, ip);
                        added = 1;
                        break;
                    }
                }
                if (!added) {
                    // For simplicity overwrite last record
                    strcpy(db[MAX-1].domain, domain);
                    strcpy(db[MAX-1].ip, ip);
                }
                char *msg = "Domain added successfully";
                send(client_sock, msg, strlen(msg), 0);
            }
        } else {
            char *msg = "Error: Invalid request format";
            send(client_sock, msg, strlen(msg), 0);
        }

        close(client_sock);
    }

    close(sockfd);
    return 0;
}