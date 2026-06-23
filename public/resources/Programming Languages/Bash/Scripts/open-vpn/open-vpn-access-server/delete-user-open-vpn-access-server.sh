#!/bin/bash
# Script to delete an OpenVPN AS user
# Usage: ./delete-user-open-vpn-access-server.sh <username>

set -euo pipefail

USERNAME="${1:-}"

if [[ -z "$USERNAME" ]]; then
    read -rp "Enter username to delete: " USERNAME
fi

echo "[*] Deleting user $USERNAME..."
sudo sacli --user "$USERNAME" UserDelete

# Rimuove anche eventuale file .ovpn nella cartella "ovpn" dello script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OVPN_FILE="$SCRIPT_DIR/ovpn/$USERNAME.ovpn"
if [[ -f "$OVPN_FILE" ]]; then
    rm -f "$OVPN_FILE"
    echo "[✓] Also removed $OVPN_FILE"
fi

echo "[✓] User $USERNAME deleted successfully."
