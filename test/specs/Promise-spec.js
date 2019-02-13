define(['Promise'], function(Promise) {

    /* global window, spyOn, setTimeout, setInterval, clearInterval: false */

    'use strict';

    if (!Function.prototype.bind) {
        Function.prototype.bind = function bind(context) {
            var fn = this,
                initial = [].slice.call(arguments, 1);
            return function boundFunction() {
                var args = [].slice.call(arguments);
                return fn.apply(context, initial.concat(args));
            };
        };
    }

    describe('Promise', function() {

        beforeEach(function setScheduler() {
            // wrapping setTimeout lets us spy on it later
            Promise.config.setScheduler(function(fn) {
                setTimeout(fn, 0);
            });
        });

        it('exists', function() {
            expect(typeof Promise).toBe('function');
        });

        describe('constructor', function() {

            it('throws if function not provided', function() {
                expect(Promise).toThrow();
            });

            it('calls itself if new not specified', function() {
                /* jshint -W064 */
                var promise = Promise(function() {});
                expect(Promise.isPromise(promise)).toBe(true);
            });

            it('initializes to pending state', function() {
                var promise = new Promise(function() {});
                expect(promise._state).toBe(0);
            });

            it('invokes the function asynchronously', function(done) {
                var hit = false;
                new Promise(function() {
                    expect(hit).toBe(true);
                    done();
                });
                hit = true;
            });

            it('calling resolve resolves the promise with the specified value', function(done) {
                new Promise(function(resolve) {
                    resolve('abc');
                }).then(function(value) {
                    expect(value).toBe('abc');
                    done();
                });
            });

            it('calling reject rejects the promise with the reason value', function(done) {
                new Promise(function(resolve, reject) {
                    reject('reason');
                }).catch(function(reason) {
                    expect(reason).toBe('reason');
                    done();
                });
            });

            it('calling notify notifies subscribers with the specified value', function(done) {
                var index = 0,
                    values = [0, 28, 77, 100];
                new Promise(function(resolve, reject, notify) {
                    notify(values[0]);
                    notify(values[1]);
                    notify(values[2]);
                    notify(values[3]);
                }).notified(function(value) {
                    expect(value).toBe(values[index++]);
                    if (index === values.length) {
                        done();
                    }
                });
            });

        });

        describe('then', function() {

            it('returns a new promise', function() {
                var original = Promise.resolve(),
                    second = original.then();
                expect(second).not.toBe(original);
            });

            it('ignores success callback if not a function', function() {
                var parent = Promise.resolve();
                expect(parent._successes.length).toBe(0);
                parent.then();
                expect(parent._successes.length).toBe(0);
            });

            it('ignores failure callback if not a function', function() {
                var parent = Promise.resolve();
                expect(parent._failures.length).toBe(0);
                parent.then();
                expect(parent._failures.length).toBe(0);
            });

            it('ignores notify callback if not a function', function() {
                var parent = Promise.resolve();
                expect(parent._notifies.length).toBe(0);
                parent.then();
                expect(parent._notifies.length).toBe(0);
            });

            it('success callback on resolved promise fires', function(done) {
                Promise.resolve('abc').then(function success(value) {
                    expect(value).toBe('abc');
                    done();
                });
            });

            it('failure callback on rejected promise fires', function(done) {
                Promise.reject('reason').then(null, function failure(reason) {
                    expect(reason).toBe('reason');
                    done();
                });
            });

            it('returned promise resolves with value of original promise', function(done) {
                var parent = Promise.delay(100, 'abc');
                parent.then(function success(value) {
                    expect(value).toBe('abc');
                    done();
                });
            });

            it('returned promise rejects with reason of original promise', function(done) {
                var err = new Error(),
                    parent = Promise.delay(100, err);
                parent.then(null, function rejected(reason) {
                    expect(reason).toBe(err);
                    done();
                });
            });

            it('parent resolved with child promise throws TypeError', function(done) {
                var parent = Promise.resolve(),
                    child = parent.then(function() {
                        return child;
                    });
                child.catch(function(err) {
                    expect(err instanceof TypeError).toBe(true);
                    done();
                });
            });

            it('parent resolved with promise resolves child when promise resolves', function(done) {
                Promise.resolve().then(function inner() {
                    return Promise.delay(50, 'inner');
                }).then(function last(value) {
                    expect(value).toBe('inner');
                    done();
                });
            });

            it('parent resolved with promise rejects child when promise rejects', function(done) {
                Promise.resolve().then(function inner() {
                    return Promise.delay(50, new Error('reason'));
                }).catch(function last(err) {
                    expect(err.message).toBe('reason');
                    done();
                });
            });

            it('parent resolved with value resolves child with same value', function(done) {
                var parent = Promise.resolve(123);
                parent.then(function(value) {
                    expect(value).toBe(123);
                    done();
                });
            });

            it('success callbacks fire in order provided', function(done) {

                var results = [],
                    promise = Promise.resolve(50),
                    handler3 = function() {
                        results.push(3);
                    },
                    handler2 = function() {
                        results.push(2);
                    },
                    handler1 = function() {
                        results.push(1);
                        promise.then(handler3);
                    };

                promise.then(handler1);
                promise.then(handler2);

                promise.then(function() {
                    setTimeout(function() {
                        expect(results).toEqual([1, 2, 3]);
                        done();
                    }, 15);
                });

            });

            it('resolved promise `then` only called once', function(done) {

                var promise = Promise.resolve(),
                    thenable = {
                        then: jasmine.createSpy('then')
                    };

                promise.then(function() {
                    return thenable;
                });

                promise.then(function() {
                    expect(thenable.then.calls.count()).toBe(1);
                    done();
                });

            });

        });

        describe('catch', function() {

            it('is alias of else', function() {
                var promise = Promise.resolve();
                expect(promise.catch).toBe(promise.else);
            });

            it('calls then with null, callback', function() {
                var promise = Promise.resolve(),
                    callback = function() {};
                spyOn(promise, 'then');
                promise.catch(callback);
                expect(promise.then).toHaveBeenCalledWith(null, callback);
            });

        });

        describe('notify', function() {

            it('calls then with null, null, callback', function() {
                var promise = Promise.resolve(),
                    callback = function() {};
                spyOn(promise, 'then');
                promise.notified(callback);
                expect(promise.then).toHaveBeenCalledWith(null, null, callback);
            });

        });

        describe('tap', function() {

            it('calls then with wrapped function', function() {
                var promise = Promise.resolve(),
                    callback = function() {};
                spyOn(promise, 'then');
                promise.tap(callback);
                expect(typeof promise.then.calls.argsFor(0)[0]).toBe('function');
            });

            it('ignores non-function callback arguments', function(done) {
                Promise.resolve('abc')
                    .tap(null)
                    .tap(undefined)
                    .tap(NaN)
                    .tap({})
                    .then(function(value) {
                        expect(value).toBe('abc');
                        done();
                    });
            });

            it('callback only invoked if promise is resolved', function(done) {
                Promise.reject('reason').tap(function() {
                    throw new Error();
                });
                Promise.resolve('abc').tap(done);
            });

            it('returning a value from callback does not change promise resolved value', function(done) {
                Promise.resolve('abc').tap(function(value) {
                    expect(value).toBe('abc');
                    return 'def';
                }).then(function(value) {
                    expect(value).toBe('abc');
                    done();
                });
            });

            it('throwing an exception in the callback does not affect next promise', function(done) {
                Promise.resolve('abc').tap(function() {
                    throw new Error();
                }).then(function(value) {
                    expect(value).toBe('abc');
                    done();
                });
            });

        });

        describe('finally', function() {

            it('callback invoked for success', function(done) {
                Promise.resolve('abc').finally(function callback(value) {
                    expect(value).toBe('abc');
                    done();
                }).done();
            });

            it('callback invoked for failure', function(done) {
                Promise.reject('reason').finally(function callback(reason) {
                    expect(reason).toBe('reason');
                    done();
                })  .catch(function(){})
                    .done();
            });

            it('if callback does not return promise, original value passed through', function(done) {
                Promise.delay(10, 'abc')
                    .finally(function callback(value) {
                        expect(value).toBe('abc');
                    }).then(function(value) {
                        expect(value).toBe('abc');
                        done();
                    }).done();
            });

            it('if callback does not return promise, original rejection passed through', function(done) {
                Promise.delay(10, new Error('rejection'))
                    .finally(function callback(value) {
                        expect(value instanceof Error).toBe(true);
                    })
                    .catch(done)
                    .done();
            });

            it('if callback returns a non-promise, original value passes through', function(done) {
                Promise.delay(10, 'original value')
                    .finally(function callback() {
                        return 'new value';
                    })
                    .then(function verify(result) {
                        expect(result).toBe('original value');
                        done();
                    }).done();
            });

            it('if callback returns a resolved promise, wait then use original value', function(done) {
                var delayed = false;
                Promise.delay(10, 'abc')
                    .finally(function callback(value) {
                        return Promise.delay(20)
                            .then(function() {
                                delayed = true;
                                return 'hello ' + value;
                            });
                    })
                    .then(function(value) {
                        expect(delayed).toBe(true);
                        expect(value).toBe('abc');
                        done();
                    }).done();
            });

            it('if callback returns a rejected promise, wait then use new rejection reason', function(done) {
                var delayed = false;
                Promise.delay(10, 'value')
                    .finally(function callback() {
                        return Promise.delay(20)
                            .then(function() {
                                delayed = true;
                                return new Error('new error');
                            });
                    })
                    .catch(function(err) {
                        expect(delayed).toBe(true);
                        expect(err.message).toBe('new error');
                        done();
                    }).done();
            });

        });

        describe('isSettled', function() {

            it('returns false if promise is pending', function() {
                var promise = Promise.delay(100);
                expect(promise.isSettled()).toBe(false);
            });

            it('returns true if promise is resolved', function() {
                var promise = Promise.resolve();
                expect(promise.isSettled()).toBe(true);
            });

            it('returns true if promise is rejected', function() {
                var promise = Promise.reject();
                expect(promise.isSettled()).toBe(true);
            });

        });

        describe('isResolved', function() {

            it('returns false if promise is pending', function() {
                var promise = Promise.delay(100);
                expect(promise.isResolved()).toBe(false);
            });

            it('returns true if promise is resolved', function() {
                var promise = Promise.resolve();
                expect(promise.isResolved()).toBe(true);
            });

            it('returns false if promise is rejected', function() {
                var promise = Promise.reject();
                expect(promise.isResolved()).toBe(false);
            });

        });

        describe('isRejected', function() {

            it('returns false if promise is pending', function() {
                var promise = Promise.delay(100);
                expect(promise.isRejected()).toBe(false);
            });

            it('returns false if promise is resolved', function() {
                var promise = Promise.resolve();
                expect(promise.isRejected()).toBe(false);
            });

            it('returns true if promise is rejected', function() {
                var promise = Promise.reject();
                expect(promise.isRejected()).toBe(true);
            });

        });

        describe('done', function() {

            it('throws error if promise rejected', function(done) {
                spyOn(window, 'setTimeout');
                Promise.reject('rejected').done();
                var token = setInterval(function verify() {
                    if (window.setTimeout.calls.any) {
                        clearInterval(token);
                        expect(window.setTimeout.calls.argsFor(0)[0]).toThrowError('rejected');
                        done();
                    }
                }, 25);
            });

            it('does not throw error if rejection caught before done', function(done) {
                Promise.reject('rejected').catch(function(reason) {
                    expect(reason).toBe('rejected');
                }).done(done);
            });

            it('calls handler if one is passed', function(done) {
                Promise.delay(20).done(done);
            });

            it('ignores non-function handlers', function() {
                [null, {}, NaN, new Date()].forEach(function test(value) {
                    Promise.resolve('abc').done(value);
                });
            });

            it('invokes multiple handlers in order', function(done) {
                var called = [],
                    promise = Promise.delay(25);
                promise.done(function() { called.push(1); });
                promise.done(function() { called.push(2); });
                promise.done(function() {
                    expect(called).toEqual([1, 2]);
                    done();
                });
            });

            it('ignores exceptions in handler', function(done) {
                var promise = Promise.delay(25);
                promise.done(function() {
                    throw new Error();
                });
                promise.done(done);
            });

            it('ignores promise returned by handler', function(done) {
                var parent = Promise.delay(25, 'parent');
                parent.done(function() {
                    return Promise.delay(30, 'child');
                });
                parent.done(function(result) {
                    expect(result).toBe('parent');
                    done();
                });
            });

            it('ignores values returned by handler', function(done) {
                var parent = Promise.delay(25, 'parent');
                parent.done(function() {
                    return 'child';
                });
                parent.done(function(result) {
                    expect(result).toBe('parent');
                    done();
                });
            });

        });

        describe('isPromise', function() {

            it('returns true for Promise', function() {
                expect(Promise.isPromise(Promise.resolve())).toBe(true);
            });

            it('returns true for thenable', function() {
                expect(Promise.isPromise({then: function() {}})).toBe(true);
            });

        });

        describe('resolve', function() {

            it('resolves with promise defers', function(done) {
                Promise.resolve(Promise.delay(20, 'abc'))
                    .then(function(value) {
                        expect(value).toBe('abc');
                        done();
                    });
            });

            it('resolves synchronously', function() {
                spyOn(window, 'setTimeout');
                expect(window.setTimeout.calls.any()).toBe(false);
                Promise.resolve('value');
                expect(window.setTimeout.calls.any()).toBe(false);
            });

            it('resolves with specified value', function() {
                spyOn(window, 'setTimeout');
                expect(window.setTimeout.calls.any()).toBe(false);
                expect(Promise.resolve('value')._data).toBe('value');
                expect(window.setTimeout.calls.any()).toBe(false);
            });

            it('defers to resolved promise', function(done) {
                Promise.resolve(Promise.delay(40, 'abc')).then(function(value) {
                    expect(value).toBe('abc');
                    done();
                });
            });

        });

        describe('reject', function() {

            it('rejects synchronously', function() {
                spyOn(window, 'setTimeout');
                expect(window.setTimeout.calls.any()).toBe(false);
                Promise.reject('reason');
                expect(window.setTimeout.calls.any()).toBe(false);
            });

            it('rejects with the specified reason', function() {
                spyOn(window, 'setTimeout');
                expect(window.setTimeout.calls.any()).toBe(false);
                expect(Promise.reject('reason')._data).toBe('reason');
                expect(window.setTimeout.calls.any()).toBe(false);
            });

        });

        describe('defer', function() {

            it('returns object with expected members', function() {
                var defer = Promise.defer();
                expect(defer.promise instanceof Promise).toBe(true);
                expect(typeof defer.resolve).toBe('function');
                expect(typeof defer.reject).toBe('function');
                expect(typeof defer.notify).toBe('function');
            });

            it('calling approve resolves promise with specified value', function(done) {
                var defer = Promise.defer();
                defer.promise.then(function(value) {
                    expect(value).toBe('value');
                    done();
                });
                defer.resolve('value');
            });

            it('calling reject rejects promise with specified reason', function(done) {
                var defer = Promise.defer();
                defer.promise.catch(function(reason) {
                    expect(reason).toBe('reason');
                    done();
                });
                defer.reject('reason');
            });

            it('calling notify notifies callbacks with specified data', function(done) {
                var defer = Promise.defer();
                defer.promise.notified(function(data) {
                    expect(data).toBe(123);
                    done();
                });
                defer.notify(123);
            });

        });

        describe('cast', function() {

            it('returns obj if obj is Promise', function() {
                var promise = Promise.resolve();
                expect(Promise.cast(promise)).toBe(promise);
            });

            it('chains returned promise if thenable passed in', function(done) {

                var thenable = {
                    fns: [],
                    then: function(fn) {
                        this.fns.push(fn);
                    },
                    resolve: function(val) {
                        this.fns.forEach(function(fn) {
                            fn(val);
                        });
                    }
                };

                var promise = Promise.cast(thenable);

                promise.then(function(value) {
                    expect(value).toBe('abc');
                    done();
                });

                spyOn(thenable, 'then').and.callThrough();

                var token = window.setInterval(function() {
                    if (thenable.then.calls.any()) {
                        window.clearInterval(token);
                        thenable.resolve('abc');
                    }
                }, 10);

            });

            it('rejects returned promise if parameter is an error', function() {
                var promise = Promise.cast(new TypeError('reason'));
                expect(promise.isRejected()).toBe(true);
                expect(promise._data instanceof TypeError).toBe(true);
            });

            it('resolves returned promise if parameter is not an error or a promise', function() {
                var promise = Promise.cast('abc');
                expect(promise.isResolved()).toBe(true);
                expect(promise._data).toBe('abc');
            });

        });

        describe('delay', function() {

            it('is alias of wait', function() {
                expect(Promise.delay).toBe(Promise.wait);
            });

            it('resolves after specified ms', function(done) {
                var start = Date.now();
                var promise = Promise.delay(100);
                promise.then(function() {
                    expect(Date.now()).toBeGreaterThan(start + 99);
                    done();
                });
            });

            it('resolves with specified value', function(done) {
                var promise = Promise.delay(100, 'abc');
                promise.then(function(value) {
                    expect(value).toBe('abc');
                    done();
                });
            });

            it('defers to resolved promise', function(done) {
                Promise.delay(50, Promise.delay(10, 'abc')).then(function(value) {
                    expect(value).toBe('abc');
                    done();
                });
            });

        });

        describe('timeout', function() {

            it('rejects after specified ms', function(done) {
                Promise.delay(50).timeout(30).catch(function(reason) {
                    expect(reason instanceof Error).toBe(true);
                    expect(reason.message).toBe('Promise timed out.');
                    done();
                });
            });

            it('does not reject if resolved before timeout', function(done) {
                Promise.delay(20).timeout(40).then(done);
            });

            it('rejects with optional reason when provided', function(done) {
                Promise.delay(50).timeout(30, 'too long').catch(function(reason) {
                    expect(reason).toBe('too long');
                    done();
                });
            });

            it('earliest of multiple timeouts rejects first', function(done) {
                Promise.delay(100)
                    .timeout(20, '20')
                    .timeout(30, '30')
                    .timeout(10, '10')
                    .catch(function(msg) {
                        expect(msg).toBe('10');
                        done();
                    });
            });

        });

        describe('call', function() {

            it('returns a promise', function() {
                expect(Promise.isPromise(Promise.call(function() {}))).toBe(true);
            });

            it('does not throw if function not specified', function() {
                expect(Promise.call.bind(Promise)).not.toThrow();
                expect(Promise.call.bind(Promise, 123)).not.toThrow();
                expect(Promise.call.bind(Promise, 'abc')).not.toThrow();
            });

            it('resolves if non-function specified', function(done) {
                Promise.call(123).then(function(value) {
                    expect(value).toBe(123);
                    done();
                });
            });

            it('passes additional args to function', function(done) {
                Promise.call(function(arg1, arg2) {
                    expect(arg1).toBe('abc');
                    expect(arg2).toBe(123);
                    done();
                }, 'abc', 123);
            });

            it('resolves promise with function result', function(done) {
                Promise.call(function() { return 'value'; }).then(function(value) {
                    expect(value).toBe('value');
                    done();
                });
            });

            it('rejects promise with error if function throws', function(done) {
                Promise.call(jasmine.unimplementedMethod_).catch(function(err) {
                    expect(err instanceof Error).toBe(true);
                    done();
                });
            });

            it('defers to returned promise', function(done) {
                Promise.call(function() {
                    return Promise.delay(40, 'abc');
                }).then(function(value) {
                    expect(value).toBe('abc');
                    done();
                });
            });

            it('defers to apply', function(done) {
                spyOn(Promise, 'apply').and.callThrough();
                Promise.call(function() {
                    expect(Promise.apply).toHaveBeenCalledWith(jasmine.any(Function), ['abc', 123]);
                    done();
                }, 'abc', 123);
            });

        });

        describe('hash', function() {

            it('resolves with correct results', function(done) {
                var input = {
                    a: Promise.delay(40, 'world'),
                    b: Promise.delay(10, 'hello'),
                    c: 123456,
                    d: new Error()
                };
                Promise.hash(input).then(function(results) {
                    expect(results.a).toBe('world');
                    expect(results.b).toBe('hello');
                    expect(results.c).toBe(123456);
                    expect(results.d instanceof Error).toBe(true);
                    done();
                });
            });

        });

        describe('settle', function() {

            it('resolves with resolved and rejected promises', function(done) {
                Promise.settle([
                    Promise.delay(50),
                    Promise.delay(50, new Error()),
                    Promise.reject(),
                    'abc'
                ]).then(function(promises) {
                    expect(promises[0].isResolved()).toBe(true);
                    expect(promises[1].isRejected()).toBe(true);
                    expect(promises[2].isRejected()).toBe(true);
                    expect(promises[3].isResolved()).toBe(true);
                    done();
                });
            });

            it('resolves with empty array if no promises specified', function(done) {
                Promise.settle([]).then(function(promises) {
                    expect(promises).toEqual([]);
                    done();
                });
            });

            it('updates with percentage compled', function(done) {
                var index = 0,
                    percents = [0, 25, 50, 75, 100];
                Promise.settle([
                    Promise.delay(10),
                    Promise.delay(20),
                    Promise.delay(25),
                    Promise.delay(35)
                ]).notified(function(percent) {
                    expect(percent).toBe(percents[index++]);
                }).finally(done);
            });

        });

        describe('race', function() {

            it('resolves with first resolved value', function(done) {
                Promise.race([
                    Promise.delay(100, 'abc'),
                    Promise.delay(50, 'def'),
                    Promise.delay(10, 'ghi')
                ]).then(function(value) {
                    expect(value).toBe('ghi');
                    done();
                });
            });

            it('rejects with first rejected value', function(done) {
                var err = new Error();
                Promise.race([
                    Promise.delay(100, 'abc'),
                    Promise.delay(50, 'def'),
                    Promise.delay(25, err)
                ]).catch(function verify(e) {
                    expect(e).toBe(err);
                    done();
                });
            });

            it('does not resolve if empty array provided', function(done) {
                var timeoutError = new Error();
                Promise.race([]).timeout(100, timeoutError).catch(function verify(err) {
                    expect(err).toBe(timeoutError);
                    done();
                });
            });

        });

        describe('some', function() {

            it('throws if array not specified', function() {
                expect(Promise.some.bind(null)).toThrow();
                expect(Promise.some.bind(null, 'abc')).toThrow();
                expect(Promise.some.bind(null, {key: 'value'})).toThrow();
            });

            it('throws if non-number specified', function() {
                expect(Promise.some.bind(null, [])).toThrow();
                expect(Promise.some.bind(null, [], NaN)).toThrow();
                expect(Promise.some.bind(null, [], 'abc')).toThrow();
                expect(Promise.some.bind(null, [], {key: 'value'})).toThrow();
            });

            it('rejects if not enough promises specified', function(done) {
                Promise.some([
                    Promise.delay(50)
                ], 2).catch(done);
            });

            it('resolves with empty array if no promises given but count is 0', function(done) {
                Promise.some([], 0).then(function(values) {
                    expect(values).toEqual([]);
                    done();
                });
            });

            it('rejects as soon as it is not possible to meet count', function(done) {
                Promise.some([
                    Promise.delay(20, 'abc'),
                    Promise.delay(40, new Error()),
                    Promise.delay(60, 'def'),
                    Promise.delay(100, 'ghi'),
                    Promise.reject()
                ], 4).catch(function(reason) {
                    expect(Array.isArray(reason)).toBe(true);
                    expect(reason.length).toBe(2);
                    done();
                });
            });

            it('resolves as soon as count is met, with only count values', function(done) {
                Promise.some([
                    Promise.delay(20, 'abc'),
                    Promise.delay(40, new Error()),
                    Promise.delay(100, 'def'),
                    Promise.delay(60, 'ghi'),
                    123456,
                    Promise.reject()
                ], 2).then(function(values) {
                    expect(values).toEqual(['abc', 123456]);
                    done();
                });
            });

            it('sends percent notifications', function(done) {
                var index = 0,
                    percents = [0, 25, 50, 100];
                Promise.some([
                    Promise.delay(10),
                    Promise.delay(20),
                    Promise.delay(35, new Error()),
                    Promise.delay(60)
                ], 4)
                .notified(function(percent) {
                    expect(percent).toBe(percents[index++]);
                })
                .catch(function() {
                    expect(index).toBe(percents.length);
                })
                .finally(done)
                .done();
            });

            it('does not change type of rejection reason', function(done) {
                Promise.some([
                    Promise.delay(10, new Error()),
                    Promise.reject('first')
                ], 1).catch(function(errors) {
                    expect(Array.isArray(errors)).toBe(true);
                    expect(typeof errors[0]).toBe('string');
                    expect(errors[1] instanceof Error).toBe(true);
                    done();
                });
            });

            it('rejects with first error if only 1 needed to fail', function(done) {
                Promise.some([
                    Promise.delay(30, new Error('third')),
                    Promise.delay(10, new Error('first')),
                    Promise.delay(20, new Error('second'))
                ], 3).catch(function(err) {
                    expect(err instanceof Error).toBe(true);
                    expect(err.message).toBe('first');
                    done();
                });
            });

            it('returns array of Error instance if more than 1 failed', function(done) {
                Promise.some([
                    Promise.delay(30, new Error('third')),
                    Promise.delay(10, new Error('first')),
                    Promise.delay(20, new Error('second'))
                ], 2).catch(function(err) {
                    expect(Array.isArray(err)).toBe(true);
                    expect(err[0].message).toBe('first');
                    expect(err[1].message).toBe('second');
                    done();
                });
            });

        });

        describe('all', function() {

            it('delegates to Promise.some', function() {
                spyOn(Promise, 'some');
                var promises = [
                    Promise.resolve(),
                    Promise.delay(50)
                ];
                Promise.all(promises);
                expect(Promise.some).toHaveBeenCalledWith(promises, 2);
            });

        });

        describe('any', function() {

            it('delegates to Promise.some', function(done) {
                spyOn(Promise, 'some').and.callThrough();
                var promises = [
                    Promise.resolve(),
                    Promise.delay(50)
                ];
                Promise.any(promises).then(function(values) {
                    expect(values).toEqual([undefined]);
                    done();
                });
                expect(Promise.some).toHaveBeenCalledWith(promises, 1);
            });

        });

        describe('spread', function() {

            it('ignores non-function callbacks', function(done) {
                Promise.all([
                    Promise.delay(10, 'abc'),
                    Promise.delay(20, 'def')
                ])  .spread(null)
                    .spread(new Date())
                    .spread(NaN)
                    .spread({})
                    .then(function(values) {
                        expect(values[0]).toBe('abc');
                        expect(values[1]).toBe('def');
                        done();
                    });
            });

            it('passes resolved array as parameters', function(done) {
                Promise.all([
                    Promise.resolve('abc'),
                    123456,
                    Promise.delay(40, 'def'),
                    Promise.delay(10, 'ghi')
                ]).spread(function(val1, val2, val3, val4) {
                    expect(val1).toBe('abc');
                    expect(val2).toBe(123456);
                    expect(val3).toBe('def');
                    expect(val4).toBe('ghi');
                    done();
                });
            });

        });

        describe('config', function() {

            describe('warnIfDoneNotCalled', function() {

                /* global console: false */

                it('does not warn by default', function(done) {
                    spyOn(console, 'warn');
                    Promise.resolve();
                    setTimeout(function() {
                        expect(console.warn).not.toHaveBeenCalled();
                        done();
                    }, 20);
                });

                it('warns if enabled and done not called', function(done) {
                    spyOn(console, 'warn');
                    Promise.config.warnIfDoneNotCalled = true;
                    Promise.resolve();
                    setTimeout(function() {
                        expect(console.warn).toHaveBeenCalled();
                        done();
                    }, 1100);
                });

                it('does not warn if enabled and done called', function(done) {
                    spyOn(console, 'warn');
                    Promise.config.warnIfDoneNotCalled = true;
                    Promise.resolve().done();
                    setTimeout(function() {
                        expect(console.warn).not.toHaveBeenCalled();
                        done();
                    }, 20);
                });

                it('does not warn if enabled and done called on child', function(done) {
                    spyOn(console, 'warn');
                    Promise.config.warnIfDoneNotCalled = true;
                    Promise.delay(10)
                        .then(function() {
                            return Promise.delay(15);
                        })
                        .done();
                    setTimeout(function() {
                        expect(console.warn).not.toHaveBeenCalled();
                        done();
                    }, 20);
                });

            });

            describe('onUnhandledRejection', function() {

                it('throws if non-function provided', function() {
                    expect(Promise.config.onUnhandledRejection.bind(null)).toThrowError(
                        'Parameter `handler` must be a function.'
                    );
                });

                it('invokes handler if rejection unhandled', function(done) {
                    var remove = Promise.config.onUnhandledRejection(function(e) {
                        e.handled = true;
                        remove();
                        done();
                    });
                    Promise.reject('reason').done();
                });

                it('returns function to remove handler', function(done) {
                    var handler = /** @type {function} */
                        jasmine.createSpy('handler').and.callFake(function(e) {
                            remove();
                            expect(e.reason).toBe('reason 1');
                            e.handled = true;
                        }),
                        handler2 = /** @type {function} */
                        jasmine.createSpy('handler2').and.callFake(function(e) {
                            remove2();
                            expect(e.reason).toBe('reason 2');
                            expect(handler).not.toHaveBeenCalledWith('reason 2');
                            e.handled = true;
                            done();
                        }),
                        remove = Promise.config.onUnhandledRejection(handler),
                        remove2 = Promise.config.onUnhandledRejection(handler2);
                    expect(typeof remove).toBe('function');
                    Promise.reject('reason 1').done();
                    setTimeout(function() {
                        Promise.reject('reason 2').done();
                    }, 50);
                });

                it('does not invoke subequent handler if e.handled set to true', function(done) {
                    var handler1 = function(e) { e.handled = true; },
                        handler2 = function() { throw new Error(); },
                        remove1 = Promise.config.onUnhandledRejection(handler1),
                        remove2 = Promise.config.onUnhandledRejection(handler2);
                    Promise.reject('reason').done();
                    setTimeout(function() {
                        remove1();
                        remove2();
                        done();
                    }, 50);
                });

                it('does not throw exception if e.handled set to true', function(done) {
                    var handler = function(e) { e.handled = true; },
                        remove = Promise.config.onUnhandledRejection(handler);
                    Promise.reject('reason').done();
                    setTimeout(function() {
                        remove();
                        done();
                    }, 50);
                });

                it('throws exception if no handler sets e.handled to true', function(done) {
                    spyOn(window, 'setTimeout');
                    var handler = function(e) {},
                        remove = Promise.config.onUnhandledRejection(handler);
                    Promise.reject('rejected').done();
                    var token = setInterval(function verify() {
                        if (window.setTimeout.calls.any) {
                            clearInterval(token);
                            expect(window.setTimeout.calls.mostRecent().args[0]).toThrowError('rejected');
                            remove();
                            done();
                        }
                    }, 25);
                });

            });

            describe('setScheduler', function() {

                it('throws if argument is not a function', function() {
                    expect(Promise.config.setScheduler.bind(null)).toThrow();
                    expect(Promise.config.setScheduler.bind(null, 123)).toThrow();
                    expect(Promise.config.setScheduler.bind(null, 'abc')).toThrow();
                });

                it('sets async method', function(done) {
                    Promise.config.setScheduler(function() {
                        Promise.config.setScheduler(window.setTimeout);
                        done();
                    });
                    Promise.delay(10);
                });

            });

            describe('setRandomErrorRate', function() {

                afterEach(function() {
                    Promise.config.setRandomErrorRate(0);
                });

                it('rate <= 0 set to 0', function() {
                    expect(Promise.config.setRandomErrorRate(-1)).toBe(0);
                    expect(Promise.config.setRandomErrorRate(-100)).toBe(0);
                    expect(Promise.config.setRandomErrorRate(0)).toBe(0);
                });

                it('rate >= 100 set to 1', function() {
                    expect(Promise.config.setRandomErrorRate(101)).toBe(1);
                    expect(Promise.config.setRandomErrorRate(1000)).toBe(1);
                    expect(Promise.config.setRandomErrorRate(100)).toBe(1);
                });

                it('rate >= 0 and <= 1 set to rate', function() {
                    expect(Promise.config.setRandomErrorRate(0.4)).toBe(0.4);
                    expect(Promise.config.setRandomErrorRate(0.01)).toBe(0.01);
                    expect(Promise.config.setRandomErrorRate(0.99)).toBe(0.99);
                });

                it('Promise.resolve not affected', function(done) {
                    Promise.config.setRandomErrorRate(1);
                    Promise.resolve('abc').then(function(value) {
                        expect(value).toBe('abc');
                        done();
                    });
                });

                it('Promise.reject not affected', function(done) {
                    Promise.config.setRandomErrorRate(1);
                    Promise.reject('reason').catch(function(reason) {
                        expect(reason).toBe('reason');
                        done();
                    });
                });

                it('Promise constructor throws random errors', function(done) {

                    Promise.config.setRandomErrorRate(0.5);

                    var promises = [],
                        data = { success: 0, failure: 0 },
                        resolve = function(resolve) { resolve(data.success++); },
                        failure = function() { data.failure++; };

                    for (var i = 0; i < 100; i++) {
                        promises.push(new Promise(resolve).catch(failure));
                    }

                    Promise.settle(promises).finally(function() {
                        expect(data.success).not.toBe(0);
                        expect(data.failure).not.toBe(0);
                        expect(data.success + data.failure).toBe(promises.length);
                        done();
                    });

                });

            });

        });

    });

});
