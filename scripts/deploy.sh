#!/bin/bash

set -e

cd "$(dirname "$0")/.."

# Tag the current version
CURRENT_VERSION=$(date +%Y%m%d_%H%M%S)
docker-compose -f docker-compose.prod.yml config > docker-compose.$CURRENT_VERSION.yml

# Function to rollback
rollback() {
    echo "Rolling back to previous version..."
    PREVIOUS_VERSION=$(ls -t docker-compose.*.yml | sed -n 2p)
    if [ -z "$PREVIOUS_VERSION" ]; then
        echo "No previous version found"
        exit 1
    fi
    docker-compose -f $PREVIOUS_VERSION down
    docker-compose -f $PREVIOUS_VERSION up -d
    echo "Rollback completed successfully"
}

# Pull latest images
docker-compose -f docker-compose.prod.yml pull

# Bring down current images
docker-compose -f docker-compose.prod.yml down

# Bring up new images
docker-compose -f docker-compose.prod.yml up -d

# Check if services are healthy
sleep 30 # Wait for services to start

if ! docker-compose -f docker-compose.prod.yml ps | grep -q "Up "; then
    echo "One or more services are not healthy"
    rollback
    exit 1
fi

# Prune unused images
docker image prune -f

echo "Deployment completed successfully"