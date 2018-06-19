// Ethernet Libraries
#include <SPI.h>
#include <Ethernet.h>
#include "ToupeiraClient.h"

// Ethernet Shield MAC Address
byte mac[] = { 0x00, 0xAA, 0xBB, 0xCC, 0xDE, 0x02 };

// Set the static IP address to use if the DHCP fails to assign
IPAddress ip(192, 168, 122, 110);

// Server's IP and PORT
const char * serverIp = "toupeira-network.herokuapp.com";
int serverPort = 80;

// Toupeira Client
bool verboseMode = false;
ToupeiraClient toupeiraClient(serverIp, serverPort, verboseMode);

// Endpoints
const char * GET_CURRENT_PLAYER_ENDPOINT = "/game/currentPlayer";
const char * POST_PLAY_ENDPOINT = "/game/play";

// Constants
const int ANALOG_TO_DIGITAL_THRESHOLD = 1000;
const int IO_PINS_AMOUNT = 8;
const int input[] = {
  A8, A9, A10, A11, A12, A13, A14, A15
};
const int waitingValueFromFPGAOutputLED = 13;
const int PLAYER_ID = 1;

// Variables
int currentValue;
int previousValue;
String lastMessage;

// State Machine
const int WAITING_TURN = 0;
const int WAITING_VALUE_FROM_FPGA = 1;
const int SENDING_VALUE_TO_SERVER = 2;

int STATE = WAITING_TURN;

void setup() {
  for (int i = 0; i < IO_PINS_AMOUNT; i++) {
    pinMode(input[i], INPUT);
  }
  pinMode(waitingValueFromFPGAOutputLED, OUTPUT);

  analogReference(INTERNAL1V1);

  Serial.begin(9600);
  Serial.println("Connecting...");
  if (Ethernet.begin(mac) == 0) {
      Serial.println("Failed to configure Ethernet using DHCP");
      Ethernet.begin(mac, ip);
  }
  delay(1000);
  Serial.println("Connected...");
}

void loop() {
  delay(500);
  switch (STATE){
    case WAITING_TURN:
      printMessage("Waiting Turn...");
      digitalWrite(waitingValueFromFPGAOutputLED, LOW);
      if (toupeiraClient.getCurrentPlayer(GET_CURRENT_PLAYER_ENDPOINT) == PLAYER_ID) {
        STATE = WAITING_VALUE_FROM_FPGA;
      }
      break;
    case WAITING_VALUE_FROM_FPGA:
      printMessage("Waiting Value From FPGA...");
      digitalWrite(waitingValueFromFPGAOutputLED, HIGH);
      currentValue = binaryToDecimalFromFPGA();
      if (currentValue != 0 && currentValue != previousValue) {
        previousValue = currentValue;
        STATE = SENDING_VALUE_TO_SERVER;
      }
      break;
    case SENDING_VALUE_TO_SERVER:
      printMessage("Sending Value To Server...");
      digitalWrite(waitingValueFromFPGAOutputLED, LOW);
      toupeiraClient.postPlay(POST_PLAY_ENDPOINT, PLAYER_ID, currentValue);
      STATE = WAITING_TURN;
      break;
    default:
      digitalWrite(waitingValueFromFPGAOutputLED, LOW);
      STATE = WAITING_TURN;
      break;
  }
}

void printMessage(String message) {
  if (message != lastMessage) {
    Serial.println(message);
    lastMessage = message;
  }
}

int binaryToDecimalFromFPGA() {
  int decimal = 0;
  int power = 1;
  for (int i = 0; i < IO_PINS_AMOUNT; i++) {
    if (analogToDigital(i)) {
      decimal += power;
    }
    power *= 2;
  }
  return decimal;
}

int analogToDigital(int index) {
  return analogRead(input[index]) >= ANALOG_TO_DIGITAL_THRESHOLD ? 1 : 0;
}
