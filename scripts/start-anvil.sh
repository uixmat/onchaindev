#!/bin/bash

# Check if Anvil is already running on port 8545
if lsof -Pi :8545 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "✓ Anvil already running on port 8545"
    exit 0
fi

# Check if anvil is installed
if ! command -v anvil &> /dev/null; then
    echo "⚠️  Anvil not found. Installing Foundry..."
    echo "Run: curl -L https://foundry.paradigm.xyz | bash"
    echo "Then: foundryup"
    echo "Then: source ~/.zshenv (or restart terminal)"
    exit 1
fi

# Start Anvil in background
echo "Starting Anvil on port 8545..."
anvil > .anvil.log 2>&1 &
ANVIL_PID=$!

# Wait for Anvil to be ready
for i in {1..10}; do
    if lsof -Pi :8545 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        echo "✓ Anvil started (PID: $ANVIL_PID)"
        echo "  Logs: .anvil.log"
        exit 0
    fi
    sleep 0.5
done

echo "✗ Anvil failed to start (check .anvil.log)"
exit 1
