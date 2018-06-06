void main(void) {
    int idx;
    int values[64];
    int square;
    int row;
    int column;
    int state;

    // Setup
    idx = 0;
    while (idx < 64) {
        values[idx] = 0;
        idx += 1;
    }
    square = 0;
    row = 0;
    column = 0;
    state = 0;

    // Loop
    while (1) {
        if (state == 0) {
            output(100, 2);
            row = input();
            if (row >= 1) {
                if (row <= 8) {
                    state = 1;
                }
            }
        } else if (state == 1) {
            output(200, 2);
            column = input();
            if (column >= 1) {
                if (column <= 8) {
                    state = 2;
                }
            }
        } else if (state == 2) {
            square = ((row - 1) * 8 ) + column;
            if (values[square - 1] == 0) {
                values[square - 1] = 1;
                state = 3;
            } else {
                output(999, 2);
                state = 0;
            }
        } else if (state == 3) {
            sam(square);
            state = 0;
            output(55, 1);
        }
    }
}
