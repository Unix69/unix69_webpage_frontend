#!/bin/bash
# check_ssh_port.sh
set -euo pipefail

PORT=$(grep -E "^Port" /etc/ssh/sshd_config | awk '{print $2}')
if [ -z "$PORT" ]; then
    echo "SSH is using the default port 22"
else
    echo "SSH is listening on port: $PORT"
fi
