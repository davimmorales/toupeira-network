// Pinos utilizados para entrada no arduino
const int input[] = {
    2, 3, 4, 5, 6, 7, 8, 9
};

// Pinos utilizados para saida no arduino
const int output[] = {
    22, 24, 26, 28, 30, 32, 34, 36
};

void setup() {
    // Inicializa as saidas para o fpga
    for (int i = 0; i < 8; i++) {
        pinMode(input[i], INPUT);
        pinMode(output[i], OUTPUT);
    }
    
    // Inicializa a comunicaçao serial
    Serial.begin(9600);
}

void loop() {
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
                // Atribui LOW para todas saidas
                for (int i = 0; i < 8; i++) {
                    digitalWrite(output[i], LOW);
                }
        }
    }
} 
