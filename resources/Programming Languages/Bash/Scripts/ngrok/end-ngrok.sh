#!/bin/bash

# Find ngrok processes and terminate
NGROK_PID=$(pgrep -f "ngrok")
if [ -z "$NGROK_PID" ]; then
    echo "Ngrok is not running."
else
    kill $NGROK_PID
    echo "Ngrok terminated."
fi
