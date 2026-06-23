#!/bin/bash
set -euo pipefail

# Controlla se l'utente ha passato un parametro
if [ $# -lt 1 ]; then
    echo "Usage: $0 <path_to_base_directory>"
    exit 1
fi

BASE_DIR="$1"

if [ ! -d "$BASE_DIR" ]; then
    echo "Directory $BASE_DIR does not exist."
    exit 1
fi

echo "Scanning .ovpn files in $BASE_DIR and its first-level subfolders..."

# Loop su sottocartelle di livello 1
for dir in "$BASE_DIR"/*/; do
    [ -d "$dir" ] || continue  # salta se non è cartella

    # Loop su file .ovpn nella sottocartella
    for ovpn in "$dir"*.ovpn; do
        [ -f "$ovpn" ] || continue  # salta se non è file

        echo "----------------------------------------"
        echo "Checking file: $ovpn"

        # Controlla se c'è auth-user-pass
        auth_line=$(grep -E "^auth-user-pass" "$ovpn" || true)
        if [ -n "$auth_line" ]; then
            echo "File references credentials: $auth_line"

            # Estrai percorso del file auth-user-pass se presente
            auth_file=$(echo "$auth_line" | awk '{print $2}')
            if [ -n "$auth_file" ] && [ -f "$auth_file" ]; then
                echo "Credentials file found: $auth_file"
                echo "Content:"
                cat "$auth_file"
            else
                echo "No separate credentials file, inline credentials might be used or missing."
            fi
        else
            echo "No auth-user-pass found. Credentials not included."
        fi
    done
done

echo "Scan completed."
