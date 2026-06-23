#!/bin/bash
# check_port_in_use.sh
set -euo pipefail

PORT=$1

if [ -z "$PORT" ]; then
    echo "Usage: $0 <port>"
    exit 1
fi

if sudo ss -tuln | grep -q ":$PORT "; then
    echo "SSH is listening on port $PORT"
else
    echo "SSH is NOT listening on port $PORT"
fi
