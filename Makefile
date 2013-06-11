.PHONY: test
test:
	./node_modules/mocha/bin/mocha --ui tdd \
		test/detect-os.js \
		test/extract-test.js

.PHONY: test-full
test-full:
	./node_modules/mocha/bin/mocha --reporter spec --ui tdd -t 100s
