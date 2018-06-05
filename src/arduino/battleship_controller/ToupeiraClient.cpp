#include <Arduino.h>
#include <Ethernet.h>
#include "ToupeiraClient.h"

EthernetClient _client;
String CURRENT_PLAYER_KEY = "\"currentPlayerId\"";
String PLAYER_KEY = "\"player\"";
String SQUARE_KEY = "\"square\"";

ToupeiraClient::ToupeiraClient(const char * ip, int port) {
  _ip = ip;
  _port = port;
}

int ToupeiraClient::getCurrentPlayer(const char * endpoint) {
  String getResponse;
  
  if (_client.connect(_ip, _port)) {
    Serial.println("\nConnected (GET)");
    _client.println("GET " + String(endpoint) + " HTTP/1.1");
    _client.println("Host: " + String(_ip) + ":" + String(_port));
    _client.println("Connection: close");
    _client.println();
  } else {
    Serial.println("Connection Failed");
  }

  while (_client.connected() && !_client.available()) {
    delay(1);
  }

  while (_client.available()) {
      if (_client.available()) {
          char c = _client.read();
          Serial.print(c);
          getResponse += String(c);
      }
      if (!_client.connected()) {
          Serial.println();
          Serial.println("Disconnected (GET)");
          _client.stop();
      }
  }

  return getCurrentPlayerFromResponse(getResponse);
}

void ToupeiraClient::postPlay(const char * endpoint, int player, int square) {
  String json = createPlayJSON(player, square);
  if (_client.connect(_ip, _port)) {
    Serial.println("\nConnected (POST)");
    _client.println();
    Serial.println(json);
    _client.println("POST " + String(endpoint) + " HTTP/1.1");
    _client.println("Host: " + String(_ip) + ":" + String(_port));
    _client.println("Content-Type: application/json; charset=utf-8");
    _client.println("Connection: close");
    _client.print("Content-Length: ");
    _client.println(json.length());
    _client.println();
    _client.println(json);
    _client.println();
  }

  if (_client.connected()) {
    _client.stop();
    Serial.println("Disconnected (POST)");
  }
}

int ToupeiraClient::getCurrentPlayerFromResponse(String response) {
  int currentPlayerKeyIndex = response.indexOf(CURRENT_PLAYER_KEY);
  if (currentPlayerKeyIndex < 0) {
    return 0;
  }
  int from = currentPlayerKeyIndex + CURRENT_PLAYER_KEY.length();
  while (!isDigit(response.charAt(from))) {
    from += 1;
  }
  int to = from;
  while (isDigit(response.charAt(to))) {
    to += 1;
  }
  return response.substring(from, to).toInt();
}

String ToupeiraClient::createPlayJSON(int player, int square) {
  return "{" + PLAYER_KEY + ":" + String(player) + ", "
    + SQUARE_KEY + ":" + String(square) + "}";
}
