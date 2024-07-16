#!/bin/bash

set -e

# Navigate to project directory
cd "$(dirname "$0")/.."

# List available versions
echo "Available versions:"
ls -t docker-compose.*.yml | nl

# Prompt for version
read -p "Enter version to rollback to: " VERSION_NUMBER

ROLLBACK_VERSION=$(ls -t docker-compose.*.yml | sed -n "${VERSION_NUMBER}p")

if [ -z "$ROLLBACK_VERSION" ]; then
    echo "Invalid version number"
    exit 1
fi

echo "Rolling back to version: $ROLLBACK_VERSION"

# Bring down current images
docker-compose -f docker-compose.prod.yml down

# Bring up new images
docker-compose -f $ROLLBACK_VERSION up -d

echo "Rollback completed successfully"