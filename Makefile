all: build node_modules

build: node_modules
	mkdir -p build
	./node_modules/.bin/babel src \
		--experimental \
		--modules common \
		--out-dir build \
		--source-maps

node_modules: package.json
	npm install

.PHONY: test
test: all
	./node_modules/.bin/mocha

.PHONY: clean
clean: remove_build remove_node_modules

.PHONY: remove_build
remove_build:
	rm -rf build

.PHONY: remove_node_modules
remove_node_modules:
	rm -rf node_modules
