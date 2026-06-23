#!/bin/bash
# check_ssh_config.sh
set -euo pipefail

if sudo sshd -t; then
    echo "SSH configuration is valid"
else
    echo "Error in SSH configuration"
fi
