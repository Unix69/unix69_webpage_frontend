#!/bin/bash

echo "Disconnecting VPN..."
sudo killall openvpn 2>/dev/null

if [ $? -eq 0 ]; then
    echo "VPN disconnected."
else
    echo "OpenVPN process not found."
fi
