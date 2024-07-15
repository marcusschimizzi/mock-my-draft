#!/bin/bash

# Function to build and push docker image
build_and_push_docker() {
    local app=$1
    local docker_username=$2
    local repo_prefix=$3
    local github_sha=$4

    # Skip e2e projects
    if [[ $app == *-e2e ]]; then
        echo "Skipping e2e project: $app"
        return
    fi

    echo "Processing $app..."

    # Check for proper dockerfile
    DOCKERFILE="apps/$app/Dockerfile"
    if [ ! -f "$DOCKERFILE" ]; then
        echo "Dockerfile not found: $DOCKERFILE"
        return 0
    fi

    # Set the full image name
    IMAGE_NAME="${docker_username}/${repo_prefix}_${app}"

    echo "Building docker image for $app..."
    if docker build \
        -t ${IMAGE_NAME}:${github_sha} \
        -t ${IMAGE_NAME}:latest \
        -f $DOCKERFILE \
        .; then
        echo "Docker image built successfully for $app"
    else
        echo "Docker image build failed for $app"
        return 1
    fi

    echo "Pushing docker image for $app..."
    if docker push ${IMAGE_NAME}:${github_sha} && docker push ${IMAGE_NAME}:latest; then
        echo "Docker image pushed successfully for $app"
    else
        echo "Docker image push failed for $app"
        return 1
    fi

    echo "Docker image build and push completed for $app"
    return 0
}

# Main execution
if [ "$#" -ne 4 ]; then
    echo "Usage: $0 <app> <docker_username> <repo_prefix> <github_sha>"
    exit 1
fi

build_and_push_docker $1 $2 $3 $4
exit $?