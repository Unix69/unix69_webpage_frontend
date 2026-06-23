#!/bin/bash
set -euo pipefail

URL="$(cat ./openvpn-link)"
DEST="./open-vpn-ovpn"

mkdir -p "$DEST"
cd "$DEST"

echo "Downloading OpenVPN packages list..."
HTML="$(curl -fsSL "$URL")"

LINKS=$(echo "$HTML" | grep -oE 'href="[^"]+vpnbook-openvpn[^"]+\.zip"' | cut -d'"' -f2)

if [ -z "$LINKS" ]; then
    echo "No OpenVPN packages found."
    exit 1
fi

echo "Found $(echo "$LINKS" | wc -l) packages"

for L in $LINKS; do
    case "$L" in
        http* ) FILE_URL="$L" ;;
        *     ) FILE_URL="https://www.vpnbook.com/$L" ;;
    esac

    ZIP_FILE=$(basename "$FILE_URL")
    echo "Downloading $FILE_URL ..."
    curl -fsO "$FILE_URL" || { echo "Failed to download $FILE_URL"; continue; }

    echo "Extracting $ZIP_FILE ..."
    unzip -o "$ZIP_FILE" -d "$DEST" >/dev/null 2>&1
    rm -f "$ZIP_FILE"
done

echo "All .ovpn files extracted in $DEST"
ls -1 "$DEST"/*.ovpn
