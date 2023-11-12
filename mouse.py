from serial import Serial
import pyautogui as pag
import time

# CHANGE THIS TO THE CORRECT ONE! =)
# ser_address = '/dev/tty.usbserial-0001'
ser_address = '/dev/tty.usbmodem1101'
# ser_address = '/dev/tty.usbmodem11101'
# ser_address = '/dev/tty.usbmodem112401'
# ser_address = '/dev/ttyACM0'
scale = 1

def calcMove(n, offset, scale):
    return (n - offset) * scale

ser = Serial(ser_address)
pag.FAILSAFE = False
# width and height
(wd, ht) = pag.size()
print(wd, ht)
# x, y = 128, 128
pag.moveTo(wd/2, ht/2)

cnt = 0
sum_x = 0
sum_y = 0
(off_x, off_y, off_z) = (0, 0, 0)
while True:
    if cnt == 1e3: 
        off_x = sum_x / 1e3
        off_y = sum_y / 1e3
        print(sum_x / 1e3, sum_y / 1e3)
        break
    try: 
        (off_x, off_y, off_z) = map(int, ser.readline().decode().split(','))
        assert off_x != 0 and off_y != 0
        print(off_x, off_y, off_z)
        cnt += 1
        sum_x += off_x
        sum_y += off_y
    except:
        continue


pag.moveTo(wd / 2, ht / 2)

time.sleep(1)

# cnt = 0
# sum_x = 0
# sum_y = 0

buffer = ''
last_line = ''

while True:
    # if cnt == 1e3: break
    new_buffer = buffer + ser.read(ser.in_waiting).decode()
    # print(buffer)
    lines = buffer.split('\n')

    last_line = lines[-1]
    try:
        (x, y, z) = map(int, last_line.split(','))
    except:
        continue
    pag.moveRel(-calcMove(x, off_x, scale), calcMove(y, off_y, scale), _pause = False)
    print(-calcMove(x, off_x, scale), calcMove(y, off_y, scale))
    # cnt += 1
    # sum_x += off_x - x
    # sum_y += off_y - y

# print(sum_x / 1e3, sum_y / 1e3)
