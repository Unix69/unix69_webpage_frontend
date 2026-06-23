#!/usr/bin/env python3
import requests
import subprocess
import tempfile
import os

# --- Configurazione ---
LOGIN_URL = "https://vpn.company.com/login"
OVPN_TEMPLATE = "template.ovpn"  # file .ovpn senza credenziali
FIELDS = {"username": "YOUR_USERNAME", "password": "YOUR_PASSWORD"}  # Puoi anche recuperare dinamicamente

# --- Effettua login e ottieni token ---
session = requests.Session()
resp = session.post(LOGIN_URL, data=FIELDS)
if resp.status_code != 200:
    raise Exception("Login fallito")

# --- Recupera username/password o token dal portale ---
# Qui devi fare il parsing della risposta HTML o JSON per estrarre credenziali temporanee
# Per esempio:
username = FIELDS["username"]
password = "temporary_password_from_site"  # da estrarre dal sito

# --- Crea file auth temporaneo ---
with tempfile.NamedTemporaryFile(mode="w+", delete=False) as f:
    f.write(f"{username}\n{password}\n")
    auth_file = f.name

# --- Avvia OpenVPN con il file auth ---
cmd = ["sudo", "openvpn", "--config", OVPN_TEMPLATE, "--auth-user-pass", auth_file]
try:
    subprocess.run(cmd)
finally:
    os.remove(auth_file)
