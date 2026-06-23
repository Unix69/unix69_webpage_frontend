#!bin/bash

# Controllo che siano stati passati 3 argomenti
if [ $# -ne 3 ]; then
    echo "Uso: $0 <utente> <permessi> <file_script>"
    echo "Esempio: $0 $(whoami) 700 mio_script.sh"
    exit 1
fi

UTENTE="$1"
PERMESSI="$2"
FILE="$3"

# Controllo che il file esista
if [ ! -f "$FILE" ]; then
    echo "Errore: il file '$FILE' non esiste."
    exit 2
fi

# Cambio proprietario del file
sudo chown "$UTENTE":"$UTENTE" "$FILE"

# Imposto i permessi
chmod "$PERMESSI" "$FILE"

# Mostro risultato finale
ls -l "$FILE"
