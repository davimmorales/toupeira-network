/*
  ToupeiraClient.cpp - Biblioteca HTTP para o servidor Toupeira.
  Criado por Diego W. O. Ferreira, 28 de Abril, 2018.
  Released into the public domain.
*/

#include <Arduino.h>
#include <Ethernet.h>
#include "ToupeiraClient.h"

// Ethernet client
EthernetClient _client;

ToupeiraClient::ToupeiraClient(const char * ip, int port) {
    _ip = ip;
    _port = port;
}

void ToupeiraClient::doGet() {
    // Conecta ao servidor
    if(_client.connect(_ip, _port)) {
        Serial.println("conectado (GET)");
        _client.println("GET /api/receive HTTP/1.1");
        _client.println("Host: " + String(_ip) + ":" + _port); // Endereço do servidor
        _client.println("Connection: close");
        _client.println();        
    } else {
        // if you didn't get a connection to the server:
        Serial.println("connection failed");
    }
    
    // Aguarda os dados
    while(_client.connected() && !_client.available()) delay(1);
    // Conectado ou dados disponiveis
    while (_client.available()) {
        // Trata os dados recebidos
        //decodificaDados();
        if (_client.available()) {
            char c = _client.read();
            Serial.print(c);
        }

        // if the server's disconnected, stop the client:
        if (!_client.connected()) {
            Serial.println();
            Serial.println("desconectado (GET)");
            // Termina a conexao
            _client.stop();
        }
    }
}

void ToupeiraClient::doPost() {
    // Conecta ao servidor
    if (_client.connect(_ip, _port)) {
        Serial.println("conectado (POST)");
        // client.println();
        // preparaJSON();
        // Serial.println(json);
        // client.println("POST /EstacaoMeteorologica/rest/dados HTTP/1.1");
        // client.println("Host: 192.168.1.108:8080"); // Endereco do servidor
        // client.println("Content-Type: application/json; charset=utf-8");
        // client.println("Connection: close");
        // client.print("Content-Length: ");
        // client.println(json.length());
        // client.println();
        // client.println(json);
        // client.println();
    }
    
    // Termina a conexao
    if (_client.connected()) {
        _client.stop();
        Serial.println("desconectado (POST)");
    }
}
