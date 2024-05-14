SHELL := /bin/bash

muikku_front_dir = ./muikku-core-plugins/src/main/resources/META-INF/resources/scripts/src
muikku_test_profiles = dummy-mail-plugin,pyramus-plugins,elastic-search-plugin,atests-plugin,timed-notifications-plugin

.PHONY: help
help:
	@echo ""
	@echo "make build		- Build the whole application"
	@echo "make clean		- Clean the whole application"
	@echo "make front-build	- Build only the front end"
	@echo "make front-prettier	- Run prettier on front code"
	@echo "make produce-ddl	- Produce the database definition from Entities"
	@echo "make test-build		- Build the environment for testing purposes"
	@echo "make test-log		- Show the server log after test"
	@echo "make test-rest		- Run the rest test package"

.PHONY: clean
clean:
	mvn clean

.PHONY: build
build:
	mvn clean compile

.PHONY: front-build
front-build:
	cd $(muikku_front_dir) && npm ci && npm run build

.PHONY: front-prettier
front-prettier:
	cd $(muikku_front_dir) && npm ci && npm run prettier-format

.PHONY: produce-ddl
produce-ddl:
	mvn clean process-classes -Pgen-ddl
	@echo ""
	@echo "Find DDL in muikku/target/sql"

.PHONY: test-build
test-build:
	mvn clean install -P$(muikku_test_profiles)
	
.PHONY: test-log
test-log:
	cat ./muikku-atests/target/cargo/configurations/wildfly26x/log/server.log
	
.PHONY: test-rest
test-rest:
	mvn clean install -P$(muikku_test_profiles) && cd muikku-atests && mvn clean verify -Prest-it


