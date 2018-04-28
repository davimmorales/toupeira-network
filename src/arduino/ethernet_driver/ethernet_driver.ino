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
IPAddress ip(192, 168, 1, 110);

// IP do Servidor
const char * serverIp = "192.168.1.106";
int serverPort = 3000;
ToupeiraClient toupeiraClient(serverIp, serverPort);

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
       
        switch (inByte) {
            case '1':
                toupeiraClient.doGet();
                break;
            case '2':
                toupeiraClient.doPost();
                break;
            default:
                break;
        }
    }
}
