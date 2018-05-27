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

String json;

ToupeiraClient::ToupeiraClient(const char * ip, int port) {
    _ip = ip;
    _port = port;
}

int ToupeiraClient::doGet(const char * endpoint) {
    String getContent;
    String getValue;
    int flagRead = 0;
    // Conecta ao servidor
    if(_client.connect(_ip, _port)) {
        Serial.println("\nconectado (GET)");
        _client.println("GET " + String(endpoint) + " HTTP/1.1");
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
            getContent = getContent+String(c);
        }

        // if the server's disconnected, stop the client:
        if (!_client.connected()) {
            Serial.println();
            Serial.println("desconectado (GET)");
            // Termina a conexao
            _client.stop();
        }
    }

    getValue = (getContent.substring(getContent.indexOf("\"value\":")+8, getContent.length()-1));
    return getValue.toInt();
}

void ToupeiraClient::doPost(const char * endpoint, int value) {
    // Conecta ao servidor
    if (_client.connect(_ip, _port)) {
        Serial.println("\nconectado (POST)");
        _client.println();
        preparaJson(value);
        Serial.println(json);
        _client.println("POST " + String(endpoint) + " HTTP/1.1");
        _client.println("Host: " + String(_ip) + ":" + _port); // Endereco do servidor
        _client.println("Content-Type: application/json; charset=utf-8");
        _client.println("Connection: close");
        _client.print("Content-Length: ");
        _client.println(json.length());
        _client.println();
        _client.println(json);
        _client.println();
    }

    // Termina a conexao
    if (_client.connected()) {
        _client.stop();
        Serial.println("desconectado (POST)");
    }
}

/*
 *  Procedimento utilitário o qual gera um JSON com os dados das leituras realizadas
 */
void ToupeiraClient::preparaJson(int value) {
    json = "";
    json.concat("{\"value\":");
    json.concat(value);
    json.concat("}");
}
