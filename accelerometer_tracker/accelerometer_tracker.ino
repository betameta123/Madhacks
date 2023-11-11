//  License along with this library; if not, write to the Free Software
//  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
//
/*******************************************************************************/

#include <Wire.h>
#include "MMA7660.h"

MMA7660 accelemeter;

#define SMP_RATE 2
#define DELTA_T 1/SMP_RATE

float x  = 0;
float y = 0;
float z = 0;
float v = 0;


void setup() {
    accelemeter.init();
    accelemeter.setSampleRate(SMP_RATE);
    Serial.begin(9600);
}

void loop() {
    int8_t x, y, z;
    float ax, ay, az;
    accelemeter.getXYZ(&x, &y, &z);

    Serial.print(x);
    Serial.print(",");
    Serial.print(y);
    Serial.print(",");
    Serial.print(z);
    Serial.println("");
}
