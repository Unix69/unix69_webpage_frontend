#!/bin/bash

# Update system packages
echo "Updating system packages..."
sudo apt update -y && sudo apt upgrade -y

# Install wget and unzip if not installed
echo "Installing wget and unzip..."
sudo apt install -y wget unzip

# Download ngrok
echo "Downloading ngrok..."
NGROK_ZIP="ngrok-stable-linux-amd64.zip"
wget -O $NGROK_ZIP https://bin.equinox.io/c/4VmDzA7iaHb/$NGROK_ZIP

# Extract ngrok
echo "Extracting ngrok..."
unzip -o $NGROK_ZIP -d $HOME/.local/bin

# Remove zip file
rm $NGROK_ZIP

# Add to PATH if necessary
if ! grep -q "$HOME/.local/bin" <<< "$PATH"; then
    echo 'export PATH=$HOME/.local/bin:$PATH' >> ~/.bashrc
    source ~/.bashrc
fi

echo "Ngrok installed successfully!"
