/*
  ToupeiraClient.h - Biblioteca HTTP para o servidor Toupeira.
  Criado por Diego W. O. Ferreira, 28 de Abril, 2018.
  Released into the public domain.
*/

#ifndef ToupeiraClient_h
#define ToupeiraClient_h

#include <Arduino.h>

class ToupeiraClient {
    public:
        ToupeiraClient(const char * ip, int port);        
        void doGet();
        void doPost();

    private:
        void preparaJson();
        const char * _ip;
        int _port;
};

#endif