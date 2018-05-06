/**
* Driver arduino ethernet
*/

// Ethernet Libraries
#include <SPI.h>
#include <Ethernet.h>
#include "ToupeiraClient.h"


// i/o pins amount
const int ioPinsAmnt = 8;

// Threshold for analog to digital entry conversion
const int analogToDigThreshold= 1000;

// Arduino's analog input
const int input[] = {
  A0, A1, A2, A3, A8, A9, A10, A11
};

// Arduino's digital output
const int output[] = {
  24, 26, 28, 30, 32, 34, 36, 38
};

// Auxiliary variable for simple protocol
int previousInByte = 0;

// Ethernet Shield's MAC Address
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

  // Initalizes FPGA's outputs
  for (int i = 0; i < ioPinsAmnt; i++) {
    pinMode(input[i], INPUT);
    pinMode(output[i], OUTPUT);
  }

  // Initalizes analog refernece
  analogReference(INTERNAL2V56);  // Tensao 2.5V, compativel com a FPGA

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

  // if (Serial.available() > 0) {
    // int sendValue = Serial.read();
    int inByte = binaryToDecimal();
    // Serial.println("available");
    Serial.println(inByte);
    if (inByte<5) {
      if (inByte!=previousInByte) {
        previousInByte = inByte;
        switch (inByte) {
          case '1':
          toupeiraClient.doGet(sendEndpoint);
          break;
          case '2':
          toupeiraClient.doPost(sendEndpoint, sendValue); // TODO: Passar variável e não valor chumbado
          break;
          case '3':
          toupeiraClient.doGet(receiveEndpoint);
          break;
          case '4':
          toupeiraClient.doPost(receiveEndpoint, sendValue); // TODO: Passar variável e não valor chumbado
          break;
          default:
          break;
        }
      }
    }
  // }
}

  void toFPGA() {
    if (Serial.available() > 0) {
      int inByte = Serial.read();

      switch (inByte) {
        case '1':
        digitalWrite(output[0], HIGH);
        break;
        case '2':
        digitalWrite(output[1], HIGH);
        break;
        case '3':
        digitalWrite(output[2], HIGH);
        break;
        case '4':
        digitalWrite(output[3], HIGH);
        break;
        case '5':
        digitalWrite(output[4], HIGH);
        break;
        case '6':
        digitalWrite(output[5], HIGH);
        break;
        case '7':
        digitalWrite(output[6], HIGH);
        break;
        case '8':
        digitalWrite(output[7], HIGH);
        break;
        default:
        // writes all outputs as LOW
        for (int i = 0; i < ioPinsAmnt; i++) {
          digitalWrite(output[i], LOW);
        }
      }
    }
  }

  void fromFPGA() {
    Serial.println(binaryToDecimal());
  }

  int binaryToDecimal() {
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
    return analogRead(input[index]) >= analogToDigThreshold ? 1 : 0;
  }
