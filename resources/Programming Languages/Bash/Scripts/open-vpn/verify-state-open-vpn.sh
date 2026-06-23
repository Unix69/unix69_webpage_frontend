#!/bin/bash

if pgrep openvpn > /dev/null; then
    echo "OpenVPN is connected"
else
    echo "OpenVPN is disconnected."
fi

