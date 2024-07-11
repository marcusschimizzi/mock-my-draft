.PHONY: build-dev
build-dev: ## Build the docker image.
	docker compose -f docker-compose.base.yml -f docker-compose.dev.yml up --build

.PHONY: build-prod
build-prod: ## Build the docker image.
	docker compose -f docker-compose.base.yml -f docker-compose.prod.yml up --build
