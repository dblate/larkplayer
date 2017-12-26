# @author YuHui(yuhui06@baidu.com)
# @date 2017/12/21

# 避免跟本地的命令重复
.PHONY doc

srcFiles := $(shell echo js/*.js)
src/%.txt:
	echo $* > $@

doc:
	rm -rf ./docs
	mkdir ./docs
	./node_modules/.bin/jsdoc2md -f ./js/utils/computed-style.js > ./docs/computed-style.md
	./node_modules/.bin/jsdoc2md -f ./js/utils/dom-data.js > ./docs/dom-data.md
	./node_modules/.bin/jsdoc2md -f ./js/utils/dom.js > ./docs/dom.md
	./node_modules/.bin/jsdoc2md -f ./js/utils/events.js > ./docs/events.md
	./node_modules/.bin/jsdoc2md -f ./js/utils/fn.js > ./docs/fn.md
	./node_modules/.bin/jsdoc2md -f ./js/utils/guid.js > ./docs/guid.md
	./node_modules/.bin/jsdoc2md -f ./js/utils/obj.js > ./docs/obj.md
	./node_modules/.bin/jsdoc2md -f ./js/utils/plugin.js > ./docs/plugin.md
	./node_modules/.bin/jsdoc2md -f ./js/utils/to-title-case.js > ./docs/to-title-case.md

tutorial:
	# todo: have this actually run some kind of tutorial wizard?
	echo "Please read the 'Makefile' file to go through this tutorial"

var-kept:
	export foo=bar
	echo "foo=[$foo]"

result: source.txt
	echo "building result.txt from source.txt"
	cp source.txt result.txt

argone:
	echo $@