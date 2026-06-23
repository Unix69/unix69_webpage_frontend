#!/bin/sh

echo "Start MCU" && ./MultiAgentSystem &
echo "Start AIU" && (python ./AIU/main.py & || python3 ./AIU/main.py & || python3.8 ./AIU/main.py &)
echo "Start GUI" && (python ./Plot.py & || python3 ./Plot.py & || python3.8 ./Plot.py &)


