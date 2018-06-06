#ifndef ToupeiraClient_h
#define ToupeiraClient_h

#include <Arduino.h>

class ToupeiraClient {
  public:
    ToupeiraClient(const char * ip, int port, bool verbose);
    int getCurrentPlayer(const char * endpoint);
    void postPlay(const char * endpoint, int player, int square);

  private:
    int getCurrentPlayerFromResponse(String response);
    String createPlayJSON(int player, int square);
    const char * _ip;
    int _port;
    bool _verbose;
};

#endif
