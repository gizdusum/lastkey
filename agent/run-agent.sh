#!/bin/zsh
set -euo pipefail

ROOT="/Users/denizalagoz/Documents/New project/lastkey"
LOG_DIR="$ROOT/agent/logs"

mkdir -p "$LOG_DIR"
cd "$ROOT"

exec /opt/homebrew/bin/node agent/index.js >> "$LOG_DIR/agent.out.log" 2>> "$LOG_DIR/agent.err.log"
