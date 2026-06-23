#!/bin/bash
set -euo pipefail

URL="$(cat ./openvpn-link)"
OUT_TXT="vpnbook_credentials"
OUT_AUTH="vpnbook.auth"

TMPDIR="$(mktemp -d)"
cleanup() { rm -rf "$TMPDIR"; }
trap cleanup EXIT

HTML="$(curl -fsSL "$URL")" || exit 1

USER="$(printf "%s" "$HTML" \
  | sed -E 's/<[^>]+>//g' \
  | grep -i 'Username' | head -1 \
  | sed -E 's/.*[Uu]sername[:[:space:]]*//; s/[[:space:]].*$//')"
[ -z "${USER:-}" ] && USER="vpnbook"

PASS="$(printf "%s" "$HTML" \
  | sed -E 's/<[^>]+>//g' \
  | grep -i 'Password' | head -1 \
  | sed -E 's/.*[Pp]assword[:[:space:]]*//; s/[[:space:]].*$//')"

if [ -z "${PASS:-}" ]; then
  IMG_SRC="$(printf "%s" "$HTML" | perl -0777 -ne 'if(/Password.*?<img[^>]+src="([^"]+)"/si){print $1}' || true)"
  if [ -n "$IMG_SRC" ]; then
    case "$IMG_SRC" in
      http* ) IMG_URL="$IMG_SRC" ;;
      * )     IMG_URL="https://www.vpnbook.com${IMG_SRC}" ;;
    esac
    IMG_FILE="$TMPDIR/pw_img"
    curl -fsSL "$IMG_URL" -o "$IMG_FILE" || exit 2
    PRE="$TMPDIR/pw_pre.png"
    if command -v magick >/dev/null 2>&1; then
      magick "$IMG_FILE" -resize 300% -colorspace Gray -negate -threshold 50% "$PRE" || PRE="$IMG_FILE"
    elif command -v convert >/dev/null 2>&1; then
      convert "$IMG_FILE" -resize 300% -colorspace Gray -negate -threshold 50% "$PRE" || PRE="$IMG_FILE"
    else
      PRE="$IMG_FILE"
    fi
    if command -v tesseract >/dev/null 2>&1; then
      PASS="$(tesseract "$PRE" stdout --psm 7 2>/dev/null | tr -d '[:space:]' | tr -cd '[:alnum:]')"
    else
      PASS=""
    fi
  fi
fi

{
  echo "Username: $USER"
  echo "Password: $PASS"
} > "$OUT_TXT"

printf "%s\n%s\n" "$USER" "${PASS:-<password_here>}" > "$OUT_AUTH"

