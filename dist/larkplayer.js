(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.larkplayer = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]';

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object),
    nativeMax = Math.max;

/** Detect if properties shadowing those on `Object.prototype` are non-enumerable. */
var nonEnumShadows = !propertyIsEnumerable.call({ 'valueOf': 1 }, 'valueOf');

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  // Safari 9 makes `arguments.length` enumerable in strict mode.
  var result = (isArray(value) || isArguments(value))
    ? baseTimes(value.length, String)
    : [];

  var length = result.length,
      skipIndexes = !!length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    object[key] = value;
  }
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = array;
    return apply(func, this, otherArgs);
  };
}

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    assignValue(object, key, newValue === undefined ? source[key] : newValue);
  }
  return object;
}

/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return baseRest(function(object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;

    customizer = (assigner.length > 3 && typeof customizer == 'function')
      ? (length--, customizer)
      : undefined;

    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike(object) && isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq(object[index], value);
  }
  return false;
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Assigns own enumerable string keyed properties of source objects to the
 * destination object. Source objects are applied from left to right.
 * Subsequent sources overwrite property assignments of previous sources.
 *
 * **Note:** This method mutates `object` and is loosely based on
 * [`Object.assign`](https://mdn.io/Object/assign).
 *
 * @static
 * @memberOf _
 * @since 0.10.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @see _.assignIn
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * function Bar() {
 *   this.c = 3;
 * }
 *
 * Foo.prototype.b = 2;
 * Bar.prototype.d = 4;
 *
 * _.assign({ 'a': 0 }, new Foo, new Bar);
 * // => { 'a': 1, 'c': 3 }
 */
var assign = createAssigner(function(object, source) {
  if (nonEnumShadows || isPrototype(source) || isArrayLike(source)) {
    copyObject(source, keys(source), object);
    return;
  }
  for (var key in source) {
    if (hasOwnProperty.call(source, key)) {
      assignValue(object, key, source[key]);
    }
  }
});

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

module.exports = assign;

},{}],2:[function(require,module,exports){
(function (global){
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used to compose bitmasks for comparison styles. */
var UNORDERED_COMPARE_FLAG = 1,
    PARTIAL_COMPARE_FLAG = 2;

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_SAFE_INTEGER = 9007199254740991,
    MAX_INTEGER = 1.7976931348623157e+308,
    NAN = 0 / 0;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/,
    reLeadingDot = /^\./,
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    return freeProcess && freeProcess.binding('util');
  } catch (e) {}
}());

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Symbol = root.Symbol,
    Uint8Array = root.Uint8Array,
    propertyIsEnumerable = objectProto.propertyIsEnumerable,
    splice = arrayProto.splice;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object),
    nativeMax = Math.max;

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView'),
    Map = getNative(root, 'Map'),
    Promise = getNative(root, 'Promise'),
    Set = getNative(root, 'Set'),
    WeakMap = getNative(root, 'WeakMap'),
    nativeCreate = getNative(Object, 'create');

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values ? values.length : 0;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  this.__data__ = new ListCache(entries);
}

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  return this.__data__['delete'](key);
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var cache = this.__data__;
  if (cache instanceof ListCache) {
    var pairs = cache.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      return this;
    }
    cache = this.__data__ = new MapCache(pairs);
  }
  cache.set(key, value);
  return this;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  // Safari 9 makes `arguments.length` enumerable in strict mode.
  var result = (isArray(value) || isArguments(value))
    ? baseTimes(value.length, String)
    : [];

  var length = result.length,
      skipIndexes = !!length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = isKey(path, object) ? [path] : castPath(path);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

/**
 * The base implementation of `getTag`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  return objectToString.call(value);
}

/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {boolean} [bitmask] The bitmask of comparison flags.
 *  The bitmask may be composed of the following flags:
 *     1 - Unordered comparison
 *     2 - Partial comparison
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, customizer, bitmask, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, baseIsEqual, customizer, bitmask, stack);
}

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {number} [bitmask] The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, equalFunc, customizer, bitmask, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = arrayTag,
      othTag = arrayTag;

  if (!objIsArr) {
    objTag = getTag(object);
    objTag = objTag == argsTag ? objectTag : objTag;
  }
  if (!othIsArr) {
    othTag = getTag(other);
    othTag = othTag == argsTag ? objectTag : othTag;
  }
  var objIsObj = objTag == objectTag && !isHostObject(object),
      othIsObj = othTag == objectTag && !isHostObject(other),
      isSameTag = objTag == othTag;

  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, equalFunc, customizer, bitmask, stack)
      : equalByTag(object, other, objTag, equalFunc, customizer, bitmask, stack);
  }
  if (!(bitmask & PARTIAL_COMPARE_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, customizer, bitmask, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, equalFunc, customizer, bitmask, stack);
}

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new Stack;
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined
            ? baseIsEqual(srcValue, objValue, customizer, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG, stack)
            : result
          )) {
        return false;
      }
    }
  }
  return true;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[objectToString.call(value)];
}

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity;
  }
  if (typeof value == 'object') {
    return isArray(value)
      ? baseMatchesProperty(value[0], value[1])
      : baseMatches(value);
  }
  return property(value);
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatches(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || baseIsMatch(object, source, matchData);
  };
}

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path, srcValue) {
  if (isKey(path) && isStrictComparable(srcValue)) {
    return matchesStrictComparable(toKey(path), srcValue);
  }
  return function(object) {
    var objValue = get(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn(object, path)
      : baseIsEqual(srcValue, objValue, undefined, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG);
  };
}

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyDeep(path) {
  return function(object) {
    return baseGet(object, path);
  };
}

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value) {
  return isArray(value) ? value : stringToPath(value);
}

/**
 * Creates a `_.find` or `_.findLast` function.
 *
 * @private
 * @param {Function} findIndexFunc The function to find the collection index.
 * @returns {Function} Returns the new find function.
 */
function createFind(findIndexFunc) {
  return function(collection, predicate, fromIndex) {
    var iterable = Object(collection);
    if (!isArrayLike(collection)) {
      var iteratee = baseIteratee(predicate, 3);
      collection = keys(collection);
      predicate = function(key) { return iteratee(iterable[key], key, iterable); };
    }
    var index = findIndexFunc(collection, predicate, fromIndex);
    return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;
  };
}

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} customizer The function to customize comparisons.
 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, equalFunc, customizer, bitmask, stack) {
  var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & UNORDERED_COMPARE_FLAG) ? new SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!seen.has(othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, customizer, bitmask, stack))) {
              return seen.add(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, customizer, bitmask, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} customizer The function to customize comparisons.
 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, equalFunc, customizer, bitmask, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & PARTIAL_COMPARE_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= UNORDERED_COMPARE_FLAG;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), equalFunc, customizer, bitmask, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} customizer The function to customize comparisons.
 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, equalFunc, customizer, bitmask, stack) {
  var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
      objProps = keys(object),
      objLength = objProps.length,
      othProps = keys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, customizer, bitmask, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = keys(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];

    result[length] = [key, value, isStrictComparable(value)];
  }
  return result;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11,
// for data views in Edge < 14, and promises in Node.js.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = objectToString.call(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : undefined;

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = isKey(path, object) ? [path] : castPath(path);

  var result,
      index = -1,
      length = path.length;

  while (++index < length) {
    var key = toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result) {
    return result;
  }
  var length = object ? object.length : 0;
  return !!length && isLength(length) && isIndex(key, length) &&
    (isArray(object) || isArguments(object));
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject(value);
}

/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue &&
      (srcValue !== undefined || (key in Object(object)));
  };
}

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoize(function(string) {
  string = toString(string);

  var result = [];
  if (reLeadingDot.test(string)) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * This method is like `_.find` except that it returns the index of the first
 * element `predicate` returns truthy for instead of the element itself.
 *
 * @static
 * @memberOf _
 * @since 1.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {Function} [predicate=_.identity]
 *  The function invoked per iteration.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {number} Returns the index of the found element, else `-1`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'active': false },
 *   { 'user': 'fred',    'active': false },
 *   { 'user': 'pebbles', 'active': true }
 * ];
 *
 * _.findIndex(users, function(o) { return o.user == 'barney'; });
 * // => 0
 *
 * // The `_.matches` iteratee shorthand.
 * _.findIndex(users, { 'user': 'fred', 'active': false });
 * // => 1
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.findIndex(users, ['active', false]);
 * // => 0
 *
 * // The `_.property` iteratee shorthand.
 * _.findIndex(users, 'active');
 * // => 2
 */
function findIndex(array, predicate, fromIndex) {
  var length = array ? array.length : 0;
  if (!length) {
    return -1;
  }
  var index = fromIndex == null ? 0 : toInteger(fromIndex);
  if (index < 0) {
    index = nativeMax(length + index, 0);
  }
  return baseFindIndex(array, baseIteratee(predicate, 3), index);
}

/**
 * Iterates over elements of `collection`, returning the first element
 * `predicate` returns truthy for. The predicate is invoked with three
 * arguments: (value, index|key, collection).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to inspect.
 * @param {Function} [predicate=_.identity]
 *  The function invoked per iteration.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {*} Returns the matched element, else `undefined`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'age': 36, 'active': true },
 *   { 'user': 'fred',    'age': 40, 'active': false },
 *   { 'user': 'pebbles', 'age': 1,  'active': true }
 * ];
 *
 * _.find(users, function(o) { return o.age < 40; });
 * // => object for 'barney'
 *
 * // The `_.matches` iteratee shorthand.
 * _.find(users, { 'age': 1, 'active': true });
 * // => object for 'pebbles'
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.find(users, ['active', false]);
 * // => object for 'fred'
 *
 * // The `_.property` iteratee shorthand.
 * _.find(users, 'active');
 * // => object for 'barney'
 */
var find = createFind(findIndex);

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result);
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Assign cache to `_.memoize`.
memoize.Cache = MapCache;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */
function toInteger(value) {
  var result = toFinite(value),
      remainder = result % 1;

  return result === result ? (remainder ? result - remainder : result) : 0;
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return object != null && hasPath(object, path, baseHasIn);
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */
function property(path) {
  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}

module.exports = find;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(require,module,exports){
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_SAFE_INTEGER = 9007199254740991,
    MAX_INTEGER = 1.7976931348623157e+308,
    NAN = 0 / 0;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array ? array.length : 0,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  if (value !== value) {
    return baseFindIndex(array, baseIsNaN, fromIndex);
  }
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN(value) {
  return value !== value;
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * The base implementation of `_.values` and `_.valuesIn` which creates an
 * array of `object` property values corresponding to the property names
 * of `props`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} props The property names to get values for.
 * @returns {Object} Returns the array of property values.
 */
function baseValues(object, props) {
  return arrayMap(props, function(key) {
    return object[key];
  });
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object),
    nativeMax = Math.max;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  // Safari 9 makes `arguments.length` enumerable in strict mode.
  var result = (isArray(value) || isArguments(value))
    ? baseTimes(value.length, String)
    : [];

  var length = result.length,
      skipIndexes = !!length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * Checks if `value` is in `collection`. If `collection` is a string, it's
 * checked for a substring of `value`, otherwise
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * is used for equality comparisons. If `fromIndex` is negative, it's used as
 * the offset from the end of `collection`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object|string} collection The collection to inspect.
 * @param {*} value The value to search for.
 * @param {number} [fromIndex=0] The index to search from.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
 * @returns {boolean} Returns `true` if `value` is found, else `false`.
 * @example
 *
 * _.includes([1, 2, 3], 1);
 * // => true
 *
 * _.includes([1, 2, 3], 1, 2);
 * // => false
 *
 * _.includes({ 'a': 1, 'b': 2 }, 1);
 * // => true
 *
 * _.includes('abcd', 'bc');
 * // => true
 */
function includes(collection, value, fromIndex, guard) {
  collection = isArrayLike(collection) ? collection : values(collection);
  fromIndex = (fromIndex && !guard) ? toInteger(fromIndex) : 0;

  var length = collection.length;
  if (fromIndex < 0) {
    fromIndex = nativeMax(length + fromIndex, 0);
  }
  return isString(collection)
    ? (fromIndex <= length && collection.indexOf(value, fromIndex) > -1)
    : (!!length && baseIndexOf(collection, value, fromIndex) > -1);
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a string, else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */
function isString(value) {
  return typeof value == 'string' ||
    (!isArray(value) && isObjectLike(value) && objectToString.call(value) == stringTag);
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */
function toInteger(value) {
  var result = toFinite(value),
      remainder = result % 1;

  return result === result ? (remainder ? result - remainder : result) : 0;
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * Creates an array of the own enumerable string keyed property values of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property values.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.values(new Foo);
 * // => [1, 2] (iteration order is not guaranteed)
 *
 * _.values('hi');
 * // => ['h', 'i']
 */
function values(object) {
  return object ? baseValues(object, keys(object)) : [];
}

module.exports = includes;

},{}],4:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _dom = require('./utils/dom');

var Dom = _interopRequireWildcard(_dom);

var _guid = require('./utils/guid');

var _toTitleCase = require('./utils/to-title-case');

var _toTitleCase2 = _interopRequireDefault(_toTitleCase);

var _mergeOptions = require('./utils/merge-options');

var _mergeOptions2 = _interopRequireDefault(_mergeOptions);

var _evented = require('./mixins/evented');

var _evented2 = _interopRequireDefault(_evented);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /**
                                                                                                                                                           * @file class Componet 所有 UI 的基类
                                                                                                                                                           * @author yuhui06@baidu.com
                                                                                                                                                           * @date 2017/11/4
                                                                                                                                                           * @todo 支持 tap 事件
                                                                                                                                                           */

var Component = function () {
    function Component(player, options, ready) {
        _classCallCheck(this, Component);

        if (!player && this.play) {
            this.player = player = this;
        } else {
            this.player = player;
        }

        // 避免覆盖 prototype.options
        this.options = (0, _mergeOptions2['default'])({}, this.options);
        options = this.options = (0, _mergeOptions2['default'])(this.options, options);
        this.id = options.id || options.el && options.el.id;
        if (!this.id) {
            var id = player && player.id || 'no_player';
            this.id = id + '_component_' + (0, _guid.newGUID)();
        }

        this.name = options.name || null;

        // Html5 中 options.el 为 video 标签
        if (options.el) {
            this.el = options.el;
            // 有时侯我们不希望在这里执行 createEl
        } else if (options.createEl !== false) {
            // 往往是执行子类的 createEl 方法
            this.el = this.createEl();
        }

        (0, _evented2['default'])(this, { eventBusKey: this.el });

        // 子元素相关信息
        this.children = [];
        this.childNameIndex = {};

        if (options.initChildren !== false) {
            this.initChildren();
        }

        this.ready(ready);
    }

    // dispose 应该做到以下几方面
    // 1. remove Elements for memory
    // 2. remove Events for memory
    // 3. remove reference for GC


    Component.prototype.dispose = function dispose() {
        this.trigger({ type: 'dispose', bubbles: false });

        if (this.el) {
            if (this.el.parentNode) {
                this.el.parentNode.removeChild(this.el);
            }
            this.off();
            this.el = null;
        }

        if (this.children) {
            this.children.forEach(function (child) {
                if (typeof child.dispose === 'function') {
                    child.dispose();
                }
            });
            this.children = null;
            this.childNameIndex = null;
        }
    };

    Component.prototype.createEl = function createEl(tagName, properties, attributes) {
        return Dom.createEl(tagName, properties, attributes);
    };

    Component.prototype.createElement = function createElement(tagName, props) {
        var ComponentClass = Component.getComponent((0, _toTitleCase2['default'])(tagName));

        for (var _len = arguments.length, child = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
            child[_key - 2] = arguments[_key];
        }

        if (ComponentClass) {
            var instance = new ComponentClass(this.player, props);
            var instanceEl = instance.el;

            if (child) {
                Dom.appendContent(instanceEl, child);
            }

            return instanceEl;
        } else {
            return Dom.createElement.apply(Dom, [tagName, props].concat(child));
        }
    };

    Component.prototype.appendChild = function appendChild(el, child) {};

    Component.prototype.contentEl = function contentEl() {
        return this.contentEl || this.el;
    };

    Component.prototype.getChild = function getChild(name) {

        if (!name) {
            return;
        }

        return this.childNameIndex[(0, _toTitleCase2['default'])(name)];
    };

    Component.prototype.addChild = function addChild() {};

    Component.prototype.removeChild = function removeChild() {};

    Component.prototype.initChildren = function initChildren() {
        var _this = this;

        if (this.options.children && this.options.children.length) {
            // 目前只支持平行的就够了
            this.options.children.forEach(function (componentName) {
                var ComponentClass = Component.getComponent((0, _toTitleCase2['default'])(componentName));
                // @todo 判断 ComponentClass 是否合法
                if (ComponentClass) {
                    // @todo this.options 传到子元素里有什么用？
                    // this.options 里的 el 会跟子元素的 el 冲突
                    var _child = new ComponentClass(_this.player);

                    _this.children.push(_child);
                    _this.childNameIndex[componentName] = _child;

                    _this.el.appendChild(_child.el);
                }
            });
        }
    };

    Component.prototype.ready = function ready(fn) {
        var _this2 = this;

        if (fn) {
            if (this.isReady) {
                setTimeout(function () {
                    fn.call(_this2);
                }, 1);
            } else {
                this.readyQueue = this.readyQueue || [];
                this.readyQueue.push(fn);
            }
        }
    };

    Component.prototype.triggerReady = function triggerReady() {
        var _this3 = this;

        this.isReady = true;

        setTimeout(function () {
            var readyQueue = _this3.readyQueue;
            _this3.readyQueue = [];
            if (readyQueue && readyQueue.length) {
                readyQueue.forEach(function (fn) {
                    fn.call(_this3);
                });
            }

            _this3.trigger('ready');
        }, 1);
    };

    Component.prototype.$ = function $(selector, context) {
        return Dom.$(selector, context || this.contentEl());
    };

    Component.prototype.$$ = function $$(selector, context) {
        return Dom.$$(selector, context || this.contentEl());
    };

    Component.prototype.hasClass = function hasClass(classToCheck) {
        return Dom.hasClass(this.el, classToCheck);
    };

    Component.prototype.addClass = function addClass(classToAdd) {
        return Dom.addClass(this.el, classToAdd);
    };

    Component.prototype.removeClass = function removeClass(classToRemove) {
        return Dom.removeClass(this.el, classToRemove);
    };

    Component.prototype.toggleClass = function toggleClass(classToToggle) {
        return Dom.toggleClass(this.el, classToToggle);
    };

    Component.prototype.show = function show() {
        this.removeClass('lark-hidden');
    };

    Component.prototype.hide = function hide() {
        this.addClass('lark-hidden');
    };

    Component.prototype.lockShowing = function lockShowing() {
        this.addClass('lark-lock-showing');
    };

    Component.prototype.unlockShowing = function unlockShowing() {
        this.removeClass('lark-lock-showing');
    };

    Component.prototype.getAttribute = function getAttribute(attribute) {
        return Dom.getAttribute(this.el, attribute);
    };

    Component.prototype.setAttribute = function setAttribute(attribute, value) {
        return Dom.setAttribute(attribute, value);
    };

    Component.prototype.removeAttribute = function removeAttribute(attribute) {
        return Dom.removeAttribute(this.el, attribute);
    };

    Component.prototype.width = function width() {};

    Component.prototype.height = function height() {};

    Component.prototype.focus = function focus() {
        this.el.focus();
    };

    Component.prototype.blur = function blur() {
        this.el.blur();
    };

    Component.registerComponent = function registerComponent(name, component) {
        // 静态方法，this 是指 Component 这个类而不是他的实例
        if (!this.components) {
            this.components = {};
        }

        this.components[name] = component;
    };

    Component.getComponent = function getComponent(name) {
        return this.components[name];
    };

    return Component;
}();

exports['default'] = Component;

},{"./mixins/evented":7,"./utils/dom":29,"./utils/guid":33,"./utils/merge-options":35,"./utils/to-title-case":41}],5:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _lodash = require('lodash.find');

var _lodash2 = _interopRequireDefault(_lodash);

var _component = require('./component');

var _component2 = _interopRequireDefault(_component);

var _dom = require('./utils/dom');

var Dom = _interopRequireWildcard(_dom);

var _toTitleCase = require('./utils/to-title-case');

var _toTitleCase2 = _interopRequireDefault(_toTitleCase);

var _normalizeSource = require('./utils/normalize-source');

var _normalizeSource2 = _interopRequireDefault(_normalizeSource);

var _obj = require('./utils/obj');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file html5 video api proxy
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yuhui06(yuhui06@baidu.com)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date 2017/11/6
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @see https://html.spec.whatwg.org/#event-media-emptied
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @see https://www.w3.org/TR/html5/embedded-content-0.html#attr-media-src
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var document = window.document;

var Html5 = function (_Component) {
    _inherits(Html5, _Component);

    function Html5(player, options, ready) {
        _classCallCheck(this, Html5);

        // @todo 处理有 source 的情况

        var _this = _possibleConstructorReturn(this, _Component.call(this, player, options, ready));

        _this.proxyWebkitFullscreen();
        return _this;
    }

    Html5.prototype.dispose = function dispose() {
        Html5.disposeMediaElement(this.el);
        _Component.prototype.dispose.call(this);
    };

    Html5.prototype.setCurrentTime = function setCurrentTime(seconds) {
        try {
            this.el.currentTime = seconds;
        } catch (ex) {
            /* eslint-disable no-console */
            console.log(ex, 'Video is not ready');
            /* eslint-enbale no-console */
        }
    };

    Html5.prototype.width = function width() {
        return this.el.offsetWidth;
    };

    Html5.prototype.height = function height() {
        return this.el.offsetHeight;
    };

    Html5.prototype.proxyWebkitFullscreen = function proxyWebkitFullscreen() {
        var _this2 = this;

        if (!('webkitDisplayingFullscreen' in this.el)) {
            return;
        }

        var endFn = function endFn() {
            this.trigger('fullscreenchange', { isFullscreen: false });
        };

        var beginFn = function beginFn() {
            if ('webkitPresentationMode' in this.el && this.el.webkitPresentationMode !== 'picture-in-picture') {

                this.one('webkitendfullscreen', endFn);
                this.trigger('fullscreenchange', { isFullscreen: true });
            }
        };

        // @todo 改变执行事件时的 this
        beginFn = beginFn.bind(this);
        endFn = endFn.bind(this);

        this.on('webkitbeginfullscreen', beginFn);
        this.on('dispose', function () {
            _this2.off('webkitbeginfullscreen', beginFn);
            _this2.off('webkitendfullscreen', endFn);
        });
    };

    Html5.prototype.supportsFullScreen = function supportsFullScreen() {
        // return this.el.webkitSupportsFullscreen;

        if (typeof this.el.webkitEnterFullScreen === 'function') {
            var userAgent = window.navigator && window.navigator.userAgent || '';

            // Seems to be broken in Chromium/Chrome && Safari in Leopard
            if (/Android/.test(userAgent) || !/Chrome|Mac OS X 10.5/.test(userAgent)) {
                return true;
            }
        }

        return false;
    };

    Html5.prototype.enterFullScreen = function enterFullScreen() {
        if (typeof this.el.webkitEnterFullScreen === 'function') {
            this.el.webkitEnterFullScreen();
        }
    };

    Html5.prototype.exitFullScreen = function exitFullScreen() {
        if (typeof this.el.webkitExitFullScreen === 'function') {
            // @test
            this.player.removeClass('lark-fullscreen');

            this.el.webkitExitFullScreen();
        }
    };

    Html5.prototype.src = function src(_src) {
        if (_src === undefined) {
            return this.el.currentSrc || this.el.src;
        }

        this.setSrc(_src);
    };

    Html5.prototype.source = function source(_source) {
        if (_source === undefined) {
            var sourceNodeList = Dom.$$('source', this.el);
            var sourceArray = Array.from(sourceNodeList);
            return sourceArray.map(function (value) {
                return {
                    src: value.src,
                    type: value.type
                };
            });
        } else {
            _source = (0, _normalizeSource2['default'])(_source);

            var docFragment = document.createDocumentFragment();
            _source.forEach(function (value) {
                var sourceElem = Dom.createElement('source', {
                    src: value.src,
                    type: value.type
                });
                docFragment.appendChild(sourceElem);
            });
            this.el.appendChild(docFragment);
        }
    };

    Html5.prototype.reset = function reset() {
        Html5.resetMediaElement(this.el);
    };

    Html5.prototype.currentSrc = function currentSrc() {
        if (this.currentSource) {
            return this.currentSource.src;
        }

        return this.el.currentSrc;
    };

    Html5.prototype.setControls = function setControls(val) {
        this.el.controls = !!val;
    };

    Html5.prototype.getVideoPlaybackQuality = function getVideoPlaybackQuality() {};

    return Html5;
}(_component2['default']);

// HTML5 Support Testing


Html5.TEST_VID = document.createElement('video');

/**
 * 检查是否支持 HTML5 video
 *
 * @return {boolean} 是否支持 HTML5 video
 */
Html5.isSupported = function () {
    try {
        Html5.TEST_VID.volume = 0.5;
    } catch (ex) {
        return false;
    }

    return !!(Html5.TEST_VID && Html5.TEST_VID.canPlayType);
};

/**
 * 检查是否支持指定类型的视频
 *
 * HTML5 api proxy
 *
 * @param {string} type 要检查的类型(mimetype)
 * @return {boolean} 是否支持
 */
Html5.canPlayType = function (type) {
    return Html5.TEST_VID.canPlayType(type);
};

Html5.canPlaySource = function (srcObj, options) {
    return Html5.canPlayType(srcObj.type);
};

Html5.canPlaySrc = function (src) {
    var source = (0, _normalizeSource2['default'])({ src: src })[0];
    var mediaSourceHandler = Html5.selectMediaSourceHandler(source);

    return !!(mediaSourceHandler || Html5.canPlaySource(source));
};

/**
 * 检查是否可以改变播放器的声音大小（许多移动端的浏览器没法改变声音大小，比如 ios）
 *
 * @return {boolean} 是否可以改变声音大小
 */
Html5.canControlVolume = function () {
    // IE will error if Windows Media Player not installed #3315
    try {
        var volume = Html5.TEST_VID.volume;

        Html5.TEST_VID.volume = volume / 2 + 0.1;
        return volume !== Html5.TEST_VID.volume;
    } catch (ex) {
        return false;
    }
};

/**
 * 检查能否改变视频播放速度
 *
 * @return {boolean} 是否可以改变视频播放速度
 */
Html5.canControlPlaybackRate = function () {
    // Playback rate API is implemented in Android Chrome, but doesn't do anything
    // https://github.com/videojs/video.js/issues/3180
    // if (browser.IS_ANDROID && browser.IS_CHROME && browser.CHROME_VERSION < 58) {
    //     return false;
    // }

    try {
        var playbackRate = Html5.TEST_VID.playbackRate;
        Html5.TEST_VID.playbackRate = playbackRate / 2 + 0.1;
        return playbackRate !== Html5.TEST_VID.playbackRate;
    } catch (ex) {
        return false;
    }
};

// HTML5 video 事件
Html5.Events = ['loadstart', 'suspend', 'abort', 'error', 'emptied', 'stalled', 'loadedmetadata', 'loadeddata', 'canplay', 'canplaythrough', 'playing', 'waiting', 'seeking', 'seeked', 'ended', 'durationchange', 'timeupdate', 'progress', 'play', 'pause', 'ratechange', 'resize', 'volumechange'];

Html5.prototype.featuresVolumeControl = Html5.canControlVolume();

Html5.prototype.featuresPlaybackRate = Html5.canControlPlaybackRate();

// @todo
// Html5.prototype.movingMediaElementInDOM = !browser.IS_IOS;

// 表明进入全屏时，播放器是否自动改变视频大小
Html5.prototype.featuresFullscreenResize = true;

// 表明是否支持 progress 事件
Html5.prototype.featuresProgressEvents = true;

// 表明是否支持 timeupdate 事件
Html5.prototype.featuresTimeupdateEvents = true;

// @todo patchCanPlayType


Html5.disposeMediaElement = function (el) {
    if (!el) {
        return;
    }

    if (el.parentNode) {
        el.parentNode.removeChild(el);
    }

    while (el.hasChildNodes()) {
        el.removeChild(el.firstChild);
    }

    // 移除 src 属性，而不是设置 src=''（在 firefox 下会有问题）
    el.removeAttribute('src');

    // force the media element to update its loading state by calling load()
    // however IE on Windows 7N has a bug that throws an error so need a try/catch (#793)
    if (typeof el.load === 'function') {
        // wrapping in an iife so it's not deoptimized (#1060#discussion_r10324473)
        (function () {
            try {
                el.load();
            } catch (ex) {
                /* eslint-disable no-console */
                console.log(ex);
                /* eslint-enbale no-console */
            }
        })();
    }
};

Html5.resetMediaElement = function (el) {
    if (!el) {
        return;
    }

    var sources = el.querySelectorAll('source');
    var i = sources.length;

    while (i--) {
        el.removeChild(sources[i]);
    }

    el.removeAttribute('src');

    if (typeof el.load === 'function') {
        // wrapping in an iife so it's not deoptimized (#1060#discussion_r10324473)
        (function () {
            try {
                el.load();
            } catch (e) {
                // satisfy linter
            }
        })();
    }
};

Html5.mediaSourceHandler = [];

Html5.validateMediaSourceHandler = function (handler) {
    if ((0, _obj.isPlain)(handler) && typeof handler.canHandleSource === 'function' && typeof handler.handleSource === 'function') {
        return true;
    } else {
        return false;
    }
};

Html5.registerMediaSourceHandler = function (handler) {
    if (Html5.validateMediaSourceHandler(handler)) {
        Html5.mediaSourceHandler.push(handler);
    } else {
        /* eslint-disable no-console */
        console.error('Invalid mediaSourceHandler');
        /* eslint-enbale no-console */
    }
};

Html5.selectMediaSourceHandler = function (source) {
    return (0, _lodash2['default'])(Html5.mediaSourceHandler, function (handler) {
        return handler.canHandleSource(source);
    });
};

// HTML5 video attributes proxy
// 获取对应属性的值
// muted defaultMuted autoplay controls loop playsinline
['muted', 'defaultMuted', 'autoplay', 'controls', 'loop', 'playsinline'].forEach(function (attr) {
    Html5.prototype[attr] = function () {
        return this.el[attr] || this.el.hasAttribute(attr);
    };
});

// HTML5 video attributes proxy
// 设置对应属性的值
// setMuted, setDefaultMuted, setAutoPlay, setLoop, setPlaysinline
// setControls 算是特例
['muted', 'defaultMuted', 'autoplay', 'loop', 'playsinline'].forEach(function (attr) {
    Html5.prototype['set' + (0, _toTitleCase2['default'])(attr)] = function (value) {
        this.el[attr] = value;

        if (value) {
            this.el.setAttribute(attr, attr);
        } else {
            this.el.removeAttribute(attr);
        }
    };
});

// Wrap HTML5 video properties with a getter
// paused, currentTime, duration, buffered, volume, poster, preload, error, seeking
// seekable, ended, palybackRate, defaultPlaybackRate, played, networkState,
// readyState, videoWidth, videoHeight
['paused', 'currentTime', 'duration', 'buffered', 'volume', 'poster', 'preload', 'error', 'seeking', 'seekable', 'ended', 'playbackRate', 'defaultPlaybackRate', 'played', 'networkState', 'readyState', 'videoWidth', 'videoHeight'].forEach(function (prop) {
    Html5.prototype[prop] = function () {
        return this.el[prop];
    };
});

// Wrap HTML5 video properties with a setter in the following format:
// set + toTitleCase(propName)
// setVolume, setSrc, setPoster, setPreload, setPlaybackRate, setDefaultPlaybackRate
['volume', 'src', 'poster', 'preload', 'playbackRate', 'defaultPlaybackRate'].forEach(function (prop) {
    Html5.prototype['set' + (0, _toTitleCase2['default'])(prop)] = function (value) {
        this.el[prop] = value;
    };
});

// Wrap native functions with a function
// pause, load, play
['pause', 'load', 'play'].forEach(function (prop) {
    Html5.prototype[prop] = function () {
        return this.el[prop]();
    };
});

exports['default'] = Html5;

},{"./component":4,"./utils/dom":29,"./utils/normalize-source":37,"./utils/obj":38,"./utils/to-title-case":41,"lodash.find":2}],6:[function(require,module,exports){
'use strict';

var _dom = require('./utils/dom');

var Dom = _interopRequireWildcard(_dom);

var _events = require('./utils/events');

var Events = _interopRequireWildcard(_events);

var _player = require('./player');

var _player2 = _interopRequireDefault(_player);

var _plugin = require('./utils/plugin');

var Plugin = _interopRequireWildcard(_plugin);

var _log = require('./utils/log');

var _log2 = _interopRequireDefault(_log);

var _html = require('./html5');

var _html2 = _interopRequireDefault(_html);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

/**
 * @file larkplayer.js larkplayer 入口函数
 * @author yuhui<yuhui06@baidu.com>
 * @date 2017/11/7
 */

function normalize(el) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var readyFn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};

    if (typeof el === 'string') {
        if (el.charAt(0) !== '#') {
            el = '#' + el;
        }

        el = Dom.$(el);
    }

    // 默认添加 playsinline 属性
    if (options.playsinline === undefined) {
        options.playsinline = true;
    }

    return { el: el, options: options, readyFn: readyFn };
}

function larkplayer(el, options, readyFn) {
    // @todo 优化不支持 html5 video 标签时的展示
    if (!_html2['default'].isSupported()) {
        return false;
    }

    // () 避免 {} 在行首造成语法错误

    var _normalize = normalize(el, options, readyFn);

    el = _normalize.el;
    options = _normalize.options;
    readyFn = _normalize.readyFn;


    var player = new _player2['default'](el, options, readyFn);

    return player;
}

larkplayer.Html5 = _html2['default'];

larkplayer.dom = Dom;

// events
larkplayer.on = Events.on;
larkplayer.one = Events.one;
larkplayer.off = Events.off;
larkplayer.trigger = Events.trigger;

larkplayer.log = _log2['default'];

// plugin
larkplayer.registerPlugin = Plugin.registerPlugin;
larkplayer.deregisterPlugin = Plugin.deregisterPlugin;

// export default larkplayer;
// for babel es6
// @see https://github.com/babel/babel/issues/2724
module.exports = larkplayer;

},{"./html5":5,"./player":8,"./utils/dom":29,"./utils/events":30,"./utils/log":34,"./utils/plugin":39}],7:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports['default'] = evented;

var _events = require('../utils/events');

var Events = _interopRequireWildcard(_events);

var _dom = require('../utils/dom');

var Dom = _interopRequireWildcard(_dom);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

/**
 * 使一个对象具有直接使用 on off one trigger 的能力
 *
 * @param {Object} target 要具有事件能力的对象
 * @param {Object} options 配置项
 * @param {string=} options.eventBusKey 一个 DOM 元素，事件绑定在该元素上
 */
/**
 * @file 给一个对象添加事件方面的 api
 * @author yuhui<yuhui06@baidu.com>
 * @date 2017/11/7
 */

function evented(target) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (target.isEvented && target.eventBusEl === options.eventBusKey) {
        return;
    } else {
        target.isEvented = true;
    }

    // @todo normalize args
    var eventBusKey = options.eventBusKey;
    if (eventBusKey && eventBusKey.nodeType === 1) {
        target.eventBusEl = eventBusKey;
    } else {
        target.eventBusEl = Dom.createEl('div');
    }

    // if (target[eventBusKey] && target[eventBusKey]['nodeType'] === 1) {
    //     target.eventBusEl = target[eventBusKey];
    // } else {
    //     target.eventBusEl = Dom.createEl('div');
    // }

    target.on = function (type, fn) {
        Events.on(target.eventBusEl, type, fn);
    };

    target.off = function (type, fn) {
        Events.off(target.eventBusEl, type, fn);
    };

    target.one = function (type, fn) {
        Events.one(target.eventBusEl, type, fn);
    };

    target.trigger = function (type, data) {
        Events.trigger(target.eventBusEl, type, data);
    };
}

},{"../utils/dom":29,"../utils/events":30}],8:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _lodash = require('lodash.includes');

var _lodash2 = _interopRequireDefault(_lodash);

var _html = require('./html5');

var _html2 = _interopRequireDefault(_html);

var _component = require('./component');

var _component2 = _interopRequireDefault(_component);

var _guid = require('./utils/guid');

var _dom = require('./utils/dom');

var Dom = _interopRequireWildcard(_dom);

var _events = require('./utils/events');

var Events = _interopRequireWildcard(_events);

var _toTitleCase = require('./utils/to-title-case');

var _toTitleCase2 = _interopRequireDefault(_toTitleCase);

var _fullscreen = require('./utils/fullscreen');

var _fullscreen2 = _interopRequireDefault(_fullscreen);

var _evented = require('./mixins/evented');

var _evented2 = _interopRequireDefault(_evented);

var _obj = require('./utils/obj');

var _plugin = require('./utils/plugin');

var Plugin = _interopRequireWildcard(_plugin);

var _log = require('./utils/log');

var _log2 = _interopRequireDefault(_log);

var _computedStyle = require('./utils/computed-style');

var _computedStyle2 = _interopRequireDefault(_computedStyle);

var _featureDetector = require('./utils/feature-detector');

var _featureDetector2 = _interopRequireDefault(_featureDetector);

var _normalizeSource = require('./utils/normalize-source');

var _normalizeSource2 = _interopRequireDefault(_normalizeSource);

require('./ui/play-button');

require('./ui/control-bar');

require('./ui/loading');

require('./ui/progress-bar-simple');

require('./ui/error');

require('./ui/control-bar-pc');

require('./ui/loading-pc');

require('./ui/error-pc');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file Player.js. player initial && api
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yuhui06(yuhui06@baidu.com)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date 2017/11/6
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @todo 对于 Player 构造函数的特殊照顾需要理一下，可能没必要
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

// 确保以下代码都执行一次


var activeClass = 'lark-user-active';

var Player = function (_Component) {
    _inherits(Player, _Component);

    /**
     * 初始化一个播放器实例
     *
     * @constructor
     * @param {Element|string} tag video 标签的 DOM 元素或者 id
     * @param {Object=} options 配置项，可选
     * @param {number=} options.height 播放器高度
     * @param {number=} options.width 播放器宽度
     * @param {boolean=} options.loop 是否循环播放
     * @param {boolean=} options.muted 是否静音
     * @param {boolean=} options.playsinline 是否使用内联的形式播放（即非全屏的形式）。仅 ios10 以上有效，在 ios10 以下，视频播放时会自动进入全屏
     * @param {string=} options.poster 视频封面
     * @param {string=} options.preload 视频预先下载资源的设置，可选值有以下 3 种（当然就算你设置了以下 3 种，最终结果也不一定符合预期，毕竟浏览器嘛，你懂的）
     *                                  - auto 浏览器自己决定
     *                                  - metadata 仅下载 metadata（视频总时长、高宽等信息）
     *                                  - none 不要预下载
     * @param {string=} options.src 视频链接
     * @param {Array=} options.source 视频 source 标签。为 [{src: 'xxx', type: 'xxx'}] 的形式，type 可选
     * @param {Function=} ready 播放器初始化完成后执行的函数，可选
     */
    /* eslint-disable fecs-max-statements */
    function Player(tag, options, ready) {
        _classCallCheck(this, Player);

        // tag.id = tag.id || `larkplayer-${newGUID()}`;

        options.initChildren = false;
        options.createEl = false;
        options.reportTouchActivity = false;
        // options.id = options.id || tag.id;

        var _this = _possibleConstructorReturn(this, _Component.call(this, null, options, ready));

        _this.isReady = false;

        // if (!Html5.isSupported()) {
        //     tag.innerHTML = '您的浏览器不支持 html5 视频播放，请升级浏览器版本或更换为 chrome 浏览器';
        //     return;
        // }

        // @todo check valid options

        _this.tag = tag;

        _this.el = _this.createEl();

        // 使得 this 具有事件能力(on off one trigger)
        (0, _evented2['default'])(_this, { eventBusKey: _this.el });

        // 需放在 this.loadTech 方法前面
        _this.handleLoadstart = _this.handleLoadstart.bind(_this);
        _this.handlePlay = _this.handlePlay.bind(_this);
        _this.handleWaiting = _this.handleWaiting.bind(_this);
        _this.handleCanplay = _this.handleCanplay.bind(_this);
        _this.handleCanplaythrough = _this.handleCanplaythrough.bind(_this);
        _this.handlePlaying = _this.handlePlaying.bind(_this);
        _this.handleSeeking = _this.handleSeeking.bind(_this);
        _this.handleSeeked = _this.handleSeeked.bind(_this);
        _this.handleFirstplay = _this.handleFirstplay.bind(_this);
        _this.handlePause = _this.handlePause.bind(_this);
        _this.handleEnded = _this.handleEnded.bind(_this);
        _this.handleDurationchange = _this.handleDurationchange.bind(_this);
        _this.handleTimeupdate = _this.handleTimeupdate.bind(_this);
        _this.handleTap = _this.handleTap.bind(_this);
        _this.handleTouchStart = _this.handleTouchStart.bind(_this);
        _this.handleTouchMove = _this.handleTouchMove.bind(_this);
        _this.handleTouchEnd = _this.handleTouchEnd.bind(_this);
        _this.handleFullscreenChange = _this.handleFullscreenChange.bind(_this);
        _this.handleFullscreenError = _this.handleFullscreenError.bind(_this);
        _this.handleError = _this.handleError.bind(_this);
        _this.handleClick = _this.handleClick.bind(_this);
        _this.handleMouseEnter = _this.handleMouseEnter.bind(_this);
        _this.handleMouseMove = _this.handleMouseMove.bind(_this);
        _this.handleMouseLeave = _this.handleMouseLeave.bind(_this);

        // 3000ms 后自动隐藏播放器控制条
        _this.activeTimeout = 3000;

        // @todo ios11 click 事件触发问题
        // this.on('click', this.handleClick);
        if (_featureDetector2['default'].touch) {
            _this.on('touchstart', _this.handleTouchStart);
            _this.on('touchend', _this.handleTouchEnd);
        } else {
            _this.on('click', _this.handleClick);
            _this.on('mouseenter', _this.handleMouseEnter);
            _this.on('mousemove', _this.handleMouseMove);
            _this.on('mouseleave', _this.handleMouseLeave);
        }

        if (!_this.tech) {
            _this.tech = _this.loadTech();
        }

        _this.initChildren();

        _this.addClass('lark-paused');
        var src = _this.src();
        if (src) {
            // 如果视频已经存在，看下是不是错过了 loadstart 事件
            _this.handleLateInit(_this.tech.el);

            var source = (0, _normalizeSource2['default'])({ src: src })[0];
            _this.mediaSourceHandler = _html2['default'].selectMediaSourceHandler(source);
            if (_this.mediaSourceHandler) {
                var handlerOptions = _this.getMediaSourceHanlderOptions(_this.mediaSourceHandler.name);
                _this.mediaSourceHandler.handleSource(source, _this, handlerOptions);
            }
        }

        // plugins
        _this.plugins = {};
        var plugins = _this.options.plugins;
        if (plugins) {
            Object.keys(plugins).forEach(function (name) {
                var plugin = Plugin.getPlugin(name);
                if (typeof plugin === 'function') {
                    plugin.call(_this, plugins[name]);
                    _this.plugins[name] = plugin;
                } else {
                    throw new Error('Plugin ' + name + ' not exist');
                }
            });
        }

        // 如果当前视频已经出错，重新触发一次 error 事件
        if (_this.techGet('error')) {
            Events.trigger(_this.tech.el, 'error');
        }

        _this.triggerReady();
        return _this;
    }
    /* eslint-enable fecs-max-statements */

    Player.prototype.getMediaSourceHanlderOptions = function getMediaSourceHanlderOptions() {
        var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

        if (this.options && this.options.mediaSourceHandler && this.options.mediaSourceHandler[name]) {

            return this.options.mediaSourceHandler[name];
        } else {
            return {};
        }
    };

    /**
     * 销毁播放器
     *
     */


    Player.prototype.dispose = function dispose() {
        this.trigger('dispose');
        // 避免 dispose 被调用两次
        this.off('dispose');

        // if (this.styleEl_ && this.styleEl_.parentNode) {
        //     this.styleEl_.parentNode.removeChild(this.styleEl_);
        // }

        if (this.tag && this.tag.player) {
            this.tag.player = null;
        }

        if (this.el && this.el.player) {
            this.el.player = null;
        }

        if (this.tech) {
            this.tech.dispose();
        }

        _Component.prototype.dispose.call(this);
    };

    /**
     * 创建播放器 DOM （将 video 标签包裹在一层 div 中，全屏及添加其他子元素时需要）
     *
     * @private
     * @return {Element} el 播放器 DOM
     */


    Player.prototype.createEl = function createEl() {
        var _this2 = this;

        var tag = this.tag;

        // 处理 options 中的 html5 标准属性
        var html5StandardOptions = ['autoplay',
        // 'controls',
        'height', 'loop', 'muted', 'poster', 'preload', 'auto', 'metadata', 'none', 'src', 'width', 'playsinline'];
        (0, _obj.each)(this.options, function (value, key) {
            if ((0, _lodash2['default'])(html5StandardOptions, key)) {
                Dom.setAttribute(tag, key, value);
            }
        });

        if (this.options.source) {
            // 等到 this.tech 初始化完成后再添加
            this.ready(function () {
                _this2.source(_this2.options.source);
            });
        }

        // 为 video 创建一个父元素，并将 video 的属性全部加在父元素上
        // 将子元素的 id 转移到父元素上
        var el = Dom.createEl('div', null, Dom.getAttributes(tag));

        // 为父元素添加 larkplayer class
        Dom.addClass(el, 'larkplayer');

        Dom.setAttribute(el, 'tabindex', '-1');
        Dom.setAttribute(tag, 'tabindex', '-1');

        // 子元素原来的 id 加上 -larkplayer 后缀
        if (tag && tag.id) {
            tag.id += '-larkplayer';
        }

        // 将原生控制条移除
        // 目前只支持使用自定义的控制条
        tag.removeAttribute('controls');

        // 将 el 插入到 DOM 中
        if (tag.parentNode) {
            tag.parentNode.insertBefore(el, tag);
        }

        // 父元素的 width height 样式继承子元素的值
        // 将 video 标签的 width height 属性移除，确保 width height 为 100%

        // IE7 不支持 hasAttribute
        // if (tag.hasAttribute('width')) {
        if (tag.width) {
            var tagWidth = tag.getAttribute('width');
            el.style.width = tagWidth + 'px';
            tag.removeAttribute('width');
        }

        // if (tag.hasAttribute('height')) {
        if (tag.height) {
            var tagHeight = tag.getAttribute('height');
            el.style.height = tagHeight + 'px';
            tag.removeAttribute('height');
        }

        // @todo safari 好像不支持移动 video DOM?
        // 将 video 插入到 el 中
        el.appendChild(tag);

        return el;
    };

    /**
     * 当 video 标签已经初始化完成后再调用 larkplayer，可能错过一些事件，这里手动触发下
     *
     * @private
     * @param {Element} el video DOM 标签
     */


    Player.prototype.handleLateInit = function handleLateInit(el) {
        var _this3 = this;

        // readyState
        // 0 - HAVE_NOTHING
        // 没有任何资源可供播放，如果 networkState 的状态是 NETWORK_EMPTY 那么 readyState 的状态一定是 HAVE_NOTHING
        // 1 - HAVE_METADATA
        // 视频时长、尺寸已经获取到。这时候还没有可播放的数据，但是跳转到指定时长时播放器不会抛出错误
        // 2 - HAVE_CURRENT_DATA
        // 当前帧的播放没有问题，但是不保证后续可以顺畅播放
        // HAVE_CURRENT_DATA 与 HAVE_METADATA 的区别可以忽略不计
        // 3 - HAVE_FUTURE_DATA
        // 当前帧可以播放，后面的一点也可以播放
        // 一定不是处于最后一帧
        // 4 - HAVE_ENOUGH_DATA
        // 已经全部缓冲完或者照目前的速度播放下去不会有问题

        if (el.networkState === 0 || el.networkState === 3) {
            return;
        }

        // 在 readyState === 0 的时候，loadstart 事件也有可能已经触发了
        // NetworkState is set synchronously BUT loadstart is fired at the
        // end of the current stack, usually before setInterval(fn, 0).
        // So at this point we know loadstart may have already fired or is
        // about to fire, and either way the player hasn't seen it yet.
        // We don't want to fire loadstart prematurely here and cause a
        // double loadstart so we'll wait and see if it happens between now
        // and the next loop, and fire it if not.
        // HOWEVER, we also want to make sure it fires before loadedmetadata
        // which could also happen between now and the next loop, so we'll
        // watch for that also.
        if (el.readyState === 0) {
            var loadstartFired = false;
            var setLoadstartFired = function setLoadstartFired() {
                loadstartFired = true;
            };

            this.on('loadstart', setLoadstartFired);

            var triggerLoadstart = function triggerLoadstart() {
                if (!loadstartFired) {
                    this.trigger('loadstart');
                }
            };

            // 确保在执行 loadedmetadata 之前，执行了 loadstart 事件
            this.on('loadedmetadata', triggerLoadstart);

            // 我们的目标是，错过了 loadstart 的话，在 ready 后再手动 trigger 一次
            this.ready(function () {
                _this3.off('loadstart', setLoadstartFired);
                _this3.off('loadedmetadata', triggerLoadstart);

                if (!loadstartFired) {
                    _this3.trigger('loadstart');
                }
            });

            return;
        }

        var eventsToTrigger = ['loadstart', 'loadedmetadata'];

        if (el.readyState >= 2) {
            eventsToTrigger.push('loadeddata');
        }

        if (el.readyState >= 3) {
            eventsToTrigger.push('canplay');
        }

        if (el.readyState >= 4) {
            eventsToTrigger.push('canplaythrough');
        }

        this.ready(function () {
            eventsToTrigger.forEach(function (event) {
                _this3.trigger(event);
            });
        });
    };

    /**
     * 创建一个 Html5 实例
     *
     * @return {Object} tech Html5 实例
     *
     * @private
     */


    Player.prototype.loadTech = function loadTech() {
        var _this4 = this;

        this.options.el = this.tag;
        var tech = new _html2['default'](this.player, this.options);

        // 注册 video 的各个事件
        [
        // 'loadstart',

        /**
         * 浏览器停止获取数据时触发
         *
         * @event Player#suspend
         * @param {Object} event 事件触发时浏览器自带的 event 对象
         */
        'suspend',

        /**
         * 浏览器在视频下载完成前停止下载时触发。但并不是因为出错，出错时触发 error 事件而不是 abort。
         * 往往是人为的停止下载，比如删除 src
         *
         * @event Player#abort
         * @param {Object} event 事件触发时浏览器自带的 event 对象
         */
        'abort',
        // 'error',

        /**
         * 视频被清空时触发
         *
         * @event Player#emptied
         * @param {Object} event 事件触发时浏览器自带的 event 对象
         */
        'emptied',

        /**
         * 浏览器获取数据时，数据并没有正常返回时触发
         *
         * @event Player#stalled
         * @param {Object} event 事件触发时浏览器自带的 event 对象
         */
        'stalled',

        /**
         * 播放器成功获取到视频总时长、高宽、字幕等信息时触发
         *
         * @event Player#loadedmetadata
         * @param {Object} event 事件触发时浏览器自带的 event 对象
         */
        'loadedmetadata',

        /**
         * 播放器第一次能够渲染当前帧时触发
         *
         * @event Player#loadeddata
         * @param {Object} event 事件触发时浏览器自带的 event 对象
         */
        'loadeddata',
        // 'canplay',
        // 'canplaythrough',
        // 'playing',
        // 'waiting',
        // 'seeking',
        // 'seeked',
        // 'ended',
        // 'durationchange',
        // 'timeupdate',

        /**
         * 浏览器获取数据的过程中触发
         *
         * @event Player#progress
         * @param {Object} event 事件触发时浏览器自带的 event 对象
         */
        'progress',
        // 'play',
        // 'pause',

        /**
         * 视频播放速率改变时触发
         *
         * @event Player#ratechange
         * @param {Object} event 事件触发时浏览器自带的 event 对象
         */
        'ratechange',

        /**
         * 视频本身的高宽发生改变时触发，注意不是播放器的高度（比如调整播放器的高宽和全屏不会触发 resize 事件）
         *
         * 这里还不是太清楚，有需要的话看看 w3c 文档吧
         *
         * @see https://html.spec.whatwg.org/#dom-video-videowidth
         * @event Player#resize
         * @param {Object} event 事件触发时浏览器自带的 event 对象
         */
        'resize',

        /**
         * 视频声音大小改变时触发
         *
         * @event Player#volumechange
         * @param {Object} event 事件触发时浏览器自带的 event 对象
         */
        'volumechange'].forEach(function (event) {
            // 对于我们不做任何处理的事件，直接 trigger 出去，提供给用户就行了
            Events.on(tech.el, event, function () {
                _this4.trigger(event);
            });
        });

        // 如果我们要先对事件做处理，那先走我们自己的 handlexxx 函数
        ['loadstart', 'canplay', 'canplaythrough', 'error', 'playing', 'timeupdate', 'waiting', 'seeking', 'seeked', 'ended', 'durationchange', 'play', 'pause'].forEach(function (event) {
            Events.on(tech.el, event, _this4['handle' + (0, _toTitleCase2['default'])(event)]);
        });

        // 绑定 firstPlay 事件
        // 先 off 确保只绑定一次
        this.off('play', this.handleFirstplay);
        this.one('play', this.handleFirstplay);

        // 全屏事件
        Events.on(tech.el, 'fullscreenchange', this.handleFullscreenChange);
        _fullscreen2['default'].fullscreenchange(this.handleFullscreenChange);
        _fullscreen2['default'].fullscreenerror(this.handleFullscreenError);

        return tech;
    };

    /**
     * 从 Html5 实例上执行对应的 get 函数
     *
     * @private
     * @param {string} method 要执行的函数名
     * @return {Mixed} 对应函数的返回值
     */


    Player.prototype.techGet = function techGet(method) {
        return this.tech[method]();
    };

    /**
     * 从 Html5 实例上执行对应的 set 函数
     *
     * @private
     * @param {string} method 要执行的函数名
     * @param {Mixed} val 对应函数需要的参数
     */


    Player.prototype.techCall = function techCall(method, val) {
        try {
            this.tech[method](val);
        } catch (ex) {
            (0, _log2['default'])(ex);
        }
    };

    /**
     * 获取或设置播放器的宽度
     *
     * @param {number=} value 要设置的播放器宽度值，可选
     * @return {number} 不传参数则返回播放器当前宽度
     */


    Player.prototype.width = function width(value) {
        if (value !== undefined) {
            if (/\d$/.test(value)) {
                value = value + 'px';
            }

            this.el.style.width = value;
        } else {
            return (0, _computedStyle2['default'])(this.el, 'width');
        }
    };

    /**
     * 获取或设置播放器的高度
     *
     * @param {number=} value 要设置的播放器高度值，可选
     * @return {number} 不传参数则返回播放器当前高度
     */


    Player.prototype.height = function height(value) {
        if (value !== undefined) {
            if (/\d$/.test(value)) {
                value = value + 'px';
            }

            this.el.style.height = value;
        } else {
            return (0, _computedStyle2['default'])(this.el, 'height');
        }
    };

    /**
     * 显示或隐藏控制条
     *
     * @param {boolean=} bool 显示或隐藏控制条，如果不传任何参数，则单纯返回当前控制条状态
     * @return {boolean} 当前控制条状态（显示或隐藏）
     */


    Player.prototype.controls = function controls(bool) {
        if (bool === undefined) {
            return this.getControlsStatus();
        }

        if (bool) {
            this.removeClass('lark-controls-hide');
        } else {
            this.addClass('lark-controls-hide');
        }

        return this.getControlsStatus();
    };

    Player.prototype.getControlsStatus = function getControlsStatus() {
        return !this.hasClass('lark-controls-hide');
    };

    /**
     * 获取或设置播放器的高宽
     *
     * @private
     * @param {string} dimension 属性名：width/height
     * @param {number} value 要设置的值
     * @return {number} 对应属性的值
     */


    Player.prototype.dimension = function dimension(_dimension, value) {
        var privateDimension = _dimension + '_';

        if (value === undefined) {
            return this[privateDimension] || 0;
        }

        if (value === '') {
            this[privateDimension] = undefined;
        } else {
            var parsedVal = parseFloat(value);
            if (isNaN(parsedVal)) {
                (0, _log2['default'])('Improper value ' + value + ' supplied for ' + _dimension);
                return;
            }

            this[privateDimension] = parsedVal;
        }

        // this.updateStyleEl_();
    };

    // @dprecated
    // videojs 中的方法，目前没用到


    Player.prototype.hasStart = function hasStart(hasStarted) {
        if (hasStarted !== undefined) {
            if (this.hasStarted !== hasStarted) {
                this.hasStarted = hasStarted;
                if (hasStarted) {
                    this.addClass('lark-has-started');
                    this.trigger('firstplay');
                } else {
                    this.removeClass('lark-has-started');
                }
            }
            return;
        }

        return !!this.hasStarted;
    };

    // = = = = = = = = = = = = = 事件处理 = = = = = = = = = = = = = =

    /**
     * 处理 loadstart 事件
     *
     * @private
     * @fires Player#loadstart
     * @listens Html5#loadstart
     * @see https://html.spec.whatwg.org/#mediaevents
     */


    Player.prototype.handleLoadstart = function handleLoadstart() {
        this.addClass('lark-loadstart');

        /**
         * loadstart 时触发
         *
         * @event Player#loadstart
         * @param {Object} event 事件触发时浏览器自带的 event 对象
         */
        this.trigger('loadstart');
    };

    /**
     * 处理 play 事件
     *
     * @private
     * @fires Player#play
     * @see https://html.spec.whatwg.org/#mediaevents
     */


    Player.prototype.handlePlay = function handlePlay() {
        var _this5 = this;

        // @todo removeClass 支持一次 remove 多个 class
        this.removeClass('lark-loadstart');
        this.removeClass('lark-ended');
        this.removeClass('lark-paused');
        this.removeClass('lark-error');
        this.removeClass('lark-seeking');
        this.removeClass('lark-waiting');
        this.addClass('lark-playing');

        clearTimeout(this.activeTimeoutHandler);
        this.addClass(activeClass);
        this.activeTimeoutHandler = setTimeout(function () {
            _this5.removeClass(activeClass);
        }, this.activeTimeout);

        /**
         * 视频播放时触发，无论是第一次播放还是暂停、卡顿后恢复播放
         *
         * @event Player#play
         * @param {Object} event 事件触发时浏览器自带的 event 对象
         */
        this.trigger('play');
    };

    /**
     * 处理 waiting 事件
     *
     * @private
     * @fires Player#waiting
     * @see https://html.spec.whatwg.org/#mediaevents
     */


    Player.prototype.handleWaiting = function handleWaiting() {
        this.addClass('lark-waiting');

        /**
         * 视频播放因为下一帧没准备好而暂时停止，但是客户端正在努力缓冲中时触发
         * 简单来讲，在视频卡顿或视频跳转到指定位置时触发，在暂停、视频播放完成、视频播放出错时不会触发
         *
         * @event Player#waiting
         * @param {Object} event 事件触发时浏览器自带的 event 对象
         */
        this.trigger('waiting');
        // 处于 waiting 状态后一般都会伴随一次 timeupdate，即使那之后视频还是处于卡顿状态
        // this.one('timeupdate', () => this.removeClass('lark-waiting'));
    };

    /**
     * 处理 canplay 事件
     *
     * @private
     * @fires Player#canplay
     */


    Player.prototype.handleCanplay = function handleCanplay() {
        this.removeClass('lark-waiting');
        this.removeClass('lark-loadstart');

        if (this.paused()) {
            this.removeClass('lark-playing');
            this.addClass('lark-paused');
        }

        /**
         * 视频能开始播发时触发，并不保证能流畅的播完
         *
         * @event Player#canplay
         * @param {Object} event 事件触发时浏览器自带的 event 对象
         */
        this.trigger('canplay');
    };

    /**
     * 处理 canplaythrough 事件
     *
     * @private
     * @fires Player#canplaythrough
     */


    Player.prototype.handleCanplaythrough = function handleCanplaythrough() {
        this.removeClass('lark-waiting');

        /**
         * 如果从当前开始播放，视频估计能流畅的播完时触发此事件
         *
         * @event Player#canplaythrough
         * @param {Object} event 事件触发时浏览器自带的 event 对象
         */
        this.trigger('canplaythrough');
    };

    /**
     * 处理 playing 事件
     *
     * @private
     * @fires Player#playing
     */


    Player.prototype.handlePlaying = function handlePlaying() {
        this.removeClass('lark-waiting');
        this.removeClass('lark-loadstart');

        /**
         * Playback is ready to start after having been paused or delayed due to lack of media data.
         *
         * @event Player#playing
         * @param {Object} event 事件触发时浏览器自带的 event 对象
         * @see https://html.spec.whatwg.org/#mediaevents
         */
        this.trigger('playing');
    };

    /**
     * 处理 seeking 事件
     *
     * @private
     * @fires Player#seeking
     */


    Player.prototype.handleSeeking = function handleSeeking() {
        this.addClass('lark-seeking');

        /**
         * 视频跳转到指定时刻时触发
         *
         * @event Player#seeking
         * @param {Object} event 事件触发时浏览器自带的 event 对象
         */
        this.trigger('seeking');
    };

    /**
     * 处理 seeked 事件
     *
     * @private
     * @fires Player#seeked
     */


    Player.prototype.handleSeeked = function handleSeeked() {
        this.removeClass('lark-seeking');
        this.removeClass('lark-waiting');

        /**
         * 视频跳转到某一时刻完成后触发
         *
         * @event Player#seeked
         * @param {Object} event 事件触发时浏览器自带的 event 对象
         */
        this.trigger('seeked');
    };

    /**
     * 处理自定义的 firstplay 事件
     * 该事件与 play 事件的不同之处在于 firstplay 只会在第一次播放时触发一次
     *
     * @private
     * @fires Player#firstplay
     */


    Player.prototype.handleFirstplay = function handleFirstplay() {
        var _this6 = this;

        // @todo 不清楚有什么用
        this.addClass('lark-has-started');

        clearTimeout(this.activeTimeoutHandler);
        this.addClass(activeClass);
        this.activeTimeoutHandler = setTimeout(function () {
            _this6.removeClass(activeClass);
        }, this.activeTimeout);

        /**
         * 在视频第一次播放时触发，只会触发一次
         *
         * @event Player#firstplay
         */
        this.trigger('firstplay');
    };

    /**
     * 处理 pause 事件
     *
     * @private
     * @fires Player#pause
     */


    Player.prototype.handlePause = function handlePause() {
        this.removeClass('lark-playing');
        this.addClass('lark-paused');

        /**
         * 视频暂停时触发
         *
         * @event Player#pause
         * @param {Object} event 事件触发时浏览器自带的 event 对象
         */
        this.trigger('pause');
    };

    /**
     * 处理 ended 事件
     *
     * @private
     * @fires Player#ended
     */


    Player.prototype.handleEnded = function handleEnded() {
        this.addClass('lark-ended');

        // 如果播放器自动循环了，在 chrome 上不会触发 ended 事件
        // @todo 待验证其他浏览器
        if (this.options.loop) {
            this.currentTime(0);
            this.play();
        } else if (!this.paused()) {
            this.pause();
        }

        /**
         * 视频播放完成时触发，如果设置了 loop 属性为 true，播放完成后可能不触发此事件
         *
         * @event Player#ended
         * @param {Object} event 事件触发时浏览器自带的 event 对象
         */
        this.trigger('ended');
    };

    /**
     * 处理 durationchange 事件
     *
     * @private
     * @fires Player#durationchange
     */


    Player.prototype.handleDurationchange = function handleDurationchange() {
        var data = {
            duration: this.techGet('duration')
        };

        /**
         * 视频时长发生改变时触发
         *
         * @event Player#durationchange
         * @param {Object} event 事件触发时浏览器自带的 event 对象
         */
        this.trigger('durationchange', data);
    };

    /**
     * 处理 timeupdate 事件
     *
     * @private
     * @fires Player#timeupdate
     */


    Player.prototype.handleTimeupdate = function handleTimeupdate() {
        var data = {
            currentTime: this.techGet('currentTime')
        };
        // data.currentTime = this.techGet('currentTime');

        /**
         * 视频当前时刻更新时触发，一般 1s 内会触发好几次
         *
         * @event Player#timeupdate
         * @param {Object} event 事件触发时浏览器自带的 event 对象
         * @param {Object} data 友情附带的数据
         * @param {number} data.currentTime 当前时刻
         */
        this.trigger('timeupdate', data);
    };

    Player.prototype.handleTap = function handleTap() {};

    /**
     * 处理 touchstart 事件，主要用于控制控制条的显隐
     *
     * @param {Object} event 事件发生时，浏览器给的 event
     *
     * @private
     */


    Player.prototype.handleTouchStart = function handleTouchStart(event) {
        // 当控制条显示并且手指放在控制条上时
        if (this.hasClass(activeClass)) {
            if (Dom.parent(event.target, 'lark-play-button') || Dom.parent(event.target, 'lark-control-bar')) {

                clearTimeout(this.activeTimeoutHandler);
            }
        }
    };

    /**
     * 处理 touchmove 事件
     *
     * @param {Object} event 事件发生时，浏览器给的 event
     *
     * @private
     */


    Player.prototype.handleTouchMove = function handleTouchMove(event) {};

    /**
     * 处理 touchend 事件，主要用于控制控制条的显隐
     *
     * @param {Object} event 事件发生时，浏览器给的 event
     *
     * @private
     */


    Player.prototype.handleTouchEnd = function handleTouchEnd(event) {
        var _this7 = this;

        clearTimeout(this.activeTimeoutHandler);

        var activeClass = 'lark-user-active';

        // 点在播放按钮或者控制条上，（继续）展现控制条
        var clickOnControls = false;
        // @todo 处理得不够优雅
        if (Dom.parent(event.target, 'lark-play-button') || Dom.parent(event.target, 'lark-control-bar')) {

            clickOnControls = true;
        }

        if (!clickOnControls) {
            this.toggleClass(activeClass);

            if (this.paused()) {
                this.play();
            }
        }

        if (this.hasClass(activeClass)) {
            this.activeTimeoutHandler = setTimeout(function () {
                _this7.removeClass(activeClass);
            }, this.activeTimeout);
        }
    };

    /**
     * 处理 fullscreenchange 事件
     *
     * @private
     * @fires Player#fullscreenchange
     */
    // Html5 中会处理一次这个事件，会传入 extData


    Player.prototype.handleFullscreenChange = function handleFullscreenChange(event) {
        var extData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var data = {};

        // 移动端的全屏事件会传 extData
        if (extData.isFullscreen !== undefined) {
            this.isFullscreen(extData.isFullscreen);
        } else if (_fullscreen2['default'].fullscreenEnabled()) {
            // pc 端 fullscreen 事件
            this.isFullscreen(_fullscreen2['default'].isFullscreen());
        }

        if (this.isFullscreen()) {
            data.isFullscreen = true;
            this.addClass('lark-fullscreen');
        } else {
            data.isFullscreen = false;
            this.removeClass('lark-fullscreen');
            // lark-fullscreen-adjust 本应该在 exitFullscreen 函数中调用，但用户可能按 ESC 返回，不会走到 exitFullscreen 函数
            this.removeClass('lark-fullscreen-adjust');
        }

        /**
         * 在进入／退出全屏时触发
         *
         * @event Player#fullscreenchange
         * @param {Object} data 全屏相关的数据
         * @param {boolean} data.isFullscreen 当前是否是全屏状态
         */
        this.trigger('fullscreenchange', data);
    };

    /**
     * 处理 fullscreenerror 事件
     *
     * @fires Player#fullscreenerror
     * @private
     */


    Player.prototype.handleFullscreenError = function handleFullscreenError() {
        /**
         * 在全屏时出错时触发
         *
         * @event Player#fullscreenerror
         */
        this.trigger('fullscreenerror');
    };

    /**
     * 处理 error 事件
     *
     * @param {Object} event 事件发生时，浏览器给的 event
     *
     * @fires Player#error
     * @private
     */


    Player.prototype.handleError = function handleError(event) {
        this.removeClass('lark-playing');
        // this.removeClass('lark-seeking');
        this.addClass('lark-error');

        /**
         * 视频播放出错时触发
         *
         * @event Player#error
         * @param {Object} event 事件触发时浏览器自带的 event 对象
         * @param {MediaError} error MediaError 对象
         * @param {number} error.code 错误编号
         *                         - 1 MEDIA_ERR_ABORTED 视频加载被浏览器（用户）中断
         *                         - 2 MEDIA_ERR_NETWORK 浏览器与视频资源已经建立连接，但是由于网络问题停止下载
         *                         - 3 MEDIA_ERR_DECODE 视频解码失败
         *                         - 4 MEDIA_ERR_SRC_NOT_SUPPORTED 视频资源问题，比如视频不存在
         * @param {string} error.message 错误信息
         */
        this.trigger('error', this.techGet('error'));
    };

    /**
     * 处理播放器 click 事件，主要用于控制控制条显隐
     *
     * pc 上用 click 事件，移动端用 touchend
     *
     * @todo 开发 tap 事件来代替 click
     * @private
     *
     * @param {Object} event 事件发生时，浏览器给的 event
     */


    Player.prototype.handleClick = function handleClick(event) {
        // clearTimeout(this.activeTimeoutHandler);

        // 点在播放按钮或者控制条上，（继续）展现控制条
        var clickOnControls = false;
        // @todo 处理得不够优雅
        if (Dom.parent(event.target, 'lark-control-bar-pc') || Dom.hasClass(event.target, 'lark-control-bar-pc')) {

            clickOnControls = true;
        }

        if (!clickOnControls) {
            // 处于暂停状态时，点击非控制条的位置继续播放
            // 切换暂停／播放状态
            var isPaused = this.paused();
            if (isPaused) {
                this.play();
            } else {
                this.pause();
            }
        }
    };

    Player.prototype.handleMouseEnter = function handleMouseEnter(event) {
        var _this8 = this;

        clearTimeout(this.activeTimeoutHandler);

        if (!this.hasClass(activeClass)) {
            this.addClass(activeClass);
        }

        this.activeTimeoutHandler = setTimeout(function () {
            _this8.removeClass(activeClass);
        }, this.activeTimeout);
    };

    Player.prototype.handleMouseMove = function handleMouseMove(event) {
        this.handleMouseEnter(event);
    };

    Player.prototype.handleMouseLeave = function handleMouseLeave(event) {
        clearTimeout(this.activeTimeoutHandler);
        this.removeClass(activeClass);
    };

    // = = = = = = = = = = = = = 对外 api = = = = = = = = = = = = = =

    // = = = func = = =

    /**
     * 获取／设置当前全屏状态标志
     *
     * @param {boolean=} isFs 全屏状态标志
     * @return {boolean} 不传参则返回当前全屏状态
     */


    Player.prototype.isFullscreen = function isFullscreen(isFs) {
        if (isFs !== undefined) {
            this.fullscreenStatus = isFs;
        } else {
            return this.fullscreenStatus;
        }
    };

    /**
     * 进入全屏
     * 会先尝试浏览器提供的全屏方法，如果没有对应方法，则进入由 css 控制的全屏样式
     */


    Player.prototype.requestFullscreen = function requestFullscreen() {
        this.isFullscreen(true);

        if (_fullscreen2['default'].fullscreenEnabled()) {
            // 利用 css 强制设置 top right bottom left margin 的值为 0
            // 避免因为定位使得元素全屏时看不到
            // 应该不会出现什么问题
            this.addClass('lark-fullscreen-adjust');
            _fullscreen2['default'].requestFullscreen(this.el);
        } else if (this.tech.supportsFullScreen()) {
            this.techGet('enterFullScreen');
        } else {
            this.enterFullWindow();
            this.trigger('fullscreenchange');
        }
    };

    /**
     * 退出全屏
     */


    Player.prototype.exitFullscreen = function exitFullscreen() {
        this.isFullscreen(false);

        if (_fullscreen2['default'].fullscreenEnabled() && _fullscreen2['default'].isFullscreen()) {
            this.removeClass('lark-fullscreen-adjust');
            _fullscreen2['default'].exitFullscreen();
        } else if (this.tech.supportsFullScreen()) {
            this.techGet('exitFullScreen');
        } else {
            this.exitFullWindow();
            this.trigger('fullscreenchange');
        }
    };

    /**
     * 通过 css 控制，使得视频像是进入了全屏一样
     *
     * @private
     */


    Player.prototype.enterFullWindow = function enterFullWindow() {
        this.addClass('lark-full-window');
    };

    Player.prototype.fullWindowOnEscKey = function fullWindowOnEscKey() {};

    /**
     * 去除由 css 控制展现的全屏样式
     *
     * @private
     */


    Player.prototype.exitFullWindow = function exitFullWindow() {
        this.removeClass('lark-full-window');
    };

    /**
     * 播放视频
     */


    Player.prototype.play = function play() {
        var _this9 = this;

        if (!this.src()) {
            _log2['default'].warn('No video src applied');
            return;
        }

        // changingSrc 现在用不上，后面支持 source 的时候可能会用上
        // if (this.isReady && this.src()) {
        if (this.isReady) {
            // play 可能返回一个 Promise
            var playReturn = this.techGet('play');
            if (playReturn && playReturn.then) {
                playReturn.then(null, function (err) {
                    // @todo 这里返回的 err 可以利用下？
                    _log2['default'].error(err);
                });
            }
        } else {
            this.ready(function () {
                var playReturn = _this9.techGet('play');
                if (playReturn && playReturn.then) {
                    playReturn.then(null, function (err) {
                        // @todo 这里返回的 err 可以利用下？
                        _log2['default'].error(err);
                    });
                }
            });
        }
    };

    /**
     * 暂停播放
     */


    Player.prototype.pause = function pause() {
        this.techCall('pause');
    };

    /**
     * 加载当前视频的资源
     */


    Player.prototype.load = function load() {
        this.techCall('load');
    };

    // reset video and ui
    // @todo 感觉这个 reset 有点费事而且费性能
    /**
     * 重置播放器
     * 会移除播放器的 src source 属性，并重置各 UI 样式
     */


    Player.prototype.reset = function reset() {
        this.pause();

        // reset video tag
        this.techCall('reset');

        // reset ui
        this.children.forEach(function (child) {
            child && child.reset && child.reset();
        });
    };

    // = = = get attr = = =

    /**
     * 判断当前是否是暂停状态
     *
     * @return {boolean} 当前是否是暂停状态
     */


    Player.prototype.paused = function paused() {
        return this.techGet('paused');
    };

    /**
     * 获取已播放时长
     *
     * @return {number} 当前已经播放的时长，以秒为单位
     */


    Player.prototype.played = function played() {
        return this.techGet('played');
    };

    Player.prototype.scrubbing = function scrubbing(isScrubbing) {};

    /**
     * 获取／设置当前时间
     *
     * @param {number=} seconds 以秒为单位，要设置的当前时间的值。可选
     * @return {number} 不传参数则返回视频当前时刻
     */


    Player.prototype.currentTime = function currentTime(seconds) {
        if (seconds !== undefined) {
            this.techCall('setCurrentTime', seconds);
        } else {
            return this.techGet('currentTime') || 0;
        }
    };

    /**
     * 获取当前视频总时长
     *
     * @return {number} 视频总时长，如果视频未初始化完成，可能返回 NaN
     */


    Player.prototype.duration = function duration() {
        return this.techGet('duration');
    };

    /**
     * 获取视频剩下的时长
     *
     * @return {number} 总时长 - 已播放时长 = 剩下的时长
     */


    Player.prototype.remainingTime = function remainingTime() {
        return this.duration() - this.currentTime();
    };

    /**
     * 获取当前已缓冲的范围
     *
     * @return {TimeRanges} 当前已缓冲的范围（buffer 有自己的 TimeRanges 对象）
     */


    Player.prototype.buffered = function buffered() {
        return this.techGet('buffered');
    };

    Player.prototype.bufferedPercent = function bufferedPercent() {};

    /**
     * 判断当前视频是否已缓冲到最后
     *
     * @return {boolean} 当前视频是否已缓冲到最后
     */


    Player.prototype.bufferedEnd = function bufferedEnd() {
        var buffered = this.buffered();
        var duration = this.duration();
        if (buffered && duration) {
            return buffered.end(buffered.length - 1) === duration;
        } else {
            return false;
        }
    };

    /**
     * 判断当前视频是否处于 seeking（跳转中） 状态
     *
     * @return {boolean} 是否处于跳转中状态
     */


    Player.prototype.seeking = function seeking() {
        return this.techGet('seeking');
    };

    /**
     * 判断当前视频是否可跳转到指定时刻
     *
     * @return {boolean} 前视频是否可跳转到指定时刻
     */


    Player.prototype.seekable = function seekable() {
        return this.techGet('seekable');
    };

    /**
     * 判断当前视频是否已播放完成
     *
     * @return {boolean} 当前视频是否已播放完成
     */


    Player.prototype.ended = function ended() {
        return this.techGet('ended');
    };

    /**
     * 获取当前视频的 networkState 状态
     *
     * @return {number} 当前视频的 networkState 状态
     * @todo 补充 networkState 各状态说明
     */


    Player.prototype.networkState = function networkState() {
        return this.techGet('networkState');
    };

    /**
     * 获取当前播放的视频的原始宽度
     *
     * @return {number} 当前视频的原始宽度
     */


    Player.prototype.videoWidth = function videoWidth() {
        return this.techGet('videoWidth');
    };

    /**
     * 获取当前播放的视频的原始高度
     *
     * @return {number} 当前视频的原始高度
     */


    Player.prototype.videoHeight = function videoHeight() {
        return this.techGet('videoHeight');
    };

    // = = = set && get attr= = =

    /**
     * 获取或设置播放器声音大小
     *
     * @param {number=} decimal 要设置的声音大小的值（0~1），可选
     * @return {number} 不传参数则返回当前视频声音大小
     */


    Player.prototype.volume = function volume(decimal) {
        if (decimal !== undefined) {
            this.techCall('setVolume', Math.min(1, Math.max(decimal, 0)));
        } else {
            return this.techGet('volume');
        }
    };

    /**
     * 获取或设置当前视频的 src 属性的值
     *
     * @param {string=} src 要设置的 src 属性的值，可选
     * @return {string} 不传参数则返回当前视频的 src 或 currentSrc
     */


    Player.prototype.src = function src(_src) {
        if (_src !== undefined) {
            if (this.mediaSourceHandler) {
                this.mediaSourceHandler.dispose();
                this.mediaSourceHandler = null;
            }

            var source = (0, _normalizeSource2['default'])({ src: _src })[0];
            this.mediaSourceHandler = _html2['default'].selectMediaSourceHandler(source);
            if (this.mediaSourceHandler) {
                var handlerOptions = this.getMediaSourceHanlderOptions(this.mediaSourceHandler.name);
                this.mediaSourceHandler.handleSource(source, this, handlerOptions);
            } else {
                // 应该先暂停一下比较好
                // this.techCall('pause');
                this.techCall('setSrc', _src);
            }

            // src 改变后，重新绑定一次 firstplay 方法
            // 先 off 确保只绑定一次
            this.off('play', this.handleFirstplay);
            this.one('play', this.handleFirstplay);

            /**
             * srcchange 时触发
             *
             * @event Player#srcchange
             * @param {string} src 更换后的视频地址
             */
            this.trigger('srcchange', _src);
        } else {
            return this.techGet('src');
        }
    };

    /**
     * 获取或设置播放器的 source
     *
     * @param {Array=} source 视频源，可选
     * @return {Array} 若不传参则获取 source 数据
     */


    Player.prototype.source = function source(_source) {
        if (_source !== undefined) {
            this.techCall('source', _source);

            /**
             * srcchange 时触发
             *
             * @event Player#srcchange
             * @param {string} src 更换后的视频地址
             */
            this.trigger('srcchange', this.player.src());
        } else {
            return this.techGet('source');
        }
    };

    /**
     * 获取或设置当前视频的播放速率
     *
     * @param {number=} playbackRate 要设置的播放速率的值，可选
     * @return {number} 不传参数则返回当前视频的播放速率
     */


    Player.prototype.playbackRate = function playbackRate(_playbackRate) {
        if (_playbackRate !== undefined) {
            this.techCall('setPlaybackRate', _playbackRate);
        } else if (this.tech && this.tech.featuresPlaybackRate) {
            return this.techGet('playbackRate');
        } else {
            return 1.0;
        }
    };

    /**
     * 获取或设置当前视频的默认播放速率
     *
     * @param {number=} defaultPlaybackRate 要设置的默认播放速率的值，可选
     * @return {number} 不传参数则返回当前视频的默认播放速率
     */


    Player.prototype.defaultPlaybackRate = function defaultPlaybackRate(_defaultPlaybackRate) {
        if (_defaultPlaybackRate !== undefined) {
            this.techCall('setDefaultPlaybackRate', _defaultPlaybackRate);
        } else if (this.tech && this.tech.featuresPlaybackRate) {
            return this.techGet('defaultPlaybackRate');
        } else {
            return 1.0;
        }
    };

    /**
     * 设置或获取 poster（视频封面） 属性的值
     *
     * @param {string=} val 可选。要设置的 poster 属性的值
     * @return {string} 不传参数则返回当前 poster 属性的值
     */


    Player.prototype.poster = function poster(val) {
        if (val !== undefined) {
            this.techCall('setPoster', val);
        } else {
            return this.techGet('poster');
        }
    };

    return Player;
}(_component2['default']);

[
/**
 * 设置或获取 muted 属性的值
 *
 * @param {boolean=} isMuted（静音） 可选。设置 muted 属性的值
 * @return {undefined|boolean} undefined 或 当前 muted 属性值
 */
'muted',

/**
 * 设置或获取 defaultMuted（默认静音） 属性的值
 *
 * @param {boolean=} isDefaultMuted 可选。设置 defaultMuted 属性的值
 * @return {undefined|boolean} undefined 或 当前 defaultMuted 的值
 */
'defaultMuted',

/**
 * 设置或获取 autoplay（自动播放，大多数移动端浏览器不允许视频自动播放） 属性的值
 *
 * @param {boolean=} isAutoplay 可选。设置 autoplay 属性的值
 * @return {undefined|boolean} undefined 或 当前 autoplay 值
 */
'autoplay',

/**
 * 设置或获取 loop（循环播放） 属性的值
 *
 * @param {boolean=} isLoop 可选。设置 loop 属性的值
 * @return {undefined|boolean} undefined 或 当前 loop 值
 */
'loop',
/**
 * 设置或获取 playsinline（是否内联播放，ios10 以上有效） 属性的值
 *
 * @param {boolean=} isPlaysinline 可选。设置 playsinline 属性的值
 * @return {undefined|boolean} undefined 或 当前 playsinline 值
 */
'playsinline',

/**
 * 设置或获取 poster（视频封面） 属性的值
 *
 * @param {string=} poster 可选。设置 poster 属性的值
 * @return {undefined|string} undefined 或 当前 poster 值
 */
// 'poster',

/**
 * 设置或获取 preload（预加载的数据） 属性的值
 *
 * @param {string=} preload 可选。设置 preload 属性的值（none、auto、metadata）
 * @return {undefined|string} undefined 或 当前 preload 值
 */
'preload'].forEach(function (prop) {
    // 这里别用箭头函数，不然 this 就指不到 Player.prototype 了
    Player.prototype[prop] = function (val) {
        if (val !== undefined) {
            this.techCall('set' + (0, _toTitleCase2['default'])(prop), val);
            this.options[prop] = val;
        } else {
            return this.techGet(prop);
        }
    };
});

if (_featureDetector2['default'].touch) {
    Player.prototype.options = {
        children: ['playButton', 'progressBarSimple', 'controlBar', 'loading', 'error']
    };
} else {
    Player.prototype.options = {
        children: ['controlBarPc', 'loadingPc', 'errorPc']
    };
}

exports['default'] = Player;

},{"./component":4,"./html5":5,"./mixins/evented":7,"./ui/control-bar":11,"./ui/control-bar-pc":10,"./ui/error":15,"./ui/error-pc":14,"./ui/loading":19,"./ui/loading-pc":18,"./ui/play-button":20,"./ui/progress-bar-simple":22,"./utils/computed-style":27,"./utils/dom":29,"./utils/events":30,"./utils/feature-detector":31,"./utils/fullscreen":32,"./utils/guid":33,"./utils/log":34,"./utils/normalize-source":37,"./utils/obj":38,"./utils/plugin":39,"./utils/to-title-case":41,"lodash.includes":3}],9:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _dom = require('../utils/dom');

var Dom = _interopRequireWildcard(_dom);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file 显示视频已加载的量
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yuhui<yuhui06@baidu.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date 2017/11/13
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @see https://developer.mozilla.org/en-US/Apps/Fundamentals/Audio_and_video_delivery/buffering_seeking_time_ranges
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @desc
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *    1) 在视频没开始播放之前，提前下载的视频资源由 preload 属性的值决定
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *           - none 什么都没有，所以我们连视频总时长都没法获取到
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *           - metadata 可以获取到视频时长、高宽等信息
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *           - auto 视浏览器而定，一般 >= metadata
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var BufferBar = function (_Component) {
    _inherits(BufferBar, _Component);

    function BufferBar(player, options) {
        _classCallCheck(this, BufferBar);

        var _this = _possibleConstructorReturn(this, _Component.call(this, player, options));

        _this.line = Dom.$('.lark-buffer-bar__line', _this.el);
        _this.handleProgress = _this.handleProgress.bind(_this);

        _this.player.on('progress', _this.handleProgress);
        // 对于已经 video 已经初始化完成后才调用 larkplayer 的情况，此时可能已经没有 progress 事件
        // 不过我们会在 player.handleLateInit 中重新触发 canplay 等事件（canplay 时，播放器应该已经有一定的 buffer）
        _this.player.on('canplay', _this.handleProgress);
        _this.handleProgress();
        return _this;
    }

    BufferBar.prototype.handleProgress = function handleProgress() {
        // TimeRanges 对象
        var buffered = this.player.buffered();
        var duration = this.player.duration();
        var currentTime = this.player.currentTime();

        if (duration > 0) {
            for (var i = 0; i < buffered.length; i++) {
                if (buffered.start(i) <= currentTime && buffered.end(i) >= currentTime) {
                    var width = buffered.end(i) / duration * 100 + '%';
                    this.render(width);
                    break;
                }
            }
        }
    };

    BufferBar.prototype.render = function render(width) {
        this.line.style.width = width;
    };

    BufferBar.prototype.reset = function reset() {
        this.render(0);
    };

    BufferBar.prototype.createEl = function createEl() {
        var line = Dom.createElement('div', {
            className: 'lark-buffer-bar__line'
        });

        return Dom.createElement('div', {
            className: 'lark-buffer-bar'
        }, line);
    };

    return BufferBar;
}(_component2['default']);

exports['default'] = BufferBar;


_component2['default'].registerComponent('BufferBar', BufferBar);

},{"../component":4,"../utils/dom":29}],10:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

require('./current-time');

require('./duration');

require('./play-button');

require('./fullscreen-button');

require('./gradient-bottom');

require('./volume');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file ControlBarPc 播放器操作按钮
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yuhui<yuhui06@baidu.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date 2017/11/9
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var ControlBarPc = function (_Component) {
    _inherits(ControlBarPc, _Component);

    function ControlBarPc() {
        _classCallCheck(this, ControlBarPc);

        return _possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    ControlBarPc.prototype.reset = function reset() {
        this.children.forEach(function (child) {
            child && child.reset && child.reset();
        });
    };

    ControlBarPc.prototype.createEl = function createEl() {
        var time = this.createElement('div', { className: 'lark-time' }, this.createElement('CurrentTime'), this.createElement('span', { className: 'lark-time-separator' }, '/'), this.createElement('Duration'));

        var playButton = this.createElement('playButton', { className: 'lark-play-button-pc' });

        var fullscreenButton = this.createElement('FullscreenButton');
        var gradientBottom = this.createElement('GradientBottom');

        // jsxParser(`
        //     <div className="lark-control-bar-pc">
        //         <ProgressBar className="lark-progress-bar-pc" />
        //         <div className="lark-control__left">
        //             <PlayButton className="lark-play-button-pc" />
        //             <div className="lark-time">
        //                 <CurrentTime />
        //                 <span className="lark-time-separator">/<span>
        //                 <Duration />
        //             </div>
        //         </div>
        //         <div className="lark-control__right">
        //             <FullscreenButton />
        //         </div>
        //     </div>
        // `);

        var volume = this.createElement('Volume');

        var controlLeft = this.createElement('div', { className: 'lark-control__left' }, playButton, volume, time);
        var controlRight = this.createElement('div', { className: 'lark-control__right' }, fullscreenButton);

        var progressBarPc = this.createElement('progressBar', { className: 'lark-progress-bar-pc' });

        return this.createElement('div', { className: 'lark-control-bar-pc' }, gradientBottom, progressBarPc, controlLeft, controlRight);
    };

    return ControlBarPc;
}(_component2['default']);

exports['default'] = ControlBarPc;


_component2['default'].registerComponent('ControlBarPc', ControlBarPc);

},{"../component":4,"./current-time":12,"./duration":13,"./fullscreen-button":16,"./gradient-bottom":17,"./play-button":20,"./volume":26}],11:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _dom = require('../utils/dom');

var Dom = _interopRequireWildcard(_dom);

require('./current-time');

require('./duration');

require('./fullscreen-button');

require('./progress-bar');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file ControlsBar 播放器控制条
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yuhui<yuhui06@baidu.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date 2017/11/9
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var ControlBar = function (_Component) {
    _inherits(ControlBar, _Component);

    function ControlBar() {
        _classCallCheck(this, ControlBar);

        return _possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    ControlBar.prototype.reset = function reset() {
        this.children.forEach(function (child) {
            child && child.reset && child.reset();
        });
    };

    ControlBar.prototype.createEl = function createEl() {
        return Dom.createElement('div', {
            className: 'lark-control-bar'
        });
    };

    return ControlBar;
}(_component2['default']);

ControlBar.prototype.options = {
    children: ['currentTime', 'progressBar', 'duration', 'fullscreenButton']
};

_component2['default'].registerComponent('ControlBar', ControlBar);

exports['default'] = ControlBar;

},{"../component":4,"../utils/dom":29,"./current-time":12,"./duration":13,"./fullscreen-button":16,"./progress-bar":23}],12:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _dom = require('../utils/dom');

var Dom = _interopRequireWildcard(_dom);

var _timeFormat = require('../utils/time-format');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file current-time.js 当前时间 UI
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yuhui<yuhui06@baidu.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date 2017/11/4
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var CurrentTime = function (_Component) {
    _inherits(CurrentTime, _Component);

    function CurrentTime(player, options) {
        _classCallCheck(this, CurrentTime);

        var _this = _possibleConstructorReturn(this, _Component.call(this, player, options));

        _this.handleTimeupdate = _this.handleTimeupdate.bind(_this);

        player.on('timeupdate', _this.handleTimeupdate);
        return _this;
    }

    CurrentTime.prototype.handleTimeupdate = function handleTimeupdate(event, data) {
        this.render(data.currentTime);
    };

    CurrentTime.prototype.render = function render(time) {
        Dom.textContent(this.el, (0, _timeFormat.timeFormat)(Math.floor(time)));
    };

    CurrentTime.prototype.reset = function reset() {
        this.render(0);
    };

    CurrentTime.prototype.createEl = function createEl() {
        var currentTime = this.player.currentTime();

        return Dom.createElement('div', {
            className: 'lark-current-time'
        }, (0, _timeFormat.timeFormat)(Math.floor(currentTime)));
    };

    return CurrentTime;
}(_component2['default']);

exports['default'] = CurrentTime;


_component2['default'].registerComponent('CurrentTime', CurrentTime);

},{"../component":4,"../utils/dom":29,"../utils/time-format":40}],13:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _dom = require('../utils/dom');

var Dom = _interopRequireWildcard(_dom);

var _timeFormat = require('../utils/time-format');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file duration.js
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yuhui<yuhui06@baidu.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date 2017/11/10
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var Duration = function (_Component) {
    _inherits(Duration, _Component);

    function Duration(player, options) {
        _classCallCheck(this, Duration);

        var _this = _possibleConstructorReturn(this, _Component.call(this, player, options));

        _this.handleLoadedMetaData = _this.handleLoadedMetaData.bind(_this);

        player.on('durationchange', _this.handleLoadedMetaData);
        player.on('loadedmetadata', _this.handleLoadedMetaData);
        return _this;
    }

    Duration.prototype.handleLoadedMetaData = function handleLoadedMetaData(event) {
        Dom.textContent(this.el, (0, _timeFormat.timeFormat)(Math.floor(this.player.duration())));
    };

    Duration.prototype.reset = function reset() {
        Dom.textContent(this.el, '');
    };

    Duration.prototype.createEl = function createEl() {
        // @todo 暂时将 duration 的值写在这，后面需要处理下对于已经发生的事件怎么办
        var durationContent = (0, _timeFormat.timeFormat)(Math.floor(this.player.duration()));
        return Dom.createEl('div', {
            className: 'lark-duration'
        }, null, durationContent);
    };

    return Duration;
}(_component2['default']);

exports['default'] = Duration;


_component2['default'].registerComponent('Duration', Duration);

},{"../component":4,"../utils/dom":29,"../utils/time-format":40}],14:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _dom = require('../utils/dom');

var Dom = _interopRequireWildcard(_dom);

require('./error');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file error.js 播放器出错时显示 pc 版
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yuhuiyuhui06
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date 2018/3/8
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var ErrorPc = function (_Component) {
    _inherits(ErrorPc, _Component);

    function ErrorPc(player, options) {
        _classCallCheck(this, ErrorPc);

        var _this = _possibleConstructorReturn(this, _Component.call(this, player, options));

        _this.handleError = _this.handleError.bind(_this);
        _this.handleClick = _this.handleClick.bind(_this);

        _this.player.on('error', _this.handleError);
        _this.on('click', _this.handleClick);

        _this.textEl = Dom.$('.lark-error-text', _this.el);
        return _this;
    }

    ErrorPc.prototype.handleClick = function handleClick() {
        var _this2 = this;

        var src = this.player.src();
        this.player.reset();
        setTimeout(function () {
            _this2.player.src(src);
            _this2.player.play();
        }, 0);
    };

    ErrorPc.prototype.handleError = function handleError(event, error) {
        var text = void 0;
        switch (parseInt(error.code, 10)) {
            // MEDIA_ERR_ABORTED
            case 1:
                text = '加载失败，点击重试(MEDIA_ERR_ABORTED)';
                break;
            // MEDIA_ERR_NETWORK
            case 2:
                text = '加载失败，请检查您的网络(MEDIA_ERR_NETWORK)';
                break;
            // MEDIA_ERR_DECODE
            case 3:
                text = '视频解码失败(MEDIA_ERR_DECODE)';
                break;
            // MEDIA_ERR_SRC_NOT_SUPPORTED
            case 4:
                text = '加载失败，该资源无法访问或者浏览器不支持该视频类型(MEDIA_ERR_SRC_NOT_SUPPORTED)';
                break;
            default:
                text = '加载失败，点击重试';
        }

        Dom.replaceContent(this.textEl, text);
    };

    ErrorPc.prototype.createEl = function createEl() {
        return this.createElement('div', { className: 'lark-error-pc' }, this.createElement('div', { className: 'lark-error-area' }, this.createElement('div', { className: 'lark-error-text' }, '加载失败，请稍后重试')));
    };

    return ErrorPc;
}(_component2['default']);

exports['default'] = ErrorPc;


_component2['default'].registerComponent('ErrorPc', ErrorPc);

},{"../component":4,"../utils/dom":29,"./error":15}],15:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _dom = require('../utils/dom');

var Dom = _interopRequireWildcard(_dom);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file error.js 播放器出错时显示
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yuhui<yuhui06@baidu.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date 2017/11/16
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var Error = function (_Component) {
    _inherits(Error, _Component);

    function Error(player, options) {
        _classCallCheck(this, Error);

        var _this = _possibleConstructorReturn(this, _Component.call(this, player, options));

        _this.handleError = _this.handleError.bind(_this);
        _this.handleClick = _this.handleClick.bind(_this);

        _this.player.on('error', _this.handleError);

        _this.on('click', _this.handleClick);
        return _this;
    }

    Error.prototype.handleError = function handleError(event, data) {
        /* eslint-disable no-console */
        console.log(event, data);
        /* eslint-enable no-console */
    };

    Error.prototype.handleClick = function handleClick() {
        var _this2 = this;

        var src = this.player.src();
        this.player.reset();
        setTimeout(function () {
            _this2.player.src(src);
            _this2.player.play();
        }, 0);
    };

    Error.prototype.createEl = function createEl() {
        var errorSpinner = Dom.createElement('span', {
            className: 'lark-error-area__spinner lark-icon-loading'
        });

        var errorText = Dom.createElement('span', {
            className: 'lark-error-area__text'
        }, '加载失败，点击重试');

        var errorCnt = Dom.createElement('div', {
            className: 'lark-error-cnt'
        }, errorSpinner, errorText);

        return Dom.createElement('div', {
            className: 'lark-error-area'
        }, errorCnt);
    };

    return Error;
}(_component2['default']);

exports['default'] = Error;


_component2['default'].registerComponent('Error', Error);

},{"../component":4,"../utils/dom":29}],16:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _dom = require('../utils/dom');

var Dom = _interopRequireWildcard(_dom);

var _events = require('../utils/events');

var Events = _interopRequireWildcard(_events);

var _tooltip = require('./tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

var _featureDetector = require('../utils/feature-detector');

var _featureDetector2 = _interopRequireDefault(_featureDetector);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file fullscreen-button.js
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yuhui<yuhui06@baidu.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date 2017/11/5
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var FullscreenButton = function (_Component) {
    _inherits(FullscreenButton, _Component);

    function FullscreenButton(player, options) {
        _classCallCheck(this, FullscreenButton);

        var _this = _possibleConstructorReturn(this, _Component.call(this, player, options));

        _this.handleClick = _this.handleClick.bind(_this);
        _this.handleMouseOver = _this.handleMouseOver.bind(_this);
        _this.handleMouseOut = _this.handleMouseOut.bind(_this);

        _this.on('click', _this.handleClick);

        if (!_featureDetector2['default'].touch) {
            _this.fullscreenButton = Dom.$('.lark-request-fullscreen', _this.el);
            _this.exitFullscreenButton = Dom.$('.lark-exit-fullscreen', _this.el);

            Events.on(_this.fullscreenButton, 'mouseover', function () {
                return _this.handleMouseOver(_this.fullscreenButton, '全屏');
            });
            Events.on(_this.exitFullscreenButton, 'mouseover', function () {
                return _this.handleMouseOver(_this.exitFullscreenButton, '退出全屏');
            });

            _this.on('mouseout', _this.handleMouseOut);
        }
        return _this;
    }

    FullscreenButton.prototype.handleClick = function handleClick() {
        if (!this.player.isFullscreen()) {
            this.player.requestFullscreen();
        } else {
            this.player.exitFullscreen();
        }

        _tooltip2['default'].hide();
    };

    FullscreenButton.prototype.handleMouseOver = function handleMouseOver(el, content) {
        _tooltip2['default'].show({
            hostEl: el,
            placement: 'top',
            margin: 16,
            content: content
        });
    };

    FullscreenButton.prototype.handleMouseOut = function handleMouseOut(event) {
        _tooltip2['default'].hide();
    };

    FullscreenButton.prototype.createEl = function createEl() {
        // @todo 将两个 icon 分别放到两个类中，这样可以确定他们每个的 click 的事件一定跟自己的名称是相符的
        return Dom.createElement('div', {
            className: 'lark-fullscreen-button'
        }, Dom.createElement('div', {
            className: 'lark-request-fullscreen lark-icon-request-fullscreen'
        }), Dom.createElement('div', {
            // @todo 需要一个非全屏的按钮 sueb
            className: 'lark-exit-fullscreen'
        }));
    };

    return FullscreenButton;
}(_component2['default']);

exports['default'] = FullscreenButton;


_component2['default'].registerComponent('FullscreenButton', FullscreenButton);

},{"../component":4,"../utils/dom":29,"../utils/events":30,"../utils/feature-detector":31,"./tooltip":25}],17:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file 播放器 UI loading
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yuhui<yuhui06@baidu.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date 2017/11/9
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var GradientBottom = function (_Component) {
    _inherits(GradientBottom, _Component);

    function GradientBottom() {
        _classCallCheck(this, GradientBottom);

        return _possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    GradientBottom.prototype.createEl = function createEl() {
        return this.createElement('div', { className: 'lark-gradient-bottom' });
    };

    return GradientBottom;
}(_component2['default']);

exports['default'] = GradientBottom;


_component2['default'].registerComponent('GradientBottom', GradientBottom);

},{"../component":4}],18:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

require('./loading');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file 播放器 UI loading pc 版
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yuhui06
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date 2018/3/8
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var LoadingPc = function (_Component) {
    _inherits(LoadingPc, _Component);

    function LoadingPc() {
        _classCallCheck(this, LoadingPc);

        return _possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    LoadingPc.prototype.createEl = function createEl() {
        var el = this.createElement('div', { className: 'lark-loading-pc' }, this.createElement('div', { className: 'lark-loading-area' }, this.createElement('div', { className: 'lark-loading-spinner' })));

        return el;
    };

    return LoadingPc;
}(_component2['default']);

exports['default'] = LoadingPc;


_component2['default'].registerComponent('LoadingPc', LoadingPc);

},{"../component":4,"./loading":19}],19:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _dom = require('../utils/dom');

var Dom = _interopRequireWildcard(_dom);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file 播放器 UI loading
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yuhui<yuhui06@baidu.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date 2017/11/9
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var Loading = function (_Component) {
    _inherits(Loading, _Component);

    function Loading() {
        _classCallCheck(this, Loading);

        return _possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    Loading.prototype.createEl = function createEl() {
        var loadingSpinner = Dom.createElement('span', {
            className: 'lark-loading-area__spinner lark-icon-loading'
        });

        var loadingText = Dom.createElement('span', {
            className: 'lark-loading-area__text'
        }, '正在加载');

        var loadingCnt = Dom.createElement('div', {
            className: 'lark-loading-cnt'
        }, loadingSpinner, loadingText);

        return Dom.createElement('div', {
            className: 'lark-loading-area'
        }, loadingCnt);
    };

    return Loading;
}(_component2['default']);

exports['default'] = Loading;


_component2['default'].registerComponent('Loading', Loading);

},{"../component":4,"../utils/dom":29}],20:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _dom = require('../utils/dom');

var Dom = _interopRequireWildcard(_dom);

var _events = require('../utils/events');

var Events = _interopRequireWildcard(_events);

var _featureDetector = require('../utils/feature-detector');

var _featureDetector2 = _interopRequireDefault(_featureDetector);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file playButton.js
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yuhui<yuhui06@baidu.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date 2017/11/7
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var PlayButton = function (_Component) {
    _inherits(PlayButton, _Component);

    function PlayButton(player, options) {
        _classCallCheck(this, PlayButton);

        // 注意 这里需要将 context（第二个参数） 设置为 this.el，因为这时 DOM 元素还没有插入到 document 里，所以在 document 里是查不到这个元素的
        var _this = _possibleConstructorReturn(this, _Component.call(this, player, options));

        _this.playBtn = Dom.$('.lark-play-button__play', _this.el);
        _this.pauseBtn = Dom.$('.lark-play-button__pause', _this.el);

        var eventName = _featureDetector2['default'].touch ? 'touchend' : 'click';

        Events.on(_this.playBtn, eventName, function (event) {
            return _this.togglePlay(event, true);
        });
        Events.on(_this.pauseBtn, eventName, function (event) {
            return _this.togglePlay(event, false);
        });
        return _this;
    }

    PlayButton.prototype.togglePlay = function togglePlay(event, isPlay) {
        if (isPlay) {
            if (this.player.paused()) {
                this.player.play();
            }
        } else {
            if (!this.player.paused()) {
                this.player.pause();
            }
        }
    };

    PlayButton.prototype.createEl = function createEl() {
        var playIcon = Dom.createElement('div', {
            className: 'lark-play-button__play lark-icon-play',
            title: 'play'
        });

        var pauseIcon = Dom.createElement('div', {
            className: 'lark-play-button__pause lark-icon-pause',
            title: 'pause'
        });

        var playButton = Dom.createElement('div', {
            className: 'lark-play-button'
        }, playIcon, pauseIcon);

        if (!this.options.className) {
            Dom.addClass(playButton, 'lark-play-button-mobile');
        } else {
            Dom.addClass(playButton, this.options.className);
        }

        return playButton;
    };

    return PlayButton;
}(_component2['default']);

exports['default'] = PlayButton;


_component2['default'].registerComponent('PlayButton', PlayButton);

},{"../component":4,"../utils/dom":29,"../utils/events":30,"../utils/feature-detector":31}],21:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _dom = require('../utils/dom');

var Dom = _interopRequireWildcard(_dom);

require('./buffer-bar');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file progress-bar.js 视频进度条
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yuhui<yuhui06@baidu.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date 2017/11/6
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @desc
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *    1) 写这个类主要是为了 DOM 结构，把 bufferBar 放到 progressBarExceptFill，这样才能方便地使用 flex 布局
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *           => progressBar 的高度等于整个 controlBar 的高度，方便用户点击
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *           => progressBar 中包含 progressBarExceptFill，这是 progressBar 的主体，使用 relative，方便子元素相对于他定位
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *           => progressBarExceptFill 中包含 bufferBar。之所以把 bufferBar 放到里面，是因为定位方便。我之前试过将 bufferBar 放到跟 progressBarExceptFill
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *              同级然后通过 position: absolute 定位。但在 ios 和 安卓下是有问题的（奇怪的是 chrome 模拟器没问题）。绝对定位的元素被排挤到了父元素之外的空间
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *              可以自己做下实验外带参考下 https://www.w3.org/TR/css-flexbox-1/#abspos-items
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var ProgressBarExceptFill = function (_Component) {
    _inherits(ProgressBarExceptFill, _Component);

    function ProgressBarExceptFill() {
        _classCallCheck(this, ProgressBarExceptFill);

        return _possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    ProgressBarExceptFill.prototype.createEl = function createEl() {
        var lineHandle = Dom.createElement('div', {
            className: 'lark-progress-bar__line__handle'
        }, Dom.createElement('div', {
            className: 'lark-progress-bar__line__handle-except-fill'
        }));

        var line = Dom.createElement('div', {
            className: 'lark-progress-bar__line'
        }, lineHandle);

        var progressBarBackground = Dom.createElement('div', {
            className: 'lark-progress-bar__background'
        });

        return Dom.createElement('div', {
            className: 'lark-progress-bar-except-fill'
        }, progressBarBackground, line);
    };

    return ProgressBarExceptFill;
}(_component2['default']);

exports['default'] = ProgressBarExceptFill;


ProgressBarExceptFill.prototype.options = {
    children: ['bufferBar']
};

_component2['default'].registerComponent('ProgressBarExceptFill', ProgressBarExceptFill);

},{"../component":4,"../utils/dom":29,"./buffer-bar":9}],22:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _dom = require('../utils/dom');

var Dom = _interopRequireWildcard(_dom);

require('./buffer-bar');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file progress-bar-simple.js 简易版的进度条，当控制条消失时在视频底部显示
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yuhui<yuhui06@baidu.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date 2017/11/10
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var ProgressBarSimple = function (_Component) {
    _inherits(ProgressBarSimple, _Component);

    function ProgressBarSimple(player, options) {
        _classCallCheck(this, ProgressBarSimple);

        var _this = _possibleConstructorReturn(this, _Component.call(this, player, options));

        _this.handleTimeUpdate = _this.handleTimeUpdate.bind(_this);
        _this.line = Dom.$('.lark-progress-bar__line', _this.el);
        player.on('timeupdate', _this.handleTimeUpdate);
        return _this;
    }

    ProgressBarSimple.prototype.handleTimeUpdate = function handleTimeUpdate() {
        // 进度条
        var percent = 0;
        var duration = this.player.duration();
        var currentTime = this.player.currentTime();
        if (duration && currentTime) {
            // 保留两位小数四舍五入
            percent = Math.round(currentTime / duration * 100) / 100;
            // 转换为百分数
            percent = percent * 100 + '%';
        }

        this.line.style.width = percent;
    };

    ProgressBarSimple.prototype.reset = function reset() {
        this.line.style.width = 0;
        this.children.forEach(function (child) {
            child && child.reset && child.reset();
        });
    };

    ProgressBarSimple.prototype.createEl = function createEl() {
        var line = Dom.createElement('div', {
            className: 'lark-progress-bar__line'
        });

        var background = Dom.createElement('div', {
            className: 'lark-progress-bar__background'
        });

        return Dom.createElement('div', {
            className: 'lark-progress-bar--simple'
        }, background, line);
    };

    return ProgressBarSimple;
}(_component2['default']);

_component2['default'].registerComponent('ProgressBarSimple', ProgressBarSimple);

ProgressBarSimple.prototype.options = {
    children: ['bufferBar']
};

exports['default'] = ProgressBarSimple;

},{"../component":4,"../utils/dom":29,"./buffer-bar":9}],23:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _slider = require('./slider');

var _slider2 = _interopRequireDefault(_slider);

var _tooltip = require('./tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

var _dom = require('../utils/dom');

var Dom = _interopRequireWildcard(_dom);

var _featureDetector = require('../utils/feature-detector');

var _featureDetector2 = _interopRequireDefault(_featureDetector);

var _timeFormat = require('../utils/time-format');

require('./progress-bar-except-fill');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file progress-bar.js 视频进度条
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yuhui<yuhui06@baidu.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date 2017/11/6
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date 2018/3/15 支持 pc 端拖拽和 tooltip
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var ProgressBar = function (_Slider) {
    _inherits(ProgressBar, _Slider);

    function ProgressBar(player, options) {
        _classCallCheck(this, ProgressBar);

        var _this = _possibleConstructorReturn(this, _Slider.call(this, player, options));

        _this.handleTimeUpdate = _this.handleTimeUpdate.bind(_this);
        _this.onClick = _this.onClick.bind(_this);
        _this.onSlideStart = _this.onSlideStart.bind(_this);
        _this.onSlideMove = _this.onSlideMove.bind(_this);
        _this.onSlideEnd = _this.onSlideEnd.bind(_this);
        _this.update = _this.update.bind(_this);
        _this.reset = _this.reset.bind(_this);
        _this.handleMouseOver = _this.handleMouseOver.bind(_this);
        _this.handleMouseMove = _this.handleMouseMove.bind(_this);
        _this.handleMouseOut = _this.handleMouseOut.bind(_this);

        _this.line = Dom.$('.lark-progress-bar__line', _this.el);
        _this.lineHandle = Dom.$('.lark-progress-bar__line__handle', _this.el);
        _this.hoverLight = Dom.$('.lark-progress-bar-hover-light', _this.el);
        _this.paddingEl = Dom.$('.lark-progress-bar-padding', _this.el);

        player.on('timeupdate', _this.handleTimeUpdate);
        _this.on('click', _this.handleClick);
        _this.on('touchstart', _this.handleSlideStart);

        if (!_featureDetector2['default'].touch) {
            _this.on('mousedown', _this.handleSlideStart);
            _this.on('mouseover', _this.handleMouseOver);
            _this.on('mousemove', _this.handleMouseMove);
            _this.on('mouseout', _this.handleMouseOut);
        }
        return _this;
    }

    ProgressBar.prototype.handleTimeUpdate = function handleTimeUpdate() {
        // 进度条
        var percent = 0;
        var duration = this.player.duration();
        var currentTime = this.player.currentTime();
        if (duration && currentTime) {
            percent = currentTime / duration * 100 + '%';
        }

        this.line.style.width = percent;
    };

    ProgressBar.prototype.onClick = function onClick(event) {
        this.update(event);
    };

    ProgressBar.prototype.onSlideStart = function onSlideStart(event) {
        this.originalPaused = this.player.paused();
    };

    ProgressBar.prototype.onSlideMove = function onSlideMove(event) {
        event.preventDefault();

        if (!this.player.paused()) {
            this.player.pause();
        }

        this.update(event);
    };

    ProgressBar.prototype.onSlideEnd = function onSlideEnd(event) {
        // 如果播放器在拖动进度条前不是处于暂停状态，那么拖动完了之后继续播放
        if (this.player.paused && !this.originalPaused && this.originalPaused !== undefined) {
            this.player.play();
        }
    };

    ProgressBar.prototype.update = function update(event) {
        var pos = Dom.getPointerPosition(this.el, event);
        var percent = pos.x * 100 + '%';
        var currentTime = this.player.duration() * pos.x;

        this.player.currentTime(currentTime);
        this.line.style.width = percent;
    };

    ProgressBar.prototype.reset = function reset() {
        this.line.style.width = 0;
        this.children.forEach(function (child) {
            child && child.reset && child.reset();
        });
    };

    ProgressBar.prototype.showToolTip = function showToolTip(event) {
        var duration = this.player.duration();
        if (duration) {
            var pointerPos = Dom.getPointerPosition(this.el, event);
            // const elPos = Dom.findPosition(this.el);

            // const top = elPos.top - (this.paddingEl.offsetHeight - this.line.offsetHeight);
            // const left = elPos.left + this.el.offsetWidth * pointerPos.x;
            var currentTime = parseInt(duration * pointerPos.x, 10);

            if (!isNaN(currentTime)) {
                _tooltip2['default'].show({
                    // top: top,
                    // left: left,
                    hostEl: this.el,
                    margin: 13,
                    placement: 'top',
                    isFollowMouse: true,
                    event: event,
                    content: (0, _timeFormat.timeFormat)(Math.floor(currentTime))
                });
            }
        }
    };

    ProgressBar.prototype.showHoverLine = function showHoverLine(event) {
        var pointerPos = Dom.getPointerPosition(this.el, event);
        var left = this.el.offsetWidth * pointerPos.x;

        this.hoverLight.style.width = left + 'px';
    };

    ProgressBar.prototype.hideHoverLine = function hideHoverLine(event) {
        this.hoverLight.style.width = 0;
    };

    ProgressBar.prototype.handleMouseOver = function handleMouseOver(event) {
        this.showToolTip(event);
        this.showHoverLine(event);
    };

    ProgressBar.prototype.handleMouseMove = function handleMouseMove(event) {
        this.showToolTip(event);
        this.showHoverLine(event);
    };

    ProgressBar.prototype.handleMouseOut = function handleMouseOut(event) {
        _tooltip2['default'].hide();
        this.hideHoverLine(event);
    };

    ProgressBar.prototype.createEl = function createEl() {
        var className = 'lark-progress-bar';
        if (this.options.className) {
            className = className + ' ' + this.options.className;
        }

        return this.createElement('div', { className: className }, this.createElement('div', { className: 'lark-progress-bar-padding' }), this.createElement('div', { className: 'lark-progress-bar-hover-light' }), this.createElement('progressBarExceptFill'));
    };

    return ProgressBar;
}(_slider2['default']);

exports['default'] = ProgressBar;


_component2['default'].registerComponent('ProgressBar', ProgressBar);

},{"../component":4,"../utils/dom":29,"../utils/feature-detector":31,"../utils/time-format":40,"./progress-bar-except-fill":21,"./slider":24,"./tooltip":25}],24:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _events = require('../utils/events');

var Events = _interopRequireWildcard(_events);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file slide.js 所有需要拖动的元素的父类
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yuhui06
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date 2018/3/15
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var Slider = function (_Component) {
    _inherits(Slider, _Component);

    function Slider(player, options) {
        _classCallCheck(this, Slider);

        var _this = _possibleConstructorReturn(this, _Component.call(this, player, options));

        _this.handleClick = _this.handleClick.bind(_this);
        _this.handleSlideStart = _this.handleSlideStart.bind(_this);
        _this.handleSlideMove = _this.handleSlideMove.bind(_this);
        _this.handleSlideEnd = _this.handleSlideEnd.bind(_this);
        _this.onClick = _this.onClick.bind(_this);
        _this.onSlideStart = _this.onSlideStart.bind(_this);
        _this.onSlideMove = _this.onSlideMove.bind(_this);
        _this.onSlideEnd = _this.onSlideEnd.bind(_this);
        return _this;
    }

    Slider.prototype.onClick = function onClick(event) {};

    Slider.prototype.onSlideStart = function onSlideStart(event) {};

    Slider.prototype.onSlideMove = function onSlideMove(event) {};

    Slider.prototype.onSlideEnd = function onSlideEnd(event) {};

    Slider.prototype.handleClick = function handleClick(event) {
        this.onClick(event);
    };

    Slider.prototype.handleSlideStart = function handleSlideStart(event) {
        this.onSlideStart(event);

        this.addClass('lark-sliding');

        Events.on(document, 'touchmove', this.handleSlideMove);
        Events.on(document, 'touchend', this.handleSlideEnd);
        Events.on(document, 'mousemove', this.handleSlideMove);
        Events.on(document, 'mouseup', this.handleSlideEnd);
    };

    Slider.prototype.handleSlideMove = function handleSlideMove(event) {
        this.onSlideMove(event);
    };

    Slider.prototype.handleSlideEnd = function handleSlideEnd(event) {
        this.onSlideEnd(event);

        this.removeClass('lark-sliding');

        Events.off(document, 'touchmove', this.handleSlideMove);
        Events.off(document, 'touchend', this.handleSlideEnd);
        Events.off(document, 'mousemove', this.handleSlideMove);
        Events.off(document, 'mouseup', this.handleSlideEnd);
    };

    return Slider;
}(_component2['default']);

exports['default'] = Slider;

},{"../component":4,"../utils/events":30}],25:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _dom = require('../utils/dom');

var Dom = _interopRequireWildcard(_dom);

var _lodash = require('lodash.assign');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

/**
 * @file tooltip.js 用于展示提示性文字
 * @author yuhui06
 * @date 2018/3/22
 * @todo 多个播放器实例并存时有点鸡肋
 */

exports['default'] = {
    id: 'lark-tooltip',
    el: null,
    timeoutHandler: null,
    initial: function initial(container) {
        // if (this.el) {
        //     return;
        // }

        if (!Dom.isEl(container)) {
            return;
        }

        var el = Dom.createElement('div', {
            className: this.id
        });
        Dom.appendContent(container, el);

        this.el = el;
        this.container = container;
    },
    normalize: function normalize(options) {
        return (0, _lodash2['default'])({
            timeout: 0,
            content: '',
            top: 0,
            left: 0,
            margin: 0,
            hostEl: null,
            placement: 'top',
            isFollowMouse: false,
            // 这个 event 有点鸡肋，但要获取鼠标位置的时候（即 isFollowMouse: true），必须得从 event 参数里获取
            event: null
        }, options);
    },
    getCoordinate: function getCoordinate(options) {
        var coordinate = void 0;

        switch (options.placement) {
            case 'top':
                // @todo 可以 cache
                var hostElRect = Dom.getBoundingClientRect(options.hostEl);
                var containerRect = Dom.getBoundingClientRect(this.container);

                var left = void 0;
                if (options.isFollowMouse) {
                    var pointerPos = Dom.getPointerPosition(options.hostEl, options.event);
                    left = hostElRect.left - containerRect.left + hostElRect.width * pointerPos.x - this.el.offsetWidth / 2;
                } else {
                    left = hostElRect.left - containerRect.left + (hostElRect.width - this.el.offsetWidth) / 2;
                }

                var outOfBounds = left + this.el.offsetWidth - this.container.offsetWidth;
                if (outOfBounds > 0) {
                    left = left - outOfBounds;
                }

                var top = hostElRect.top - containerRect.top - this.el.offsetHeight - options.margin;
                coordinate = { left: left, top: top };
                break;
        }

        return coordinate;
    },
    show: function show(options) {
        var _this = this;

        clearTimeout(this.timeoutHandler);

        options = this.normalize(options);

        if (!Dom.isEl(options.hostEl)) {
            return;
        }

        var container = Dom.parent(options.hostEl, 'larkplayer');
        var el = Dom.$('.lark-tooltip', container);

        // 多个播放器实例并存时需要不断切换 this.el 和 this.container
        if (el) {
            this.el = el;
            this.container = container;
        } else {
            this.initial(container);
        }

        // if (!this.el) {
        //     const container = Dom.parent(options.hostEl, 'larkplayer');
        //     this.initial(container);
        // }

        Dom.replaceContent(this.el, options.content);

        setTimeout(function () {
            // 元素 display none 时获取到的 offsetHeight 和 offsetWidth 是 0
            // 所以先以 visibility: hidden 的方式“显示”元素，以获取正确的高宽
            _this.el.style.visibility = 'hidden';
            _this.el.style.display = 'block';
            var coordinate = _this.getCoordinate(options);
            _this.el.style.top = coordinate.top + 'px';
            _this.el.style.left = coordinate.left + 'px';
            _this.el.style.visibility = 'visible';
        }, 0);
    },
    hide: function hide() {
        var _this2 = this;

        if (!this.el) {
            return;
        }

        this.timeoutHandler = setTimeout(function () {
            _this2.el.style.display = 'none';
        });
    }
};

},{"../utils/dom":29,"lodash.assign":1}],26:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _component = require('../component');

var _component2 = _interopRequireDefault(_component);

var _dom = require('../utils/dom');

var Dom = _interopRequireWildcard(_dom);

var _events = require('../utils/events');

var Events = _interopRequireWildcard(_events);

var _slider = require('./slider');

var _slider2 = _interopRequireDefault(_slider);

var _tooltip = require('./tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file 音量 UI 组件
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author yuhui06
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date 2018/3/9
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var Volume = function (_Slider) {
    _inherits(Volume, _Slider);

    function Volume(player, options) {
        _classCallCheck(this, Volume);

        var _this = _possibleConstructorReturn(this, _Slider.call(this, player, options));

        _this.onSlideStart = _this.onSlideStart.bind(_this);
        _this.onSlideMove = _this.onSlideMove.bind(_this);
        _this.onSlideEnd = _this.onSlideEnd.bind(_this);
        _this.onClick = _this.onClick.bind(_this);
        _this.update = _this.update.bind(_this);
        _this.iconClick = _this.iconClick.bind(_this);
        _this.handleIconMouseOver = _this.handleIconMouseOver.bind(_this);
        _this.handleIconMouseOut = _this.handleIconMouseOut.bind(_this);
        _this.switchStatus = _this.switchStatus.bind(_this);
        _this.clearStatus = _this.clearStatus.bind(_this);

        _this.line = Dom.$('.lark-volume-line__line', _this.el);
        _this.ball = Dom.$('.lark-volume-line__ball', _this.el);
        _this.icon = Dom.$('.lark-volume-icon', _this.el);

        Events.on(_this.icon, 'click', _this.iconClick);
        Events.on(_this.icon, 'mouseover', _this.handleIconMouseOver);
        Events.on(_this.icon, 'mouseout', _this.handleIconMouseOut);
        Events.on(_this.line, 'click', _this.handleClick);
        Events.on(_this.ball, 'mousedown', _this.handleSlideStart);
        Events.on(_this.ball, 'touchstart', _this.handleSlideStart);
        return _this;
    }

    Volume.prototype.onSlideStart = function onSlideStart(event) {
        this.lastVolume = this.player.volume();
    };

    Volume.prototype.onSlideMove = function onSlideMove(event) {
        event.preventDefault();
        var pos = Dom.getPointerPosition(this.line, event);
        this.update(pos.x);
    };

    Volume.prototype.onSlideEnd = function onSlideEnd(event) {
        if (this.player.volume() !== 0) {
            this.lastVolume = null;
        }
    };

    Volume.prototype.onClick = function onClick(event) {
        this.lastVolume = this.player.volume();

        var pos = Dom.getPointerPosition(this.line, event);
        this.update(pos.x);

        if (this.player.volume() !== 0) {
            this.lastVolume = null;
        }
    };

    Volume.prototype.update = function update(percent) {
        var lineWidth = this.line.offsetWidth;

        this.ball.style.left = percent * lineWidth + 'px';
        this.player.volume(percent);
        this.switchStatus(percent);
    };

    Volume.prototype.iconClick = function iconClick(event) {
        // 点击静音
        if (this.lastVolume == null) {
            this.lastVolume = this.player.volume();
            this.update(0);
        } else {
            // 再次点击时恢复上次的声音
            this.update(this.lastVolume);
            this.lastVolume = null;
        }

        this.handleIconMouseOver();
    };

    Volume.prototype.handleIconMouseOver = function handleIconMouseOver() {
        _tooltip2['default'].show({
            hostEl: this.icon,
            margin: 16,
            content: this.lastVolume == null ? '静音' : '取消静音'
        });
    };

    Volume.prototype.handleIconMouseOut = function handleIconMouseOut(event) {
        _tooltip2['default'].hide();
    };

    Volume.prototype.switchStatus = function switchStatus(volume) {
        this.clearStatus();

        var status = void 0;
        if (volume === 0) {
            status = 'small';
        } else if (volume <= 0.6 && volume > 0) {
            status = 'middle';
        } else if (volume > 0.6) {
            status = 'large';
        }

        Dom.addClass(this.icon, 'lark-icon-sound-' + status);
    };

    Volume.prototype.clearStatus = function clearStatus() {
        var _this2 = this;

        var statusClass = ['lark-icon-sound-small', 'lark-icon-sound-middle', 'lark-icon-sound-large'];
        statusClass.forEach(function (className) {
            Dom.removeClass(_this2.icon, className);
        });
    };

    Volume.prototype.createEl = function createEl() {
        var volumeIcon = this.createElement('div', { className: 'lark-volume-icon lark-icon-sound-large' });

        var volumeLine = this.createElement('div', { className: 'lark-volume-line' }, this.createElement('div', { className: 'lark-volume-line__line' }, this.createElement('div', { className: 'lark-volume-line__line-padding' })), this.createElement('div', { className: 'lark-volume-line__ball' }));

        return this.createElement('div', { className: 'lark-volume' }, volumeIcon, volumeLine);
    };

    return Volume;
}(_slider2['default']);

exports['default'] = Volume;


_component2['default'].registerComponent('Volume', Volume);

},{"../component":4,"../utils/dom":29,"../utils/events":30,"./slider":24,"./tooltip":25}],27:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports['default'] = computedStyle;
/**
 * @file 获取元素指定样式的值
 * @author yuhui06@baidu.com
 * @date 2017/11/3
 */

/**
 * 获取元素指定样式
 * 主要针对 window.getComputedStyle 做兼容处理
 *
 * @param {Element} el 从该元素的上获取指定样式值
 * @param {string} prop 要获取的样式
 * @return {string} 样式值
 *
 * @see https://bugzilla.mozilla.org/show_bug.cgi?id=548397
 */
function computedStyle(el, prop) {
    if (!el || !prop) {
        return '';
    }

    if (typeof window.getComputedStyle === 'function') {
        var styleCollection = window.getComputedStyle(el);
        return styleCollection ? styleCollection[prop] : '';
    }

    return el.currentStyle && el.currentStyle[prop] || '';
}

},{}],28:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.getData = getData;
exports.hasData = hasData;
exports.removeData = removeData;

var _guid = require('./guid');

// 所有的数据会存在这里
// 我们可以将数据与 DOM 元素绑定，但又不是直接将数据放在它上面
// eg. Event listeners 是通过这种方式绑定的
var elData = {};

// @test
/**
 * @file dom-data.js
 * @author yuhui06@baidu.com
 * @date 2017/11/3
 * @desc
 *      1) 这是一个神奇的方法，看好了，最好别眨眼😉
 *      2) 这里没有 setData 方法，只负责取数据就行了。我们往取回来的数据里塞东西，自然就存起来了
 */

window.elData = elData;

var elIdAttr = 'larkplayer_data_' + Date.now();

/**
 * 获取 DOM 元素上的数据
 *
 * @param {Element} el 获取该元素上的数据
 * @return {Object} 想要的数据
 */
function getData(el) {
    var id = el[elIdAttr];

    if (!id) {
        id = el[elIdAttr] = (0, _guid.newGUID)();
    }

    if (!elData[id]) {
        elData[id] = {};
    }

    return elData[id];
}

/**
 * 判断一个元素上是否有我们存的数据
 *
 * @param {Element} el 就是要看这个元素上有没有我们之前存的数据
 * @return {boolean} 元素上是否存有数据
 */
function hasData(el) {
    var id = el[elIdAttr];

    if (!id || !elData[id]) {
        return false;
    }

    return !!Object.keys(elData[id]).length;
}

/**
 * 删除我们之前在元素上存放的数据
 *
 * @param {Element} el 宿主元素
 */
function removeData(el) {
    var id = el[elIdAttr];

    if (!id) {
        return;
    }

    // 删除存放的数据
    delete elData[id];

    // 同时删除 DOM 上的对应属性
    try {
        delete el[elIdAttr];
    } catch (e) {
        if (el.removeAttribute) {
            el.removeAttribute(elIdAttr);
        } else {
            // IE document 节点似乎不支持 removeAttribute 方法
            el[elIdAttr] = null;
        }
    }
}

},{"./guid":33}],29:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.$$ = exports.$ = undefined;
exports.isReal = isReal;
exports.isEl = isEl;
exports.createQuerier = createQuerier;
exports.createEl = createEl;
exports.createElement = createElement;
exports.textContent = textContent;
exports.normalizeContent = normalizeContent;
exports.isTextNode = isTextNode;
exports.prependTo = prependTo;
exports.parent = parent;
exports.hasClass = hasClass;
exports.addClass = addClass;
exports.removeClass = removeClass;
exports.toggleClass = toggleClass;
exports.setAttributes = setAttributes;
exports.getAttributes = getAttributes;
exports.getAttribute = getAttribute;
exports.setAttribute = setAttribute;
exports.removeAttribute = removeAttribute;
exports.blockTextSelection = blockTextSelection;
exports.unblockTextSelection = unblockTextSelection;
exports.getBoundingClientRect = getBoundingClientRect;
exports.findPosition = findPosition;
exports.getPointerPosition = getPointerPosition;
exports.emptyEl = emptyEl;
exports.appendContent = appendContent;
exports.insertContent = insertContent;
exports.replaceContent = replaceContent;

var _lodash = require('lodash.includes');

var _lodash2 = _interopRequireDefault(_lodash);

var _obj = require('./obj');

var _computedStyle = require('./computed-style');

var _computedStyle2 = _interopRequireDefault(_computedStyle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var document = window.document;

/**
 * 检测一个字符串是否包含任何非空格的字符
 *
 * @inner
 *
 * @param {string} str 待检查的字符串
 * @return {boolean} 是否包含非空格的字符
 */
/**
 * @file dom 相关 api
 * @author yuhui06@baidu.com
 * @date 2017/11/2
 */

function isNonBlankString(str) {
    return typeof str === 'string' && /\S/.test(str);
}

/**
 * 如果字符串中包含空格，则抛出错误
 *
 * @inner
 *
 * @param {string} str 待检查的字符串
 * @throws {Error}
 */
function throwIfWhitespace(str) {
    if (/\s/.test(str)) {
        throw new Error('class has illegal whitespace characters');
    }
}

/**
 * 生成一个正则表达式，用于检查一个元素的 className 字符串中是否包含特定的 className
 *
 * @inner
 *
 * @param {string} className 就是为了他！
 * @return {Regexp} 用于检查该类名是否存在于一个元素的 className 字符串中
 */
function classRegExp(className) {
    return new RegExp('(^|\\s+)' + className + '($|\\s+)');
}

/**
 * 是否处于浏览器环境中
 *
 * @return {boolean}
 */
function isReal() {
    // IE 9 以下，DOM 上的方法的 typeof 类型为 'object' 而不是 'function'
    // 所以这里用 'undefined' 检测
    return typeof document.createElement !== 'undefined';
}

/**
 * 判断一个变量是否是 DOM element
 *
 * @param {Mixed} value 待检查的变量
 * @return {boolean} 是否是 DOM element
 */
function isEl(value) {
    return (0, _obj.isObject)(value) && value.nodeType === 1;
}

/**
 * 创建一个 DOM 查询函数，这个函数在原有方法的基础上有额外的指定上下文的功能
 *
 * @param {string} method 方法名
 * @return {Function} 查询 DOM 用的函数
 */
function createQuerier(method) {
    return function (selector, context) {
        if (!isNonBlankString(selector)) {
            return document[method](null);
        }
        if (isNonBlankString(context)) {
            context = document.querySelector(context);
        }

        var ctx = isEl(context) ? context : document;

        return ctx[method] && ctx[method](selector);
    };
}

/**
 * 创建 DOM 元素
 *
 * @param {string=} tagName 元素类型。可选，默认 div
 * @param {Object=} properties 元素 prop 属性。可选，默认无
 * @param {Object=} attributes 元素 attr 属性。可选，默认无
 * @param {string|Element|TextNode|Array|Function=} content 元素内容。可选，默认无
 * @return {Element} el 创建的元素
 */
function createEl() {
    var tagName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'div';
    var properties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var attributes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var content = arguments[3];

    var el = document.createElement(tagName);

    if (properties == null) {
        properties = {};
    }

    if (attributes == null) {
        attributes = {};
    }

    Object.keys(properties).forEach(function (propName) {
        var val = properties[propName];

        // 对于一些属性需要特殊处理
        if (propName.indexOf('aria-') !== -1 || propName === 'role' || propName === 'type') {

            el.setAttribute(propName, val);
        } else if (propName === 'textContent') {
            // textContent 并不是所有浏览器都支持，单独写了个方法
            textContent(el, val);
        } else {
            el[propName] = val;
        }
    });

    Object.keys(attributes).forEach(function (attrName) {
        el.setAttribute(attrName, attributes[attrName]);
    });

    if (content) {
        appendContent(el, content);
    }

    return el;
}

/**
 * 创建一个元素，并能添加 props 和 子元素
 *
 * vjs 的 createEl 将 props 和 attrs 分成了两个参数，但是我们的业务没必要这么做
 * 而且每次想要传 child 参数的时候，还得先传 attrs 参数让我觉得很烦
 *
 * @todo 先写一个这个函数自己用，后面看有没有必要把 createEl 函数换掉
 *
 * @param {string} tagName DOM 元素标签名
 * @param {Object=} props 要到 DOM 元素上的属性。注意，这里直接是 el.propName = value 的形式，如果涉及到 attrs，建议后续用 setAttrbute 自己添加
 * @param {...Element|string} child 元素的子元素，参数个数不限。可以没有，也可以有多个
 * @return {Element} el 创建的元素
 */
function createElement() {
    var tagName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'div';
    var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var el = document.createElement(tagName);

    if (props == null) {
        props = {};
    }
    Object.keys(props).forEach(function (propName) {
        el[propName] = props[propName];
    });

    for (var _len = arguments.length, child = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        child[_key - 2] = arguments[_key];
    }

    if (child) {
        appendContent(el, child);
    }

    return el;
}

/**
 * 更改 DOM 元素中的文本节点（整个文本内容都会被替换掉）
 *
 * @param {Element} el 将要改变文本节点的 DOM 元素
 * @param {string} text 要添加的文本
 * @return {Element} el 更改后的 DOM 元素
 */
function textContent(el, text) {
    if (typeof el.textContent === 'undefined') {
        el.innerText = text;
    } else {
        el.textContent = text;
    }

    return el;
}

/**
 * 将要插入到 DOM 元素中的内容标准化
 *
 * 使用 createTextNode 而不是 createElement 避免 XSS 漏洞
 *
 * @param {string|Element|TextNode|Array|Function} content
 *        - string: 标准化为 text node
 *        - Element/TextNode: 不做任何处理
 *        - Array: 遍历处理数组元素
 *        - Function: 先运行得到结果再处理
 * @return {Array} 标准化后的内容
 */
function normalizeContent(content) {
    if (typeof content === 'function') {
        content = content();
    }

    return (Array.isArray(content) ? content : [].concat(content)).map(function (value) {
        if (typeof value === 'function') {
            value = value();
        }

        if (isEl(value) || isTextNode(value)) {
            return value;
        }

        if (isNonBlankString(value)) {
            return document.createTextNode(value);
        }
    }).filter(function (value) {
        return value;
    });
}

/**
 * 判断一个变量是否是 textNode
 *
 * @param {Mixed} value 待检查的变量
 * @return {boolean} 是否是 textNode
 */
function isTextNode(value) {
    return (0, _obj.isObject)(value) && value.nodeType === 3;
}

/**
 * 将一个元素插入到另一个中作为第一个子元素
 *
 * @param {Element} child 最终的子元素
 * @param {Element} parent 最终的父元素
 */
function prependTo(child, parent) {
    if (parent.firstChild) {
        parent.insertBefore(child, parent.firstChild);
    } else {
        parent.appendChild(child);
    }
}

/**
 * 返回指定元素的最近的命中选择器的父元素
 *
 * @param {Element} el 要寻找父元素的指定元素
 * @param {string} classForSelector 目前只支持 class 选择器
 * @return {Element|null} 选择器命中的最近的父元素列表
 */
function parent(el, classForSelector) {
    var result = null;
    while (el && el.parentNode) {
        if (hasClass(el.parentNode, classForSelector)) {
            result = el.parentNode;
            el = null;
        } else {
            el = el.parentNode;
        }
    }

    return result;
}

/**
 * 检查指定元素是否包含指定 class
 *
 * @param {Element} el 宿主元素
 * @param {string} classToCheck 待检查的 class
 * @return {boolean} 元素上是否包含指定 class
 */
function hasClass(el, classToCheck) {
    throwIfWhitespace(classToCheck);

    if (el.classList) {
        // node.contains(otherNode)
        return el.classList.contains(classToCheck);
    } else {
        return classRegExp(classToCheck).test(el.className);
    }
}

/**
 * 给指定元素增加 class
 *
 * @param {Element} el 要添加 class 的元素
 * @param {string} classToAdd 要添加的 class
 * @return {Element} 添加完 class 后的元素
 */
function addClass(el, classToAdd) {
    if (el.classList) {
        el.classList.add(classToAdd);
    } else if (!hasClass(el, classToAdd)) {
        el.className = (el.className + ' ' + classToAdd).trim();
    }

    return el;
}

/**
 * 移除指定元素的指定 class
 *
 * @param {Element} el 要移除 class 的元素
 * @param {string} classToRemove 要移除的 class
 * @return {Element} 移除指定 class 后的元素
 */
function removeClass(el, classToRemove) {
    if (hasClass(el, classToRemove)) {
        if (el.classList) {
            el.classList.remove(classToRemove);
        } else {
            el.className = el.className.split(/\s+/).filter(function (className) {
                return className !== classToRemove;
            }).join(' ');
        }
    }

    return el;
}

/**
 * 增加或删除一个元素上的指定的 class
 *
 * @param {Element} el 将要改变 class 的元素
 * @param {string} classToToggle 要添加或删除的 class
 * @param {Function|boolean=} predicate 添加或删除 class 的依据（额外的判断条件）
 * @return {Element} 改变完 class 后的元素
 */
function toggleClass(el, classToToggle, predicate) {
    // IE 下不支持 el.classList.toggle 方法的第二个参数
    // 不过不影响，因为这里我们用 add/remove
    var has = hasClass(el, classToToggle);

    if (typeof predicate === 'function') {
        predicate = predicate(el, classToToggle);
    }

    if (typeof predicate !== 'boolean') {
        predicate = !has;
    }

    if (predicate === has) {
        return;
    }

    if (predicate) {
        addClass(el, classToToggle);
    } else {
        removeClass(el, classToToggle);
    }

    return el;
}

/**
 * 设置元素的属性
 *
 * @param {Element} el 要设置属性的元素
 * @param {Object} attributes 要设置的属性集合
 */
function setAttributes(el, attributes) {
    Object.keys(attributes).forEach(function (attrName) {
        var attrValue = attributes[attrName];

        if (attrValue == null || attrValue === false) {
            el.removeAttribute(attrName);
        } else {
            el.setAttribute(attrName, attrValue === true ? '' : attrValue);
        }
    });
}

/**
 * 获取元素的所有属性，将 DOM 的 NamedNodeMap 表示为 key/value 的形式
 *
 * @param {Element} el 要获取属性的元素
 * @return {Object} 以 key/value 形式存储的属性
 * @desc
 *      1) boolean 的属性，其值为 true/false
 */
function getAttributes(el) {
    var collection = {};

    // 已知的值为 boolean 的属性
    // 有些浏览器的这些属性的 typeof 是 boolean，有些不是
    // 列出一个白名单以确保我们想要的效果
    var knownBooleans = ['autoplay', 'controls', 'playsinline', 'webkit-playsinline', 'loop', 'muted', 'default', 'defaultMuted'];

    if (el && el.attributes && el.attributes.length) {
        var attrs = el.attributes;

        for (var i = 0; i < attrs.length; i++) {
            var attrName = attrs[i]['name'];
            var attrValue = attrs[i]['value'];

            if (typeof el[attrName] === 'boolean' || (0, _lodash2['default'])(knownBooleans, attrName)) {
                attrValue = attrValue !== null;
            }

            collection[attrName] = attrValue;
        }
    }

    return collection;
}

/**
 * 获取元素的指定属性，element.getAttribute 换一种写法
 *
 * @param {Element} el 要获取属性的元素
 * @param {string} attribute 要获取的属性名
 * @return {string} 获取的属性值
 */
function getAttribute(el, attribute) {
    return el.getAttribute(attribute);
}

/**
 * 设置元素的指定属性 element.setAttribute 换一种写法
 *
 * @param {Element} el 要设置属性的元素
 * @param {string} attr 要设置的属性
 * @param {Mixed} value 要设置的属性的值
 */
function setAttribute(el, attr, value) {
    if (value === false) {
        removeAttribute(el, attr);
    } else {
        // 应该没有属性的值为 "true" 的形式，对于这种，直接转换为空的字符串
        // 如 controls = "true" => controls
        el.setAttribute(attr, value === true ? '' : value);
    }
}

/**
 * 移除元素上的指定属性 element.removeAttribute 换一种写法
 *
 * @param {Element} el 要移除属性的元素
 * @param {string} attribute 要移除的属性名
 */
function removeAttribute(el, attribute) {
    el.removeAttribute(attribute);
}

/**
 * 当拖动东西的时候，尝试去阻塞选中文本的功能
 */
function blockTextSelection() {
    document.body.focus();
    document.onselectstart = function () {
        return false;
    };
}

/**
 * 关闭对文本选中功能的阻塞
 */
function unblockTextSelection() {
    document.onselectstart = function () {
        return true;
    };
}

/**
 * 同原生的 getBoundingClientRect 方法一样，确保兼容性
 *
 * 在一些老的浏览器（比如 IE8）提供的属性不够时，此方法会手动补全
 *
 * 另外，一些浏览器不支持向 ClientRect/DOMRect 对象中添加属性，所以我们选择创建一个新的对象，
 * 并且把 ClientReact 中的标准属性浅拷贝过来（ x 和 y 没有拷贝，因为这个属性支持的并不广泛）
 *
 * @param {Element} el 要获取 ClientRect 对象的元素
 * @return {Object|undefined}
 */
function getBoundingClientRect(el) {
    // TODO 为什么还需要判断 parentNode
    if (el && el.getBoundingClientRect && el.parentNode) {
        var rect = el.getBoundingClientRect();
        var result = {};

        ['top', 'right', 'bottom', 'left', 'width', 'height'].forEach(function (attr) {
            if (rect[attr] !== undefined) {
                result[attr] = rect[attr];
            }
        });

        if (!result.height) {
            result.height = parseFloat((0, _computedStyle2['default'])(el, 'height'));
        }

        if (!result.width) {
            result.width = parseFloat((0, _computedStyle2['default'])(el, 'width'));
        }

        return result;
    }
}

/**
 * 获取一个元素在文档中的绝对位置（left, top）
 *
 * @see http://ejohn.org/blog/getboundingclientrect-is-awesome/
 *
 * @param {Element} el 要获取位置的元素
 * @return {Object} 包含位置信息的对象
 *
 * @desc
 *      1) clientLeft/clientTop 获取一个元素的左/上边框的宽度，不包括 padding 和 margin 的值
 */
function findPosition(el) {
    var box = getBoundingClientRect(el);

    if (!box) {
        return { left: 0, top: 0 };
    }

    var docEl = document.documentElement;
    var body = document.body;

    var clientLeft = docEl.clientLeft || body.clientLeft || 0;
    var scrollLeft = window.pageXOffset || body.scrollLeft;
    var left = box.left + scrollLeft - clientLeft;

    var clientTop = docEl.clientLeft || body.clientLeft || 0;
    var scrollTop = window.pageYOffset || body.scrollTop;
    var top = box.top + scrollTop - clientTop;

    // 安卓有时侯返回小数，稍微有点偏差，这里四舍五入下
    return {
        left: Math.round(left),
        top: Math.round(top)
    };
}

/**
 * x and y coordinates for a dom element or mouse pointer
 * 以左下角为原点
 *
 * @typedef {Object} DOM~Coordinates
 *
 * @property {number} x  该点距元素左边的距离／元素宽
 * @property {number} y  该点距元素底部的距离／元素高
 */
/**
 * 获取一个元素上被点击的位置（相对于该元素左下角）
 *
 * @param {Element} el 被点击的元素
 * @param {Event} event 点击事件
 * @return {DOM~Coordinates}
 * @desc
 *      1) offsetWidth/offsetHeight: 元素宽／高，包括 border padding width/height scrollbar
 *      2) pageX/pageY: 点击的 x/y 坐标，相对于 document，是个绝对值（当有滚动条时会把滚动条的距离也计算在内）
 *      3) changedTouches: touch 事件中的相关数据
 */
function getPointerPosition(el, event) {
    var box = findPosition(el);
    var boxW = el.offsetWidth;
    var boxH = el.offsetHeight;
    var boxY = box.top;
    var boxX = box.left;

    var pageX = event.pageX;
    var pageY = event.pageY;

    if (event.changedTouches) {
        pageX = event.changedTouches[0].pageX;
        pageY = event.changedTouches[0].pageY;
    }

    return {
        x: Math.max(0, Math.min(1, (pageX - boxX) / boxW)),
        y: Math.max(0, Math.min(1, (boxY - pageY + boxH) / boxH))
    };
}

/**
 * 清空一个元素
 *
 * @param {Element} el 要清空的元素
 * @return {Element} 移除所有子元素后的元素
 */
function emptyEl(el) {
    while (el.firstChild) {
        el.removeChild(el.firstChild);
    }

    return el;
}

/**
 * 向元素内插入内容
 *
 * @param {Element} el 父元素
 * @param {string|Element|TextNode|Array|Function} content 待插入的内容，会先经过 normalizeContent 处理
 * @return {Element} 被塞了新内容的元素
 */
function appendContent(el, content) {
    normalizeContent(content).forEach(function (node) {
        return el.appendChild(node);
    });
    return el;
}

/**
 * 替换元素的内容
 * 感觉名字起得不怎么好
 *
 * @param {Element} el 父元素
 * @param {string|Element|TextNode|Array|Function} content
 *        参见 normalizeContent 中参数描述 {@link: dom:normalizeContent}
 * @return {Element} el 替换内容后的元素
 */
function insertContent(el, content) {
    return appendContent(emptyEl(el), content);
}

/**
 * 同 insertContent
 * insertContent 是 vjs 里的函数，但我感觉名字起的不好，我想用这个
 *
 * @todo 看可不可以直接把 insertContent 函数去掉（需考虑到后续对 vjs 插件的影响）;
 *
 * @param {Element} el 父元素
 * @param {string|Element|TextNode|Array|Function} content
 *        参见 normalizeContent 中参数描述 {@link: dom:normalizeContent}
 * @return {Element} el 替换内容后的元素
 */
function replaceContent(el, content) {
    return appendContent(emptyEl(el), content);
}

/**
 * 通过选择器和上下文（可选）找到一个指定元素
 *
 * @const
 *
 * @type {Function}
 * @param {string} selector css 选择器，反正最后都会被 querySelector 处理，你看着传吧
 * @param {Element|string=} 上下文环境。可选，默认为 document
 * @return {Element|null} 被选中的元素或 null
 */

// export const $ = (function () {
//     if (document.querySelector) {
//         return createQuerier('querySelector');
//     } else {
//         return function (str, context) {
//             const idReg = /^#\w+/;
//             const classReg = /^.\w+/;

//             context = isEl(context) ? context : document;

//             if (idReg.test(str)) {
//                 return context.getElementById(str.slice(1));
//             } else if (classReg.test(str)) {
//                 return context.getElementsByClassName && context.getElementsByClassName(str.slice(1))[0];
//             } else {
//                 return context.getElementsByTagName && context.getElementsByTagName(str)[0];
//             }
//         }
//     }
// })();

var $ = exports.$ = createQuerier('querySelector');

/**
 * 通过选择器和上下文（可选）找到所有符合的元素
 *
 * @const
 *
 * @type {Function}
 * @param {string} selector css 选择器，反正最后都会被 querySelectorAll 处理，你看着传吧
 * @param {Element|string=} 上下文环境。可选，默认为 document
 * @return {NodeList} 被选中的元素列表，如果没有符合条件的元素，空列表
 */
var $$ = exports.$$ = createQuerier('querySelectorAll');

// export const $$ = (function () {
//     if (document.querySelectorAll) {
//         return createQuerier('querySelectorAll');
//     } else {
//         return function (str, context) {
//             const idReg = /^#\w+/;
//             const classReg = /^.\w+/;

//             context = isEl(context) ? context : document;

//             if (idReg.test(str)) {
//                 return context.getElementById(str.slice(1));
//             } else if (classReg.test(str)) {
//                 return context.getElementsByClassName && context.getElementsByClassName(str.slice(1));
//             } else {
//                 return context.getElementsByTagName && context.getElementsByTagName(str);
//             }
//         }
//     }
// })();

},{"./computed-style":27,"./obj":38,"lodash.includes":3}],30:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.isPassiveSupported = undefined;
exports.fixEvent = fixEvent;
exports.on = on;
exports.trigger = trigger;
exports.off = off;
exports.one = one;

var _lodash = require('lodash.includes');

var _lodash2 = _interopRequireDefault(_lodash);

var _domData = require('./dom-data');

var DomData = _interopRequireWildcard(_domData);

var _guid = require('./guid');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// data.disabled
// data.dispatcher
// data.handlers
// let data = {};

var document = window.document;

/**
 * 清理事件相关的数据(Clean up the listener cache and dispatchers)
 *
 * @inner
 *
 * @param {Element} elem 待清理的元素
 * @param {string} type 待清理的事件类型
 */
/**
 * @file 事件系统，借用系统事件能力的同时，能添加自定义事件
 * @author yuhui06@baidu.com
 * @date 2017/11/3
 */

function cleanUpEvents(elem, type) {
    var data = DomData.getData(elem);

    // 如果该 type 下已经没有回调函数，那就取消掉之前注册的事件并且删除不必要的属性
    if (data.handlers && data.handlers[type] && data.handlers[type]['length'] === 0) {
        // 删除不必要的属性
        delete data.handlers[type];

        // 删除之前注册的事件
        if (elem.removeEventListener) {
            elem.removeEventListener(type, data.dispatcher, false);
        } else if (elem.detachEvent) {
            elem.detachEvent('on' + type, data.dispatcher);
        }
    }

    // 如果 hanlders 下已经没有 type，那可以清除 data 下的所有属性了
    if (Object.getOwnPropertyNames(data.handlers).length === 0) {
        delete data.handlers;
        delete data.dispatcher;
        delete data.disabled;
    }

    // 如果 data 的属性已经被清空，那么对应 DOM 上的数据相关的属性也可以清除了
    if (Object.getOwnPropertyNames(data).length === 0) {
        DomData.removeData(elem);
    }
}

/**
 * 循环 types 数组，给每个 type 都执行指定的方法
 *
 * 将需要在不同函数里执行的循环操作抽离出来
 *
 * @inner
 *
 * @param {Function} func 要循环执行的函数
 * @param {Element} elem 宿主元素
 * @param {Array} types 类型数组
 * @param {Function} callback 要注册的回调函数
 */
function handleMultipleEvents(func, elem, types, callback) {
    if (types && types.length) {
        types.forEach(function (type) {
            return func(elem, type, callback);
        });
    }
}

/**
 * 修复事件，使其具有标准的属性
 *
 * @param {Event|Object} event 待修复的事件
 * @return {Object} 修复后的事件
 */
function fixEvent(event) {
    function returnTure() {
        return true;
    }

    function returnFalse() {
        return false;
    }

    // Test if fixing up is needed
    // Used to check if !event.stopPropagation instead of isPropagationStopped
    // But native events return true for stopPropagation, but don't have
    // other expected methods like isPropagationStopped. Seems to be a problem
    // with the Javascript Ninja code. So we're just overriding all events now.
    if (!event || !event.isPropagationStopped) {
        var old = event || window.event;

        event = {};

        // Clone the old object so that we can modify the values event = {};
        // IE8 Doesn't like when you mess with native event properties
        // Firefox returns false for event.hasOwnProperty('type') and other props
        //  which makes copying more difficult.
        // TODO: Probably best to create a whitelist of event props
        for (var key in old) {
            // Safari 6.0.3 warns you if you try to copy deprecated layerX/Y
            // Chrome warns you if you try to copy deprecated keyboardEvent.keyLocation
            // and webkitMovementX/Y
            if (key !== 'layerX' && key !== 'layerY' && key !== 'keyLocation' && key !== 'webkitMovementX' && key !== 'webkitMovementY') {
                // Chrome 32+ warns if you try to copy deprecated returnValue, but
                // we still want to if preventDefault isn't supported (IE8).
                if (!(key === 'returnValue' && old.preventDefault)) {
                    event[key] = old[key];
                }
            }
        }

        // 事件发生在此元素上
        if (!event.target) {
            event.target = event.srcElement || document;
        }

        // 跟事件发生元素有关联的元素
        if (!event.relatedTarget) {
            event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement;
        }

        // 阻止默认事件
        event.preventDefault = function () {
            if (old.preventDefault) {
                old.preventDefault();
            }

            event.returnValue = false;
            old.returnValue = false;
            event.defaultPrevented = true;
        };

        event.defaultPrevented = false;

        // 阻止事件冒泡
        event.stopPropagation = function () {
            if (old.stopPropagation) {
                old.stopPropagation();
            }

            event.cancelBubble = true;
            old.cancelBubble = true;
            event.isPropagationStopped = returnTure;
        };

        event.isPropagationStopped = returnFalse;

        // 阻止事件冒泡，并且当前阶段的事件也不执行
        event.stopImmediatePropagation = function () {
            if (old.stopImmediatePropagation) {
                old.stopImmediatePropagation();
            }

            event.isImmediatePropagationStopped = returnTure;
            event.stopPropagation();
        };

        event.isImmediatePropagationStopped = returnFalse;

        // 鼠标位置
        if (event.clientX != null) {
            var doc = document.documentElement;
            var body = document.body;

            // clientX 代表与窗口左边的距离，根据页面滚动不同，是可变的
            // pageX 代表相对于文档左边的距离，是个常量
            event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);

            event.pageY = event.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
        }

        // 键盘按键
        event.which = event.charCode || event.keyCode;

        // 鼠标按键
        // 0: 左键
        // 1: 中间按钮
        // 2: 右键
        if (event.button != null) {
            // em... 这里应该是 与运算，就没去细究了
            /* eslint-disable */
            event.button = event.button & 1 ? 0 : event.button & 4 ? 1 : event.button & 2 ? 2 : 0;
            /* eslint-disable */
        }
    }

    return event;
}

/**
 * 是否支持 passive event listeners
 * passive event listeners 可以提升页面的滚动性能
 *
 * @see https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
 */
var isPassiveSupported = exports.isPassiveSupported = false;
(function () {
    try {
        var opts = Object.defineProperty({}, 'passive', {
            get: function get() {
                // 如果浏览器会来读取这个属性，说明支持该功能
                exports.isPassiveSupported = isPassiveSupported = true;
            }
        });

        window.addEventListener('test', null, opts);
    } catch (ex) {}
})();

/**
 * @const 目前 chrome 支持的 passive event
 */
var passiveEvents = ['touchstart', 'touchmove'];

/**
 * 向元素注册监听函数
 *
 * @todo explain
 * @param {Element|Object} 要绑定事件的元素／对象，这里允许 Object 是考虑到后面讲事件处理作为一种能力赋予任何一个对象
 * @param {string|Array} 事件类型，可以是数组的形式
 * @param {Function} fn 要注册的回调函数
 */
function on(elem, type, fn) {
    if (Array.isArray(type)) {
        return handleMultipleEvents(on, elem, type, fn);
    }

    var data = DomData.getData(elem);
    if (!data.handlers) {
        data.handlers = {};
    }

    if (!data.handlers[type]) {
        data.handlers[type] = [];
    }

    if (!fn.guid) {
        fn.guid = (0, _guid.newGUID)();
    }

    // 我们往 handlers[type] 里面存函数，然后通过 dispatcher 调用
    data.handlers[type].push(fn);

    if (!data.dispatcher) {
        /**
         * trigger 的时候，我们通过调用这个函数，来调用注册在对应 elem 的对应 type 上的所有函数
         *
         * @param {Event} event 事件
         * @param {Mixed} extraData 传入函数的数据
         */
        data.dispatcher = function (event, extraData) {
            if (data.disabled) {
                return;
            }

            // 通过 event.type 找到之前注册的回调函数
            var handlers = data.handlers[event.type];

            event = fixEvent(event);

            if (handlers) {
                // 鲁棒性。如果事件在执行过程中发生变动，不至于影响原来注册的事件，从而影响下次执行
                var handlersClone = handlers.slice(0);

                for (var i = 0; i < handlersClone.length; i++) {
                    // 如果执行了 stopImmediatePropagation，那我们应该立即停止
                    if (event.isImmediatePropagationStopped()) {
                        break;
                    } else {
                        try {
                            // 在当前 elem 上调用，同时将 event extraData 传过去当参数
                            handlersClone[i].call(elem, event, extraData);
                        } catch (ex) {
                            console.log(ex);
                        }
                    }
                }
            }
        };
    }

    // 只注册一次
    if (data.handlers[type]['length'] === 1) {
        // 系统事件，借用系统的能力调起
        // 注意 这里注册的是 dispatcher 函数，通过 dispatcher 来统一地管理 fn
        if (elem.addEventListener) {
            // passive event listener
            var options = false;
            if (isPassiveSupported && (0, _lodash2['default'])(passiveEvents, type)) {
                options = { passive: true };
            }

            elem.addEventListener(type, data.dispatcher, options);
        } else if (elem.attachEvent) {
            elem.attachEvent('on' + type, data.dispatcher);
        }
    }
}

/**
 * 触发事件
 *
 * @param {string} 事件类型
 * @param {Mixed} hash 事件触发时，传入的数据
 */
function trigger(elem, event, hash) {
    // 先判断 hasData，避免直接用 getData 给 elem 添加额外的数据（具体可参见 DomData:getData）
    var data = DomData.hasData(elem) ? DomData.getData(elem) : {};
    // 事件冒泡
    var parent = elem.parentNode || elem.ownerDocument;

    // 将 string 包装成正常的事件类型
    if (typeof event === 'string') {
        event = { type: event, target: elem };
    }

    // 标准化
    event = fixEvent(event);

    // 如果有事件调度函数，那我们可以通过这个函数去调用注册在这个元素上的对应类型的事件
    // 理论上注册过事件后就会有这个函数
    if (data.dispatcher) {
        data.dispatcher.call(elem, event, hash);
    }

    // 冒泡吧
    // 如果还有父元素，并且没有手动阻止事件冒泡，且这个事件本身支持冒泡（media events 不支持），那我们继续
    if (parent && !event.isPropagationStopped() && event.bubbles === true) {
        // 注意 这里就直接传我们标准化过的 event 了，不用再传 type
        trigger.call(null, parent, event, hash);
        // 如果已经到最上层的元素，并且没有被阻止事件的默认行为，那我们看看有没有系统对这种事件有没有默认行为要执行
    } else if (!parent && !event.defaultPrevented) {
        var targetData = DomData.getData(event.target);
        // 如果系统也在这个事件上注册有函数
        if (event.target[event.type]) {
            // 在执行系统的事件函数前，先关闭我们自己的事件分发，因为已经执行过一次了（否则之前的那些事件有会被执行一次）
            targetData.disabled = true;

            // 执行系统默认事件
            if (typeof event.target[event.type] === 'function') {
                event.target[event.type]();
            }

            // 恢复 disable 参数，避免对下次事件造成影响
            targetData.disabled = false;
        }
    }

    // 告知调用者这个事件的默认行为是否被阻止了
    // @see https://www.w3.org/TR/DOM-Level-3-Events/#event-flow-default-cancel
    return !event.defaultPrevented;
}

/**
 * 移除已注册的事件
 *
 * @param {Element} elem 要移除事件的元素
 * @param {string|Array=} 事件类型。可选，如果没有 type 参数，则移除该元素上所有的事件
 * @param {Function=} 要移除的指定的函数。可选，如果没有此参数，则移除该 type 上的所有事件
 *
 * @desc
 *    1) 请按照参数顺序传参数
 */
function off(elem, type, fn) {
    if (!DomData.hasData(elem)) {
        return;
    }

    var data = DomData.getData(elem);

    if (!data.handlers) {
        return;
    }

    if (Array.isArray(type)) {
        return handleMultipleEvents(off, elem, type, fn);
    }

    function removeType(curType) {
        data.handlers[curType] = [];
        cleanUpEvents(elem, curType);
    }

    // 避免不传 type，直接传 fn 的情况
    if (typeof type === 'function') {
        throw new Error('注销指定事件函数前，先指定事件类型');
    }

    // 没有传 type，则移除所有事件
    if (!type) {
        for (var i in data.handlers) {
            removeType(i);
        }

        return;
    }

    // 传了 type
    var handlers = data.handlers[type];

    if (!handlers) {
        return;
    }

    // 传了 type，但没传 fn，则移除该 type 下的所有事件
    if (type && !fn) {
        removeType(type);
        return;
    }

    // 传了 type 且传了 fn，则移除 type 下的 fn
    // 如果这个函数之前注册过，就会有 guid 属性
    if (fn.guid) {
        if (handlers && handlers.length) {
            data.handlers[type] = handlers.filter(function (value) {
                return value.guid !== fn.guid;
            });
        }
    }

    // 最后需要再扫描下，有没有刚好被移除了所有函数的 type 或者 handlers
    cleanUpEvents(elem, type);
}

/**
 * 在指定事件下，只触发指定函数一次
 *
 * @param {Element} elem 要绑定事件的元素
 * @param {string|Array} type 绑定的事件类型
 * @param {Function} 注册的回调函数
 */
function one(elem, type, fn) {
    if (Array.isArray(type)) {
        return handleMultipleEvents(one, elem, type, fn);
    }

    function executeOnlyOnce() {
        off(elem, type, executeOnlyOnce);
        fn.apply(this, arguments);
    }

    // 移除函数需要 guid 属性
    executeOnlyOnce.guid = fn.guid = fn.guid || (0, _guid.newGUID)();

    on(elem, type, executeOnlyOnce);
}

},{"./dom-data":28,"./guid":33,"lodash.includes":3}],31:[function(require,module,exports){
'use strict';

exports.__esModule = true;
/**
 * @file 检测浏览器是否支持某些特性
 * @author yuhui06
 * @date 2018/3/8
 */

var document = window.document;

exports['default'] = {
  touch: 'ontouchend' in document
};

},{}],32:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _events = require('./events');

var Events = _interopRequireWildcard(_events);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var document = window.document;

/**
 * @const 目前所有的 fullscreen api
 */
/**
 * @file 将 fullscreen api 抽象并统一
 * @author yuhui<yuhui06@baidu.com>
 * @date 2017/11/8
 * @desc
 *    1) 在全屏播放器的时候，选择将 video 的父元素全屏而不是将 video 标签全屏，在 pc 上可以帮你解决很多问题
 *    2) 这个全屏并不是万能的，在一些浏览器下依然无法全屏（如 ios safari、IE9）
 *
 * @see https://fullscreen.spec.whatwg.org/
 * @see https://developers.google.com/web/fundamentals/native-hardware/fullscreen/?hl=zh-cn
 * @see https://github.com/sindresorhus/screenfull.js/blob/gh-pages/readme.md
 */

var API = [
// ideal api
['requestFullscreen', 'exitFullscreen', 'fullscreenElement', 'fullscreenEnabled', 'fullscreenchange', 'fullscreenerror'],
// New WebKit
['webkitRequestFullscreen', 'webkitExitFullscreen', 'webkitFullscreenElement', 'webkitFullscreenEnabled', 'webkitfullscreenchange', 'webkitfullscreenerror'],
// Old WebKit (Safari 5.1)
['webkitRequestFullScreen', 'webkitCancelFullScreen', 'webkitCurrentFullScreenElement', 'webkitCancelFullScreen', 'webkitfullscreenchange', 'webkitfullscreenerror'], ['mozRequestFullScreen', 'mozCancelFullScreen', 'mozFullScreenElement', 'mozFullScreenEnabled', 'mozfullscreenchange', 'mozfullscreenerror'], ['msRequestFullscreen', 'msExitFullscreen', 'msFullscreenElement', 'msFullscreenEnabled', 'MSFullscreenChange', 'MSFullscreenError']];

var browserApi = {};

API.forEach(function (value, index) {
    if (value && value[1] in document) {
        value.forEach(function (val, i) {
            browserApi[API[0][i]] = val;
        });
    }
});

exports['default'] = {
    requestFullscreen: function requestFullscreen(el) {
        el[browserApi.requestFullscreen]();
    },
    exitFullscreen: function exitFullscreen() {
        document[browserApi.exitFullscreen]();
    },
    fullscreenElement: function fullscreenElement() {
        return document[browserApi.fullscreenElement];
    },
    fullscreenEnabled: function fullscreenEnabled() {
        return document[browserApi.fullscreenEnabled];
    },
    isFullscreen: function isFullscreen() {
        return !!this.fullscreenElement();
    },
    fullscreenchange: function fullscreenchange(callback) {
        Events.on(document, browserApi.fullscreenchange, callback);
    },
    fullscreenerror: function fullscreenerror(callback) {
        Events.on(document, browserApi.fullscreenerror, callback);
    },

    // @todo 不够优雅，不过好歹是给了事件注销的机会
    off: function off(type, callback) {
        if (/change/.test(type)) {
            type = browserApi.fullscreenchange;
        } else {
            type = browserApi.fullscreenerror;
        }
        Events.off(document, type, callback);
    }
};

},{"./events":30}],33:[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports.newGUID = newGUID;
/**
 * @file guid 唯一标识
 * @author yuhui06@baidu.com
 * @date 2017/11/3
 */

// guid 从 1 开始
var guid = 1;

/**
 * 获取一个自增且唯一的 ID
 *
 * @return {number} 新的 ID
 */
function newGUID() {
  return guid++;
}

},{}],34:[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports["default"] = log;
/**
 * @file log.js log...log....loggggg
 * @author yuhui<yuhui06@baidu.com>
 * @date 2017/11/16
 */

/**
 * 在控制台输出日志信息
 *
 * @param {...string|object} 参数个人任意，类型不限
 * @example
 *    1) log('style: %c,'
 *           + 'just like print in c.'
 *           + 'string: %s,'
 *           + 'int: %i,'
 *           + 'float: %f,'
 *           + 'object: %o',
 *           'color:red;font-style: italic;',
 *           'string',
 *           333,
 *           1.2334,
 *           {});
 */

/* eslint-disable no-console */

function log() {
  var _console;

  (_console = console).log.apply(_console, arguments);
}

log.info = console.info;

log.warn = console.warn;

log.error = console.error;

log.clear = console.clear;

},{}],35:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports['default'] = mergeOptions;

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

},{"./obj.js":38}],36:[function(require,module,exports){
'use strict';

exports.__esModule = true;
/**
 * @file 视频 MIME Type 对照表
 * @author YuHui<yuhui06@baidu.com>
 * @version 1.0 | YuHui<yuhui06@baidu.com> | 2017/12/14 | initial
 */

exports['default'] = {
    'flv': 'video/x-flv',
    'mp4': 'video/mp4',
    'webm': 'video/webm',
    'ogg': 'video/ogg',
    'm3u8': 'application/x-mpegURL',
    'ts': 'video/MP2T',
    '3gp': 'video/3gpp',
    'mov': 'video/quicktime',
    'avi': 'video/x-msvideo',
    'wmv': 'video/x-ms-wmv'
};

},{}],37:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports['default'] = nomalizeSource;

var _obj = require('./obj');

var _mimeTypeMap = require('./mime-type-map');

var _mimeTypeMap2 = _interopRequireDefault(_mimeTypeMap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * @const
 * 匹配 url 最后一个 . 后面的字符串
 */
/**
 * @file 标准化用户传入的 source 参数
 * @author YuHui<yuhui06@baidu.com>
 * @version 1.0 | YuHui<yuhui06@baidu.com> | 2017/12/14 | initial
 */

var MIME_TYPE_REG = /\.([\w]+)$/;

/**
 * 根据 src 字符串获取视频类型
 *
 * @param {string} src 链接地址
 * @return {string|undefined} MIMEType 文件类型
 */
function getMIMEType(src) {
    var MIMEType = '';
    if (typeof src === 'string') {
        var matchResult = src.match(MIME_TYPE_REG);
        if (Array.isArray(matchResult)) {
            MIMEType = matchResult[1];
        }
    }

    return _mimeTypeMap2['default'][MIMEType];
}

/**
 * 标准化单个 source 对象
 *
 * @param {Object} singleSource 传入的 source 对象
 * @param {string} singleSource.src 视频链接
 * @param {string=} singleSource.type 可选，视频类型，若不填则自动根据视频链接的后缀生成
 * @return {Object} singleSource 标准化后的 source 对象
 */
function nomalizeSingleSource(singleSource) {
    if (!(0, _obj.isPlain)(singleSource)) {
        throw new TypeError('SingleSource should be an Object');
    }

    if (typeof singleSource.src !== 'string') {
        throw new TypeError('SingleSource.src should be a string');
    }

    if (singleSource.hasOwnProperty('type') && typeof singleSource.type !== 'string') {
        throw new TypeError('SingleSource.type should be a string');
    }

    if (!singleSource.type) {
        singleSource.type = getMIMEType(singleSource.src);
    }

    return singleSource;
}

/**
 * 标准化 source
 *
 * @param {Object|Array} source 要添加到 video 标签里的 source，可以是单个的对象，也可以是包含多个对象的数组
 * @return {Array} 标准化后的 source
 */
function nomalizeSource(source) {
    if ((0, _obj.isPlain)(source)) {
        return [nomalizeSingleSource(source)];
    } else if (Array.isArray(source)) {
        return source.map(function (value) {
            return nomalizeSingleSource(value);
        });
    } else {
        throw new TypeError('Source should be an Object or an Array which contains Object');
    }
}

},{"./mime-type-map":36,"./obj":38}],38:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.isObject = isObject;
exports.isPlain = isPlain;
exports.each = each;
/**
 * @file Object 相关方法
 * @module obj
 * @author yuhui06@baidu.com
 * @date 2017/11/2
 */

/**
 * @callback obj:EachCallback
 *
 * @param {Mixed} value 对象目前的 key 所对应的值
 * @param {string} key 对象目前的 key
 */

/**
 * 检查一个变量是否是对象（而不是 null）
 *
 * @param {Mixed} value 待检查的变量
 * @return {boolean} 该变量是否是对象
 * @desc
 *      1) typeof null 的值是 object
 */
function isObject(value) {
  return !!value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object';
}

/**
 * 判断一个变量是否是“纯粹”的对象
 *
 * @param {Mixed} value 任意 js 变量
 * @return {boolean} 该变量是否是纯粹的对象
 */
function isPlain(value) {
  return isObject(value) && Object.prototype.toString.call(value) === '[object Object]' && value.constructor === Object;
}

/**
 * 迭代对象
 *
 * @param {Object} obj 要迭代的对象
 * @param {EachCallback} fn 每次迭代时调用的函数，具体参见 EachCallback 定义
 */
function each(obj, fn) {
  Object.keys(obj).forEach(function (key) {
    return fn(obj[key], key);
  });
}

},{}],39:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.isPluginExist = isPluginExist;
exports.getPlugin = getPlugin;
exports.registerPlugin = registerPlugin;
exports.deregisterPlugin = deregisterPlugin;
/**
 * @file plugin.js 一些不想直接写在播放器中的代码，但又可能用到的功能，我们称之为 plugin
 * @author yuhui<yuhui06@baidu.com>
 * @date 2017/11/20
 */

/**
 * @const
 * @inner
 *
 * 以 name => plugin 的形式存储 plugin 的对象
 */
var pluginStore = {};

/**
 * 判断 plugin 的名称是否已存在
 *
 * @param {string} name plugin 名称
 * @return {boolean} 指定名称是否已存在
 */
function isPluginExist(name) {
  return pluginStore.hasOwnProperty(name);
}

/**
 * 通过名称获取对应过的 plugin
 *
 * @param {string} name 要获取的 plugin 的名称
 * @return {Function} 要获取的 plugin
 */
function getPlugin(name) {
  return pluginStore[name];
}

/**
 * 注册 plugin
 * 此方法会被赋值到 larkplayer 上（larkplayer.registerPlugin = registerPlugin）
 * 后续调用时，我们一般从 larkplayer 上调用
 *
 * @param {string} name 要注册的 plugin 的名称
 * @param {Function} plugin 要注册的 plugin 函数。
 *                   plugin 的 this 在运行时会被指定为 player
 */
function registerPlugin(name, plugin) {
  if (typeof plugin !== 'function') {
    throw new TypeError('Plugin should be a function');
  }

  if (isPluginExist(name)) {
    throw new Error('Plugin has existed, register fail');
  }

  pluginStore[name] = plugin;
}

/**
 * 注销 plugin
 *
 * @param {name} name 要注销的 plugin 名称
 */
function deregisterPlugin(name) {
  delete pluginStore[name];
}

},{}],40:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.timeFormat = timeFormat;
/**
 * @file time-format.js 将秒数格式化为指定的时间字符串形式
 * @author yuhui<yuhui06@baidu.com>
 * @date 2017/11/3
 */

/**
 * 将秒数格式化为 hh:mm:ss 的形式
 *
 * @param {number} seconds 要转化的秒数
 * @return {string} 格式化后的表示时间的字符串
 */

/**
 * 不足两位的时间，前面补零
 *
 * @inner
 *
 * @param {string|number} val 该段位的时间（如 1h 12h 23m 1s）
 * @return {string} 进行过不足两位前面补零操作的时间串
 */
function pad(val) {
    val = '' + val;
    if (val.length < 2) {
        val = '0' + val;
    }

    return val;
}

/**
 * 将传入的秒数格式化为 hh:mm:ss 的形式，如果不足一小时，则为 mm:ss 的形式
 *
 * @param {number} seconds 总秒数
 * @return {string} 格式化后的时间串
 */
function timeFormat(seconds) {
    seconds = parseInt(seconds, 10);
    if (!isNaN(seconds)) {
        var hour = Math.floor(seconds / 3600);
        var minute = Math.floor((seconds - hour * 3600) / 60);
        var second = seconds % 60;

        var result = [pad(minute), pad(second)];
        if (hour > 0) {
            result.unshift(pad(hour));
        }

        return result.join(':');
    } else {
        return '- -';
    }
}

},{}],41:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports['default'] = toTitleCase;
exports.titleCaseEquals = titleCaseEquals;
/**
 * @file to-title-case.js
 * @author yuhui06@baidu.com
 * @date 2017/11/3
 */

/**
 * 将字符串的首字母大写
 *
 * @param {string} str 要将首字母大写的字符串
 * @return {string} 首字母大写的字符串
 */
function toTitleCase(str) {
  if (typeof str !== 'string') {
    return str;
  }

  // let [firstChar, ...otherChars] = [...str];
  // return firstChar.toUpperCase() + otherChars.join('');

  // return [...str].map((value, index) => (index === 0 ? value.toUpperCase() : value)).join('');
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * 比较两个字符串在首字母大写的情况下是否相等
 *
 * @param {string} str1 待比较的字符串
 * @param {string} str2 待比较的字符串
 * @return {boolean} 两个字符串在首字母大写后是否相等
 */
function titleCaseEquals(str1, str2) {
  return toTitleCase(str1) === toTitleCase(str2);
}

},{}]},{},[6])(6)
});
