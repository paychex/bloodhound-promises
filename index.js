import has from 'lodash/has';
import noop from 'lodash/noop';
import size from 'lodash/size';
import attempt from 'lodash/attempt';
import constant from 'lodash/constant';
import flatten from 'lodash/flatten';
import forEach from 'lodash/forEach';
import isMap from 'lodash/isMap';
import isError from 'lodash/isError';
import isEmpty from 'lodash/isEmpty';
import isObject from 'lodash/isObject';
import isLength from 'lodash/isLength';
import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';
import toArray from 'lodash/toArray';

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

const RESOLVED = 1;
const REJECTED = 2;

const STATE = 'Symbol' in global ? Symbol('STATE') : '_state';
const VALUE = 'Symbol' in global ? Symbol('_value') : '_value';
const SETTLED = 'Symbol' in global ? Symbol('SETTLED') : '_settled';

const readonly = value => ({
    enumerable: false,
    get: constant(value),
});

function ensureSettlersArray(promise) {
    if (has(promise, SETTLED)) return;
    Object.defineProperty(promise, SETTLED, {
        value: [],
        configurable: true
    });
}

function asTypeName(param) {
    return isString(param) ?
        param :
        param.name
}

function isErrorOrTypeName(param) {
    return isString(param) ||
        param === Error ||
        isError(param.prototype);
}

function isInstanceOfTypeName(typename) {
    const error = this;
    return (error === Error || isError(error)) && (
        error.name === typename ||
        isInstanceOfTypeName.call(Object.getPrototypeOf(error.constructor), typename)
    );
}

function isIterable(value) {
    return value && !isString(value) && isFunction(value[Symbol.iterator]);
}

function invokeThis(fn) {
    return fn(this);
}

function verifyArgType(val, predicates, msg) {
    const conditions = flatten([predicates]);
    if (!conditions.some(invokeThis, val)) {
        throw new TypeError(msg);
    }
}

function setInternalProperties(promise, state, value) {
    if (has(promise, STATE)) return;
    Object.defineProperties(promise, {
        [VALUE]: readonly(value),
        [STATE]: readonly(state),
    });
    forEach(promise[SETTLED], attempt);
    delete promise[SETTLED];
}

function handlePossibleThenable(promise, resolve, reject, x) {

    let settled = false;

    try {

        const then = x.then;

        if (!isFunction(then))
            return resolve(x);

        function onFulfilled(value) {
            if (settled) return;
            settled = true;
            RESOLVER(promise, resolve, reject, value);
        }

        function onRejected(reason) {
            if (settled) return;
            settled = true;
            reject(reason);
        }

        then.call(x, onFulfilled, onRejected);

    } catch (e) {
        if (!settled)
            reject(e);
    }

}

function RESOLVER(promise, resolve, reject, x) {
    if (x === promise) {
        reject(new TypeError(`Can't resolve promise with itself.`));
    } else if (isError(x)) {
        reject(x);
    } else if (!isObject(x)) {
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

    let asyncNotifier = noop,
        errorHandler = function throwError(e) {
            throw e;
        };

    const resolver = resolve => resolve();
    const resolved = new Promise(resolver);

    function schedule(task, resolve, reject) {
        return () => resolved.then(() =>
            resolve(task())).catch(reject);
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
        const promise = this;
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
                callback.call(this, success, fail, noop);
            } catch (e) {
                fail(e);
            }
        }).catch(noop);
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
        return new BloodhoundPromise((resolve) => resolve(value));
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
        return new BloodhoundPromise((_, reject) => reject(error));
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
        const result = {};
        result.promise = new BloodhoundPromise((resolve, reject, notify) => {
            result.reject = reject;
            result.resolve = resolve;
            Object.defineProperty(result, 'notify', { value: notify });
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
        const defer = BloodhoundPromise.defer();
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
    BloodhoundPromise.apply =
    BloodhoundPromise.fapply = function apply(fn, args) {
        verifyArgType(fn, isFunction, 'Function argument expected.');
        return new BloodhoundPromise((resolve) => resolve(fn(...args)));
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
    BloodhoundPromise.call =
    BloodhoundPromise.fcall =
    BloodhoundPromise.try =
    BloodhoundPromise.attempt = function call(fn) {
        const args = Array.prototype.slice.call(arguments, 1);
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
    BloodhoundPromise.cast =
    BloodhoundPromise.when = function cast(value) {
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
    BloodhoundPromise.isPromise =
    BloodhoundPromise.isPromiseLike = function isPromise(object) {
        return Boolean(object instanceof BloodhoundPromise ||
            (object && isFunction(object.then)));
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
        const defer = BloodhoundPromise.defer();
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
    BloodhoundPromise.hash =
    BloodhoundPromise.settle =
    BloodhoundPromise.allSettled = function settle(promises) {

        verifyArgType(promises, [isObject, isMap, isIterable], 'Object or Iterable argument expected.');

        let count = size(promises);

        const defer = BloodhoundPromise.defer();
        const result = isIterable(promises) ? [] : {};

        function getSettler(key, promise) {
            return function complete() {
                result[key] = promise;
                if (--count === 0) {
                    defer.resolve(result);
                }
            };
        }

        if (isEmpty(promises)) {
            return BloodhoundPromise.resolve(result);
        }

        forEach(promises, function attachHandlers(value, key) {
            const promise = BloodhoundPromise.cast(value);
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

        verifyArgType(promises, [isObject, isMap, isIterable], 'Object or Iterable argument expected.');
        verifyArgType(count, isLength, 'Non-negative number argument expected.');

        let success = 0,
            failure = 0;

        const errors = [];
        const total = size(promises);
        const defer = BloodhoundPromise.defer();
        const result = isIterable(promises) ? [] : {};

        function getHandler(key, inCatch) {
            return function handler(value) {
                if (inCatch || isError(value)) {
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
            return count === total ?
                BloodhoundPromise.resolve(result) :
                BloodhoundPromise.reject(new Error('Expected number of promises not provided.'));
        }

        forEach(promises, function attachHandlers(promise, key) {
            BloodhoundPromise.cast(promise).then(
                getHandler(key, false),
                getHandler(key, true)
            );
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
        return BloodhoundPromise.some(promises, size(promises));
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
        verifyArgType(handler, isFunction, 'Function argument expected.');
        errorHandler = handler;
    };

    BloodhoundPromise.config.setAsyncNotifier = function setAsyncNotifier(notifier) {
        verifyArgType(notifier, isFunction, 'Function argument expected.');
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
    BloodhoundPromise.prototype.value =
    BloodhoundPromise.prototype.getValue = function getValue() {
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
            attempt(callback, error);
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
        return new BloodhoundPromise((resolve, reject) => {
            const promise = this;
            const propagate = schedule(function chain() {
                resolved.then(asyncNotifier);
                const value = promise.getValue();
                if (promise.isResolved()) {
                    if (isFunction(onFulfilled)) {
                        return onFulfilled(value);
                    } else {
                        return value;
                    }
                } else if (isFunction(onRejected)) {
                    return onRejected(value);
                } else {
                    throw value;
                }
            }, resolve, reject);
            if (promise.isSettled()) {
                propagate();
            } else {
                ensureSettlersArray(promise);
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
    BloodhoundPromise.prototype.else =
    BloodhoundPromise.prototype.catch = function rejected() {
        const args = flatten(toArray(arguments));
        const types = args.filter(isErrorOrTypeName).map(asTypeName);
        const handler = args.reverse().find(isFunction) || noop;
        return this.then(null, function conditionalHandler(error) {
            if (isEmpty(types) || types.some(isInstanceOfTypeName, error)) {
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
        return !isFunction(callback) ?
            BloodhoundPromise.resolve(this) :
            this.then(function swallowErrors(value) {
                const propagate = constant(value);
                return BloodhoundPromise.call(callback, value)
                    .then(propagate, propagate);
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
        return !isFunction(callback) ?
            BloodhoundPromise.resolve(this) :
            this.then(function spreadValues(array) {
                return isIterable(array) ?
                    callback(...array) :
                    callback(...arguments);
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
    BloodhoundPromise.prototype.lastly =
    BloodhoundPromise.prototype.finally = function lastly(callback) {
        function propagateErrors(value) {
            return BloodhoundPromise.call(callback, value)
                .then(constant(value));
        }
        return !isFunction(callback) ?
            BloodhoundPromise.resolve(this) :
            this.then(propagateErrors, propagateErrors);
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
        return new Promise((resolve, reject) =>
            this.then(resolve, reject))
    };

    return BloodhoundPromise;

}

export default wrapAsBloodhound
