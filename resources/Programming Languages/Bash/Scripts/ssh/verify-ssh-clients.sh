#!/bin/bash

echo "=== Active SSH connections ==="
ss -tnp | grep sshd || echo "No active SSH connections"

echo
echo "=== Last successful SSH logins ==="
last -i | grep "ssh" | head -10
