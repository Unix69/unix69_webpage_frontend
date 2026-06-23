#!/bin/bash
# Script to create a normal OpenVPN AS user, set a serial number, and export their client profile
# Usage: ./create-user-open-vpn-access-server.sh <username> <password>

set -euo pipefail

USERNAME="${1:-}"
PASSWORD="${2:-}"

if [[ -z "$USERNAME" ]]; then
    read -rp "Enter new username: " USERNAME
fi

if [[ -z "$PASSWORD" ]]; then
    read -rsp "Enter password for $USERNAME: " PASSWORD
    echo
fi

# Create normal user (non-admin)
sudo sacli --user "$USERNAME" --key type --value user UserPropPut
sudo sacli --user "$USERNAME" --new_pass "$PASSWORD" SetLocalPassword

# Generate a UUID to use as serial number
SN=$(uuidgen)
echo "Generated serial number for $USERNAME: $SN"

# Set serial number for the user
sudo sacli --user "$USERNAME" --key serial_number --value "$SN" UserPropPut

# Verify the serial number
echo "Serial number set for $USERNAME:"
sudo sacli --user "$USERNAME" --key serial_number UserPropGet

# Export profile nella cartella "ovpn" dello script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT_DIR="$SCRIPT_DIR/ovpn"
mkdir -p "$OUT_DIR"
sudo sacli --user "$USERNAME" GetUserProfile | base64 --decode > "$OUT_DIR/$USERNAME.ovpn"

echo "[✓] User $USERNAME created, serial number set, and profile saved at $OUT_DIR/$USERNAME.ovpn"
echo "Share the .ovpn file and credentials with the user for VPN access."
