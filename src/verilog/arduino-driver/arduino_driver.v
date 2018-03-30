module arduino_driver (
  read_clock,
  write_clock,
  flag_write_arduino,
  system_input,
  system_output,
  module_input,
  module_output
  );

  parameter BYTE_LENGTH = 4;
  parameter DATA_LENGTH = 32;
  localparam DIFF_LENGTH = DATA_LENGTH-BYTE_LENGTH;

  input flag_write_arduino;
  input read_clock;
  input write_clock;
  input [BYTE_LENGTH-1:0] system_input;
  input [BYTE_LENGTH-1:0] module_input;
  output [DATA_LENGTH-1:0] module_output;

  reg [DATA_LENGTH-1:0] system_input_buffer;
  output reg [BYTE_LENGTH-1:0] system_output;

  always @ ( posedge read_clock ) begin
    system_input_buffer <= {28'b0, system_input};
  end

  always @ ( negedge write_clock ) begin
    if (flag_write_arduino) begin
      system_output <= module_input;
    end
  end

  assign module_output = system_input_buffer;

endmodule // arduino-driver
