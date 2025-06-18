#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>

#define MAX_DOMAINS 100
#define BUFFER_SIZE 1024

typedef struct {
    char domain[256];
    char ip[16];
} DNSRecord;

DNSRecord dnsDB[MAX_DOMAINS];
int dnsCount = 0;

void save_dns_records() {
    FILE *file = fopen("dns_records.txt", "w");
    if (!file) {
        perror("Failed to open file for saving DNS records");
        return;
    }
    for (int i = 0; i < dnsCount; i++) {
        fprintf(file, "%s %s\n", dnsDB[i].domain, dnsDB[i].ip);
    }
    fclose(file);
}

void load_dns_records() {
    FILE *file = fopen("dns_records.txt", "r");
    if (!file) {
        perror("Failed to open file for loading DNS records");
        return;
    }
    dnsCount = 0;
    while (fscanf(file, "%255s %15s", dnsDB[dnsCount].domain, dnsDB[dnsCount].ip) == 2) {
        dnsCount++;
    }
    fclose(file);
}

char *query_dns(const char *domain) {
    for (int i = 0; i < dnsCount; i++) {
        printf("Checking domain: '%s' with '%s' -> %d\n", dnsDB[i].domain, domain, strcmp(dnsDB[i].domain, domain));
        if (strcmp(dnsDB[i].domain, domain) == 0) {
            return dnsDB[i].ip;
        }
    }
    printf("%d\n", dnsCount);
    return NULL;
}

int register_dns(const char *domain, const char *ip) {
    if (query_dns(domain) != NULL) {
        return 0; // Domain already exists
    }
    if (dnsCount >= MAX_DOMAINS) {
        return -1; // Database full
    }
    strcpy(dnsDB[dnsCount].domain, domain);
    strcpy(dnsDB[dnsCount++].ip, ip);

    save_dns_records();

    return 1; // Successfully registered
}

void handle_client(int client_sock) {
    load_dns_records();
    char buffer[BUFFER_SIZE];
    memset(buffer, 0, sizeof(buffer));
    recv(client_sock, buffer, sizeof(buffer), 0);

    // Trim newline characters from the received message
    buffer[strcspn(buffer, "\n")] = 0;

    printf("Received request: %s\n", buffer);

    char response[BUFFER_SIZE];
    memset(response, 0, sizeof(response));

    char action[2], domain[256], ip[16];
    int parsed = sscanf(buffer, "(%1s, %255[^),], %15[^)])", action, domain, ip);

    if (strcmp(action, "R") == 0 && parsed >= 2) {
        char *result = query_dns(domain);
        if (result) {
            snprintf(response, sizeof(response), "%s → %s", domain, result);
        } else {
            snprintf(response, sizeof(response), "Error: Domain not found.");
        }
    } else if (strcmp(action, "W") == 0 && parsed == 3) {
        int status = register_dns(domain, ip);
        if (status == 1) {
            snprintf(response, sizeof(response), "Saved: %s → %s", domain, ip);
            // loop through the database to print all entries
            printf("Current DNS Records:\n");
            for (int i = 0; i < dnsCount; i++) {
                printf("%s → %s\n", dnsDB[i].domain, dnsDB[i].ip);
            }
        } else if (status == 0) {
            snprintf(response, sizeof(response), "Error: Domain already exists.");
        } else {
            snprintf(response, sizeof(response), "Error: Database full.");
        }
    } else {
        snprintf(response, sizeof(response), "Error: Invalid format. Use (R, domain) or (W, domain, IP)");
    }

    printf("dnsCount: %d\n", dnsCount);

    send(client_sock, response, strlen(response), 0);
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
    server.sin_port = htons(8889);

    if (bind(socket_desc, (struct sockaddr *)&server, sizeof(server)) < 0) {
        perror("Bind failed");
        return 1;
    }

    listen(socket_desc, 3);
    printf("DNS Server listening on port 8889...\n");

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