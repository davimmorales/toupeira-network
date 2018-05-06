/**
 * Driver arduino ethernet
 */

// Bibliotecas Ethernet
#include <SPI.h>
#include <Ethernet.h>
#include "ToupeiraClient.h"

// Endereço MAC do Ethernet Shield
byte mac[] = { 0x00, 0xAA, 0xBB, 0xCC, 0xDE, 0x02 };

// Set the static IP address to use if the DHCP fails to assign
IPAddress ip(192, 168, 122, 110);

// Server's IP
const char * serverIp = "toupeira-network.herokuapp.com";
int serverPort = 80;
ToupeiraClient toupeiraClient(serverIp, serverPort);

// Endpoints
const char * sendEndpoint = "/api/send";
const char * receiveEndpoint = "/api/receive";


void setup() {
    // Open serial communications and wait for port to open
    Serial.begin(9600);

    Serial.println("connecting...");
    // start the Ethernet connection:
    if (Ethernet.begin(mac) == 0) {
        Serial.println("Failed to configure Ethernet using DHCP");
        // try to congifure using IP address instead of DHCP
        Ethernet.begin(mac, ip);
    }

    // give the Ethernet shield a second to initialize
    delay(1000);
    Serial.println("connected...");
}

void loop() {
    if (Serial.available() > 0) {
        int inByte = Serial.read();
      Serial.println("available");
        switch (inByte) {
            case '1':
                  toupeiraClient.doGet(sendEndpoint);
                  
            break;
            case '2':
                  toupeiraClient.doPost(sendEndpoint,11); // TODO: Passar variável e não valor chumbado
            break;
            case '3':
                  toupeiraClient.doGet(receiveEndpoint);
            break;
            case '4':
                  toupeiraClient.doPost(receiveEndpoint,11); // TODO: Passar variável e não valor chumbado
            break;
            default:
            break;
        }
    }
}
