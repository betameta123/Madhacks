//  License along with this library; if not, write to the Free Software
//  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
//
/*******************************************************************************/

#include <Wire.h>
#include "MMA7660.h"

MMA7660 accelemeter1;

#define SMP_RATE 0
#define DELTA_T 1/120

float ax_calibration = 0;
float ay_calibration = 0;
float az_calibration = 0;

float x_curr  = 0;
float y_curr = 0;
float z_curr = 0;
float v_x = 0;
float v_y = 0;
float v_z = 0;

const int buttonPin = 2;
int buttonState = 0;

void calcPos(float ax, float ay, float az, float* pos) {
  // Get positions
  double d_x = v_x * DELTA_T + (1/2)* ax * DELTA_T * DELTA_T;
  double d_y = v_y * DELTA_T + (1/2)* ay * DELTA_T * DELTA_T;
  double d_z = v_z * DELTA_T + (1/2)* az * DELTA_T * DELTA_T;
  // double d_x = ax;
  // double d_y = ay;
  //  double d_z = az;
  // Serial.print(d_x);
  // Serial.print(",");
  // Serial.print(d_y);
  // Serial.print(",");
  // Serial.print(d_z);
  // Serial.println("");
  *pos = x_curr += d_x;
  *(pos + 1) = y_curr += d_y;
  *(pos + 2) = z_curr += d_z;

  // Set new velocities
  v_x = v_x + ax * DELTA_T;
  v_y = v_y + ay * DELTA_T;
  v_z = v_z + az * DELTA_T;
}

void setup() {
    accelemeter1.init();
    accelemeter1.setSampleRate(SMP_RATE);
    Serial.begin(9600);
    float ax, ay, az;
    for(int i = 0; i < 1 << 12; i++) {
      accelemeter1.getAcceleration(&ax, &ay, &az);
      ax_calibration += ax;
      ay_calibration += ay;
      az_calibration += az;
    }
    ax_calibration /= 1 << 12;
    ay_calibration /= 1 << 12;
    az_calibration /= 1 << 12;

    pinMode(buttonPin, INPUT);
}

void loop() {
    int b;
    float ax, ay, az;
    float a_ax = 0, a_ay = 0, a_az = 0;
    accelemeter1.getAcceleration(&ax, &ay, &az);
    ax -= ax_calibration;
    ay -= ay_calibration;
    az -= az_calibration;
    // Scale acceleration values
    az *= 9.8;

    for(int i = 0; i < 20; i++) {
      a_ax += ax;
      a_ay += ay;
      a_az += az;
    }
    
    a_ax /= 20;
    a_ay /= 20;
    a_az /= 20;

    float pos[3];
    calcPos(a_ax, a_ay, a_az, pos);
    buttonState = digitalRead(buttonPin);
    if (buttonState == HIGH) {
      b = 1;
    }
    else {
      b = 0;
    }
    
    Serial.print(pos[0]);
    Serial.print(",");
    Serial.print(pos[1]);
    Serial.print(",");
    Serial.print(pos[2]);
    Serial.print(",");
    Serial.print(b);
    Serial.println("");
}
