#!/bin/bash
set -euo pipefail

if systemctl is-active --quiet ssh; then
    echo "SSH is running."
else
    echo "SSH is NOT running."
    exit 1
fi

echo "Your local IP addresses:"
hostname -I
