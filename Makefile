.PHONY: setup lint test django-check build-storybook build ci

setup:
	python3 -m pip install --upgrade pip
	pip3 install -e .
	npm install
	npm run build

lint:
	npm run lint

test:
	npm run test

django-check:
	npm run check:django

build-storybook:
	npm run build:storybook

build: build-storybook

ci: lint test django-check
