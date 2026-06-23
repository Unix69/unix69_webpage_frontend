#!/bin/bash
set -euo pipefail

echo "=============================="
echo "[*] Listing currently connected OpenVPN AS users:"
echo "=============================="

# Get connected sessions
sudo sacli VPNStatus_User all | jq -r '
to_entries[] |
"\(.key):
  connected since: \(.value.connected_since // "N/A")
  remote IP: \(.value.remote_ip // "N/A")
  virtual IP: \(.value.virtual_ip // "N/A")
  protocol: \(.value.protocol // "N/A")
  connection type: \(.value.connection_type // "N/A")
"'
echo "=============================="
