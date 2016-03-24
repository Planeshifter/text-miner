
#############
# VARIABLES #

NPM ?= npm
NODE_ENV ?= test

KERNEL ?= $(shell uname -s)
ifeq ($(KERNEL), Darwin)
	OPEN ?= open
else
	OPEN ?= xdg-open
endif


# NOTES #

NOTES ?= 'TODO|FIXME|WARNING|HACK|NOTE'


# MOCHA #

MOCHA ?= ./node_modules/.bin/mocha
_MOCHA ?= ./node_modules/.bin/_mocha
MOCHA_REPORTER ?= spec


# ISTANBUL #

ISTANBUL ?= ./node_modules/.bin/istanbul
ISTANBUL_OUT ?= ./reports/coverage
ISTANBUL_REPORT ?= lcov
ISTANBUL_LCOV_INFO_PATH ?= $(ISTANBUL_OUT)/lcov.info
ISTANBUL_HTML_REPORT_PATH ?= $(ISTANBUL_OUT)/lcov-report/index.html


# JSHINT #

JSHINT ?= ./node_modules/.bin/jshint
JSHINT_REPORTER ?= ./node_modules/jshint-stylish



# FILES #

SOURCES ?= lib/*.js
TESTS ?= test/*.js




###########
# TARGETS #


# HELP #

.PHONY: help

help:
	@echo ''
	@echo 'Usage: make <cmd>'
	@echo ''
	@echo '  make help        Print this message.'
	@echo '  make notes       Search for code annotations.'
	@echo '  make test        Run tests.'
	@echo '  make test-cov    Run tests with code coverage.'
	@echo '  make view-cov    View the most recent code coverage report.'
	@echo '  make lint        Run code linting.'
	@echo '  make install     Install dependencies.'
	@echo '  make clean       Clean the build directory.'
	@echo '  make clean-node  Remove Node dependencies.'
	@echo ''



# NOTES #

.PHONY: notes

notes:
	grep -Ern $(NOTES) $(SOURCES) $(TESTS)



# UNIT TESTS #

.PHONY: test test-mocha

test: test-mocha

test-mocha: node_modules
	NODE_ENV=$(NODE_ENV) \
	NODE_PATH=$(NODE_PATH_TEST) \
	$(MOCHA) \
		--reporter $(MOCHA_REPORTER) \
		$(TESTS)



# CODE COVERAGE #

.PHONY: test-cov test-istanbul-mocha

test-cov: test-istanbul-mocha

test-istanbul-mocha: node_modules
	NODE_ENV=$(NODE_ENV) \
	NODE_PATH=$(NODE_PATH_TEST) \
	$(ISTANBUL) cover \
		--dir $(ISTANBUL_OUT) \
		--report $(ISTANBUL_REPORT) \
	$(_MOCHA) -- \
		--reporter $(MOCHA_REPORTER) \
		$(TESTS)



# COVERAGE REPORT #

.PHONY: view-cov view-istanbul-report

view-cov: view-istanbul-report

view-istanbul-report:
	$(OPEN) $(ISTANBUL_HTML_REPORT_PATH)



# LINT #

.PHONY: lint lint-jshint

lint: lint-jshint

lint-jshint: node_modules
	$(JSHINT) \
		--reporter $(JSHINT_REPORTER) \
		./



# NODE #

.PHONY: install clean-node

install: package.json
	$(NPM) install

clean-node:
	rm -rf node_modules



# CLEAN #

.PHONY: clean

clean:
	rm -rf build
