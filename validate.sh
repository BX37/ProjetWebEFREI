#!/usr/bin/env bash
set -e
echo "Health:"
curl -sS http://localhost:3000/health | jq .
echo
echo "next-metro (missing station -> 400):"
curl -sS -i "http://localhost:3000/next-metro"
echo
echo "next-metro (Chatelet):"
curl -sS "http://localhost:3000/next-metro?station=Chatelet" | jq .