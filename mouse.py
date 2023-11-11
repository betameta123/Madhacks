from serial import Serial
import pyautogui as pag
import time

# CHANGE THIS TO THE CORRECT ONE! =)
# ser_address = '/dev/tty.usbserial-0001'
ser_address = '/dev/ttyACM0'
scale = 0.2

ser = Serial(ser_address)
pag.FAILSAFE = False
# width and height
(wd, ht) = pag.size()
print(wd, ht)
# x, y = 128, 128
# pag.moveTo(wd/2, ht/2)
# pag.moveTo(100, 100)

while True:
    (d_x, d_y, d_z) = map(int, ser.readline().decode().split(','))
    # print(d_x, d_y, d_z)
    # pag.move(1,1)
    # pag.move(d_x * scale, d_y * scale)
    # print(d_x, d_, d_z)
    # time.sleep(2)
