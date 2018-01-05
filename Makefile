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
	./node_modules/.bin/jsdoc2md -f ./src/js/utils/dom-data.js > ./docs/dom-data.md
	./node_modules/.bin/jsdoc2md -f ./src/js/utils/dom.js > ./docs/dom.md
	./node_modules/.bin/jsdoc2md -f ./src/js/utils/events.js > ./docs/events.md
	./node_modules/.bin/jsdoc2md -f ./src/js/utils/fn.js > ./docs/fn.md
	./node_modules/.bin/jsdoc2md -f ./src/js/utils/guid.js > ./docs/guid.md
	./node_modules/.bin/jsdoc2md -f ./src/js/utils/obj.js > ./docs/obj.md
	./node_modules/.bin/jsdoc2md -f ./src/js/utils/plugin.js > ./docs/plugin.md
	./node_modules/.bin/jsdoc2md -f ./src/js/utils/to-title-case.js > ./docs/to-title-case.md
	./node_modules/.bin/jsdoc2md -f ./src/js/player.js > ./docs/player.md

clean:
	rm -rf ./docs
	rm -rf ./dist
	rm -rf ./lib