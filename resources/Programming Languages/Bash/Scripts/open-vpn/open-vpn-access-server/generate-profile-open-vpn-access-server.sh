#!/bin/bash
set -euo pipefail

# Input username e password
if [[ $# -lt 1 ]]; then
    read -rp "Enter OpenVPN username: " USERNAME
else
    USERNAME="$1"
fi

if [[ $# -lt 2 ]]; then
    read -rsp "Enter password for $USERNAME: " PASSWORD
    echo
else
    PASSWORD="$2"
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT_DIR="$SCRIPT_DIR/ovpn"
mkdir -p "$OUT_DIR"

# Verifica se l'utente esiste
USER_EXISTS=$(sudo sacli UserPropGet | jq -r "has(\"$USERNAME\")")
if [[ "$USER_EXISTS" != "true" ]]; then
    echo "[*] User $USERNAME does not exist, creating..."
    sudo sacli --user "$USERNAME" --key type --value user UserPropPut
fi

# Imposta la password locale (necessaria per generare il profilo)
sudo sacli --user "$USERNAME" --new_pass "$PASSWORD" SetLocalPassword

# Genera il profilo .ovpn
echo "[*] Generating .ovpn profile for $USERNAME..."
sudo sacli --user "$USERNAME" GetUserProfile | grep -v "^sacli:" | base64 --decode > "$OUT_DIR/$USERNAME.ovpn"

echo "[✓] Profile saved at $OUT_DIR/$USERNAME.ovpn"
echo "Import this file in your OpenVPN client and connect."
