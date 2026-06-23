#!/bin/bash
set -euo pipefail

# Paths degli script secondari
SCRIPT_USERS="./show-registered-users-open-vpn-access-server.sh"
SCRIPT_CONNECTED="./show-connected-users-open-vpn-access-server.sh"
SCRIPT_HISTORY="./show-users-history-open-vpn-access-server.sh"

# Controllo che esistano gli script secondari
for script in "$SCRIPT_USERS" "$SCRIPT_CONNECTED" "$SCRIPT_HISTORY"; do
    if [[ ! -f "$script" ]]; then
        echo "[!] Script $script not found."
        exit 1
    fi
done

# Menu interattivo
while true; do
    echo "=============================="
    echo "OpenVPN AS Info Menu"
    echo "=============================="
    echo "1) Show all registered users"
    echo "2) Show currently connected users"
    echo "3) Show user history"
    echo "4) Exit"
    echo "=============================="
    read -rp "Enter your choice [1-4]: " choice

    case "$choice" in
        1)
            bash "$SCRIPT_USERS"
            ;;
        2)
            bash "$SCRIPT_CONNECTED"
            ;;
        3)
            bash "$SCRIPT_HISTORY"
            ;;
        4)
            echo "Exiting..."
            exit 0
            ;;
        *)
            echo "[!] Invalid choice, try again."
            ;;
    esac

    echo
done

