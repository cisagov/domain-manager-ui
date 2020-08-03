.PHONY: all help build logs up stop down redeploy

# make all - Default Target. Does nothing.
all:
	@echo "Angular helper commands."
	@echo "For more information try 'make help'."

# target: help - Display callable targets.
help:
	@egrep "^# target:" [Mm]akefile

# target: build = build all containers
build:
	docker-compose -f docker-compose.yml build

# target: app logs - Runs angular logs in the terminal
logs:
	 docker attach --sig-proxy=false domain-management

# target: up - Run local web server.
up:
	 docker-compose -f docker-compose.yml up -d

# target: stop - Stop all docker containers
stop:
	docker-compose -f docker-compose.yml stop

# target: down - Remove all docker containers
down:
	docker-compose -f docker-compose.yml down

# target: redeploy = bring down, rebuild and redeploy all containers
redeploy: down build up
