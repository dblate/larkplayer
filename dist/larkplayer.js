(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.larkplayer = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

function find(array, predicate, context) {
  if (typeof Array.prototype.find === 'function') {
    return array.find(predicate, context);
  }

  context = context || this;
  var length = array.length;
  var i;

  if (typeof predicate !== 'function') {
    throw new TypeError(predicate + ' is not a function');
  }

  for (i = 0; i < length; i++) {
    if (predicate.call(context, array[i], i, array)) {
      return array[i];
    }
  }
}

module.exports = find;

},{}],2:[function(require,module,exports){
(function (global){
var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = require('min-document');

var doccy;

if (typeof document !== 'undefined') {
    doccy = document;
} else {
    doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }
}

module.exports = doccy;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"min-document":4}],3:[function(require,module,exports){
(function (global){
var win;

if (typeof window !== "undefined") {
    win = window;
} else if (typeof global !== "undefined") {
    win = global;
} else if (typeof self !== "undefined"){
    win = self;
} else {
    win = {};
}

module.exports = win;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],4:[function(require,module,exports){

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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
var nativeKeys = overArg(Object.keys, Object);

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

module.exports = values;

},{}],7:[function(require,module,exports){
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

'use strict';
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}],8:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports['default'] = evented;

var _dom = require('../utils/dom');

var DOM = _interopRequireWildcard(_dom);

var _events = require('./events');

var Events = _interopRequireWildcard(_events);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

/**
 * @file Events
 * @author yuhui06
 * @date 2017/11/3
 *       2018/4/27 简化代码
 */

function evented() {
    var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var eventBusKey = DOM.isEl(target.el) ? target.el : DOM.createElement('div');

    target.on = function (eventName, fn) {
        Events.on(eventBusKey, eventName, fn);
    };

    target.off = function (eventName, fn) {
        Events.off(eventBusKey, eventName, fn);
    };

    target.one = function (eventName, fn) {
        Events.one(eventBusKey, eventName, fn);
    };

    target.trigger = function (eventName, initialDict) {
        Events.trigger(eventBusKey, eventName, initialDict);
    };
}

},{"../utils/dom":22,"./events":9}],9:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.on = on;
exports.off = off;
exports.one = one;
exports.trigger = trigger;

var _document = require('global/document');

var _document2 = _interopRequireDefault(_document);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * 绑定事件
 *
 * @param {Element} el 要绑定事件的 DOM 元素
 * @param {string} eventName 事件名
 * @param {Function} fn 回调函数
 * @param {(Object|boolean)=} options 事件触发方式设置。可选，默认为 false
 *                   @https://dom.spec.whatwg.org/#dictdef-eventlisteneroptions 查看其他可选项
 */
/**
 * @file Events
 * @author yuhui06
 * @date 2017/11/3
 *       2018/4/27 使用 CustomEvent 重构 Events 模块
 */

function on(el, eventName, fn) {
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    el.addEventListener(eventName, fn, options);
}

/**
 * 注销事件
 *
 * @param {Element} el 要注销事件的 DOM 元素
 * @param {string} eventName 事件名
 * @param {Function} fn 要注销的函数名
 * @param {(Object|boolean)=} options 事件触发方式设置
 */
function off(el, eventName, fn) {
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    el.removeEventListener(eventName, fn, options);
}

/**
 * 绑定事件且该事件只执行一次
 *
 * @param {Element} el 要绑定事件的 DOM 元素
 * @param {string} eventName 事件名
 * @param {Function} fn 回调函数
 * @param {(Object|boolean)=} options 事件触发方式设置。可选，默认为 false
 */
function one(el, eventName, fn) {
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    function wrapper() {
        fn();
        off(el, eventName, wrapper, options);
    }

    on(el, eventName, wrapper, options);
}

/**
 * 触发事件
 *
 * @param {Element} el 触发事件的元素
 * @param {string} eventName 事件名
 * @param {Object=} initialDict 一些其他设置，可选
 * @param {boolean} initialDict.bubbles 是否冒泡，默认 false
 * @param {boolean} initialDict.cancelable 是否可取消，默认 false
 * @param {Mixed} initialDict.detail 随事件传递的自定义数据，默认 null 
 */
function trigger(el, eventName) {
    var initialDict = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    initialDict = (0, _objectAssign2['default'])({
        bubbles: false,
        cancelable: false,
        detail: null
    }, initialDict);

    // for IE9/10/11
    var event = _document2['default'].createEvent('CustomEvent');
    event.initCustomEvent(eventName, initialDict.bubbles, initialDict.cancelable, initialDict.detail);

    el.dispatchEvent(event);
}

},{"global/document":2,"object-assign":7}],10:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _document = require('global/document');

var _document2 = _interopRequireDefault(_document);

var _events = require('../events/events');

var Events = _interopRequireWildcard(_events);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

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
    if (value && value[1] in _document2['default']) {
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
        _document2['default'][browserApi.exitFullscreen]();
    },
    fullscreenElement: function fullscreenElement() {
        return _document2['default'][browserApi.fullscreenElement];
    },
    fullscreenEnabled: function fullscreenEnabled() {
        return _document2['default'][browserApi.fullscreenEnabled];
    },
    isFullscreen: function isFullscreen() {
        return !!this.fullscreenElement();
    },
    fullscreenchange: function fullscreenchange(callback) {
        Events.on(_document2['default'], browserApi.fullscreenchange, callback);
    },
    fullscreenerror: function fullscreenerror(callback) {
        Events.on(_document2['default'], browserApi.fullscreenerror, callback);
    },

    // @todo 不够优雅，不过好歹是给了事件注销的机会
    off: function off(type, callback) {
        if (type) {
            if (callback) {
                Events.off(_document2['default'], type, callback);
            } else {
                Events.off(_document2['default'], type);
            }
        } else {
            Events.off(_document2['default'], browserApi.fullscreenchange);
            Events.off(_document2['default'], browserApi.fullscreenerror);
        }
    }
};

},{"../events/events":9,"global/document":2}],11:[function(require,module,exports){
'use strict';

exports.__esModule = true;
/**
 * @file html5 video attributes
 * @author yuhui06
 * @date 2018/5/11
 * @see https://www.w3.org/TR/html5/semantics-embedded-content.html#the-media-elements
 * @see https://www.w3.org/TR/html5/semantics-embedded-content.html#the-video-element
 * @todo player 对应方法的文档
 */

var HTML5_WRITABLE_ATTRS = exports.HTML5_WRITABLE_ATTRS = ['src', 'crossOrigin', 'poster', 'preload', 'autoplay', 'loop', 'muted', 'defaultMuted', 'controls', 'controlsList', 'width', 'height', 'playsinline', 'playbackRate', 'defaultPlaybackRate', 'volume', 'currentTime'];

var HTML5_WRITABLE_BOOL_ATTRS = exports.HTML5_WRITABLE_BOOL_ATTRS = ['autoplay', 'loop', 'muted', 'defaultMuted', 'controls', 'playsinline'];

var HTML5_READONLY_ATTRS = exports.HTML5_READONLY_ATTRS = ['error', 'currentSrc', 'networkState', 'buffered', 'readyState', 'seeking', 'duration', 'paused', 'played', 'seekable', 'ended', 'videoWidth', 'videoHeight'];

exports['default'] = [].concat(HTML5_WRITABLE_ATTRS, HTML5_READONLY_ATTRS);

},{}],12:[function(require,module,exports){
'use strict';

exports.__esModule = true;
/**
 * @file html5 video events
 * @author yuhui06
 * @date 2018/5/10
 * @see https://www.w3.org/TR/html5/semantics-embedded-content.html#media-elements-event-summary
 * @todo 移到这里后，player event 的文档怎么办？
 */

exports['default'] = ['loadstart',

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
'abort', 'error',

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
'loadeddata', 'canplay', 'canplaythrough', 'playing', 'waiting', 'seeking', 'seeked', 'ended', 'durationchange', 'timeupdate',

/**
 * 浏览器获取数据的过程中触发
 *
 * @event Player#progress
 * @param {Object} event 事件触发时浏览器自带的 event 对象
 */
'progress', 'play', 'pause',

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
'volumechange'];

},{}],13:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _window = require('global/window');

var _window2 = _interopRequireDefault(_window);

var _document = require('global/document');

var _document2 = _interopRequireDefault(_document);

var _lodash = require('lodash.includes');

var _lodash2 = _interopRequireDefault(_lodash);

var _dom = require('../utils/dom');

var DOM = _interopRequireWildcard(_dom);

var _toTitleCase = require('../utils/to-title-case');

var _toTitleCase2 = _interopRequireDefault(_toTitleCase);

var _normalizeSource = require('../utils/normalize-source');

var _normalizeSource2 = _interopRequireDefault(_normalizeSource);

var _evented = require('../events/evented');

var _evented2 = _interopRequireDefault(_evented);

var _html5Attrs = require('./html5-attrs');

var _html5Attrs2 = _interopRequireDefault(_html5Attrs);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /**
                                                                                                                                                           * @file html5 video api proxy
                                                                                                                                                           * @author yuhui06(yuhui06@baidu.com)
                                                                                                                                                           * @date 2017/11/6
                                                                                                                                                           * @see https://html.spec.whatwg.org/#event-media-emptied
                                                                                                                                                           * @see https://www.w3.org/TR/html5/embedded-content-0.html#attr-media-src
                                                                                                                                                           */

var Html5 = function () {
    function Html5(player, options) {
        _classCallCheck(this, Html5);

        this.options = options;
        this.el = this.options.el;

        (0, _evented2['default'])(this, { eventBusKey: this.el });
        this.proxyWebkitFullscreen();
    }

    Html5.prototype.dispose = function dispose() {
        Html5.disposeMediaElement(this.el);
    };

    Html5.prototype.proxyWebkitFullscreen = function proxyWebkitFullscreen() {
        var _this = this;

        if (!('webkitDisplayingFullscreen' in this.el)) {
            return;
        }

        var endFn = function endFn() {
            this.trigger('fullscreenchange', { detail: { isFullscreen: false } });
        };

        var beginFn = function beginFn() {
            if ('webkitPresentationMode' in this.el && this.el.webkitPresentationMode !== 'picture-in-picture') {

                this.one('webkitendfullscreen', endFn);
                this.trigger('fullscreenchange', { detail: { isFullscreen: true } });
            }
        };

        // @todo 改变执行事件时的 this
        beginFn = beginFn.bind(this);
        endFn = endFn.bind(this);

        this.on('webkitbeginfullscreen', beginFn);
        this.on('dispose', function () {
            _this.off('webkitbeginfullscreen', beginFn);
            _this.off('webkitendfullscreen', endFn);
        });
    };

    Html5.prototype.supportsFullScreen = function supportsFullScreen() {
        // return this.el.webkitSupportsFullscreen;

        if (typeof this.el.webkitEnterFullScreen === 'function') {
            var userAgent = _window2['default'].navigator && _window2['default'].navigator.userAgent || '';

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
            var sourceNodeList = DOM.$$('source', this.el);
            var sourceArray = Array.from(sourceNodeList);
            return sourceArray.map(function (value) {
                return {
                    src: value.src,
                    type: value.type
                };
            });
        } else {
            _source = (0, _normalizeSource2['default'])(_source);

            var docFragment = _document2['default'].createDocumentFragment();
            _source.forEach(function (value) {
                var sourceElem = DOM.createElement('source', {
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

    return Html5;
}();

// HTML5 Support Testing


exports['default'] = Html5;
Html5.TEST_VID = _document2['default'].createElement('video');

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

Html5.disposeMediaElement = function (el) {
    Html5.resetMediaElement(el);
    el.parentNode && el.parentNode.removeChild(el);
};

Html5.resetMediaElement = function (el) {
    if (!el) {
        return;
    }

    while (el.hasChildNodes()) {
        el.removeChild(el.firstChild);
    }

    el.removeAttribute('src');

    if (typeof el.load === 'function') {
        try {
            el.load();
        } catch (ex) {}
    }
};

// Wrap HTML5 video attributes with a getter 
_html5Attrs2['default'].forEach(function (attr) {
    Html5.prototype[attr] = function () {
        return (0, _lodash2['default'])(_html5Attrs.HTML5_WRITABLE_BOOL_ATTRS, attr) ? this.el[attr] || this.el.hasAttribute(attr) : this.el[attr];
    };
});

// Wrap HTML5 video attributes with a setter on Html5 prototype
_html5Attrs.HTML5_WRITABLE_ATTRS.forEach(function (attr) {
    Html5.prototype['set' + (0, _toTitleCase2['default'])(attr)] = function (value) {
        this.el[attr] = value;
        value === false && this.el.removeAttribute(attr);
    };
});

// Wrap native functions with a function
['pause', 'load', 'play'].forEach(function (prop) {
    Html5.prototype[prop] = function () {
        return this.el[prop]();
    };
});

},{"../events/evented":8,"../utils/dom":22,"../utils/normalize-source":27,"../utils/to-title-case":30,"./html5-attrs":11,"global/document":2,"global/window":3,"lodash.includes":5}],14:[function(require,module,exports){
'use strict';

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _dom = require('./utils/dom');

var DOM = _interopRequireWildcard(_dom);

var _events = require('./events/events');

var Events = _interopRequireWildcard(_events);

var _player = require('./player');

var _player2 = _interopRequireDefault(_player);

var _html = require('./html5/html5');

var _html2 = _interopRequireDefault(_html);

var _component = require('./plugin/component');

var _component2 = _interopRequireDefault(_component);

var _mediaSourceHandler = require('./plugin/media-source-handler');

var _mediaSourceHandler2 = _interopRequireDefault(_mediaSourceHandler);

var _plugin = require('./plugin/plugin');

var _plugin2 = _interopRequireDefault(_plugin);

var _utils = require('./utils/utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function normalize(el) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var readyFn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};

    options = (0, _objectAssign2['default'])({ playsinline: true }, options);

    if (typeof el === 'string') {
        el = DOM.$(/^#/.test(el) ? el : '#' + el);
    }
    if (!DOM.isEl(el)) {
        throw new Error('[larkplayer initial error]: el should be an id or DOM element!');
    }
    if (el.tagName.toUpperCase() !== 'VIDEO') {
        var videoEl = DOM.createElement('video', {
            id: el.id + '-video'
        });

        el.appendChild(videoEl);
        el = videoEl;
    }

    return [el, options, readyFn];
} /**
   * @file larkplayer entry
   * @author yuhui06
   * @date 2017/11/7
   */

function larkplayer(el, options, readyFn) {
    if (!_html2['default'].isSupported()) {
        el.innerHTML = '请升级或更换浏览器以支持 html5 视频播放';
        return false;
    }

    return new (Function.prototype.bind.apply(_player2['default'], [null].concat(normalize(el, options, readyFn))))();
}

(0, _objectAssign2['default'])(larkplayer, { Events: Events, DOM: DOM, Component: _component2['default'], MediaSourceHandler: _mediaSourceHandler2['default'], Plugin: _plugin2['default'], util: _utils2['default'] });

// @see https://github.com/babel/babel/issues/2724
module.exports = larkplayer;

},{"./events/events":9,"./html5/html5":13,"./player":15,"./plugin/component":16,"./plugin/media-source-handler":17,"./plugin/plugin":20,"./utils/dom":22,"./utils/utils":31,"object-assign":7}],15:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _lodash = require('lodash.includes');

var _lodash2 = _interopRequireDefault(_lodash);

var _document = require('global/document');

var _document2 = _interopRequireDefault(_document);

var _html = require('./html5/html5');

var _html2 = _interopRequireDefault(_html);

var _html5Events = require('./html5/html5-events');

var _html5Events2 = _interopRequireDefault(_html5Events);

var _html5Attrs = require('./html5/html5-attrs');

var _fullscreen = require('./html5/fullscreen');

var _fullscreen2 = _interopRequireDefault(_fullscreen);

var _component = require('./plugin/component');

var _component2 = _interopRequireDefault(_component);

var _mediaSourceHandler = require('./plugin/media-source-handler');

var _mediaSourceHandler2 = _interopRequireDefault(_mediaSourceHandler);

var _plugin = require('./plugin/plugin');

var _plugin2 = _interopRequireDefault(_plugin);

var _pluginTypes = require('./plugin/plugin-types');

var _pluginTypes2 = _interopRequireDefault(_pluginTypes);

var _events = require('./events/events');

var Events = _interopRequireWildcard(_events);

var _dom = require('./utils/dom');

var DOM = _interopRequireWildcard(_dom);

var _toTitleCase = require('./utils/to-title-case');

var _toTitleCase2 = _interopRequireDefault(_toTitleCase);

var _evented = require('./events/evented');

var _evented2 = _interopRequireDefault(_evented);

var _obj = require('./utils/obj');

var _log = require('./utils/log');

var _log2 = _interopRequireDefault(_log);

var _computedStyle = require('./utils/computed-style');

var _computedStyle2 = _interopRequireDefault(_computedStyle);

var _featureDetector = require('./utils/feature-detector');

var _featureDetector2 = _interopRequireDefault(_featureDetector);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /**
                                                                                                                                                           * @file Player.js. player initial && api
                                                                                                                                                           * @author yuhui06(yuhui06@baidu.com)
                                                                                                                                                           * @date 2017/11/6
                                                                                                                                                           * @todo 对于 Player 构造函数的特殊照顾需要理一下，可能没必要
                                                                                                                                                           */

/**
 * @class Player
 */
var Player = function () {

    /**
     * 初始化一个播放器实例
     *
     * @constructor
     * @param {Element|string} tag DOM 元素或其 id，如果是 video 标签，会自动获取其属性
     * @param {Object=} options 配置项，可选
     * @param {number=} options.height 播放器高度
     * @param {number=} options.width 播放器宽度
     * @param {boolean=} options.loop 是否循环播放，默认 false
     * @param {boolean=} options.controls 是否有控制条，默认 false
     * @param {string=} options.controlsList 对原生控制条的一些设置，可选值为 nodownload nofullscreen noremoteplayback
     * @param {number=} options.playbackRate 视频播放速率，默认 1.0
     * @param {number=} options.defaultPlaybackRate 视频默认播放速率，默认 1.0
     * @param {number=} options.volume 声音大小，默认 1，取值应在 0~1
     * @param {boolean=} options.muted 是否静音
     * @param {boolean=} options.playsinline 是否使用内联的形式播放（即非全屏的形式），默认 true。仅 ios10 以上有效，在 ios10 以下，视频播放时会自动进入全屏
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
    function Player(tag, options, readyFn) {
        _classCallCheck(this, Player);

        this.isReady = false;
        this.player = this;
        this.options = options;
        this.tag = tag;
        this.el = this.createEl();
        this.ready(readyFn);

        (0, _evented2['default'])(this, { eventBusKey: this.el });

        this.handleFirstplay = this.handleFirstplay.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
        this.handleFullscreenChange = this.handleFullscreenChange.bind(this);
        this.handleFullscreenError = this.handleFullscreenError.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.fullWindowOnEscKey = this.fullWindowOnEscKey.bind(this);

        if (_featureDetector2['default'].touch) {
            this.on('touchend', this.handleTouchEnd);
        } else {
            this.on('click', this.handleClick);
        }

        if (!this.tech) {
            this.tech = this.loadTech();
        }

        var src = this.src();
        if (src) {
            // 如果视频已经存在，看下是不是错过了 loadstart 事件
            this.handleLateInit(this.tech.el);

            this.callMS(src);
        }

        this.initialUIPlugins();
        this.initialNormalPlugins();
        this.triggerReady();
    }
    /* eslint-enable fecs-max-statements */

    Player.prototype.initialNormalPlugins = function initialNormalPlugins() {
        var _this = this;

        this[_pluginTypes2['default'].OTHERS] = {};
        var allPlugins = _plugin2['default'].getAll();
        allPlugins.forEach(function (PluginClass) {
            var name = PluginClass._displayName;
            var pluginInstance = new PluginClass(_this, _this.getPluginOptions(name, _pluginTypes2['default'].OTHERS));
            _this[_pluginTypes2['default'].OTHERS][name] = pluginInstance;
        });
    };

    Player.prototype.initialUIPlugins = function initialUIPlugins() {
        var _this2 = this;

        // @hack 为了让 Component.createElement 能取到 player
        _component2['default'].player = this;

        this[_pluginTypes2['default'].UI] = {};
        var allPlugins = _component2['default'].getAll();
        allPlugins.forEach(function (PluginClass) {
            var name = PluginClass._displayName;
            var pluginInstance = new PluginClass(_this2, _this2.getPluginOptions(name, _pluginTypes2['default'].UI));
            var el = pluginInstance.el;
            _this2.el.appendChild(el);
            _this2[_pluginTypes2['default'].UI][name] = pluginInstance;
        });
    };

    Player.prototype.getPluginOptions = function getPluginOptions(name, namespace) {
        return this.options && this.options[namespace] && this.options[namespace][name];
    };

    Player.prototype.callMS = function callMS(src) {
        this.disposeMS();

        var HandlerClass = _mediaSourceHandler2['default'].select(src);
        if (HandlerClass) {
            this.MSHandler = new HandlerClass(this, this.getPluginOptions(HandlerClass._displayName, _pluginTypes2['default'].MS));
            this.MSHandler.src(src);

            return true;
        }

        return false;
    };

    Player.prototype.disposeMS = function disposeMS() {
        if (this.MSHandler) {
            this.MSHandler.dispose();
            this.MSHandler = null;
        }
    };

    Player.prototype.ready = function ready(fn) {
        var _this3 = this;

        if (fn) {
            if (this.isReady) {
                setTimeout(function () {
                    fn.call(_this3);
                }, 1);
            } else {
                this.readyQueue = this.readyQueue || [];
                this.readyQueue.push(fn);
            }
        }
    };

    Player.prototype.triggerReady = function triggerReady() {
        var _this4 = this;

        this.isReady = true;

        setTimeout(function () {
            var readyQueue = _this4.readyQueue;
            _this4.readyQueue = [];
            if (readyQueue && readyQueue.length) {
                readyQueue.forEach(function (fn) {
                    fn.call(_this4);
                });
            }

            _this4.trigger('ready');
        }, 1);
    };

    Player.prototype.removeClass = function removeClass(className) {
        return DOM.removeClass(this.el, className);
    };

    Player.prototype.addClass = function addClass(className) {
        return DOM.addClass(this.el, className);
    };

    Player.prototype.hasClass = function hasClass(className) {
        return DOM.hasClass(this.el, className);
    };

    Player.prototype.toggleClass = function toggleClass(className) {
        return this.hasClass(className) ? this.removeClass(className) : this.addClass(className);
    };

    /**
     * 销毁播放器
     *
     */


    Player.prototype.dispose = function dispose() {
        this.trigger('dispose');

        // 注销全屏事件
        _fullscreen2['default'].off();

        // 销毁 MS 插件
        this.disposeMS();

        if (this.tag && this.tag.player) {
            this.tag.player = null;
        }

        if (this.el && this.el.player) {
            this.el.player = null;
        }

        if (this.tech) {
            this.tech.dispose();
        }
    };

    /**
     * 创建播放器 DOM （将 video 标签包裹在一层 div 中，全屏及添加其他子元素时需要）
     *
     * @private
     * @return {Element} el 播放器 DOM
     */


    Player.prototype.createEl = function createEl() {
        var _this5 = this;

        var tag = this.tag;

        // 处理 options 中的 html5 标准属性
        (0, _obj.each)(this.options, function (value, key) {
            if ((0, _lodash2['default'])(_html5Attrs.HTML5_WRITABLE_ATTRS, key) && value) {
                DOM.setAttribute(tag, key, value);
            }
        });

        if (this.options.source) {
            this.ready(function () {
                _this5.source(_this5.options.source);
            });
        }

        // 创建容器元素
        var el = DOM.createElement('div', {
            className: 'larkplayer',
            id: tag.id + '-larkplayer'
        });

        DOM.setAttribute(tag, 'tabindex', '-1');

        // 将 el 插入到 DOM 中
        if (tag.parentNode) {
            tag.parentNode.insertBefore(el, tag);
        }

        if (tag.hasAttribute('width')) {
            el.style.width = tag.getAttribute('width') + 'px';
            tag.setAttribute('width', '100%');
        }

        if (tag.hasAttribute('height')) {
            el.style.height = tag.getAttribute('height') + 'px';
            tag.setAttribute('height', '100%');
        }

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
        var _this6 = this;

        if (!!el.error) {
            this.ready(function () {
                _this6.trigger('error');
            });
            return;
        }

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
                    _this6.trigger('loadstart');
                }
            };

            // 确保在执行 loadedmetadata 之前，执行了 loadstart 事件
            this.on('loadedmetadata', triggerLoadstart);

            // 我们的目标是，错过了 loadstart 的话，在 ready 后再手动 trigger 一次
            this.ready(function () {
                _this6.off('loadstart', setLoadstartFired);
                _this6.off('loadedmetadata', triggerLoadstart);

                if (!loadstartFired) {
                    _this6.trigger('loadstart');
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
                _this6.trigger(event);
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
        var _this7 = this;

        this.options.el = this.tag;
        var tech = new _html2['default'](this.player, this.options);

        // 代理 video 的各个事件
        _html5Events2['default'].forEach(function (eventName) {
            Events.on(tech.el, eventName, function () {
                _this7.trigger(eventName);
            });
        });

        // 绑定 firstPlay 事件
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
     * @return {number|NaN} 不传参数则返回播放器当前宽度
     */


    Player.prototype.width = function width(value) {
        if (value !== undefined) {
            if (/\d$/.test(value)) {
                value = value + 'px';
            }

            this.el.style.width = value;
        } else {
            return parseInt((0, _computedStyle2['default'])(this.el, 'width'), 0);
        }
    };

    /**
     * 获取或设置播放器的高度
     *
     * @param {number=} value 要设置的播放器高度值，可选
     * @return {number|NaN} 不传参数则返回播放器当前高度
     */


    Player.prototype.height = function height(value) {
        if (value !== undefined) {
            if (/\d$/.test(value)) {
                value = value + 'px';
            }

            this.el.style.height = value;
        } else {
            return parseInt((0, _computedStyle2['default'])(this.el, 'height'), 0);
        }
    };

    // = = = = = = = = = = = = = 事件处理 = = = = = = = = = = = = = =

    /**
     * 处理自定义的 firstplay 事件
     * 该事件与 play 事件的不同之处在于 firstplay 只会在第一次播放时触发一次
     *
     * @private
     * @fires Player#firstplay
     */


    Player.prototype.handleFirstplay = function handleFirstplay() {
        /**
         * 在视频第一次播放时触发，只会触发一次
         *
         * @event Player#firstplay
         */
        this.trigger('firstplay');
    };

    Player.prototype.handleTouchEnd = function handleTouchEnd(event) {
        if (event.target === this.tech.el && this.paused()) {
            this.play();
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
        if (event.detail && event.detail.isFullscreen !== undefined) {
            this.fullscreenStatus = event.detail.isFullscreen;
        } else if (_fullscreen2['default'].fullscreenEnabled()) {
            // pc 端 fullscreen 事件
            this.fullscreenStatus = _fullscreen2['default'].isFullscreen();
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
        this.trigger('fullscreenchange', { detail: data });
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

    Player.prototype.handleClick = function handleClick(event) {
        if (event.target === this.tech.el) {
            this.paused() ? this.play() : this.pause();
        }
    };

    // = = = = = = = = = = = = = 对外 api = = = = = = = = = = = = = =

    /**
     * 判断当前是否处于全屏状态
     *
     * @return {boolean} 返回当前全屏状态
     */


    Player.prototype.isFullscreen = function isFullscreen() {
        return this.fullscreenStatus || false;
    };

    /**
     * 进入全屏
     * 会先尝试浏览器提供的全屏方法，如果没有对应方法，则进入由 css 控制的全屏样式
     */


    Player.prototype.requestFullscreen = function requestFullscreen() {
        this.fullscreenStatus = true;

        if (_fullscreen2['default'].fullscreenEnabled()) {
            // 利用 css 强制设置 top right bottom left margin 的值为 0
            // 避免因为定位使得元素全屏时看不到
            this.addClass('lark-fullscreen-adjust');
            _fullscreen2['default'].requestFullscreen(this.el);
        } else if (this.tech.supportsFullScreen()) {
            this.techGet('enterFullScreen');
        } else {
            this.enterFullWindow();
        }
    };

    /**
     * 退出全屏
     */


    Player.prototype.exitFullscreen = function exitFullscreen() {
        this.fullscreenStatus = false;

        if (_fullscreen2['default'].fullscreenEnabled() && _fullscreen2['default'].isFullscreen()) {
            this.removeClass('lark-fullscreen-adjust');
            _fullscreen2['default'].exitFullscreen();
        } else if (this.tech.supportsFullScreen()) {
            this.techGet('exitFullScreen');
        } else {
            this.exitFullWindow();
        }
    };

    /**
     * 通过 css 控制，使得视频像是进入了全屏一样
     *
     * @private
     */


    Player.prototype.enterFullWindow = function enterFullWindow() {
        this.addClass('lark-full-window');
        this.trigger('fullscreenchange');
        Events.on(_document2['default'], 'keydown', this.fullWindowOnEscKey);
    };

    Player.prototype.fullWindowOnEscKey = function fullWindowOnEscKey(event) {
        var keyCode = event.keyCode || event.which;
        // Esc 键码为 27
        if (keyCode === 27) {
            this.exitFullWindow();
        }
    };

    /**
     * 去除由 css 控制展现的全屏样式
     *
     * @private
     */


    Player.prototype.exitFullWindow = function exitFullWindow() {
        this.removeClass('lark-full-window');
        this.trigger('fullscreenchange');
        Events.off(_document2['default'], 'keydown', this.fullWindowOnEscKey);
    };

    Player.prototype.internalPlay = function internalPlay() {
        var playReturn = this.techGet('play');
        if (playReturn && playReturn.then) {
            playReturn.then(null, function (err) {
                // @todo 这里返回的 err 可以利用下？
                _log2['default'].error(err);
            });
        }
    };

    /**
     * 播放视频
     */


    Player.prototype.play = function play() {
        if (this.MSHandler) {
            this.MSHandler.play();
        } else {
            this.isReady ? this.internalPlay() : this.ready(this.internalPlay);
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
     * 获取视频剩下的时长
     *
     * @return {number} 总时长 - 已播放时长 = 剩下的时长
     */


    Player.prototype.remainingTime = function remainingTime() {
        return this.duration() - this.currentTime();
    };

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
     * 获取或设置当前视频的 src 属性的值
     *
     * @param {string=} src 要设置的 src 属性的值，可选
     * @return {string} 不传参数则返回当前视频的 src 或 currentSrc
     */


    Player.prototype.src = function src(_src) {
        if (_src !== undefined) {

            var success = this.callMS(_src);
            if (!success) {
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
            this.trigger('srcchange', { detail: _src });
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
            this.trigger('srcchange', { detail: this.player.src() });
        } else {
            return this.techGet('source');
        }
    };

    return Player;
}();

exports['default'] = Player;


_html5Attrs.HTML5_WRITABLE_ATTRS.filter(function (attr) {
    return !(0, _lodash2['default'])(['src', 'currentTime', 'width', 'height'], attr);
}).forEach(function (attr) {
    Player.prototype[attr] = function (val) {
        if (val !== undefined) {
            this.techCall('set' + (0, _toTitleCase2['default'])(attr), val);
            this.options[attr] = val;
        } else {
            return this.techGet(attr);
        }
    };
});

_html5Attrs.HTML5_READONLY_ATTRS.forEach(function (attr) {
    Player.prototype[attr] = function () {
        return this.techGet(attr);
    };
});

},{"./events/evented":8,"./events/events":9,"./html5/fullscreen":10,"./html5/html5":13,"./html5/html5-attrs":11,"./html5/html5-events":12,"./plugin/component":16,"./plugin/media-source-handler":17,"./plugin/plugin":20,"./plugin/plugin-types":19,"./utils/computed-style":21,"./utils/dom":22,"./utils/feature-detector":23,"./utils/log":25,"./utils/obj":28,"./utils/to-title-case":30,"global/document":2,"lodash.includes":5}],16:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _pluginStore = require('./plugin-store');

var _pluginStore2 = _interopRequireDefault(_pluginStore);

var _pluginTypes = require('./plugin-types');

var _pluginTypes2 = _interopRequireDefault(_pluginTypes);

var _dom = require('../utils/dom');

var DOM = _interopRequireWildcard(_dom);

var _events = require('../events/events');

var Events = _interopRequireWildcard(_events);

var _evented = require('../events/evented');

var _evented2 = _interopRequireDefault(_evented);

var _toCamelCase = require('../utils/to-camel-case');

var _toCamelCase2 = _interopRequireDefault(_toCamelCase);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /**
                                                                                                                                                           * @file component.js UI 插件基类
                                                                                                                                                           * @author yuhui06
                                                                                                                                                           * @date 2018/4/8
                                                                                                                                                           * @desc
                                                                                                                                                           *    1) UI 插件需继承此类实现
                                                                                                                                                           *    2) UI 插件通过 Component.register(class, options) 绑定
                                                                                                                                                           *    3) 编写插件时建议引入 DOM 和 Events 模块，食用效果更佳
                                                                                                                                                           */

var Component = function () {
    function Component(player) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, Component);

        this.player = player;
        this.options = options;
        this.el = this.createEl(this.options);

        (0, _evented2['default'])(this, { eventBusKey: this.el });
        this.dispose = this.dispose.bind(this);
        this.player.on('dispose', this.dispose);
    }

    Component.prototype.createEl = function createEl() {
        return DOM.createElement('div', this.options);
    };

    // 1. remove Elements for memory
    // 2. remove Events for memory
    // 3. remove reference for GC


    Component.prototype.dispose = function dispose() {
        this.player.off('dispose', this.dispose);

        if (DOM.isEl(this.el) && this.el.parentNode) {
            this.el.parentNode.removeChild(this.el);
        }
        this.player = null;
        this.options = null;
        this.el = null;
    };

    Component.createElement = function createElement(name) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        // babel 编译后的默认值遇到 null 时会取 null，因为判断的是 !== undefined
        options = options || {};

        var ComponentClass = void 0;
        if (typeof name === 'string') {
            ComponentClass = Component.get((0, _toCamelCase2['default'])(name));
        } else if (name.prototype instanceof Component) {
            ComponentClass = name;
        }

        for (var _len = arguments.length, child = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
            child[_key - 2] = arguments[_key];
        }

        if (ComponentClass) {
            // 这里的 this.player 不是什么黑魔法，它确实无法取到实例中的 this.player
            // 只不过是在调用 Component.createElement 之前，先给 Component.player 赋了值而已
            // 如果你看不懂我在说什么，当我没说
            var instance = new ComponentClass(this.player, options);
            var el = instance.el;

            if (child) {
                DOM.appendContent(el, child);
            }

            return el;
        } else {
            return DOM.createElement.apply(DOM, [name, options].concat(child));
        }
    };

    Component.register = function register(component, options) {
        return _pluginStore2['default'].add(component, options, _pluginTypes2['default'].UI);
    };

    Component.unregister = function unregister(name) {
        _pluginStore2['default']['delete'](name, _pluginTypes2['default'].UI);
    };

    Component.get = function get(name) {
        return _pluginStore2['default'].get(name, _pluginTypes2['default'].UI);
    };

    Component.getAll = function getAll() {
        return _pluginStore2['default'].getAll(_pluginTypes2['default'].UI);
    };

    return Component;
}();

exports['default'] = Component;

},{"../events/evented":8,"../events/events":9,"../utils/dom":22,"../utils/to-camel-case":29,"./plugin-store":18,"./plugin-types":19}],17:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _arrayFind = require('array-find');

var _arrayFind2 = _interopRequireDefault(_arrayFind);

var _pluginStore = require('./plugin-store');

var _pluginStore2 = _interopRequireDefault(_pluginStore);

var _pluginTypes = require('./plugin-types');

var _pluginTypes2 = _interopRequireDefault(_pluginTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /**
                                                                                                                                                           * @file MediaSourceHandler 插件基类，指基于 Media Source Extension 处理视频解码的一类插件
                                                                                                                                                           * @author yuhui06
                                                                                                                                                           * @date 2018/4/2
                                                                                                                                                           * @desc
                                                                                                                                                           *     1) MS 插件通过继承 MediaSourceHandler 实现
                                                                                                                                                           *     2) MS 插件通过 MediaSourceHandler.register(handler, options) 绑定
                                                                                                                                                           *     3) MS 插件需实现 canPlay 静态方法，用于判断插件是否支持特定类型
                                                                                                                                                           */

var MediaSourceHandler = function () {
    function MediaSourceHandler(player, options) {
        _classCallCheck(this, MediaSourceHandler);

        this.player = player;
        this.options = options;
    }

    MediaSourceHandler.prototype.src = function src(_src) {
        this.player.techCall('setSrc', _src);
    };

    MediaSourceHandler.prototype.play = function play() {
        this.player.techCall('play');
    };

    MediaSourceHandler.prototype.dispose = function dispose() {
        this.player = null;
        this.options = null;
    };

    MediaSourceHandler.canPlay = function canPlay(src, type) {
        return false;
    };

    MediaSourceHandler.register = function register(handler, options) {
        return _pluginStore2['default'].add(handler, options, _pluginTypes2['default'].MS);
    };

    MediaSourceHandler.unregister = function unregister(name) {
        _pluginStore2['default']['delete'](name, _pluginTypes2['default'].MS);
    };

    MediaSourceHandler.getAll = function getAll() {
        return _pluginStore2['default'].getAll(_pluginTypes2['default'].MS);
    };

    MediaSourceHandler.select = function select(src, type) {
        var allMSHandlers = MediaSourceHandler.getAll();
        return (0, _arrayFind2['default'])(allMSHandlers, function (value) {
            return value.canPlay(src, type);
        });
    };

    return MediaSourceHandler;
}();

exports['default'] = MediaSourceHandler;

},{"./plugin-store":18,"./plugin-types":19,"array-find":1}],18:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _lodash = require('lodash.values');

var _lodash2 = _interopRequireDefault(_lodash);

var _component = require('./component');

var _component2 = _interopRequireDefault(_component);

var _mediaSourceHandler = require('./media-source-handler');

var _mediaSourceHandler2 = _interopRequireDefault(_mediaSourceHandler);

var _plugin = require('./plugin');

var _plugin2 = _interopRequireDefault(_plugin);

var _pluginTypes = require('./plugin-types');

var _pluginTypes2 = _interopRequireDefault(_pluginTypes);

var _guid = require('../utils/guid');

var _toCamelCase = require('../utils/to-camel-case');

var _toCamelCase2 = _interopRequireDefault(_toCamelCase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var UI = _pluginTypes2['default'].UI,
    MS = _pluginTypes2['default'].MS,
    OTHERS = _pluginTypes2['default'].OTHERS; /**
                                               * @file plugin-store.js 用于存取插件
                                               * @author yuhui06
                                               * @date 2018/4/8
                                               */

function getInitialStore() {
    var _ref;

    return _ref = {}, _ref[UI] = {}, _ref[MS] = {}, _ref[OTHERS] = {}, _ref;
}

exports['default'] = {
    store: getInitialStore(),
    validate: function validate(plugin, type) {
        switch (type) {
            case UI:
                // return Component.isPrototypeOf(plugin);
                return plugin && plugin.prototype instanceof _component2['default'];
            case MS:
                // return MediaSourceHandler.isPrototypeOf(plugin);
                return plugin && plugin.prototype instanceof _mediaSourceHandler2['default'];
            case OTHERS:
                // return Plugin.isPrototypeOf(plugin);
                return plugin && plugin.prototype instanceof _plugin2['default'];
            default:
                return false;
        }
    },
    has: function has(name, type) {
        return this.store[type] && this.store[type][name];
    },
    add: function add(plugin) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var type = arguments[2];

        if (this.validate(plugin, type)) {
            var name = options.name || (0, _toCamelCase2['default'])(plugin.name) || 'plugin_' + (0, _guid.newGUID)();
            plugin._displayName = name;

            if (!this.has(name, type)) {
                this.store[type][name] = plugin;
            }

            return true;
        } else {
            return false;
        }
    },
    'delete': function _delete(name, type) {
        if (this.has(name, type)) {
            delete this.store[type][name];
        }
    },
    clear: function clear() {
        this.store = getInitialStore();
    },
    get: function get(name, type) {
        if (this.has(name, type)) {
            return this.store[type][name];
        }
    },
    getAll: function getAll(type) {
        switch (type) {
            case UI:
                return (0, _lodash2['default'])(this.store[UI]);
            case MS:
                return (0, _lodash2['default'])(this.store[MS]);
            case OTHERS:
                return (0, _lodash2['default'])(this.store[OTHERS]);
            default:
                var allPlugins = [];
                for (var _type in this.store) {
                    if (this.store.hasOwnProperty(_type)) {
                        allPlugins.concat((0, _lodash2['default'])(this.store[_type]));
                    }
                }
                return allPlugins;
        }
    }
};

},{"../utils/guid":24,"../utils/to-camel-case":29,"./component":16,"./media-source-handler":17,"./plugin":20,"./plugin-types":19,"lodash.values":6}],19:[function(require,module,exports){
'use strict';

exports.__esModule = true;
/**
 * @file plugin-types 定义插件类型
 * @author yuhui06
 * @date 2018/4/8
 */

exports['default'] = {
  UI: 'UI',
  MS: 'MS',
  OTHERS: 'plugin'
};

},{}],20:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _pluginStore = require('./plugin-store');

var _pluginStore2 = _interopRequireDefault(_pluginStore);

var _pluginTypes = require('./plugin-types');

var _pluginTypes2 = _interopRequireDefault(_pluginTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /**
                                                                                                                                                           * @file 普通插件基类
                                                                                                                                                           * @author yuhui06
                                                                                                                                                           * @date 2018/4/8
                                                                                                                                                           * @desc
                                                                                                                                                           *    1) 插件需继承此类实现
                                                                                                                                                           *    2) 插件通过 Plugin.register(class, options) 绑定
                                                                                                                                                           */

var Plugin = function () {
    function Plugin(player) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, Plugin);

        this.player = player;
        this.options = options;

        this.dispose = this.dispose.bind(this);
        this.player.on('dispose', this.dispose);
    }

    Plugin.prototype.dispose = function dispose() {
        this.player = null;
        this.options = null;
    };

    Plugin.register = function register(plugin, options) {
        _pluginStore2['default'].add(plugin, options, _pluginTypes2['default'].OTHERS);
    };

    Plugin.unregister = function unregister(name) {
        _pluginStore2['default']['delete'](name, _pluginTypes2['default'].OTHERS);
    };

    Plugin.get = function get(name) {
        _pluginStore2['default'].get(name, _pluginTypes2['default'].OTHERS);
    };

    Plugin.getAll = function getAll() {
        return _pluginStore2['default'].getAll(_pluginTypes2['default'].OTHERS);
    };

    return Plugin;
}();

exports['default'] = Plugin;

},{"./plugin-store":18,"./plugin-types":19}],21:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports['default'] = computedStyle;

var _window = require('global/window');

var _window2 = _interopRequireDefault(_window);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

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

    if (typeof _window2['default'].getComputedStyle === 'function') {
        var styleCollection = _window2['default'].getComputedStyle(el);
        return styleCollection ? styleCollection[prop] : '';
    }

    return el.currentStyle && el.currentStyle[prop] || '';
} /**
   * @file 获取元素指定样式的值
   * @author yuhui06@baidu.com
   * @date 2017/11/3
   */

},{"global/window":3}],22:[function(require,module,exports){
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

var _window = require('global/window');

var _window2 = _interopRequireDefault(_window);

var _document = require('global/document');

var _document2 = _interopRequireDefault(_document);

var _obj = require('./obj');

var _computedStyle = require('./computed-style');

var _computedStyle2 = _interopRequireDefault(_computedStyle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * 检测一个字符串是否包含任何非空格的字符
 *
 * @inner
 *
 * @param {string} str 待检查的字符串
 * @return {boolean} 是否包含非空格的字符
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
/**
 * @file dom 相关 api
 * @author yuhui06@baidu.com
 * @date 2017/11/2
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
    return typeof _document2['default'].createElement !== 'undefined';
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
            return _document2['default'][method](null);
        }
        if (isNonBlankString(context)) {
            context = _document2['default'].querySelector(context);
        }

        var ctx = isEl(context) ? context : _document2['default'];

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

    var el = _document2['default'].createElement(tagName);

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
 * @param {Object=} props 属性
 * @param {...Element|string} child 元素的子元素，参数个数不限。可以没有，也可以有多个
 * @return {Element} el 创建的元素
 */
function createElement() {
    var tagName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'div';
    var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var el = _document2['default'].createElement(tagName);

    if (props == null) {
        props = {};
    }
    Object.keys(props).forEach(function (propName) {
        setAttribute(el, propName === 'className' ? 'class' : propName, props[propName]);
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
            return _document2['default'].createTextNode(value);
        }
    }).filter(function (value) {
        return !!value;
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
    _document2['default'].body.focus();
    _document2['default'].onselectstart = function () {
        return false;
    };
}

/**
 * 关闭对文本选中功能的阻塞
 */
function unblockTextSelection() {
    _document2['default'].onselectstart = function () {
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

    var docEl = _document2['default'].documentElement;
    var body = _document2['default'].body;

    var clientLeft = docEl.clientLeft || body.clientLeft || 0;
    var scrollLeft = _window2['default'].pageXOffset || body.scrollLeft;
    var left = box.left + scrollLeft - clientLeft;

    var clientTop = docEl.clientLeft || body.clientLeft || 0;
    var scrollTop = _window2['default'].pageYOffset || body.scrollTop;
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

},{"./computed-style":21,"./obj":28,"global/document":2,"global/window":3,"lodash.includes":5}],23:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _document = require('global/document');

var _document2 = _interopRequireDefault(_document);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  touch: 'ontouchend' in _document2['default']
}; /**
    * @file 检测浏览器是否支持某些特性
    * @author yuhui06
    * @date 2018/3/8
    */

},{"global/document":2}],24:[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports.newGUID = newGUID;
/**
 * @file guid 唯一标识
 * @author yuhui06@baidu.com
 * @date 2017/11/3
 */

var guid = 1;

/**
 * 获取一个自增且唯一的 ID
 *
 * @return {number} 新的 ID
 */
function newGUID() {
  return guid++;
}

},{}],25:[function(require,module,exports){
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

},{}],26:[function(require,module,exports){
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

},{}],27:[function(require,module,exports){
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

},{"./mime-type-map":26,"./obj":28}],28:[function(require,module,exports){
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

},{}],29:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports['default'] = toCamelCase;
/**
 * @file 将命名风格改为驼峰式
 * @author yuhui06
 * @date 2018/4/16
 */

// @notice 由于目前不存在下划线等连接的单词，所以单纯将首字母改成小写即可
function toCamelCase(str) {
    if (typeof str !== 'string') {
        return str;
    }

    return str.charAt(0).toLowerCase() + str.slice(1);
}

},{}],30:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports['default'] = toTitleCase;
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

  return str.charAt(0).toUpperCase() + str.slice(1);
}

},{}],31:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _arrayFind = require('array-find');

var _arrayFind2 = _interopRequireDefault(_arrayFind);

var _lodash = require('lodash.includes');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.values');

var _lodash4 = _interopRequireDefault(_lodash3);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _computedStyle = require('./computed-style');

var _computedStyle2 = _interopRequireDefault(_computedStyle);

var _featureDetector = require('./feature-detector');

var _featureDetector2 = _interopRequireDefault(_featureDetector);

var _guid = require('./guid');

var guid = _interopRequireWildcard(_guid);

var _mimeTypeMap = require('./mime-type-map');

var _mimeTypeMap2 = _interopRequireDefault(_mimeTypeMap);

var _obj = require('./obj');

var obj = _interopRequireWildcard(_obj);

var _toCamelCase = require('./to-camel-case');

var _toCamelCase2 = _interopRequireDefault(_toCamelCase);

var _toTitleCase = require('./to-title-case');

var _toTitleCase2 = _interopRequireDefault(_toTitleCase);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
    find: _arrayFind2['default'],
    includes: _lodash2['default'],
    values: _lodash4['default'],
    assign: _objectAssign2['default'],
    computedStyle: _computedStyle2['default'],
    featureDetector: _featureDetector2['default'],
    guid: guid,
    mimeTypeMap: _mimeTypeMap2['default'],
    obj: obj,
    toCamelCase: _toCamelCase2['default'],
    toTitleCase: _toTitleCase2['default']
}; /**
    * @file 整合 utils 方法，对外输出
    * @author yuhui06
    * @date 2018/5/6
    */

},{"./computed-style":21,"./feature-detector":23,"./guid":24,"./mime-type-map":26,"./obj":28,"./to-camel-case":29,"./to-title-case":30,"array-find":1,"lodash.includes":5,"lodash.values":6,"object-assign":7}]},{},[14])(14)
});
