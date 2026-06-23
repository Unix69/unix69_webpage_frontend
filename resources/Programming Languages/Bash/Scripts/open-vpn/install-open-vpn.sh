#!/bin/bash

echo "Update repository..."
sudo apt update && sudo apt upgrade -y

echo "Install OpenVPN..."
sudo apt install -y openvpn

echo "Installation complete!"
