#!/bin/bash

# Controllo che venga passato l'utente come parametro
if [ -z "$1" ]; then
    echo "Uso: $0 <nome_utente>"
    exit 1
fi

USER="$1"

# Generazione UUID
SN=$(uuidgen)

echo "Generato serial number per $USER: $SN"

# Impostazione serial number con sacli
sudo sacli --user "$USER" --key serial_number --value "$SN" UserPropPut

# Verifica che il serial number sia stato impostato
echo "Verifica del serial number..."
sudo sacli --user "$USER" --key serial_number UserPropGet
