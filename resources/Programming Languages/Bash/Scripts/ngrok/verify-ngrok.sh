#!/bin/bash

# Check if ngrok is running
NGROK_PID=$(pgrep -f "ngrok")

if [ -z "$NGROK_PID" ]; then
    echo "Ngrok is not running."
else
    echo "Ngrok is running with PID: $NGROK_PID"
    echo "Active public URLs:"
    curl --silent http://127.0.0.1:4040/api/tunnels | jq -r '.tunnels[] | .public_url'
fi
