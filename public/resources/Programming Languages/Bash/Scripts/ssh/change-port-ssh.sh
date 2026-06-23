#!/bin/bash
# change_ssh_port.sh
set -euo pipefail

NEW_PORT=$1

if [ -z "$NEW_PORT" ]; then
    echo "Usage: $0 <new_port>"
    exit 1
fi

# Backup configuration file
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak

# Replace the existing port or add the line if missing
if grep -q "^Port" /etc/ssh/sshd_config; then
    sudo sed -i "s/^Port .*/Port $NEW_PORT/" /etc/ssh/sshd_config
else
    echo "Port $NEW_PORT" | sudo tee -a /etc/ssh/sshd_config > /dev/null
fi

echo "SSH port changed to $NEW_PORT"
