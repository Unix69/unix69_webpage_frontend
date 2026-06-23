#!/bin/bash

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "Please run this script as root or using sudo."
    exit 1
fi

# Stop the SSH service
echo "Stopping SSH service..."
systemctl stop ssh

# Disable SSH service from starting at boot
echo "Disabling SSH service at startup..."
systemctl disable ssh

# Verify status
echo "SSH service status:"
systemctl status ssh --no-pager
