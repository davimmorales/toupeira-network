/**
 * Driver arduino ethernet
 */

// Bibliotecas Ethernet
#include <SPI.h>
#include <Ethernet.h>

// Endereço MAC do Ethernet Shield
byte mac[] = { 0x00, 0xAA, 0xBB, 0xCC, 0xDE, 0x02 };

IPAddress server(192, 168, 1, 106);

// Set the static IP address to use if the DHCP fails to assign
IPAddress ip(192, 168, 1, 110);

// Inicializa o Ethernet client
EthernetClient client;

void setup() {
    // Open serial communications and wait for port to open:
    Serial.begin(9600);

    // start the Ethernet connection:
    if (Ethernet.begin(mac) == 0) {
        Serial.println("Failed to configure Ethernet using DHCP");
        // try to congifure using IP address instead of DHCP:
        Ethernet.begin(mac, ip);
    }

    // give the Ethernet shield a second to initialize:
    delay(1000);
    Serial.println("connecting...");

    // if you get a connection, report back via serial:
    if (client.connect(server, 3000)) {
        Serial.println("connected");
        client.println("GET /api/receive HTTP/1.1");
        client.println("Host: 192.168.1.106:3000"); // Endereco do servidor
        client.println("Connection: close");
        client.println();
    } else {
        // if you didn't get a connection to the server:
        Serial.println("connection failed");
    }
}

void loop() {
    // if there are incoming bytes available
    // from the server, read them and print them:
    if (client.available()) {
        char c = client.read();
        Serial.print(c);
    }

    // if the server's disconnected, stop the client:
    if (!client.connected()) {
        Serial.println();
        Serial.println("disconnecting.");
        client.stop();

        // do nothing forevermore:
        while (true);
    }
}
