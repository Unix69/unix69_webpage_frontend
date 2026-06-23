#!/bin/bash


if [ $# -ne 1 ]; then
    echo "Use: $0 <file_config.ovpn>"
    exit 1
fi

CONFIG="$1"

if [ ! -f "$CONFIG" ]; then
    echo "Error: configuration file $CONFIG not found"
    exit 2
fi

echo "Connecting to VPN..."
sudo openvpn --config "$CONFIG" --daemon

