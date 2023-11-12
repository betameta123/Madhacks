from serial import Serial
import pyautogui as pag
import time

# CHANGE THIS TO THE CORRECT ONE! =)
ser_address = '/dev/tty.usbserial-0001'
# ser_address = '/dev/tty.usbmodem11101'
# ser_address = '/dev/tty.usbmodem112401'
# ser_address = '/dev/ttyACM0'
scale = 0.3

ser = Serial(ser_address)
pag.FAILSAFE = False
# width and height
(wd, ht) = pag.size()
print(wd, ht)
# x, y = 128, 128
pag.moveTo(wd/2, ht/2)

while True:
    try: 
        (off_x, off_y, off_z) = map(int, ser.readline().decode().split(','))
        assert off_x != 0 and off_y != 0
        print(off_x, off_y, off_z)
        break
    except:
        continue

buffer = ''
last_line = ''

time.sleep(1)
while True:
    buffer = buffer + ser.read(ser.in_waiting).decode()
    # print(buffer)
    lines = buffer.split('\n')
    if lines:
        last_line = lines[-1]
    try:
        (d_x, d_y, d_z) = map(int, last_line.split(','))
    except:
        continue
    pag.moveRel((d_x - off_x) / 128 * scale * wd/2, (d_y - off_y) / 128 * scale * ht/2, _pause = False)
    print((d_x - off_x) / 128 * scale * wd/2, (d_y - off_y) / 128 * scale * ht/2)
    # print(d_x, d_y, d_z)
