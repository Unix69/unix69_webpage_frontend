#!/bin/bash
set -euo pipefail

# Input username
if [[ $# -lt 1 ]]; then
    read -rp "Enter OpenVPN username to generate .ovpn: " USERNAME
else
    USERNAME="$1"
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT_DIR="$SCRIPT_DIR/ovpn"
mkdir -p "$OUT_DIR"

# Recupera il serial number dell'utente (se esiste)
SN=$(sudo sacli --user "$USERNAME" UserPropGet | jq -r ".\"$USERNAME\".serial_number // empty")

if [[ -z "$SN" ]]; then
    # Utente senza serial number
    echo "[!] SN not found for user '$USERNAME'. Assuming local user."
    echo "[*] Exporting local user profile..."
    sudo sacli --user "$USERNAME" GetUserProfile --sn "$SN" | grep -v "^sacli:" > "$OUT_DIR/$USERNAME.ovpn"
else
    # Utente con serial number
    echo "[*] SN found for user '$USERNAME': $SN"
    echo "[*] Exporting profile using SN..."
    sudo sacli GetUserProfile --sn "$SN" | grep -v "^sacli:" > "$OUT_DIR/$USERNAME.ovpn"
fi

echo "[✓] Profile saved at $OUT_DIR/$USERNAME.ovpn"
echo "Use your OpenVPN client to import this file and connect."
