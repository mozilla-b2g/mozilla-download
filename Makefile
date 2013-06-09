.PHONY: test
test:
	./node_modules/mocha/bin/mocha --ui tdd \
		test/index-test.js \
		test/extract-test.js

.PHONY: test-full
test-full:
	./node_modules/mocha/bin/mocha --ui tdd
