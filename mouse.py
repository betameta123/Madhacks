from serial import Serial
import pyautogui as pag

# CHANGE THIS TO THE CORRECT ONE! =)
ser_address = '/dev/tty.usbserial-0001'
scale = 1

ser = Serial(ser_address)

# width and height
(wd, ht) = pag.size()  
# x, y = 128, 128
pag.moveTo(wd/2, ht/2)

while True:
    (d_x, d_y, d_z) = map(int, ser.readline().decode().split(','))
    print(d_x, d_y, d_z)
    pag.moveRel(d_x/128 * scale * wd, d_y/128 * scale * ht)