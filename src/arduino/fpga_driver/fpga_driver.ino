// Quantidade de pinos utilizados para entrada/saida
const int quantidadePinos = 8;

// Limiar para conversao da entrada analogica para sinal digital
const int limiarAnalogicoParaDigital = 1000;

// Pinos utilizados para entrada analogica no Arduino
const int input[] = {
    8, 9, 10, 11, 12, 13, 14, 15
};

// Pinos utilizados para saida digital do Arduino
const int output[] = {
    24, 26, 28, 30, 32, 34, 36, 38
};

void setup() {
    // Inicializa as saidas para o FPGA
    for (int i = 0; i < quantidadePinos; i++) {
        pinMode(input[i], INPUT);
        pinMode(output[i], OUTPUT);
    }
    // Inicializa a comunicacao serial
    Serial.begin(9600);
    // Inicializa referencia analogica
    analogReference(INTERNAL1V1);
}

void loop() {
    //toFPGA();
    fromFPGA();
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
                // Atribui LOW para todas saidas
                for (int i = 0; i < quantidadePinos; i++) {
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
    int potencia = 1;
    for (int i = 0; i < quantidadePinos; i++) {
        if (analogToDigital(i)) {
            decimal += potencia;
        }
        potencia *= 2;
    }
    return decimal;
}

int analogToDigital(int index) {
    return analogRead(input[index]) >= limiarAnalogicoParaDigital ? 1 : 0;
}
