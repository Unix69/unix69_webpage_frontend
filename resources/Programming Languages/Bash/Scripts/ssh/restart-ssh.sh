#!/bin/bash
# restart_ssh.sh
set -euo pipefail

sudo systemctl restart ssh
echo "SSH server restarted."
sudo systemctl status ssh --no-pager | head -n 10
