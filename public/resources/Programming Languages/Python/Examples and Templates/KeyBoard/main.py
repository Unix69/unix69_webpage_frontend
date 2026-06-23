import os
import sys
try:
    from msvcrt import kbhit
except ImportError:
    from select import select
    def kbhit():
        dr, dw, de = select([sys.stdin], [], [], 0)
        return dr != []


while True:
    if kbhit():
        k = input()
    else:
        print('nohit')