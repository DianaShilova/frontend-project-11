install:
	npm install

publish:
	npm publish --dry-run
	npm link

test:
	NODE_OPTIONS=--experimental-vm-modules npx jest --coverage

test-coverage:
	npm test -- --coverage --coverageProvider=v8

help:
	npx babel-node bin/gendiff.js -h

lint:
	npx eslint .