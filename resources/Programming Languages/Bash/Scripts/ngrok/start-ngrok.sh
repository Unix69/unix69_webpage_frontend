#!/bin/bash

# Check if authtoken is configured
if ! /usr/local/bin/ngrok config check &>/dev/null; then
    echo "Enter your ngrok authtoken:"
    read NGROK_TOKEN
    /usr/local/bin/ngrok authtoken $NGROK_TOKEN
fi

# Ask for the protocol to use
echo "Enter the protocol to use via ngrok (e.g., tcp, http):"
read PROTOCOL


# Ask for the local port to expose
echo "Enter the local port to expose via ngrok (e.g., 8080):"
read PORT

# Start ngrok in the background
nohup /usr/local/bin/ngrok $PROTOCOL $PORT > ngrok.log 2>&1 &
NGROK_PID=$!
echo "Ngrok started with PID $NGROK_PID. Log available in ngrok.log"
