(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Bloodhound = factory());
}(this, function () { 'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  var global$1 = typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};

  /** Used for built-in method references. */
  var objectProto = Object.prototype;
  /** Used to check objects for own properties. */

  var hasOwnProperty = objectProto.hasOwnProperty;
  /**
   * The base implementation of `_.has` without support for deep paths.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {Array|string} key The key to check.
   * @returns {boolean} Returns `true` if `key` exists, else `false`.
   */

  function baseHas(object, key) {
    return object != null && hasOwnProperty.call(object, key);
  }

  var _baseHas = baseHas;

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
  var isArray_1 = isArray;

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  /** Detect free variable `global` from Node.js. */

  var freeGlobal = _typeof(commonjsGlobal) == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
  var _freeGlobal = freeGlobal;

  /** Detect free variable `self`. */

  var freeSelf = (typeof self === "undefined" ? "undefined" : _typeof(self)) == 'object' && self && self.Object === Object && self;
  /** Used as a reference to the global object. */

  var root = _freeGlobal || freeSelf || Function('return this')();
  var _root = root;

  /** Built-in value references. */

  var _Symbol2 = _root.Symbol;
  var _Symbol = _Symbol2;

  /** Used for built-in method references. */

  var objectProto$1 = Object.prototype;
  /** Used to check objects for own properties. */

  var hasOwnProperty$1 = objectProto$1.hasOwnProperty;
  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */

  var nativeObjectToString = objectProto$1.toString;
  /** Built-in value references. */

  var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;
  /**
   * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the raw `toStringTag`.
   */

  function getRawTag(value) {
    var isOwn = hasOwnProperty$1.call(value, symToStringTag),
        tag = value[symToStringTag];

    try {
      value[symToStringTag] = undefined;
      var unmasked = true;
    } catch (e) {}

    var result = nativeObjectToString.call(value);

    if (unmasked) {
      if (isOwn) {
        value[symToStringTag] = tag;
      } else {
        delete value[symToStringTag];
      }
    }

    return result;
  }

  var _getRawTag = getRawTag;

  /** Used for built-in method references. */
  var objectProto$2 = Object.prototype;
  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */

  var nativeObjectToString$1 = objectProto$2.toString;
  /**
   * Converts `value` to a string using `Object.prototype.toString`.
   *
   * @private
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   */

  function objectToString(value) {
    return nativeObjectToString$1.call(value);
  }

  var _objectToString = objectToString;

  /** `Object#toString` result references. */

  var nullTag = '[object Null]',
      undefinedTag = '[object Undefined]';
  /** Built-in value references. */

  var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;
  /**
   * The base implementation of `getTag` without fallbacks for buggy environments.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */

  function baseGetTag(value) {
    if (value == null) {
      return value === undefined ? undefinedTag : nullTag;
    }

    return symToStringTag$1 && symToStringTag$1 in Object(value) ? _getRawTag(value) : _objectToString(value);
  }

  var _baseGetTag = baseGetTag;

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
    return value != null && _typeof(value) == 'object';
  }

  var isObjectLike_1 = isObjectLike;

  /** `Object#toString` result references. */

  var symbolTag = '[object Symbol]';
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
    return _typeof(value) == 'symbol' || isObjectLike_1(value) && _baseGetTag(value) == symbolTag;
  }

  var isSymbol_1 = isSymbol;

  /** Used to match property names within property paths. */

  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
      reIsPlainProp = /^\w*$/;
  /**
   * Checks if `value` is a property name and not a property path.
   *
   * @private
   * @param {*} value The value to check.
   * @param {Object} [object] The object to query keys on.
   * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
   */

  function isKey(value, object) {
    if (isArray_1(value)) {
      return false;
    }

    var type = _typeof(value);

    if (type == 'number' || type == 'symbol' || type == 'boolean' || value == null || isSymbol_1(value)) {
      return true;
    }

    return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
  }

  var _isKey = isKey;

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
    var type = _typeof(value);

    return value != null && (type == 'object' || type == 'function');
  }

  var isObject_1 = isObject;

  /** `Object#toString` result references. */

  var asyncTag = '[object AsyncFunction]',
      funcTag = '[object Function]',
      genTag = '[object GeneratorFunction]',
      proxyTag = '[object Proxy]';
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
    if (!isObject_1(value)) {
      return false;
    } // The use of `Object#toString` avoids issues with the `typeof` operator
    // in Safari 9 which returns 'object' for typed arrays and other constructors.


    var tag = _baseGetTag(value);
    return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
  }

  var isFunction_1 = isFunction;

  /** Used to detect overreaching core-js shims. */

  var coreJsData = _root['__core-js_shared__'];
  var _coreJsData = coreJsData;

  /** Used to detect methods masquerading as native. */

  var maskSrcKey = function () {
    var uid = /[^.]+$/.exec(_coreJsData && _coreJsData.keys && _coreJsData.keys.IE_PROTO || '');
    return uid ? 'Symbol(src)_1.' + uid : '';
  }();
  /**
   * Checks if `func` has its source masked.
   *
   * @private
   * @param {Function} func The function to check.
   * @returns {boolean} Returns `true` if `func` is masked, else `false`.
   */


  function isMasked(func) {
    return !!maskSrcKey && maskSrcKey in func;
  }

  var _isMasked = isMasked;

  /** Used for built-in method references. */
  var funcProto = Function.prototype;
  /** Used to resolve the decompiled source of functions. */

  var funcToString = funcProto.toString;
  /**
   * Converts `func` to its source code.
   *
   * @private
   * @param {Function} func The function to convert.
   * @returns {string} Returns the source code.
   */

  function toSource(func) {
    if (func != null) {
      try {
        return funcToString.call(func);
      } catch (e) {}

      try {
        return func + '';
      } catch (e) {}
    }

    return '';
  }

  var _toSource = toSource;

  /**
   * Used to match `RegExp`
   * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
   */

  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
  /** Used to detect host constructors (Safari). */

  var reIsHostCtor = /^\[object .+?Constructor\]$/;
  /** Used for built-in method references. */

  var funcProto$1 = Function.prototype,
      objectProto$3 = Object.prototype;
  /** Used to resolve the decompiled source of functions. */

  var funcToString$1 = funcProto$1.toString;
  /** Used to check objects for own properties. */

  var hasOwnProperty$2 = objectProto$3.hasOwnProperty;
  /** Used to detect if a method is native. */

  var reIsNative = RegExp('^' + funcToString$1.call(hasOwnProperty$2).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
  /**
   * The base implementation of `_.isNative` without bad shim checks.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a native function,
   *  else `false`.
   */

  function baseIsNative(value) {
    if (!isObject_1(value) || _isMasked(value)) {
      return false;
    }

    var pattern = isFunction_1(value) ? reIsNative : reIsHostCtor;
    return pattern.test(_toSource(value));
  }

  var _baseIsNative = baseIsNative;

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

  var _getValue = getValue;

  /**
   * Gets the native function at `key` of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {string} key The key of the method to get.
   * @returns {*} Returns the function if it's native, else `undefined`.
   */

  function getNative(object, key) {
    var value = _getValue(object, key);
    return _baseIsNative(value) ? value : undefined;
  }

  var _getNative = getNative;

  /* Built-in method references that are verified to be native. */

  var nativeCreate = _getNative(Object, 'create');
  var _nativeCreate = nativeCreate;

  /**
   * Removes all key-value entries from the hash.
   *
   * @private
   * @name clear
   * @memberOf Hash
   */

  function hashClear() {
    this.__data__ = _nativeCreate ? _nativeCreate(null) : {};
    this.size = 0;
  }

  var _hashClear = hashClear;

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
    var result = this.has(key) && delete this.__data__[key];
    this.size -= result ? 1 : 0;
    return result;
  }

  var _hashDelete = hashDelete;

  /** Used to stand-in for `undefined` hash values. */

  var HASH_UNDEFINED = '__lodash_hash_undefined__';
  /** Used for built-in method references. */

  var objectProto$4 = Object.prototype;
  /** Used to check objects for own properties. */

  var hasOwnProperty$3 = objectProto$4.hasOwnProperty;
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

    if (_nativeCreate) {
      var result = data[key];
      return result === HASH_UNDEFINED ? undefined : result;
    }

    return hasOwnProperty$3.call(data, key) ? data[key] : undefined;
  }

  var _hashGet = hashGet;

  /** Used for built-in method references. */

  var objectProto$5 = Object.prototype;
  /** Used to check objects for own properties. */

  var hasOwnProperty$4 = objectProto$5.hasOwnProperty;
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
    return _nativeCreate ? data[key] !== undefined : hasOwnProperty$4.call(data, key);
  }

  var _hashHas = hashHas;

  /** Used to stand-in for `undefined` hash values. */

  var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';
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
    this.size += this.has(key) ? 0 : 1;
    data[key] = _nativeCreate && value === undefined ? HASH_UNDEFINED$1 : value;
    return this;
  }

  var _hashSet = hashSet;

  /**
   * Creates a hash object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */

  function Hash(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;
    this.clear();

    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  } // Add methods to `Hash`.


  Hash.prototype.clear = _hashClear;
  Hash.prototype['delete'] = _hashDelete;
  Hash.prototype.get = _hashGet;
  Hash.prototype.has = _hashHas;
  Hash.prototype.set = _hashSet;
  var _Hash = Hash;

  /**
   * Removes all key-value entries from the list cache.
   *
   * @private
   * @name clear
   * @memberOf ListCache
   */
  function listCacheClear() {
    this.__data__ = [];
    this.size = 0;
  }

  var _listCacheClear = listCacheClear;

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
    return value === other || value !== value && other !== other;
  }

  var eq_1 = eq;

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
      if (eq_1(array[length][0], key)) {
        return length;
      }
    }

    return -1;
  }

  var _assocIndexOf = assocIndexOf;

  /** Used for built-in method references. */

  var arrayProto = Array.prototype;
  /** Built-in value references. */

  var splice = arrayProto.splice;
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
        index = _assocIndexOf(data, key);

    if (index < 0) {
      return false;
    }

    var lastIndex = data.length - 1;

    if (index == lastIndex) {
      data.pop();
    } else {
      splice.call(data, index, 1);
    }

    --this.size;
    return true;
  }

  var _listCacheDelete = listCacheDelete;

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
        index = _assocIndexOf(data, key);
    return index < 0 ? undefined : data[index][1];
  }

  var _listCacheGet = listCacheGet;

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
    return _assocIndexOf(this.__data__, key) > -1;
  }

  var _listCacheHas = listCacheHas;

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
        index = _assocIndexOf(data, key);

    if (index < 0) {
      ++this.size;
      data.push([key, value]);
    } else {
      data[index][1] = value;
    }

    return this;
  }

  var _listCacheSet = listCacheSet;

  /**
   * Creates an list cache object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */

  function ListCache(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;
    this.clear();

    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  } // Add methods to `ListCache`.


  ListCache.prototype.clear = _listCacheClear;
  ListCache.prototype['delete'] = _listCacheDelete;
  ListCache.prototype.get = _listCacheGet;
  ListCache.prototype.has = _listCacheHas;
  ListCache.prototype.set = _listCacheSet;
  var _ListCache = ListCache;

  /* Built-in method references that are verified to be native. */

  var Map = _getNative(_root, 'Map');
  var _Map = Map;

  /**
   * Removes all key-value entries from the map.
   *
   * @private
   * @name clear
   * @memberOf MapCache
   */

  function mapCacheClear() {
    this.size = 0;
    this.__data__ = {
      'hash': new _Hash(),
      'map': new (_Map || _ListCache)(),
      'string': new _Hash()
    };
  }

  var _mapCacheClear = mapCacheClear;

  /**
   * Checks if `value` is suitable for use as unique object key.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
   */
  function isKeyable(value) {
    var type = _typeof(value);

    return type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean' ? value !== '__proto__' : value === null;
  }

  var _isKeyable = isKeyable;

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
    return _isKeyable(key) ? data[typeof key == 'string' ? 'string' : 'hash'] : data.map;
  }

  var _getMapData = getMapData;

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
    var result = _getMapData(this, key)['delete'](key);
    this.size -= result ? 1 : 0;
    return result;
  }

  var _mapCacheDelete = mapCacheDelete;

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
    return _getMapData(this, key).get(key);
  }

  var _mapCacheGet = mapCacheGet;

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
    return _getMapData(this, key).has(key);
  }

  var _mapCacheHas = mapCacheHas;

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
    var data = _getMapData(this, key),
        size = data.size;
    data.set(key, value);
    this.size += data.size == size ? 0 : 1;
    return this;
  }

  var _mapCacheSet = mapCacheSet;

  /**
   * Creates a map cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */

  function MapCache(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;
    this.clear();

    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  } // Add methods to `MapCache`.


  MapCache.prototype.clear = _mapCacheClear;
  MapCache.prototype['delete'] = _mapCacheDelete;
  MapCache.prototype.get = _mapCacheGet;
  MapCache.prototype.has = _mapCacheHas;
  MapCache.prototype.set = _mapCacheSet;
  var _MapCache = MapCache;

  /** Error message constants. */

  var FUNC_ERROR_TEXT = 'Expected a function';
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
   * method interface of `clear`, `delete`, `get`, `has`, and `set`.
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
    if (typeof func != 'function' || resolver != null && typeof resolver != 'function') {
      throw new TypeError(FUNC_ERROR_TEXT);
    }

    var memoized = function memoized() {
      var args = arguments,
          key = resolver ? resolver.apply(this, args) : args[0],
          cache = memoized.cache;

      if (cache.has(key)) {
        return cache.get(key);
      }

      var result = func.apply(this, args);
      memoized.cache = cache.set(key, result) || cache;
      return result;
    };

    memoized.cache = new (memoize.Cache || _MapCache)();
    return memoized;
  } // Expose `MapCache`.


  memoize.Cache = _MapCache;
  var memoize_1 = memoize;

  /** Used as the maximum memoize cache size. */

  var MAX_MEMOIZE_SIZE = 500;
  /**
   * A specialized version of `_.memoize` which clears the memoized function's
   * cache when it exceeds `MAX_MEMOIZE_SIZE`.
   *
   * @private
   * @param {Function} func The function to have its output memoized.
   * @returns {Function} Returns the new memoized function.
   */

  function memoizeCapped(func) {
    var result = memoize_1(func, function (key) {
      if (cache.size === MAX_MEMOIZE_SIZE) {
        cache.clear();
      }

      return key;
    });
    var cache = result.cache;
    return result;
  }

  var _memoizeCapped = memoizeCapped;

  /** Used to match property names within property paths. */

  var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
  /** Used to match backslashes in property paths. */

  var reEscapeChar = /\\(\\)?/g;
  /**
   * Converts `string` to a property path array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the property path array.
   */

  var stringToPath = _memoizeCapped(function (string) {
    var result = [];

    if (string.charCodeAt(0) === 46
    /* . */
    ) {
        result.push('');
      }

    string.replace(rePropName, function (match, number, quote, subString) {
      result.push(quote ? subString.replace(reEscapeChar, '$1') : number || match);
    });
    return result;
  });
  var _stringToPath = stringToPath;

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
        length = array == null ? 0 : array.length,
        result = Array(length);

    while (++index < length) {
      result[index] = iteratee(array[index], index, array);
    }

    return result;
  }

  var _arrayMap = arrayMap;

  /** Used as references for various `Number` constants. */

  var INFINITY = 1 / 0;
  /** Used to convert symbols to primitives and strings. */

  var symbolProto = _Symbol ? _Symbol.prototype : undefined,
      symbolToString = symbolProto ? symbolProto.toString : undefined;
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

    if (isArray_1(value)) {
      // Recursively convert values (susceptible to call stack limits).
      return _arrayMap(value, baseToString) + '';
    }

    if (isSymbol_1(value)) {
      return symbolToString ? symbolToString.call(value) : '';
    }

    var result = value + '';
    return result == '0' && 1 / value == -INFINITY ? '-0' : result;
  }

  var _baseToString = baseToString;

  /**
   * Converts `value` to a string. An empty string is returned for `null`
   * and `undefined` values. The sign of `-0` is preserved.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
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
    return value == null ? '' : _baseToString(value);
  }

  var toString_1 = toString;

  /**
   * Casts `value` to a path array if it's not one.
   *
   * @private
   * @param {*} value The value to inspect.
   * @param {Object} [object] The object to query keys on.
   * @returns {Array} Returns the cast property path array.
   */

  function castPath(value, object) {
    if (isArray_1(value)) {
      return value;
    }

    return _isKey(value, object) ? [value] : _stringToPath(toString_1(value));
  }

  var _castPath = castPath;

  /** `Object#toString` result references. */

  var argsTag = '[object Arguments]';
  /**
   * The base implementation of `_.isArguments`.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an `arguments` object,
   */

  function baseIsArguments(value) {
    return isObjectLike_1(value) && _baseGetTag(value) == argsTag;
  }

  var _baseIsArguments = baseIsArguments;

  /** Used for built-in method references. */

  var objectProto$6 = Object.prototype;
  /** Used to check objects for own properties. */

  var hasOwnProperty$5 = objectProto$6.hasOwnProperty;
  /** Built-in value references. */

  var propertyIsEnumerable = objectProto$6.propertyIsEnumerable;
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

  var isArguments = _baseIsArguments(function () {
    return arguments;
  }()) ? _baseIsArguments : function (value) {
    return isObjectLike_1(value) && hasOwnProperty$5.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
  };
  var isArguments_1 = isArguments;

  /** Used as references for various `Number` constants. */
  var MAX_SAFE_INTEGER = 9007199254740991;
  /** Used to detect unsigned integer values. */

  var reIsUint = /^(?:0|[1-9]\d*)$/;
  /**
   * Checks if `value` is a valid array-like index.
   *
   * @private
   * @param {*} value The value to check.
   * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
   * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
   */

  function isIndex(value, length) {
    var type = _typeof(value);

    length = length == null ? MAX_SAFE_INTEGER : length;
    return !!length && (type == 'number' || type != 'symbol' && reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
  }

  var _isIndex = isIndex;

  /** Used as references for various `Number` constants. */
  var MAX_SAFE_INTEGER$1 = 9007199254740991;
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
    return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$1;
  }

  var isLength_1 = isLength;

  /** Used as references for various `Number` constants. */

  var INFINITY$1 = 1 / 0;
  /**
   * Converts `value` to a string key if it's not a string or symbol.
   *
   * @private
   * @param {*} value The value to inspect.
   * @returns {string|symbol} Returns the key.
   */

  function toKey(value) {
    if (typeof value == 'string' || isSymbol_1(value)) {
      return value;
    }

    var result = value + '';
    return result == '0' && 1 / value == -INFINITY$1 ? '-0' : result;
  }

  var _toKey = toKey;

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
    path = _castPath(path, object);
    var index = -1,
        length = path.length,
        result = false;

    while (++index < length) {
      var key = _toKey(path[index]);

      if (!(result = object != null && hasFunc(object, key))) {
        break;
      }

      object = object[key];
    }

    if (result || ++index != length) {
      return result;
    }

    length = object == null ? 0 : object.length;
    return !!length && isLength_1(length) && _isIndex(key, length) && (isArray_1(object) || isArguments_1(object));
  }

  var _hasPath = hasPath;

  /**
   * Checks if `path` is a direct property of `object`.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Object
   * @param {Object} object The object to query.
   * @param {Array|string} path The path to check.
   * @returns {boolean} Returns `true` if `path` exists, else `false`.
   * @example
   *
   * var object = { 'a': { 'b': 2 } };
   * var other = _.create({ 'a': _.create({ 'b': 2 }) });
   *
   * _.has(object, 'a');
   * // => true
   *
   * _.has(object, 'a.b');
   * // => true
   *
   * _.has(object, ['a', 'b']);
   * // => true
   *
   * _.has(other, 'a');
   * // => false
   */

  function has(object, path) {
    return object != null && _hasPath(object, path, _baseHas);
  }

  var has_1 = has;

  /**
   * This method returns `undefined`.
   *
   * @static
   * @memberOf _
   * @since 2.3.0
   * @category Util
   * @example
   *
   * _.times(2, _.noop);
   * // => [undefined, undefined]
   */
  function noop() {// No operation performed.
  }

  var noop_1 = noop;

  /** Used for built-in method references. */
  var objectProto$7 = Object.prototype;
  /**
   * Checks if `value` is likely a prototype object.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
   */

  function isPrototype(value) {
    var Ctor = value && value.constructor,
        proto = typeof Ctor == 'function' && Ctor.prototype || objectProto$7;
    return value === proto;
  }

  var _isPrototype = isPrototype;

  /**
   * Creates a unary function that invokes `func` with its argument transformed.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {Function} transform The argument transform.
   * @returns {Function} Returns the new function.
   */
  function overArg(func, transform) {
    return function (arg) {
      return func(transform(arg));
    };
  }

  var _overArg = overArg;

  /* Built-in method references for those with the same name as other `lodash` methods. */

  var nativeKeys = _overArg(Object.keys, Object);
  var _nativeKeys = nativeKeys;

  /** Used for built-in method references. */

  var objectProto$8 = Object.prototype;
  /** Used to check objects for own properties. */

  var hasOwnProperty$6 = objectProto$8.hasOwnProperty;
  /**
   * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   */

  function baseKeys(object) {
    if (!_isPrototype(object)) {
      return _nativeKeys(object);
    }

    var result = [];

    for (var key in Object(object)) {
      if (hasOwnProperty$6.call(object, key) && key != 'constructor') {
        result.push(key);
      }
    }

    return result;
  }

  var _baseKeys = baseKeys;

  /* Built-in method references that are verified to be native. */

  var DataView = _getNative(_root, 'DataView');
  var _DataView = DataView;

  /* Built-in method references that are verified to be native. */

  var Promise = _getNative(_root, 'Promise');
  var _Promise = Promise;

  /* Built-in method references that are verified to be native. */

  var Set = _getNative(_root, 'Set');
  var _Set = Set;

  /* Built-in method references that are verified to be native. */

  var WeakMap = _getNative(_root, 'WeakMap');
  var _WeakMap = WeakMap;

  /** `Object#toString` result references. */

  var mapTag = '[object Map]',
      objectTag = '[object Object]',
      promiseTag = '[object Promise]',
      setTag = '[object Set]',
      weakMapTag = '[object WeakMap]';
  var dataViewTag = '[object DataView]';
  /** Used to detect maps, sets, and weakmaps. */

  var dataViewCtorString = _toSource(_DataView),
      mapCtorString = _toSource(_Map),
      promiseCtorString = _toSource(_Promise),
      setCtorString = _toSource(_Set),
      weakMapCtorString = _toSource(_WeakMap);
  /**
   * Gets the `toStringTag` of `value`.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */

  var getTag = _baseGetTag; // Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.

  if (_DataView && getTag(new _DataView(new ArrayBuffer(1))) != dataViewTag || _Map && getTag(new _Map()) != mapTag || _Promise && getTag(_Promise.resolve()) != promiseTag || _Set && getTag(new _Set()) != setTag || _WeakMap && getTag(new _WeakMap()) != weakMapTag) {
    getTag = function getTag(value) {
      var result = _baseGetTag(value),
          Ctor = result == objectTag ? value.constructor : undefined,
          ctorString = Ctor ? _toSource(Ctor) : '';

      if (ctorString) {
        switch (ctorString) {
          case dataViewCtorString:
            return dataViewTag;

          case mapCtorString:
            return mapTag;

          case promiseCtorString:
            return promiseTag;

          case setCtorString:
            return setTag;

          case weakMapCtorString:
            return weakMapTag;
        }
      }

      return result;
    };
  }

  var _getTag = getTag;

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
    return value != null && isLength_1(value.length) && !isFunction_1(value);
  }

  var isArrayLike_1 = isArrayLike;

  /** `Object#toString` result references. */

  var stringTag = '[object String]';
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
    return typeof value == 'string' || !isArray_1(value) && isObjectLike_1(value) && _baseGetTag(value) == stringTag;
  }

  var isString_1 = isString;

  /**
   * The base implementation of `_.property` without support for deep paths.
   *
   * @private
   * @param {string} key The key of the property to get.
   * @returns {Function} Returns the new accessor function.
   */
  function baseProperty(key) {
    return function (object) {
      return object == null ? undefined : object[key];
    };
  }

  var _baseProperty = baseProperty;

  /**
   * Gets the size of an ASCII `string`.
   *
   * @private
   * @param {string} string The string inspect.
   * @returns {number} Returns the string size.
   */

  var asciiSize = _baseProperty('length');
  var _asciiSize = asciiSize;

  /** Used to compose unicode character classes. */
  var rsAstralRange = "\\ud800-\\udfff",
      rsComboMarksRange = "\\u0300-\\u036f",
      reComboHalfMarksRange = "\\ufe20-\\ufe2f",
      rsComboSymbolsRange = "\\u20d0-\\u20ff",
      rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
      rsVarRange = "\\ufe0e\\ufe0f";
  /** Used to compose unicode capture groups. */

  var rsZWJ = "\\u200d";
  /** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */

  var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange + rsComboRange + rsVarRange + ']');
  /**
   * Checks if `string` contains Unicode symbols.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {boolean} Returns `true` if a symbol is found, else `false`.
   */

  function hasUnicode(string) {
    return reHasUnicode.test(string);
  }

  var _hasUnicode = hasUnicode;

  /** Used to compose unicode character classes. */
  var rsAstralRange$1 = "\\ud800-\\udfff",
      rsComboMarksRange$1 = "\\u0300-\\u036f",
      reComboHalfMarksRange$1 = "\\ufe20-\\ufe2f",
      rsComboSymbolsRange$1 = "\\u20d0-\\u20ff",
      rsComboRange$1 = rsComboMarksRange$1 + reComboHalfMarksRange$1 + rsComboSymbolsRange$1,
      rsVarRange$1 = "\\ufe0e\\ufe0f";
  /** Used to compose unicode capture groups. */

  var rsAstral = '[' + rsAstralRange$1 + ']',
      rsCombo = '[' + rsComboRange$1 + ']',
      rsFitz = "\\ud83c[\\udffb-\\udfff]",
      rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
      rsNonAstral = '[^' + rsAstralRange$1 + ']',
      rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}",
      rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]",
      rsZWJ$1 = "\\u200d";
  /** Used to compose unicode regexes. */

  var reOptMod = rsModifier + '?',
      rsOptVar = '[' + rsVarRange$1 + ']?',
      rsOptJoin = '(?:' + rsZWJ$1 + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
      rsSeq = rsOptVar + reOptMod + rsOptJoin,
      rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';
  /** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */

  var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');
  /**
   * Gets the size of a Unicode `string`.
   *
   * @private
   * @param {string} string The string inspect.
   * @returns {number} Returns the string size.
   */

  function unicodeSize(string) {
    var result = reUnicode.lastIndex = 0;

    while (reUnicode.test(string)) {
      ++result;
    }

    return result;
  }

  var _unicodeSize = unicodeSize;

  /**
   * Gets the number of symbols in `string`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {number} Returns the string size.
   */

  function stringSize(string) {
    return _hasUnicode(string) ? _unicodeSize(string) : _asciiSize(string);
  }

  var _stringSize = stringSize;

  /** `Object#toString` result references. */

  var mapTag$1 = '[object Map]',
      setTag$1 = '[object Set]';
  /**
   * Gets the size of `collection` by returning its length for array-like
   * values or the number of own enumerable string keyed properties for objects.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Collection
   * @param {Array|Object|string} collection The collection to inspect.
   * @returns {number} Returns the collection size.
   * @example
   *
   * _.size([1, 2, 3]);
   * // => 3
   *
   * _.size({ 'a': 1, 'b': 2 });
   * // => 2
   *
   * _.size('pebbles');
   * // => 7
   */

  function size(collection) {
    if (collection == null) {
      return 0;
    }

    if (isArrayLike_1(collection)) {
      return isString_1(collection) ? _stringSize(collection) : collection.length;
    }

    var tag = _getTag(collection);

    if (tag == mapTag$1 || tag == setTag$1) {
      return collection.size;
    }

    return _baseKeys(collection).length;
  }

  var size_1 = size;

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
      case 0:
        return func.call(thisArg);

      case 1:
        return func.call(thisArg, args[0]);

      case 2:
        return func.call(thisArg, args[0], args[1]);

      case 3:
        return func.call(thisArg, args[0], args[1], args[2]);
    }

    return func.apply(thisArg, args);
  }

  var _apply = apply;

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

  var identity_1 = identity;

  /* Built-in method references for those with the same name as other `lodash` methods. */

  var nativeMax = Math.max;
  /**
   * A specialized version of `baseRest` which transforms the rest array.
   *
   * @private
   * @param {Function} func The function to apply a rest parameter to.
   * @param {number} [start=func.length-1] The start position of the rest parameter.
   * @param {Function} transform The rest array transform.
   * @returns {Function} Returns the new function.
   */

  function overRest(func, start, transform) {
    start = nativeMax(start === undefined ? func.length - 1 : start, 0);
    return function () {
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

      otherArgs[start] = transform(array);
      return _apply(func, this, otherArgs);
    };
  }

  var _overRest = overRest;

  /**
   * Creates a function that returns `value`.
   *
   * @static
   * @memberOf _
   * @since 2.4.0
   * @category Util
   * @param {*} value The value to return from the new function.
   * @returns {Function} Returns the new constant function.
   * @example
   *
   * var objects = _.times(2, _.constant({ 'a': 1 }));
   *
   * console.log(objects);
   * // => [{ 'a': 1 }, { 'a': 1 }]
   *
   * console.log(objects[0] === objects[1]);
   * // => true
   */
  function constant(value) {
    return function () {
      return value;
    };
  }

  var constant_1 = constant;

  var defineProperty = function () {
    try {
      var func = _getNative(Object, 'defineProperty');
      func({}, '', {});
      return func;
    } catch (e) {}
  }();

  var _defineProperty$1 = defineProperty;

  /**
   * The base implementation of `setToString` without support for hot loop shorting.
   *
   * @private
   * @param {Function} func The function to modify.
   * @param {Function} string The `toString` result.
   * @returns {Function} Returns `func`.
   */

  var baseSetToString = !_defineProperty$1 ? identity_1 : function (func, string) {
    return _defineProperty$1(func, 'toString', {
      'configurable': true,
      'enumerable': false,
      'value': constant_1(string),
      'writable': true
    });
  };
  var _baseSetToString = baseSetToString;

  /** Used to detect hot functions by number of calls within a span of milliseconds. */
  var HOT_COUNT = 800,
      HOT_SPAN = 16;
  /* Built-in method references for those with the same name as other `lodash` methods. */

  var nativeNow = Date.now;
  /**
   * Creates a function that'll short out and invoke `identity` instead
   * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
   * milliseconds.
   *
   * @private
   * @param {Function} func The function to restrict.
   * @returns {Function} Returns the new shortable function.
   */

  function shortOut(func) {
    var count = 0,
        lastCalled = 0;
    return function () {
      var stamp = nativeNow(),
          remaining = HOT_SPAN - (stamp - lastCalled);
      lastCalled = stamp;

      if (remaining > 0) {
        if (++count >= HOT_COUNT) {
          return arguments[0];
        }
      } else {
        count = 0;
      }

      return func.apply(undefined, arguments);
    };
  }

  var _shortOut = shortOut;

  /**
   * Sets the `toString` method of `func` to return `string`.
   *
   * @private
   * @param {Function} func The function to modify.
   * @param {Function} string The `toString` result.
   * @returns {Function} Returns `func`.
   */

  var setToString = _shortOut(_baseSetToString);
  var _setToString = setToString;

  /**
   * The base implementation of `_.rest` which doesn't validate or coerce arguments.
   *
   * @private
   * @param {Function} func The function to apply a rest parameter to.
   * @param {number} [start=func.length-1] The start position of the rest parameter.
   * @returns {Function} Returns the new function.
   */

  function baseRest(func, start) {
    return _setToString(_overRest(func, start, identity_1), func + '');
  }

  var _baseRest = baseRest;

  /** Built-in value references. */

  var getPrototype = _overArg(Object.getPrototypeOf, Object);
  var _getPrototype = getPrototype;

  /** `Object#toString` result references. */

  var objectTag$1 = '[object Object]';
  /** Used for built-in method references. */

  var funcProto$2 = Function.prototype,
      objectProto$9 = Object.prototype;
  /** Used to resolve the decompiled source of functions. */

  var funcToString$2 = funcProto$2.toString;
  /** Used to check objects for own properties. */

  var hasOwnProperty$7 = objectProto$9.hasOwnProperty;
  /** Used to infer the `Object` constructor. */

  var objectCtorString = funcToString$2.call(Object);
  /**
   * Checks if `value` is a plain object, that is, an object created by the
   * `Object` constructor or one with a `[[Prototype]]` of `null`.
   *
   * @static
   * @memberOf _
   * @since 0.8.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   * }
   *
   * _.isPlainObject(new Foo);
   * // => false
   *
   * _.isPlainObject([1, 2, 3]);
   * // => false
   *
   * _.isPlainObject({ 'x': 0, 'y': 0 });
   * // => true
   *
   * _.isPlainObject(Object.create(null));
   * // => true
   */

  function isPlainObject(value) {
    if (!isObjectLike_1(value) || _baseGetTag(value) != objectTag$1) {
      return false;
    }

    var proto = _getPrototype(value);

    if (proto === null) {
      return true;
    }

    var Ctor = hasOwnProperty$7.call(proto, 'constructor') && proto.constructor;
    return typeof Ctor == 'function' && Ctor instanceof Ctor && funcToString$2.call(Ctor) == objectCtorString;
  }

  var isPlainObject_1 = isPlainObject;

  /** `Object#toString` result references. */

  var domExcTag = '[object DOMException]',
      errorTag = '[object Error]';
  /**
   * Checks if `value` is an `Error`, `EvalError`, `RangeError`, `ReferenceError`,
   * `SyntaxError`, `TypeError`, or `URIError` object.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an error object, else `false`.
   * @example
   *
   * _.isError(new Error);
   * // => true
   *
   * _.isError(Error);
   * // => false
   */

  function isError(value) {
    if (!isObjectLike_1(value)) {
      return false;
    }

    var tag = _baseGetTag(value);
    return tag == errorTag || tag == domExcTag || typeof value.message == 'string' && typeof value.name == 'string' && !isPlainObject_1(value);
  }

  var isError_1 = isError;

  /**
   * Attempts to invoke `func`, returning either the result or the caught error
   * object. Any additional arguments are provided to `func` when it's invoked.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Util
   * @param {Function} func The function to attempt.
   * @param {...*} [args] The arguments to invoke `func` with.
   * @returns {*} Returns the `func` result or error object.
   * @example
   *
   * // Avoid throwing errors for invalid selectors.
   * var elements = _.attempt(function(selector) {
   *   return document.querySelectorAll(selector);
   * }, '>_>');
   *
   * if (_.isError(elements)) {
   *   elements = [];
   * }
   */

  var attempt = _baseRest(function (func, args) {
    try {
      return _apply(func, undefined, args);
    } catch (e) {
      return isError_1(e) ? e : new Error(e);
    }
  });
  var attempt_1 = attempt;

  /**
   * Appends the elements of `values` to `array`.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {Array} values The values to append.
   * @returns {Array} Returns `array`.
   */
  function arrayPush(array, values) {
    var index = -1,
        length = values.length,
        offset = array.length;

    while (++index < length) {
      array[offset + index] = values[index];
    }

    return array;
  }

  var _arrayPush = arrayPush;

  /** Built-in value references. */

  var spreadableSymbol = _Symbol ? _Symbol.isConcatSpreadable : undefined;
  /**
   * Checks if `value` is a flattenable `arguments` object or array.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
   */

  function isFlattenable(value) {
    return isArray_1(value) || isArguments_1(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
  }

  var _isFlattenable = isFlattenable;

  /**
   * The base implementation of `_.flatten` with support for restricting flattening.
   *
   * @private
   * @param {Array} array The array to flatten.
   * @param {number} depth The maximum recursion depth.
   * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
   * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
   * @param {Array} [result=[]] The initial result value.
   * @returns {Array} Returns the new flattened array.
   */

  function baseFlatten(array, depth, predicate, isStrict, result) {
    var index = -1,
        length = array.length;
    predicate || (predicate = _isFlattenable);
    result || (result = []);

    while (++index < length) {
      var value = array[index];

      if (depth > 0 && predicate(value)) {
        if (depth > 1) {
          // Recursively flatten arrays (susceptible to call stack limits).
          baseFlatten(value, depth - 1, predicate, isStrict, result);
        } else {
          _arrayPush(result, value);
        }
      } else if (!isStrict) {
        result[result.length] = value;
      }
    }

    return result;
  }

  var _baseFlatten = baseFlatten;

  /**
   * Flattens `array` a single level deep.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Array
   * @param {Array} array The array to flatten.
   * @returns {Array} Returns the new flattened array.
   * @example
   *
   * _.flatten([1, [2, [3, [4]], 5]]);
   * // => [1, 2, [3, [4]], 5]
   */

  function flatten(array) {
    var length = array == null ? 0 : array.length;
    return length ? _baseFlatten(array, 1) : [];
  }

  var flatten_1 = flatten;

  /**
   * A specialized version of `_.forEach` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns `array`.
   */
  function arrayEach(array, iteratee) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (iteratee(array[index], index, array) === false) {
        break;
      }
    }

    return array;
  }

  var _arrayEach = arrayEach;

  /**
   * Creates a base function for methods like `_.forIn` and `_.forOwn`.
   *
   * @private
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {Function} Returns the new base function.
   */
  function createBaseFor(fromRight) {
    return function (object, iteratee, keysFunc) {
      var index = -1,
          iterable = Object(object),
          props = keysFunc(object),
          length = props.length;

      while (length--) {
        var key = props[fromRight ? length : ++index];

        if (iteratee(iterable[key], key, iterable) === false) {
          break;
        }
      }

      return object;
    };
  }

  var _createBaseFor = createBaseFor;

  /**
   * The base implementation of `baseForOwn` which iterates over `object`
   * properties returned by `keysFunc` and invokes `iteratee` for each property.
   * Iteratee functions may exit iteration early by explicitly returning `false`.
   *
   * @private
   * @param {Object} object The object to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {Function} keysFunc The function to get the keys of `object`.
   * @returns {Object} Returns `object`.
   */

  var baseFor = _createBaseFor();
  var _baseFor = baseFor;

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

  var _baseTimes = baseTimes;

  /**
   * This method returns `false`.
   *
   * @static
   * @memberOf _
   * @since 4.13.0
   * @category Util
   * @returns {boolean} Returns `false`.
   * @example
   *
   * _.times(2, _.stubFalse);
   * // => [false, false]
   */
  function stubFalse() {
    return false;
  }

  var stubFalse_1 = stubFalse;

  var isBuffer_1 = createCommonjsModule(function (module, exports) {
    /** Detect free variable `exports`. */
    var freeExports =  exports && !exports.nodeType && exports;
    /** Detect free variable `module`. */

    var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;
    /** Detect the popular CommonJS extension `module.exports`. */

    var moduleExports = freeModule && freeModule.exports === freeExports;
    /** Built-in value references. */

    var Buffer = moduleExports ? _root.Buffer : undefined;
    /* Built-in method references for those with the same name as other `lodash` methods. */

    var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;
    /**
     * Checks if `value` is a buffer.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
     * @example
     *
     * _.isBuffer(new Buffer(2));
     * // => true
     *
     * _.isBuffer(new Uint8Array(2));
     * // => false
     */

    var isBuffer = nativeIsBuffer || stubFalse_1;
    module.exports = isBuffer;
  });

  /** `Object#toString` result references. */

  var argsTag$1 = '[object Arguments]',
      arrayTag = '[object Array]',
      boolTag = '[object Boolean]',
      dateTag = '[object Date]',
      errorTag$1 = '[object Error]',
      funcTag$1 = '[object Function]',
      mapTag$2 = '[object Map]',
      numberTag = '[object Number]',
      objectTag$2 = '[object Object]',
      regexpTag = '[object RegExp]',
      setTag$2 = '[object Set]',
      stringTag$1 = '[object String]',
      weakMapTag$1 = '[object WeakMap]';
  var arrayBufferTag = '[object ArrayBuffer]',
      dataViewTag$1 = '[object DataView]',
      float32Tag = '[object Float32Array]',
      float64Tag = '[object Float64Array]',
      int8Tag = '[object Int8Array]',
      int16Tag = '[object Int16Array]',
      int32Tag = '[object Int32Array]',
      uint8Tag = '[object Uint8Array]',
      uint8ClampedTag = '[object Uint8ClampedArray]',
      uint16Tag = '[object Uint16Array]',
      uint32Tag = '[object Uint32Array]';
  /** Used to identify `toStringTag` values of typed arrays. */

  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag$1] = typedArrayTags[dateTag] = typedArrayTags[errorTag$1] = typedArrayTags[funcTag$1] = typedArrayTags[mapTag$2] = typedArrayTags[numberTag] = typedArrayTags[objectTag$2] = typedArrayTags[regexpTag] = typedArrayTags[setTag$2] = typedArrayTags[stringTag$1] = typedArrayTags[weakMapTag$1] = false;
  /**
   * The base implementation of `_.isTypedArray` without Node.js optimizations.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
   */

  function baseIsTypedArray(value) {
    return isObjectLike_1(value) && isLength_1(value.length) && !!typedArrayTags[_baseGetTag(value)];
  }

  var _baseIsTypedArray = baseIsTypedArray;

  /**
   * The base implementation of `_.unary` without support for storing metadata.
   *
   * @private
   * @param {Function} func The function to cap arguments for.
   * @returns {Function} Returns the new capped function.
   */
  function baseUnary(func) {
    return function (value) {
      return func(value);
    };
  }

  var _baseUnary = baseUnary;

  var _nodeUtil = createCommonjsModule(function (module, exports) {
    /** Detect free variable `exports`. */
    var freeExports =  exports && !exports.nodeType && exports;
    /** Detect free variable `module`. */

    var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;
    /** Detect the popular CommonJS extension `module.exports`. */

    var moduleExports = freeModule && freeModule.exports === freeExports;
    /** Detect free variable `process` from Node.js. */

    var freeProcess = moduleExports && _freeGlobal.process;
    /** Used to access faster Node.js helpers. */

    var nodeUtil = function () {
      try {
        // Use `util.types` for Node.js 10+.
        var types = freeModule && freeModule.require && freeModule.require('util').types;

        if (types) {
          return types;
        } // Legacy `process.binding('util')` for Node.js < 10.


        return freeProcess && freeProcess.binding && freeProcess.binding('util');
      } catch (e) {}
    }();

    module.exports = nodeUtil;
  });

  /* Node.js helper references. */

  var nodeIsTypedArray = _nodeUtil && _nodeUtil.isTypedArray;
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

  var isTypedArray = nodeIsTypedArray ? _baseUnary(nodeIsTypedArray) : _baseIsTypedArray;
  var isTypedArray_1 = isTypedArray;

  /** Used for built-in method references. */

  var objectProto$a = Object.prototype;
  /** Used to check objects for own properties. */

  var hasOwnProperty$8 = objectProto$a.hasOwnProperty;
  /**
   * Creates an array of the enumerable property names of the array-like `value`.
   *
   * @private
   * @param {*} value The value to query.
   * @param {boolean} inherited Specify returning inherited property names.
   * @returns {Array} Returns the array of property names.
   */

  function arrayLikeKeys(value, inherited) {
    var isArr = isArray_1(value),
        isArg = !isArr && isArguments_1(value),
        isBuff = !isArr && !isArg && isBuffer_1(value),
        isType = !isArr && !isArg && !isBuff && isTypedArray_1(value),
        skipIndexes = isArr || isArg || isBuff || isType,
        result = skipIndexes ? _baseTimes(value.length, String) : [],
        length = result.length;

    for (var key in value) {
      if ((inherited || hasOwnProperty$8.call(value, key)) && !(skipIndexes && ( // Safari 9 has enumerable `arguments.length` in strict mode.
      key == 'length' || // Node.js 0.10 has enumerable non-index properties on buffers.
      isBuff && (key == 'offset' || key == 'parent') || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset') || // Skip index properties.
      _isIndex(key, length)))) {
        result.push(key);
      }
    }

    return result;
  }

  var _arrayLikeKeys = arrayLikeKeys;

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
    return isArrayLike_1(object) ? _arrayLikeKeys(object) : _baseKeys(object);
  }

  var keys_1 = keys;

  /**
   * The base implementation of `_.forOwn` without support for iteratee shorthands.
   *
   * @private
   * @param {Object} object The object to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Object} Returns `object`.
   */

  function baseForOwn(object, iteratee) {
    return object && _baseFor(object, iteratee, keys_1);
  }

  var _baseForOwn = baseForOwn;

  /**
   * Creates a `baseEach` or `baseEachRight` function.
   *
   * @private
   * @param {Function} eachFunc The function to iterate over a collection.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {Function} Returns the new base function.
   */

  function createBaseEach(eachFunc, fromRight) {
    return function (collection, iteratee) {
      if (collection == null) {
        return collection;
      }

      if (!isArrayLike_1(collection)) {
        return eachFunc(collection, iteratee);
      }

      var length = collection.length,
          index = fromRight ? length : -1,
          iterable = Object(collection);

      while (fromRight ? index-- : ++index < length) {
        if (iteratee(iterable[index], index, iterable) === false) {
          break;
        }
      }

      return collection;
    };
  }

  var _createBaseEach = createBaseEach;

  /**
   * The base implementation of `_.forEach` without support for iteratee shorthands.
   *
   * @private
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array|Object} Returns `collection`.
   */

  var baseEach = _createBaseEach(_baseForOwn);
  var _baseEach = baseEach;

  /**
   * Casts `value` to `identity` if it's not a function.
   *
   * @private
   * @param {*} value The value to inspect.
   * @returns {Function} Returns cast function.
   */

  function castFunction(value) {
    return typeof value == 'function' ? value : identity_1;
  }

  var _castFunction = castFunction;

  /**
   * Iterates over elements of `collection` and invokes `iteratee` for each element.
   * The iteratee is invoked with three arguments: (value, index|key, collection).
   * Iteratee functions may exit iteration early by explicitly returning `false`.
   *
   * **Note:** As with other "Collections" methods, objects with a "length"
   * property are iterated like arrays. To avoid this behavior use `_.forIn`
   * or `_.forOwn` for object iteration.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @alias each
   * @category Collection
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} [iteratee=_.identity] The function invoked per iteration.
   * @returns {Array|Object} Returns `collection`.
   * @see _.forEachRight
   * @example
   *
   * _.forEach([1, 2], function(value) {
   *   console.log(value);
   * });
   * // => Logs `1` then `2`.
   *
   * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
   *   console.log(key);
   * });
   * // => Logs 'a' then 'b' (iteration order is not guaranteed).
   */

  function forEach(collection, iteratee) {
    var func = isArray_1(collection) ? _arrayEach : _baseEach;
    return func(collection, _castFunction(iteratee));
  }

  var forEach_1 = forEach;

  /** `Object#toString` result references. */

  var mapTag$3 = '[object Map]';
  /**
   * The base implementation of `_.isMap` without Node.js optimizations.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a map, else `false`.
   */

  function baseIsMap(value) {
    return isObjectLike_1(value) && _getTag(value) == mapTag$3;
  }

  var _baseIsMap = baseIsMap;

  /* Node.js helper references. */

  var nodeIsMap = _nodeUtil && _nodeUtil.isMap;
  /**
   * Checks if `value` is classified as a `Map` object.
   *
   * @static
   * @memberOf _
   * @since 4.3.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a map, else `false`.
   * @example
   *
   * _.isMap(new Map);
   * // => true
   *
   * _.isMap(new WeakMap);
   * // => false
   */

  var isMap = nodeIsMap ? _baseUnary(nodeIsMap) : _baseIsMap;
  var isMap_1 = isMap;

  /** `Object#toString` result references. */

  var mapTag$4 = '[object Map]',
      setTag$3 = '[object Set]';
  /** Used for built-in method references. */

  var objectProto$b = Object.prototype;
  /** Used to check objects for own properties. */

  var hasOwnProperty$9 = objectProto$b.hasOwnProperty;
  /**
   * Checks if `value` is an empty object, collection, map, or set.
   *
   * Objects are considered empty if they have no own enumerable string keyed
   * properties.
   *
   * Array-like values such as `arguments` objects, arrays, buffers, strings, or
   * jQuery-like collections are considered empty if they have a `length` of `0`.
   * Similarly, maps and sets are considered empty if they have a `size` of `0`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is empty, else `false`.
   * @example
   *
   * _.isEmpty(null);
   * // => true
   *
   * _.isEmpty(true);
   * // => true
   *
   * _.isEmpty(1);
   * // => true
   *
   * _.isEmpty([1, 2, 3]);
   * // => false
   *
   * _.isEmpty({ 'a': 1 });
   * // => false
   */

  function isEmpty(value) {
    if (value == null) {
      return true;
    }

    if (isArrayLike_1(value) && (isArray_1(value) || typeof value == 'string' || typeof value.splice == 'function' || isBuffer_1(value) || isTypedArray_1(value) || isArguments_1(value))) {
      return !value.length;
    }

    var tag = _getTag(value);

    if (tag == mapTag$4 || tag == setTag$3) {
      return !value.size;
    }

    if (_isPrototype(value)) {
      return !_baseKeys(value).length;
    }

    for (var key in value) {
      if (hasOwnProperty$9.call(value, key)) {
        return false;
      }
    }

    return true;
  }

  var isEmpty_1 = isEmpty;

  /**
   * Copies the values of `source` to `array`.
   *
   * @private
   * @param {Array} source The array to copy values from.
   * @param {Array} [array=[]] The array to copy values to.
   * @returns {Array} Returns `array`.
   */
  function copyArray(source, array) {
    var index = -1,
        length = source.length;
    array || (array = Array(length));

    while (++index < length) {
      array[index] = source[index];
    }

    return array;
  }

  var _copyArray = copyArray;

  /**
   * Converts `iterator` to an array.
   *
   * @private
   * @param {Object} iterator The iterator to convert.
   * @returns {Array} Returns the converted array.
   */
  function iteratorToArray(iterator) {
    var data,
        result = [];

    while (!(data = iterator.next()).done) {
      result.push(data.value);
    }

    return result;
  }

  var _iteratorToArray = iteratorToArray;

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
    map.forEach(function (value, key) {
      result[++index] = [key, value];
    });
    return result;
  }

  var _mapToArray = mapToArray;

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
    set.forEach(function (value) {
      result[++index] = value;
    });
    return result;
  }

  var _setToArray = setToArray;

  /**
   * Converts an ASCII `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */
  function asciiToArray(string) {
    return string.split('');
  }

  var _asciiToArray = asciiToArray;

  /** Used to compose unicode character classes. */
  var rsAstralRange$2 = "\\ud800-\\udfff",
      rsComboMarksRange$2 = "\\u0300-\\u036f",
      reComboHalfMarksRange$2 = "\\ufe20-\\ufe2f",
      rsComboSymbolsRange$2 = "\\u20d0-\\u20ff",
      rsComboRange$2 = rsComboMarksRange$2 + reComboHalfMarksRange$2 + rsComboSymbolsRange$2,
      rsVarRange$2 = "\\ufe0e\\ufe0f";
  /** Used to compose unicode capture groups. */

  var rsAstral$1 = '[' + rsAstralRange$2 + ']',
      rsCombo$1 = '[' + rsComboRange$2 + ']',
      rsFitz$1 = "\\ud83c[\\udffb-\\udfff]",
      rsModifier$1 = '(?:' + rsCombo$1 + '|' + rsFitz$1 + ')',
      rsNonAstral$1 = '[^' + rsAstralRange$2 + ']',
      rsRegional$1 = "(?:\\ud83c[\\udde6-\\uddff]){2}",
      rsSurrPair$1 = "[\\ud800-\\udbff][\\udc00-\\udfff]",
      rsZWJ$2 = "\\u200d";
  /** Used to compose unicode regexes. */

  var reOptMod$1 = rsModifier$1 + '?',
      rsOptVar$1 = '[' + rsVarRange$2 + ']?',
      rsOptJoin$1 = '(?:' + rsZWJ$2 + '(?:' + [rsNonAstral$1, rsRegional$1, rsSurrPair$1].join('|') + ')' + rsOptVar$1 + reOptMod$1 + ')*',
      rsSeq$1 = rsOptVar$1 + reOptMod$1 + rsOptJoin$1,
      rsSymbol$1 = '(?:' + [rsNonAstral$1 + rsCombo$1 + '?', rsCombo$1, rsRegional$1, rsSurrPair$1, rsAstral$1].join('|') + ')';
  /** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */

  var reUnicode$1 = RegExp(rsFitz$1 + '(?=' + rsFitz$1 + ')|' + rsSymbol$1 + rsSeq$1, 'g');
  /**
   * Converts a Unicode `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */

  function unicodeToArray(string) {
    return string.match(reUnicode$1) || [];
  }

  var _unicodeToArray = unicodeToArray;

  /**
   * Converts `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */

  function stringToArray(string) {
    return _hasUnicode(string) ? _unicodeToArray(string) : _asciiToArray(string);
  }

  var _stringToArray = stringToArray;

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
    return _arrayMap(props, function (key) {
      return object[key];
    });
  }

  var _baseValues = baseValues;

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
    return object == null ? [] : _baseValues(object, keys_1(object));
  }

  var values_1 = values;

  /** `Object#toString` result references. */

  var mapTag$5 = '[object Map]',
      setTag$4 = '[object Set]';
  /** Built-in value references. */

  var symIterator = _Symbol ? _Symbol.iterator : undefined;
  /**
   * Converts `value` to an array.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {Array} Returns the converted array.
   * @example
   *
   * _.toArray({ 'a': 1, 'b': 2 });
   * // => [1, 2]
   *
   * _.toArray('abc');
   * // => ['a', 'b', 'c']
   *
   * _.toArray(1);
   * // => []
   *
   * _.toArray(null);
   * // => []
   */

  function toArray(value) {
    if (!value) {
      return [];
    }

    if (isArrayLike_1(value)) {
      return isString_1(value) ? _stringToArray(value) : _copyArray(value);
    }

    if (symIterator && value[symIterator]) {
      return _iteratorToArray(value[symIterator]());
    }

    var tag = _getTag(value),
        func = tag == mapTag$5 ? _mapToArray : tag == setTag$4 ? _setToArray : values_1;
    return func(value);
  }

  var toArray_1 = toArray;

  /**
   * Passed to the BloodhoundPromise constructor. Invoked synchronously. Call `resolve` or
   * `reject` to settle the promise.
   *
   * @global
   * @callback Executor
   * @param {function} resolve Method to invoke to resolve the promise. Pass the resolved value.
   * @param {function} reject Method to invoke to reject the promise. Pass the rejection reason.
   */

  /**
   * Provides methods to resolve or reject a promise after is created.
   *
   * @global
   * @typedef {Object} Defer
   * @property {function(any)} resolve Resolves the promise with the given value.
   * @property {function(any)} reject Rejects the promise with the given reason.
   * @property {function()} notify A no-op for backwards compatibility.
   * @property {BloodhoundPromise} promise The promise that can be resolved or rejected using
   * the provided methods.
   */

  /**
   * Invoked when `done()` is called on a rejected promise.
   *
   * @global
   * @callback ErrorHandler
   * @param {any} error The reason the promise rejected.
   */

  /**
   * Registers a callback to invoke when `done()`
   * is called on a rejected promise chain. The handler will be invoked with the rejection
   * reason.
   *
   * @global
   * @callback SetErrorHandler
   * @param {ErrorHandler} handler The callback to invoke when `done()` is called on a rejected promise.
   */

  /**
   * Invoked when the wrapped Promise's scheduler is invoked.
   *
   * @global
   * @callback AsyncNotifier
   */

  /**
   * Registers a callback to invoke when the
   * wrapped Promise's scheduler is used (e.g. when invoking success and failure handlers
   * passed to `.then(...)`).
   *
   * @global
   * @callback SetAsyncNotifier
   * @param {AsyncNotifier} notifier The callback to invoke when the wrapped Promise's scheduler is used.
   */

  /**
   * Provides methods to configure BloodhoundPromise.
   *
   * @global
   * @typedef {Object} Config
   * @property {SetAsyncNotifier} setAsyncNotifier Registers a callback to invoke when the
   * wrapped Promise's scheduler is used (e.g. when invoking success and failure handlers
   * passed to `.then(...)`).
   * @property {SetErrorHandler} setErrorHandler Registers a callback to invoke when `done()`
   * is called on a rejected promise chain. The handler will be invoked with the rejection
   * reason.
   */

  var RESOLVED = 1;
  var REJECTED = 2;
  var STATE = 'Symbol' in global$1 ? Symbol('STATE') : '_state';
  var VALUE = 'Symbol' in global$1 ? Symbol('_value') : '_value';
  var SETTLED = 'Symbol' in global$1 ? Symbol('SETTLED') : '_settled';

  var readonly = function readonly(value) {
    return {
      enumerable: false,
      get: constant_1(value)
    };
  };

  function asTypeName(param) {
    return isString_1(param) ? param : param.name;
  }

  function isErrorOrTypeName(param) {
    return isString_1(param) || param === Error || isError_1(param.prototype);
  }

  function isInstanceOfTypeName(typename) {
    var error = this;
    return (error === Error || isError_1(error)) && (error.name === typename || isInstanceOfTypeName.call(Object.getPrototypeOf(error.constructor), typename));
  }

  function isIterable(value) {
    return value && !isString_1(value) && isFunction_1(value[Symbol.iterator]);
  }

  function invokeThis(fn) {
    return fn(this);
  }

  function verifyArgType(val, predicates, msg) {
    var conditions = flatten_1([predicates]);

    if (!conditions.some(invokeThis, val)) {
      throw new TypeError(msg);
    }
  }

  function setInternalProperties(promise, state, value) {
    var _Object$definePropert;

    if (has_1(promise, STATE)) return;
    Object.defineProperties(promise, (_Object$definePropert = {}, _defineProperty(_Object$definePropert, VALUE, readonly(value)), _defineProperty(_Object$definePropert, STATE, readonly(state)), _Object$definePropert));
    forEach_1(promise[SETTLED], attempt_1);
    delete promise[SETTLED];
  }

  function handlePossibleThenable(promise, resolve, reject, x) {
    var settled = false;

    try {
      var onFulfilled = function onFulfilled(value) {
        if (settled) return;
        settled = true;
        RESOLVER(promise, resolve, reject, value);
      };

      var onRejected = function onRejected(reason) {
        if (settled) return;
        settled = true;
        reject(reason);
      };

      var then = x.then;
      if (!isFunction_1(then)) return resolve(x);
      then.call(x, onFulfilled, onRejected);
    } catch (e) {
      if (!settled) reject(e);
    }
  }

  function RESOLVER(promise, resolve, reject, x) {
    if (x === promise) {
      reject(new TypeError("Can't resolve promise with itself."));
    } else if (isError_1(x)) {
      reject(x);
    } else if (!isObject_1(x)) {
      resolve(x);
    } else {
      handlePossibleThenable(promise, resolve, reject, x);
    }
  }
  /**
   * Wraps a Promise implementation to enable the following behaviors:
   *
   * Static Changes
   *
   * - `Promise.timeout` created.
   * - `Promise.unwrap` created.
   * - `Promise.apply/fapply` created.
   * - `Promise.call/fcall/try/attempt` created.
   * - `Promise.config.setErrorHandler` created.
   * - `Promise.config.setAsyncNotifier` created.
   * - Promise constructor callback will be invoked with a 3rd "notify" function...which does nothing.
   * - `Promise.defer.resolve` will reject the promise if an Error instance if provided.
   * - `Promise.some` will accept an array or object and resolve with the same type.
   * - `Promise.all` will accept an array or object and resolve with the same type.
   * - `Promise.any` will accept an array or object and resolve with the same type.
   * - `Promise.settle` will accept an array or object and resolve with the same type.
   * - `Promise.resolve` will return a rejected promise if an Error instance is provided.
   * - `Promise.cast/when` will return a rejected promise if an Error instance is provided.
   * - `Promise.delay` will return a rejected promise if an Error instance is provided.
   *
   * Instance Changes
   *
   * - `promise.done` created.
   * - `promise.spread` created.
   * - `promise.timeout` created.
   * - `promise.value/getValue` created.
   * - `promise.isResolved` created.
   * - `promise.isRejected` created.
   * - `promise.isSettled` created.
   * - `promise.unwrap` created.
   * - `promise.then` will return a rejected promise if an Error instance is returned from a callback.
   * - `promise.then` will invoke the handler registered using `Promise.config.setAsyncNotifier.`
   * - `promise.catch/else` will return a rejected promise if an Error instance is returned from a callback.
   * - `promise.catch/else` can be passed an array of Error types to conditionally invoke the callback.
   * - `promise.catch/else` will swallow a rejection if no callback is provided.
   * - `Promise.tap` will not reject, even when a rejected promise is returned from the callback.
   * - `Promise.finally` will pass the callback the resolved value or rejection reason.
   *
   * Assumptions:
   *
   * - The wrapped Promise's constructor callback will be invoked synchronously.
   *
   * @exports index
   * @param {function(new:Promise)} Promise The Promise constructor to wrap.
   * @returns {BloodhoundPromise} A BloodhoundPromise constructor that uses the wrapped
   * Promise's scheduler to implement advanced functionality.
   * @example
   * import asBloodhound from 'bloodhound-promises';
   *
   * export const BloodhoundPromise = asBloodhound(Promise);
   * @example
   * import Q from 'q';
   * import asBloodhound from 'bloodhound-promises';
   *
   * export const BloodhoundPromise = asBloodhound(Q.Promise);
   * @example
   * import when from 'when';
   * import asBloodhound from 'bloodhound-promises';
   *
   * export const BloodhoundPromise = asBloodhound(when.promise);
   * @example
   * import * as Bluebird from "bluebird";
   * import asBloodhound from 'bloodhound-promises';
   *
   * export const BloodhoundPromise = asBloodhound(Bluebird.Promise);
   */


  function wrapAsBloodhound(Promise) {
    var asyncNotifier = noop_1,
        errorHandler = function throwError(e) {
      throw e;
    };

    var resolver = function resolver(resolve) {
      return resolve();
    };

    var resolved = new Promise(resolver);

    function schedule(task, resolve, reject) {
      return function () {
        return resolved.then(task).then(resolve, reject);
      };
    }
    /**
     * Promise with extra features.
     *
     * @class
     * @global
     * @name BloodhoundPromise
     * @param {Executor} executor Invoked with `resolve` and `reject` functions to settle the promise.
     * @example
     * new BloodhoundPromise((resolve, reject) => {
     *   setTimeout(() => {
     *     resolve(result); // or:
     *     reject(new Error('something bad happened'));
     *   });
     * });
     * @example
     * import asBloodhound from 'bloodhound-promises';
     *
     * const BloodhoundPromise = asBloodhound(Promise);
     * const stop = log.startTiming('async operation');
     *
     * BloodhoundPromise.delay(10)
     *   .then(() => doSomethingAsync())
     *   .timeout(15000, new Error('async operation timed out'))
     *   .tap((result) => log.event('received value:', result))
     *   .catch('TypeError', 'EvalError', (e) => log.error(e))
     *   .done((result) => stop({ result }));
     */


    function BloodhoundPromise(callback) {
      var promise = this;
      new Promise(function proxy(resolve, reject) {
        function okay(value) {
          setInternalProperties(promise, RESOLVED, value);
          resolve(value);
        }

        function fail(error) {
          setInternalProperties(promise, REJECTED, error);
          reject(error);
        }

        function success(value) {
          RESOLVER(promise, okay, fail, value);
        }

        try {
          callback.call(this, success, fail, noop_1);
        } catch (e) {
          fail(e);
        }
      }).catch(noop_1);
    }
    /**
     * Creates a new BloodhoundPromise resolved with the given value. If an Error instance
     * is provided, the returned promise will be rejected.
     *
     * @function BloodhoundPromise.resolve
     * @param {any} value The value to resolve a new promise with.
     * @returns {BloodhoundPromise} A new promise instance resolved with the given value.
     * @example
     * BloodhoundPromise.resolve(123);
     * BloodhoundPromise.resolve(someOtherPromise).then(...);
     * BloodhoundPromise.resolve(new Error('rejection reason')).catch(...);
     */


    BloodhoundPromise.resolve = function resolve(value) {
      return new BloodhoundPromise(function (resolve) {
        return resolve(value);
      });
    };
    /**
     * Creates a new BloodhoundPromise rejected with the given reason.
     *
     * @function BloodhoundPromise.reject
     * @param {any} error The reason the promise is rejected.
     * @returns {BloodhoundPromise} A new promise instance rejected with the given reason.
     * @example
     * BloodhoundPromise.reject(new Error('bad data'));
     */


    BloodhoundPromise.reject = function reject(error) {
      return new BloodhoundPromise(function (_, reject) {
        return reject(error);
      });
    };
    /**
     * Creates an object that references a new BloodhoundPromise as well as the
     * methods to use to resolve or reject that promise later.
     *
     * @function BloodhoundPromise.defer
     * @returns {Defer} A new Defer instance.
     * @example
     * const defer = BloodhoundPromise.defer();
     * setTimeout(() => defer.resolve(123));
     * defer.promise.then(...);
     */


    BloodhoundPromise.defer = function defer() {
      var result = {};
      result.promise = new BloodhoundPromise(function (resolve, reject, notify) {
        result.reject = reject;
        result.resolve = resolve;
        Object.defineProperty(result, 'notify', {
          value: notify
        });
      });
      return result;
    };
    /**
     * Creates a new BloodhoundPromise that will reject with the given reason
     * if the provided promise does not settle before the given time elapses. If
     * the provided promise settles within the time period then the returned promise
     * will be resolve or rejected to match.
     *
     * @function BloodhoundPromise.timeout
     * @param {BloodhoundPromise} promise The promise that should settle before the given time has elapsed.
     * @param {number} ms The number of milliseconds to wait before rejecting the returned promise.
     * @param {any} [error] The optional value to reject the promise with if the time period elapsed before the given promise settles.
     * @returns {BloodhoundPromise} A new promise instance.
     * @example
     * BloodhoundPromise.timeout(somePromise, 10000).catch(...);
     * BloodhoundPromise.timeout(somePromise, 500, new Error('operation timed out'));
     */


    BloodhoundPromise.timeout = function timeout(promise, ms, error) {
      var defer = BloodhoundPromise.defer();
      promise.then(defer.resolve, defer.reject);
      setTimeout(defer.reject, ms, error || new Error('Promise timed out.'));
      return defer.promise;
    };
    /**
     * Invokes the specified function with the given arguments. The promise will
     * be rejected if an Error is thrown while invoking the function.
     *
     * @function BloodhoundPromise.apply
     * @alias BloodhoundPromise.fapply
     * @param {function} fn The function to invoke.
     * @param {array} args The arguments to pass to the function.
     * @returns {BloodhoundPromise} A new promise instance.
     * @example
     * function divide(arg1, arg2) {
     *   return arg1 / arg2;
     * }
     * BloodhoundPromise.apply(divide, [50, 10]).then(...);
     * BloodhoundPromise.apply(divide, [50, 0]).catch(...); // division by zero
     */


    BloodhoundPromise.apply = BloodhoundPromise.fapply = function apply(fn, args) {
      verifyArgType(fn, isFunction_1, 'Function argument expected.');
      return new BloodhoundPromise(function (resolve) {
        return resolve(fn.apply(void 0, _toConsumableArray(args)));
      });
    };
    /**
     * Invokes the specified function with the given arguments. The promise will
     * be rejected if an error is thrown while invoking the function.
     *
     * @function BloodhoundPromise.call
     * @alias BloodhoundPromise.fcall
     * @alias BloodhoundPromise.try
     * @alias BloodhoundPromise.attempt
     * @param {function} fn The function to invoke.
     * @param {...any[]} args The arguments to pass to the function.
     * @returns {BloodhoundPromise} A new promise instance.
     * @example
     * function divide(arg1, arg2) {
     *   return arg1 / arg2;
     * }
     * BloodhoundPromise.call(divide, 50, 10).then(...);
     * BloodhoundPromise.call(divide, 50, 0).catch(...); // division by zero
     */


    BloodhoundPromise.call = BloodhoundPromise.fcall = BloodhoundPromise.try = BloodhoundPromise.attempt = function call(fn) {
      var args = Array.prototype.slice.call(arguments, 1);
      return BloodhoundPromise.apply(fn, args);
    };
    /**
     * Converts the specified value to a BloodhoundPromise.
     *
     * @function BloodhoundPromise.cast
     * @alias BloodhoundPromise.when
     * @param {any} value The value to cast as a BloodhoundPromise. If
     * a Promise-like object is provided, the returned promise will be
     * settled when the provided promise settles. If an Error is provided,
     * the returned promise will be rejected with that reason.
     * @returns {BloodhoundPromise} A new promise instance.
     * @example
     * BloodhoundPromise.cast(123).then(...);
     * BloodhoundPromise.cast(anotherPromise).then(..., ...);
     */


    BloodhoundPromise.cast = BloodhoundPromise.when = function cast(value) {
      return BloodhoundPromise.resolve(value);
    };
    /**
     * Determines if the specified object can be treated like a Promise.
     *
     * @function BloodhoundPromise.isPromise
     * @alias BloodhoundPromise.isPromiseLike
     * @param {any} object The value to check.
     * @returns {boolean} True if the value is a Promise-like object; otherwise, false.
     * @example
     * BloodhoundPromise.isPromise(123); // false
     * BloodhoundPromise.isPromise(Promise.resolve()); // true
     * BloodhoundPromise.isPromise(BloodhoundPromise.cast(123)); // true
     */


    BloodhoundPromise.isPromise = BloodhoundPromise.isPromiseLike = function isPromise(object) {
      return Boolean(object instanceof BloodhoundPromise || object && isFunction_1(object.then));
    };
    /**
     * Settles the returned promise with the first of the given promises to resolve or reject.
     *
     * @function BloodhoundPromise.race
     * @param {Iterable} promises The collection of promises to race.
     * @returns {BloodhoundPromise} A new promise instance.
     * @example
     * BloodhoundPromise.race([
     *     someAsyncOperation(),
     *     BloodhoundPromise.delay(10000, new Error('operation timed out'))
     * ]).then(..., ...);
     */


    BloodhoundPromise.race = Promise.race;
    /**
     * Settles the returned promise with the given value after the specified time. If an
     * Error is provided, the returned promise will be rejected. If a Promise is provided,
     * the returned promise will wait for the given promise to settled and match its state.
     *
     * @function BloodhoundPromise.delay
     * @param {number} ms The number of milliseconds to delay before settling the promise.
     * @param {any} result The value to settle the promise with.
     * @returns {BloodhoundPromise} A new promise instance.
     * @example
     * BloodhoundPromise.delay(1000, 'async value').then(...);
     * BloodhoundPromise.delay(1000, new Error('rejected')).catch(...);
     */

    BloodhoundPromise.delay = function delay(ms, result) {
      var defer = BloodhoundPromise.defer();
      setTimeout(defer.resolve, ms, result);
      return defer.promise;
    };
    /**
     * Resolves the returned promise when all the given promises either
     * resolve or reject.
     *
     * @function BloodhoundPromise.settle
     * @alias BloodhoundPromise.hash
     * @alias BloodhoundPromise.allSettled
     * @param {Iterable|Map|object} promises The promises to wait to settle.
     * @returns {BloodhoundPromise<array|object>} A new promise instance resolved
     * with an array of promises if an iterable was provided.or an object if an
     * object or Map was provided. The object's keys will be the keys in
     * the original object; the values will be the promises.
     * @example
     * BloodhoundPromise.hash({
     *   a: someAsyncOperation(),
     *   b: BloodhoundPromise.delay(1000, 'default'),
     *   c: BloodhoundPromise.reject(new Error())
     * }).then(console.log); // { a: <Promise>, b: <Promise>, c: <Promise> }
     * @example
     * BloodhoundPromise.settle([
     *   someAsyncOperation(),
     *   BloodhoundPromise.delay(1000, 'default'),
     *   BloodhoundPromise.reject(new Error())
     * ]).then(console.log); // [ <Promise>, <Promise>, <Promise> ]
     */


    BloodhoundPromise.hash = BloodhoundPromise.settle = BloodhoundPromise.allSettled = function settle(promises) {
      verifyArgType(promises, [isObject_1, isMap_1, isIterable], 'Object or Iterable argument expected.');
      var count = size_1(promises);
      var defer = BloodhoundPromise.defer();
      var result = isIterable(promises) ? [] : {};

      function getSettler(key, promise) {
        return function complete() {
          result[key] = promise;

          if (--count === 0) {
            defer.resolve(result);
          }
        };
      }

      if (isEmpty_1(promises)) {
        return BloodhoundPromise.resolve(result);
      }

      forEach_1(promises, function attachHandlers(value, key) {
        var promise = BloodhoundPromise.cast(value);
        promise.finally(getSettler(key, promise));
      });
      return defer.promise;
    };
    /**
     * Resolves the returned promise when the specified number of the given
     * promises has resolved. Otherwise, if not enough of the promises can
     * resolve to meet the requested minimum count, the returned promise will
     * be rejected.
     *
     * @function BloodhoundPromise.some
     * @param {Iterable|Map|object} promises The promises to wait to resolve.
     * @param {number} count The number of promises that must resolve before
     * the returned promise is resolved.
     * @returns {BloodhoundPromise<array|object>} A new promise instance resolved
     * with an array of settled values if an iterable was provided or an object if
     * an object or Map was provided. The object's keys will be the keys in the
     * original object and the values will be the settled values.
     * @example
     * BloodhoundPromise.some({
     *   a: someAsyncOperation(),
     *   b: BloodhoundPromise.delay(1000, 'default'),
     *   c: BloodhoundPromise.reject(new Error())
     * }, 2).then(console.log); // { a: ..., b: 'default' }
     * @example
     * BloodhoundPromise.some([
     *   someAsyncOperation(),
     *   BloodhoundPromise.delay(1000, 'default'),
     *   BloodhoundPromise.reject(new Error())
     * ], 2).then(console.log); // [ ..., 'default' ]
     */


    BloodhoundPromise.some = function some(promises, count) {
      verifyArgType(promises, [isObject_1, isMap_1, isIterable], 'Object or Iterable argument expected.');
      verifyArgType(count, isLength_1, 'Non-negative number argument expected.');
      var success = 0,
          failure = 0;
      var errors = [];
      var total = size_1(promises);
      var defer = BloodhoundPromise.defer();
      var result = isIterable(promises) ? [] : {};

      function getHandler(key, inCatch) {
        return function handler(value) {
          if (inCatch || isError_1(value)) {
            failure++;
            errors[errors.length] = value;
          } else {
            success++;
            result[key] = value;
          }

          if (success >= count) {
            defer.resolve(result);
          } else if (failure > total - count) {
            defer.reject(failure === 1 ? errors[0] : errors);
          }
        };
      }

      if (total < count || count === 0) {
        return count === total ? BloodhoundPromise.resolve(result) : BloodhoundPromise.reject(new Error('Expected number of promises not provided.'));
      }

      forEach_1(promises, function attachHandlers(promise, key) {
        BloodhoundPromise.cast(promise).then(getHandler(key, false), getHandler(key, true));
      });
      return defer.promise;
    };
    /**
     * Resolves the returned promise only if all the specified promises resolve.
     *
     * @function BloodhoundPromise.all
     * @param {Iterable|Map|object} promises The promises to wait to resolve.
     * @returns {BloodhoundPromise<array|object>} A new promise resolved with an array of
     * resolved values if an iterable was provided or an object if an object or Map was
     * provided. The object's keys will be the keys in the original object and the values
     * will be the resolved values.
     * @example
     * BloodhoundPromise.all({
     *   a: someAsyncOperation(),
     *   b: BloodhoundPromise.delay(1000, 'default'),
     *   c: BloodhoundPromise.reject(new Error('oops'))
     * }).catch(console.log); // <Error: oops>
     * @example
     * BloodhoundPromise.all([
     *   someAsyncOperation(),
     *   BloodhoundPromise.delay(1000, 'default')
     * ]).then(console.log); // [ ..., 'default' ]
     */


    BloodhoundPromise.all = function all(promises) {
      return BloodhoundPromise.some(promises, size_1(promises));
    };
    /**
     * Resolves the returned promise if any the specified promises resolve.
     *
     * @function BloodhoundPromise.any
     * @param {Iterable|Map|object} promises The promises to wait for one to resolve.
     * @returns {BloodhoundPromise<array|object>} A new promise resolved with an array containing
     * the first resolved value if an iterable was provided or an object if an object or
     * Map was provided. The object's 1 key will be the key of the first resolved promise in
     * the original object and the value will be that first resolved value.
     * @example
     * BloodhoundPromise.any({
     *   a: someAsyncOperation(),
     *   b: BloodhoundPromise.delay(1000, 'default'),
     *   c: BloodhoundPromise.reject(new Error())
     * }).then(console.log); // { b: 'default' }
     * @example
     * BloodhoundPromise.any([
     *   someAsyncOperation(),
     *   BloodhoundPromise.delay(1000, 'default'),
     *   BloodhoundPromise.reject(new Error())
     * ]).then(console.log); // [ 'default' ]
     */


    BloodhoundPromise.any = function any(promises) {
      return BloodhoundPromise.some(promises, 1);
    };
    /**
     * Returns the original Promise constructor function passed
     * to {@link module:index.wrapAsBloodhound wrapAsBloodhound}.
     *
     * @function BloodhoundPromise.unwrap
     * @returns {function(new:Promise)} The original Promise constructor.
     * @example
     * const Promise = BloodhoundPromise.unwrap();
     * return new Promise((resolve, reject) => { ... });
     */


    BloodhoundPromise.unwrap = function unwrap() {
      return Promise;
    };
    /**
     * Provides methods to configure BloodhoundPromise.
     *
     * @member {Config} BloodhoundPromise.config
     * @example
     * BloodhoundPromise.config.setErrorHandler((error) => {
     *   console.log('unhandled promise rejection!', error);
     * });
     * @example
     * BloodhoundPromise.config.setAsyncNotifier(() => {
     *   console.log('a promise callback was just invoked');
     * });
     */


    BloodhoundPromise.config = Object.create(null);

    BloodhoundPromise.config.setErrorHandler = function setErrorHandler(handler) {
      verifyArgType(handler, isFunction_1, 'Function argument expected.');
      errorHandler = handler;
    };

    BloodhoundPromise.config.setAsyncNotifier = function setAsyncNotifier(notifier) {
      verifyArgType(notifier, isFunction_1, 'Function argument expected.');
      asyncNotifier = notifier;
    };

    BloodhoundPromise.prototype = new Promise(resolver);
    BloodhoundPromise.prototype.constructor = BloodhoundPromise;
    /**
     * Returns the resolved value or rejection reason.
     *
     * @function BloodhoundPromise.prototype.value
     * @alias BloodhoundPromise.prototype.getValue
     * @returns {any} The resolved value or rejection reason.
     * @example
     * BloodhoundPromise.resolve(123).value(); // 123
     */

    BloodhoundPromise.prototype.value = BloodhoundPromise.prototype.getValue = function getValue() {
      return this[VALUE];
    };
    /**
     * Returns whether the promise has been resolved.
     *
     * @function BloodhoundPromise.prototype.isResolved
     * @returns {boolean} Whether the promise has been resolved.
     * @example
     * BloodhoundPromise.reject().isResolved(); // false
     * BloodhoundPromise.delay(1000).isResolved(); // false
     * BloodhoundPromise.resolve(123).isResolved(); // true
     */


    BloodhoundPromise.prototype.isResolved = function isResolved() {
      return this[STATE] === RESOLVED;
    };
    /**
     * Returns whether the promise has been rejected.
     *
     * @function BloodhoundPromise.prototype.isRejected
     * @returns {boolean} Whether the promise has been rejected.
     * @example
     * BloodhoundPromise.reject().isRejected(); // true
     * BloodhoundPromise.delay(1000).isRejected(); // false
     * BloodhoundPromise.resolve(123).isRejected(); // false
     */


    BloodhoundPromise.prototype.isRejected = function isRejected() {
      return this[STATE] === REJECTED;
    };
    /**
     * Returns whether the promise has been resolved or rejected.
     *
     * @function BloodhoundPromise.prototype.isSettled
     * @returns {boolean} Whether the promise has been resolved or rejected.
     * @example
     * BloodhoundPromise.reject().isSettled(); // true
     * BloodhoundPromise.resolve().isSettled(); // true
     * BloodhoundPromise.delay(1000).isSettled(); // false
     */


    BloodhoundPromise.prototype.isSettled = function isSettled() {
      return this.isResolved() || this.isRejected();
    };
    /**
     * Does nothing. Exists for backwards-compatibility.
     *
     * @function BloodhoundPromise.prototype.notify
     * @returns {BloodhoundPromise} A new promise that matches the parent promise.
     * @deprecated Not used in Bloodhound.
     */


    BloodhoundPromise.prototype.notify = function notify() {
      return BloodhoundPromise.resolve(this);
    };
    /**
     * Ends the promise chain. Invokes the specified callback (if provided).
     * Also, if the promise is rejected, invokes the callback registered
     * using {@link SetErrorHandler BloodhoundPromise.config.setErrorHandler}.
     *
     * @function BloodhoundPromise.prototype.done
     * @param {function} [callback] Optional function that will be
     * invoked with the promise's resolved value or rejection reason
     * when the parent promise settles.
     * @example
     * BloodhoundPromise.call(someMethod)
     *   .tap(logResult)
     *   .then(handleResult)
     *   .catch() // swallow
     *   .done();
     * @example
     * BloodhoundPromise.call(someMethod)
     *   .then(handleResult)
     *   .done((valueOrError) => { ... });
     */


    BloodhoundPromise.prototype.done = function done(callback) {
      this.then(callback, function unhandledRejection(error) {
        attempt_1(callback, error);
        setTimeout(errorHandler, 0, error);
      });
    };
    /**
     * Rejects the returned promise if the given promise fails to settle
     * within the specified period. If the given promise settles within
     * the specified period then the returned value will be resolved or
     * rejected to match.
     *
     * @function BloodhoundPromise.prototype.timeout
     * @param {number} ms The number of milliseconds to wait before
     * rejecting the promise with the specified reason.
     * @param {any} [error] The optional reason the promise should be rejected
     * with if the timeout period elapses.
     * @returns {BloodhoundPromise} A new promise.
     * @example
     * BloodhoundPromise.call(someMethod, 'arg')
     *   .timeout(10000, new Error('operation timed out'))
     *   .then(...);
     *   .catch(...);
     */


    BloodhoundPromise.prototype.timeout = function timeout(ms, error) {
      return BloodhoundPromise.timeout(this, ms, error);
    };
    /**
     * Invokes one of the specified callbacks when the promise settles.
     *
     * @function BloodhoundPromise.prototype.then
     * @param {function} onFulfilled Method to invoke when the promise resolves.
     * Will be passed the resolved value.
     * @param {function} onRejected Method to invoke when the promise rejects.
     * Will be passed the rejection reason.
     * @returns {BloodhoundPromise} A new promise.
     * @example
     * BloodhoundPromise.call(someMethod)
     *   .then(onSuccess);
     * @example
     * BloodhoundPromise.call(someMethod)
     *   .then(onSuccess, onFailure);
     */


    BloodhoundPromise.prototype.then = function then(onFulfilled, onRejected) {
      var _this = this;

      return new BloodhoundPromise(function (resolve, reject) {
        var promise = _this;
        var propagate = schedule(function chain() {
          resolved.then(asyncNotifier);
          var value = promise.getValue();

          if (promise.isResolved()) {
            if (isFunction_1(onFulfilled)) {
              return onFulfilled(value);
            } else {
              return value;
            }
          } else if (isFunction_1(onRejected)) {
            return onRejected(value);
          } else {
            throw value;
          }
        }, resolve, reject);

        if (promise.isSettled()) {
          propagate();
        } else {
          promise[SETTLED] = promise[SETTLED] || [];
          promise[SETTLED].push(propagate);
        }
      });
    };
    /**
     * Invokes the specified callback if the promise rejects. The callback
     * will be passed the rejection reason. Optionally, you can specify which
     * Error type names the rejection reason should match for the callback
     * to be invoked.
     *
     * @function BloodhoundPromise.prototype.catch
     * @alias BloodhoundPromise.prototype.else
     * @param {...string[]} [types] The error type names to match against the
     * rejection reason in order for the callback to be invoked. If not provided,
     * the callback will always be invoked when the promise is rejected.
     * @param {function} onRejected Method to invoke when the promise rejects. If
     * one or more Error type names has been specified, the callback will only be
     * invoked if the rejection reason matches the given Error type name.
     * @returns {BloodhoundPromise} A new promise.
     * @example
     * BloodhoundPromise.call(someMethod, 'arg')
     *   .catch((err) => log.error('method failed', err));
     */


    BloodhoundPromise.prototype.else = BloodhoundPromise.prototype.catch = function rejected() {
      var args = flatten_1(toArray_1(arguments));
      var types = args.filter(isErrorOrTypeName).map(asTypeName);
      var handler = args.reverse().find(isFunction_1) || noop_1;
      return this.then(null, function conditionalHandler(error) {
        if (isEmpty_1(types) || types.some(isInstanceOfTypeName, error)) {
          return handler(error);
        }

        throw error;
      });
    };
    /**
     * Invokes the specified callback only if the promise resolves. If the
     * callback returns a promise, the promise chain will wait for that promise
     * to settle, but neither a fulfillment nor a rejection will be propagated
     * to the next promise in the chain. Instead, the original resolved value
     * will always be propagated.
     *
     * @function BloodhoundPromise.prototype.tap
     * @param {function} callback The method to invoke when the promise resolves.
     * Will be passed the resolved value. Nothing this callback does will affect
     * the next promise in the chain, which will always be provided with the
     * original resolved value.
     * @returns {BloodhoundPromise} A new promise.
     * @example
     * BloodhoundPromise.call(someMethod, 'arg')
     *   .tap(result => log.info('method succeeded', result))
     *   .then(result => { ... });
     */


    BloodhoundPromise.prototype.tap = function tap(callback) {
      return !isFunction_1(callback) ? BloodhoundPromise.resolve(this) : this.then(function swallowErrors(value) {
        var propagate = constant_1(value);
        return BloodhoundPromise.call(callback, value).then(propagate, propagate);
      });
    };
    /**
     * When a promise is resolved with an array, spread will invoke the given
     * success callback by passing each element in the array for each expected
     * argument.
     *
     * @function BloodhoundPromise.prototype.spread
     * @param {function} callback Method to invoke with the array of resolved
     * values passed in as arguments.
     * @returns {BloodhoundPromise} A new promise.
     * @example
     * BloodhoundPromise.all([
     *   'value for arg 1',
     *   BloodhoundPromise.call(getValueForArg2),
     *   BloodhoundPromise.resolve(getValueForArg3()),
     * ]).spread((arg1, arg2, arg3) => { ... });
     */


    BloodhoundPromise.prototype.spread = function spread(callback) {
      return !isFunction_1(callback) ? BloodhoundPromise.resolve(this) : this.then(function spreadValues(array) {
        return isIterable(array) ? callback.apply(void 0, _toConsumableArray(array)) : callback.apply(void 0, arguments);
      });
    };
    /**
     * Invokes the specified callback when the promise settles. If the method
     * returns a promise, we wait for that promise to settle. Only if it rejects
     * will this promise be rejected (any resolved value will be ignored).
     *
     * @function BloodhoundPromise.prototype.finally
     * @alias BloodhoundPromise.prototype.lastly
     * @param {function} callback Method to invoke when the promise settles.
     * The method will be passed the resolved value or rejection reason.
     * @returns {BloodhoundPromise} A new promise.
     * @example
     * ui.showLoading(true);
     * BloodhoundPromise.call(someMethod)
     *   .then(...)
     *   .finally(() => ui.showLoading(false));
     */


    BloodhoundPromise.prototype.lastly = BloodhoundPromise.prototype.finally = function lastly(callback) {
      function propagateErrors(value) {
        return BloodhoundPromise.call(callback, value).then(constant_1(value));
      }

      return !isFunction_1(callback) ? BloodhoundPromise.resolve(this) : this.then(propagateErrors, propagateErrors);
    };
    /**
     * Provides an instance of the original Promise implementation that matches
     * the resolved or rejected state of this BloodhoundPromise.
     *
     * @function BloodhoundPromise.prototype.unwrap
     * @returns {Promise} An instance of the original Promise settled to
     * match this BloodhoundPromise.
     * @example
     * BloodhoundPromise.call(someMethod, 'arg')
     *   .unwrap() // as original Promise
     *   .catch(console.error);
     */


    BloodhoundPromise.prototype.unwrap = function unwrap() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        return _this2.then(resolve, reject);
      });
    };

    return BloodhoundPromise;
  }

  return wrapAsBloodhound;

}));
