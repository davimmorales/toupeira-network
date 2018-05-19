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

int objectReceived;
int ioPinsAmnt = 8;

const int analogToDigitalThreshold = 1000;
const int input[] = {
    A0, A1, A2, A3, A4, A5, A8, A9
};

const int output[] = {
    24, 28, 32, 36, 40, 44, 48, 52
};

void setup() {
    // Open serial communications and wait for port to open

    for (int i = 0; i < ioPinsAmnt; i++) {
        pinMode(input[i], INPUT);
        pinMode(output[i], OUTPUT);
    }

    Serial.begin(9600);

    analogReference(INTERNAL1V1);

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


  int inByte;
    if (Serial.available() > 0) {
        int operation = Serial.read();
      Serial.println("available");
        switch (operation) {
            case '1':
                 inByte = binaryToDecimalFromFPGA();
                 //if (inByte != previousInByte) {
                   Serial.println(inByte);
                 //  previousInByte = inByte;
                   toupeiraClient.doPost(sendEndpoint, inByte);
                // }
            break;
            // case '2':
            //       toupeiraClient.doPost(sendEndpoint,11); // TODO: Passar variável e não valor chumbado
            // break;
            case '3':
                  objectReceived = toupeiraClient.doGet(receiveEndpoint);
                  Serial.println(objectReceived);
                  toFPGA(objectReceived);
            break;
            // case '4':
            //       toupeiraClient.doPost(receiveEndpoint,11); // TODO: Passar variável e não valor chumbado
            // break;
            default:
            break;
        }
    }
}

void toFPGA(int value) {
  decimalToBinary(toupeiraClient.doGet(receiveEndpoint));
}

int decimalToBinary(int value) {
  for (int i = 0; i < ioPinsAmnt; i++) {
    int index = ioPinsAmnt-1-i;
    ((value/power(2, index)) > 0) ?
    digitalWrite(output[i], HIGH) : digitalWrite(output[i], LOW);

    value = (value % power(2, index));
  }
}

int power(int value, int exponent) {
  int result = 1;
  for (int i = 0; i < exponent; i++) {
    result *= value;
  }
  return result;
}

int binaryToDecimalFromFPGA() {
  int decimal = 0;
  int power = 1;
  for (int i = 0; i < ioPinsAmnt; i++) {
    if (analogToDigital(i)) {
      decimal += power;
    }
    power *= 2;
  }
  return decimal;
}

int analogToDigital(int index) {
  return analogRead(input[index]) >= analogToDigitalThreshold ? 1 : 0;
}
