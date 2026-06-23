#!/bin/bash
set -euo pipefail

# --- Check if jq is installed ---
if ! command -v jq >/dev/null 2>&1; then
    echo "[*] jq not found. Installing..."
    if command -v apt >/dev/null 2>&1; then
        sudo apt update && sudo apt install -y jq
    elif command -v dnf >/dev/null 2>&1; then
        sudo dnf install -y jq
    elif command -v yum >/dev/null 2>&1; then
        sudo yum install -y jq
    else
        echo "[!] Package manager not recognized. Please install jq manually."
        exit 1
    fi
else
    echo "[✓] jq already installed."
fi

# --- Get username and password from command line or prompt ---
USERNAME="${1:-}"
PASSWORD="${2:-}"

if [[ -z "$USERNAME" ]]; then
    read -rp "Enter admin username to create: " USERNAME
fi

if [[ -z "$PASSWORD" ]]; then
    read -rsp "Enter password for $USERNAME: " PASSWORD
    echo
fi

echo "=============================="
echo "[*] Listing current OpenVPN AS users:"
echo "=============================="
# List users with their types
sudo sacli UserPropGet | jq -r 'to_entries[] | "\(.key): \(.value.type)"'
echo "=============================="

echo "[*] Checking if at least one admin exists..."
ADMIN_EXISTS=$(sudo sacli UserPropGet | jq -r 'to_entries[] | select(.value.prop_superuser=="true")' | wc -l)

if [[ "$ADMIN_EXISTS" -gt 0 ]]; then
    echo "[+] At least one admin user already exists. No action needed."
    exit 0
fi

echo "[!] No admin found. Creating new admin user: $USERNAME"

# Create admin user by setting superuser property
sudo sacli --user "$USERNAME" --key prop_superuser --value true UserPropPut

# Set password
sudo sacli --user "$USERNAME" --new_pass "$PASSWORD" SetLocalPassword

# Restart services to apply changes
sudo sacli start

echo "[✓] Admin user '$USERNAME' successfully created."
