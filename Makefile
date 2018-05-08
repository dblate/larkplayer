# @author YuHui(yuhui06@baidu.com)
# @date 2017/12/21

# 避免跟本地的命令重复
.PHONY doc

srcFiles := $(shell echo js/*.js)
src/%.txt:
	echo $* > $@

doc:
	rm -rf ./docs/api
	mkdir -p ./docs/api
	./node_modules/.bin/jsdoc2md -f ./src/utils/dom.js > ./docs/api/dom.md
	./node_modules/.bin/jsdoc2md -f ./src/events/events.js > ./docs/api/events.md
	./node_modules/.bin/jsdoc2md -f ./src/utils/fn.js > ./docs/api/fn.md
	./node_modules/.bin/jsdoc2md -f ./src/utils/guid.js > ./docs/api/guid.md
	./node_modules/.bin/jsdoc2md -f ./src/utils/obj.js > ./docs/api/obj.md
	./node_modules/.bin/jsdoc2md -f ./src/utils/to-title-case.js > ./docs/api/to-title-case.md
	./node_modules/.bin/jsdoc2md -f ./src/player.js > ./docs/api/player.md

clean:
	rm -rf ./docs/api
	rm -rf ./dist
	rm -rf ./lib