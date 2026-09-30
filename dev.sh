#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
exec nix develop --command pnpm dev
