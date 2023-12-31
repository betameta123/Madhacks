#include <Wire.h>
#include "MMA7660.h"

MMA7660 accelemeter;
int32_t sstatex = 0, sstatey = 0;
int32_t a_x0 = 0, a_y0 = 0, v_x0 = 0, v_y0 = 0, pos_x0 = 0, pos_y0 = 0;
uint8_t countx = 0, county = 0;

const int buttonPin = 2;
int buttonState = 0;

void movement_end_check(int32_t a_x, int32_t a_y) {
  if(a_x == 0)
    countx++;
  else
    countx = 0;
  
  if(countx >= 15)
    v_x0 = 0;

  if (a_x == 0)
    county++;
  else
    county = 0;

  if(county >= 15) {
    v_y0 = 0;
  }
}
void accel_setup() {
  accelemeter.init();
  int8_t ax, ay, az;
  uint16_t count1 = 0;
  do {
    accelemeter.getXYZ(&ax, &ay, &az);
    sstatex += ax;
    sstatey += ay;
    count1++;
  } while (count1 != 0x0400);

  sstatex >>= 10;
  sstatey >>= 10;
}

void setup() {
  Serial.begin(9600);
  accel_setup();
  pinMode(buttonPin, INPUT);
}

void loop() {
  int8_t ax, ay, az;
  int32_t s_ax = 0, s_ay = 0, s_az = 0;
  uint8_t counter = 0;

  do {
    accelemeter.getXYZ(&ax, &ay, &az);
    s_ax += ax;
    s_ay += ay;
    counter++;
  } while (counter != 0x20);

  s_ax >>= 5;
  s_ay >>= 5;
  s_ax -= sstatex;
  s_ay -= sstatey;

  if (s_ax <= 3 && s_ax >= -3)
    s_ax = 0;
  if (s_ay <= 3 && s_ay >= -3)
    s_ay = 0;

  int32_t v_x = v_x0 + a_x0 + ((s_ax - a_x0) >> 1);
  int32_t pos_x = pos_x0 + v_x0 + ((v_x - v_x0) >> 1);

  int32_t v_y = v_y0 + a_y0 + ((s_ay - a_y0) >> 1);
  int32_t pos_y = pos_y0 + v_y0 + ((v_y - v_y0) >> 1);

  a_x0 = s_ax;
  a_y0 = s_ay;

  v_x0 = v_x;
  v_y0 = v_y;

  Serial.print(pos_x);
  Serial.print(",");
  Serial.print(pos_y);
  Serial.print(",");

  movement_end_check(s_ax, s_ay);
  pos_x0 = pos_x;
  pos_y0 = pos_y;

  buttonState = digitalRead(buttonPin);
  Serial.print(buttonState);
  Serial.println("");
}

