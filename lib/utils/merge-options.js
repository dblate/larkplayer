'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = mergeOptions;

var _obj = require('./obj.js');

/**
 * 深拷贝和合并对象，为 options 定制
 *
 * @param {...Object} args 要合并的对象
 * @return {Object} 合并后的对象
 * @desc
 *      1) 这里其实我们还有一个隐形的约定：options 不要乱传，options 本身是个对象，options 的值要么是对象，要么是普通类型（非引用）
 */
function mergeOptions() {
    var result = {};

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    args.forEach(function (opt) {
        // 对空数组 forEach 时，回调函数传入的参数会是 undefined
        // 这个判断，就是这个函数的鲁棒性所在
        if (!opt) {
            return;
        }

        (0, _obj.each)(opt, function (value, key) {
            // 不是对象时，我们认为他只是普通类型（非引用）时，直接赋值就行了
            if (!(0, _obj.isPlain)(value)) {
                result[key] = value;
            } else {
                // 如果 value 是对象，先保证 result[key] 是对象，再进行后面的赋值
                if (!(0, _obj.isPlain)(result[key])) {
                    result[key] = {};
                }

                // 把剩下的值 merge 到 result[key] 上，如果剩下的值的 key 里还有对象，就递归了
                result[key] = mergeOptions(result[key], value);
            }
        });
    });

    return result;
} /**
   * @file 深拷贝和合并对象（为 options 定制）
   * @author yuhui06@baidu.com
   * @date 2017/11/3
   */
//# sourceMappingURL=merge-options.js.map
