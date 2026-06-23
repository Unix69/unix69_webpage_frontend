#!/bin/bash
set -euo pipefail

sudo apt update
sudo apt install -y openssh-server
sudo systemctl enable ssh
echo "SSH installed and enabled at startup."
