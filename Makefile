.PHONY: build-all
build-all: ## Build the docker image.
	docker build -t base-image -f docker/Dockerfile .
	docker compose -f docker/docker-compose.yml build

.PHONY: start-all
start-all: ## Start the docker container.
	docker compose -f docker/docker-compose.yml up -d

.PHONY: stop-all
stop-all: ## Stop the docker container.
	docker compose -f docker/docker-compose.yml down

# GIT_SHA1 = $(shell git rev-parse --verify HEAD)
# IMAGES_TAG = ${shell git describe --exact-match --tags 2> /dev/null || echo "latest"}
# IMAGE_PREFIX = mock-my-draft-

# IMAGE_DIRS = $(wildcard apps/*)

# .PHONY: all ${IMAGE_DIRS}

# all: build-base ${IMAGE_DIRS}

# build-base:
# 	docker build -t base-image -f docker/Dockerfile .


# ${IMAGE_DIRS}:
# 	$(eval IMAGE_NAME := $(subst /,-,$@))
# 	docker build -f docker/Dockerfile -t ${DOCKERHUB_OWNER}/${IMAGE_PREFIX}${IMAGE_NAME}:${IMAGES_TAG} -t ${DOCKERHUB_OWNER}/${IMAGE_PREFIX}${IMAGE_NAME}:latest --build-arg TAG=${IMAGE_PREFIX}${IMAGE_NAME} --build-arg GIT_SHA1=${GIT_SHA1} $@
# docker push ${DOCKERHUB_OWNER}/${IMAGE_PREFIX}${IMAGE_NAME}:${IMAGES_TAG}
# docker push ${DOCKERHUB_OWNER}/${IMAGE_PREFIX}${IMAGE_NAME}:latest