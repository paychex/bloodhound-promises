import expect from 'expect';
import asBloodhoundPromise from '../index';
import Q from 'q';
import when from 'when';
import * as Bluebird from "bluebird";

describe('Bloodhound', () => {

    let BloodhoundPromise;
    beforeEach(() => BloodhoundPromise = asBloodhoundPromise(Promise));

    it('is instance of Promise', () =>
        expect(BloodhoundPromise.resolve() instanceof Promise));

    it('is instance of Bloodhound', () =>
        expect(BloodhoundPromise.resolve() instanceof BloodhoundPromise));

    it('does not modify wrapped Promise', () => {
        expect(BloodhoundPromise.prototype).not.toBe(Promise.prototype);
        expect(BloodhoundPromise.prototype.tap).toBeDefined();
        expect(Promise.prototype.tap).not.toBeDefined();
    });

    describe('constructor', () => {

        it('method invoked synchronously', () => {
            const calls = [];
            new BloodhoundPromise(() => calls.push(1));
            calls.push(2);
            expect(calls).toEqual([1, 2]);
        });

        it('invoked with 3rd function', (/* done */) => {
            let type;
            new BloodhoundPromise((_, __, notify) =>
                type = typeof notify);
            expect(type).toBe('function');
        });

    });

    it('uses wrapped scheduler', done => {
        const calls = [];
        const original = Promise.resolve();
        const bloodhound = BloodhoundPromise.resolve();
        Promise.all([
            original.then(() => calls.push(1)),
            bloodhound.then(() => calls.push(2)),
            original.then(() => calls.push(3))
        ]).then(() => {
            expect(calls).toEqual([1, 2, 3]);
            done();
        });
    });

    it('rejects with TypeError if resolved with self', (done) => {
        const defer = BloodhoundPromise.defer();
        defer.resolve(defer.promise);
        defer.promise.catch(e => {
            expect(e.name).toBe('TypeError');
            expect(e.message).toBe(`Can't resolve promise with itself.`);
            done();
        });
    });

    describe('(interop)', () => {

        it('works with other libraries', done => {
            BloodhoundPromise.resolve('xyz')
                .then(() => Q('abc'))
                .then(() => when.resolve('def'))
                .then(() => Bluebird.resolve('ghi'))
                .then(value => {
                    expect(value).toBe('ghi');
                    done();
                });
        });

        it('wraps other libraries', done => {
            const QP = asBloodhoundPromise(Q.Promise);
            const BBP = asBloodhoundPromise(Bluebird.Promise);
            const WP = asBloodhoundPromise(when.promise);
            BloodhoundPromise.all([
                new QP(resolve => setTimeout(resolve, 10, 'abc')),
                new WP(resolve => setTimeout(resolve, 10, 'def')),
                new BBP(resolve => setTimeout(resolve, 10, 'ghi')),
            ]).then(results => {
                expect(results).toEqual(['abc', 'def', 'ghi']);
                done();
            });
        });

    });

    describe('(static)', () => {

        let array, object;

        beforeEach(() => {
            array = [
                1,
                Promise.resolve('abc'),
                BloodhoundPromise.delay(1, null)
            ];
            object = {
                a: 1,
                b: Promise.resolve('abc'),
                c: BloodhoundPromise.delay(1, null)
            };
        });

        it('race is inherited', () =>
            expect(BloodhoundPromise.race).toBeInstanceOf(Function));

        describe('defer', () => {

            it('notify method provided', () =>
                expect(typeof BloodhoundPromise.defer().notify).toBe('function'));

            it('resolve with Error rejects', done => {
                const error = new Error();
                const defer = BloodhoundPromise.defer();
                defer.promise.catch(reason => {
                    expect(reason).toBe(error);
                    done();
                });
                defer.resolve(error);
            });

        });

        describe('some', () => {

            it('throws if non-iterable and non-object provided', done => {
                try {
                    BloodhoundPromise.some(null, 2);
                } catch (e) {
                    expect(e.message).toBe('Object or Iterable argument expected.');
                    done();
                }
            });

            it('throws if non-length provided', done => {
                try {
                    BloodhoundPromise.some([], -2);
                } catch (e) {
                    expect(e.message).toBe('Non-negative number argument expected.');
                    done();
                }
            });

            it('resolves synchronously if empty array provided', () => {
                expect(BloodhoundPromise.some([], 0).isResolved()).toBe(true);
            });

            it('resolves synchronously if empty object provided', () => {
                expect(BloodhoundPromise.some({}, 0).isResolved()).toBe(true);
            });

            it('rejects synchronously if expected count not available', () => {
                expect(BloodhoundPromise.some([], 1).isRejected()).toBe(true);
                expect(BloodhoundPromise.some([123], 2).isRejected()).toBe(true);
            });

            it('works with arrays', done => {
                BloodhoundPromise.some([
                    BloodhoundPromise.resolve(1),
                    Promise.resolve('abc'),
                    BloodhoundPromise.delay(1, null)
                ], 3).then((value) => {
                    expect(value).toEqual([1, 'abc', null]);
                    done();
                }).catch(err => console.log(err.message));
            });

            it('works with objects', done => {
                BloodhoundPromise.some(object, 3).then((value) => {
                    expect(value).toMatchObject({
                        a: 1,
                        b: 'abc',
                        c: null
                    });
                    done();
                });
            });

            it('casts values as promises', done => {
                BloodhoundPromise.some(array, 3).then((value) => {
                    expect(value).toEqual([1, 'abc', null]);
                    done();
                });
            });

            it('rejects with single error', done => {
                const error = new Error();
                BloodhoundPromise.some([1, 2, error], 3)
                    .catch(err => {
                        expect(err).toBe(error);
                        done();
                    });
            });

            it('rejects with array of errors', done => {
                const error1 = new Error();
                const error2 = new Error();
                BloodhoundPromise.some([1, 2, error1, error2], 3)
                    .catch(errors => {
                        expect(errors).toEqual([error1, error2]);
                        done();
                    });
            });

            it('resolves with all values', done => {
                const input = [null, NaN, undefined, 0];
                BloodhoundPromise.some(input, input.length)
                    .then(values => {
                        expect(values).toEqual(input);
                        done();
                    });
            });

        });

        describe('all', () => {

            const err1 = new Error(1);
            const err2 = new Error(2);

            it('calls some with length of array', done => {
                const input = [1, 2, 3];
                BloodhoundPromise.some = (object, count) => {
                    expect(object).toEqual(input);
                    expect(count).toBe(input.length);
                    done();
                };
                BloodhoundPromise.all(input);
            });

            it('calls some with number of keys in object', done => {
                const input = {a: 1, b: 2, c: 3};
                BloodhoundPromise.some = (object, count) => {
                    expect(object).toEqual(input);
                    expect(count).toBe(Object.keys(input).length);
                    done();
                };
                BloodhoundPromise.all(input);
            });

            [
                {
                    type: 'array',
                    arg: [
                        err1,
                        err2,
                        'abc',
                    ]
                },
                {
                    type: 'object',
                    arg: {
                        a: err1,
                        b: err2,
                        c: 'abc',
                    }
                }
            ].forEach(({ type, arg }) => {

                it(`rejects with first reason if any ${type} promises reject`, done => {
                    BloodhoundPromise.all(arg).catch(result => {
                        expect(result).toEqual(err1);
                        done();
                    })
                });

            });

        });

        describe('any', () => {

            const err1 = new Error(1);
            const err2 = new Error(2);
            const err3 = new Error(3);

            it('calls some with count 1', done => {
                let callCount = 0;
                BloodhoundPromise.some = (_, count) => {
                    expect(count).toBe(1);
                    if (++callCount === 2)
                        done();
                };
                BloodhoundPromise.any(array);
                BloodhoundPromise.any(object);
            });

            [
                {
                    type: 'array',
                    arg: [
                        err1,
                        err2,
                        err3,
                    ]
                },
                {
                    type: 'object',
                    arg: {
                        a: err1,
                        b: err2,
                        c: err3,
                    }
                }
            ].forEach(({ type, arg }) => {

                it(`rejects with array of reasons if all ${type} promises reject`, done => {
                    BloodhoundPromise.any(arg).catch(result => {
                        expect(result).toEqual([err1, err2, err3]);
                        done();
                    })
                });

            });

        });

        describe('settle', () => {

            it('resolves synchronously if empty array provided', () =>
                expect(BloodhoundPromise.settle([]).isResolved()).toBe(true));

            it('resolves synchronously if empty object provided', () =>
                expect(BloodhoundPromise.settle({}).isResolved()).toBe(true));

            it('works with arrays', done => {
                const error = new Error();
                BloodhoundPromise.settle([1, 2, error])
                    .then(promises => {
                        expect(promises.length).toBe(3);
                        expect(promises[0].getValue()).toBe(1);
                        expect(promises[1].getValue()).toBe(2);
                        expect(promises[2].getValue()).toBe(error);
                        done();
                    });
            });

            it('works with objects', done => {
                const error = new Error();
                BloodhoundPromise.settle({ a: 1, b: 2, c: error })
                    .then(promises => {
                        expect(Object.keys(promises).length).toBe(3);
                        expect(promises.a.getValue()).toBe(1);
                        expect(promises.b.getValue()).toBe(2);
                        expect(promises.c.getValue()).toBe(error);
                        done();
                    });
            });

        });

        it('reject sets isRejected', () =>
            expect(BloodhoundPromise.reject().isRejected()).toBe(true));

        describe('resolve', () => {

            it('sets isResolved', () => {
                expect(BloodhoundPromise.resolve().isResolved()).toBe(true);
            });

            it('with Error rejects', () => {
                expect(BloodhoundPromise.resolve(new Error()).isRejected()).toBe(true);
            });

        });

        describe('isPromise', () => {

            it('returns true for Bloodhound promise', () =>
                expect(BloodhoundPromise.isPromise(BloodhoundPromise.resolve())).toBe(true));

            it('returns true for wrapped Promise', () =>
                expect(BloodhoundPromise.isPromise(Promise.resolve())).toBe(true));

            it('returns true for thenable', () =>
                expect(BloodhoundPromise.isPromise({ then() {} })).toBe(true));

            it('returns false for nil', () =>
                expect(BloodhoundPromise.isPromise(null)).toBe(false));

        });

        it('cast with Error rejects', () =>
            expect(BloodhoundPromise.cast(new Error()).isRejected()).toBe(true));

        it('unwrap returns wrapped Promise', () =>
            expect(BloodhoundPromise.unwrap()).toBe(Promise));

        it('delay resolves after timeout', done => {
            const start = Date.now();
            BloodhoundPromise.delay(10, 'abc')
                .then(value => {
                    expect(value).toBe('abc');
                    expect(Date.now() - start).toBeCloseTo(10, -2);
                    done();
                });
        });

        describe('timeout', () => {

            it('resolves if within timeout', done => {
                BloodhoundPromise.timeout(BloodhoundPromise.delay(1, 'abc'), 20)
                    .then(result => {
                        expect(result).toBe('abc');
                        done();
                    });
            });

            it('rejects with default error after timeout', done => {
                const start = Date.now();
                const promise = BloodhoundPromise.delay(20, 'abc');
                BloodhoundPromise.timeout(promise, 10)
                    .catch(error => {
                        expect(error.message).toBe('Promise timed out.');
                        expect(Date.now() - start).toBeCloseTo(10, -2);
                        done();
                    });
            });

            it('rejects with given error after timeout', done => {
                const start = Date.now();
                const error = new Error();
                const promise = BloodhoundPromise.delay(20, 'abc');
                BloodhoundPromise.timeout(promise, 10, error)
                    .catch(err => {
                        expect(err).toBe(error);
                        expect(Date.now() - start).toBeCloseTo(10, -2);
                        done();
                    });
            });

        });

        it('apply invokes function with arguments', done => {
            function fn(arg1, arg2) {
                expect(arg1).toBe(123);
                expect(arg2).toBe('abc');
                done();
            }
            BloodhoundPromise.apply(fn, [123, 'abc']);
        });

        it('call invokes apply', done => {
            BloodhoundPromise.apply = (fn, args) => {
                expect(fn).toBe(Function.prototype);
                expect(args).toEqual([123, 'abc']);
                done();
            };
            BloodhoundPromise.call(Function.prototype, 123, 'abc');
        });

        describe('config', () => {

            describe('setAsyncNotifier', () => {

                it('invokes callback for onFulfilled', done => {
                    BloodhoundPromise.config.setAsyncNotifier(() => done());
                    BloodhoundPromise.resolve().then(() => {});
                });

                it('invokes callback for onRejected', done => {
                    BloodhoundPromise.config.setAsyncNotifier(() => done());
                    BloodhoundPromise.reject().then(null, () => {});
                });

                it('invokes callback if onFulfilled throws', done => {
                    BloodhoundPromise.config.setAsyncNotifier(() => done());
                    BloodhoundPromise.resolve().then(function() {
                        throw new Error();
                    });
                });

                it('invokes callback if onRejected throws', done => {
                    BloodhoundPromise.config.setAsyncNotifier(() => done());
                    BloodhoundPromise.reject().then(null, function () {
                        throw new Error();
                    });
                });

            });

            describe('setErrorHandler', () => {

                it('default behavior throws outside promise on done', done => {
                    const error = new Error();
                    const setTimeout = global.setTimeout;
                    global.setTimeout = function(callback, ms, arg) {
                        expect(ms).toBe(0);
                        expect(arg).toBe(error);
                        try {
                            callback(arg);
                        } catch (e) {
                            expect(e).toBe(error);
                            done();
                        } finally {
                            global.setTimeout = setTimeout;
                        }
                    }
                    BloodhoundPromise.reject(error).done();
                });

                it('custom handler invoked with reason on done', done => {
                    const error = new Error();
                    BloodhoundPromise.config.setErrorHandler(function(err) {
                        expect(err).toBe(error);
                        done();
                    });
                    BloodhoundPromise.reject(error).done();
                });

            });

        });

    });

    describe('(instance)', () => {

        describe('then', () => {

            it('onFulfilled rejects if Error returned', done => {
                const error = new Error();
                BloodhoundPromise.resolve()
                    .then(() => error)
                    .catch(err => {
                        expect(err).toBe(error);
                        done();
                    });
            });

            it('onRejected rejects if Error returned', done => {
                const error = new Error();
                BloodhoundPromise.reject()
                    .then(Function.prototype, () => error)
                    .catch(err => {
                        expect(err).toBe(error);
                        done();
                    });
            });

            it('promise settles once', done => {
                BloodhoundPromise.resolve({
                    then(success) {
                        success(123);
                        success(456);
                    }
                }).then(value => {
                    expect(value).toBe(123);
                    done();
                });
            });

            it('promise rejects once', done => {
                const err1 = new Error();
                const err2 = new Error();
                BloodhoundPromise.resolve({
                    then(_, failure) {
                        failure(err1);
                        failure(err2);
                    }
                }).catch(value => {
                    expect(value).toBe(err1);
                    done();
                });
            });

            it('invocation exceptions reject', done => {
                const error = new Error();;
                BloodhoundPromise.resolve({
                    then() { throw error; }
                }).catch(err => {
                    expect(err).toBe(error);
                    done();
                });
            });

            it('invocation exceptions swallowed if already settled', done => {
                const error = new Error();;
                BloodhoundPromise.resolve({
                    then(success) {
                        success(123);
                        throw error;
                    }
                }).then(value => {
                    expect(value).toBe(123);
                    done();
                });
            });

            it('invokes callbacks in order', done => {
                const calls = [];
                const promise = BloodhoundPromise.delay(10);
                BloodhoundPromise.all([
                    promise.then(() => calls.push(1)),
                    promise.then(() => calls.push(2)),
                    promise.then(() => calls.push(3)),
                ]).then(() => {
                    expect(calls).toEqual([1, 2, 3]);
                    done();
                });
            });

        });

        describe('catch', () => {

            it('rejects if Error returned', done => {
                const error = new Error();
                BloodhoundPromise.reject()
                    .catch(() => error)
                    .catch(err => {
                        expect(err).toBe(error);
                        done();
                    });
            });

            it('swallows if no callback provided', done => {
                BloodhoundPromise.reject()
                    .catch()
                    .then(() => done());
            });

            describe('(conditional)', () => {

                it('empty type list has normal behavior', done => {
                    const error = new Error();
                    BloodhoundPromise.reject(error)
                        .catch([], err => {
                            expect(err).toBe(error);
                            done();
                        });
                });

                it('no matching types propagates rejection', done => {
                    const error = new Error();
                    BloodhoundPromise.reject(error)
                        .catch('TypeError', () => expect.fail('should not be called'))
                        .catch(err => {
                            expect(err).toBe(error);
                            done();
                        });
                });

                it('matching typename invokes handler', done => {
                    const error = new TypeError();
                    BloodhoundPromise.reject(error)
                        .catch('TypeError', err => {
                            expect(err).toBe(error);
                            done();
                        })
                        .catch(() => expect.fail('should not be called'));
                });

                it('respects inheritance', done => {
                    const error = new TypeError();
                    BloodhoundPromise.reject(error)
                        .catch(Error, err => {
                            expect(err).toBe(error);
                            done();
                        })
                        .catch(() => expect.fail('should not be called'));
                });

                it('matching type invokes handler', done => {
                    const error = new TypeError();
                    BloodhoundPromise.reject(error)
                        .catch(TypeError, err => {
                            expect(err).toBe(error);
                            done();
                        })
                        .catch(() => expect.fail('should not be called'));
                });

                it('flattens types', done => {
                    const error = new TypeError();
                    BloodhoundPromise.reject(error)
                        .catch('Error', ['SyntaxError', 'TypeError'], err => {
                            expect(err).toBe(error);
                            done();
                        })
                        .catch(() => expect.fail('should not be called'));
                });

                it('ignores invalid arguments', done => {
                    const err = new Error();
                    BloodhoundPromise.reject(err)
                        .catch(null, undefined, NaN, 123, /rx/, {}, reason => {
                            expect(reason).toBe(err);
                            done();
                        });
                });

                it('swallows if no callback provided', done => {
                    const err = new TypeError();
                    BloodhoundPromise.reject(err)
                        .catch('TypeError')
                        .then(value => {
                            expect(value).toBe(undefined);
                            done();
                        });
                });

            });

        });

        describe('tap', () => {

            it('creates new promise', () => {
                const promise = BloodhoundPromise.resolve();
                expect(promise.tap()).not.toBe(promise);
            });

            it('does not propagate returned value', done => {
                BloodhoundPromise.resolve(123)
                    .tap(() => 'abc')
                    .then(value => {
                        expect(value).toBe(123);
                        done();
                    });
            });

            it('does not reject on error', done => {
                BloodhoundPromise.resolve(123)
                    .tap(value => {
                        expect(value).toBe(123);
                        throw new Error();
                    })
                    .then(value => {
                        expect(value).toBe(123);
                        done();
                    });
            });

            it('does not propagate rejected promise', done => {
                BloodhoundPromise.resolve(123)
                    .tap(() => BloodhoundPromise.reject())
                    .then(value => {
                        expect(value).toBe(123);
                        done();
                    });
            });

        });

        describe('finally', () => {

            it('returns new promise', () => {
                const promise = BloodhoundPromise.resolve();
                expect(promise.finally()).not.toBe(promise);
            });

            it('provides fulfilled value to callback', done => {
                BloodhoundPromise.resolve(123)
                    .finally(value => {
                        expect(value).toBe(123);
                        done();
                    });
            });

            it('provides rejection reason to callback', done => {
                const error = new Error();
                BloodhoundPromise.reject(error)
                    .finally(value => {
                        expect(value).toBe(error);
                        done();
                    });
            });

            it('waits for returned promise', done => {
                const start = Date.now();
                BloodhoundPromise.resolve()
                    .finally(() => BloodhoundPromise.delay(10))
                    .finally(() => {
                        expect(Date.now() - start).toBeCloseTo(10, -2);
                        done();
                    });
            })

            it('propagates rejection', done => {
                const error = new Error();
                BloodhoundPromise.resolve(123)
                    .finally(() => BloodhoundPromise.reject(error))
                    .catch(err => {
                        expect(err).toBe(error);
                        done();
                    });
            });

            it('does not propagate resolved value', done => {
                BloodhoundPromise.resolve(123)
                    .finally(() => BloodhoundPromise.delay(10, 'abc'))
                    .finally(value => {
                        expect(value).toBe(123);
                        done();
                    });
            });

        });

        it('notify creates new promise', () => {
            const promise = BloodhoundPromise.resolve();
            expect(promise.notify()).not.toBe(promise);
        });

        describe('spread', () => {

            it('creates new promise', () => {
                const promise = BloodhoundPromise.resolve();
                expect(promise.spread()).not.toBe(promise);
            });

            it('invokes callback with array values', done => {
                BloodhoundPromise.resolve([123, 'abc', null])
                    .spread((arg1, arg2, arg3) => {
                        expect(arg1).toBe(123);
                        expect(arg2).toBe('abc');
                        expect(arg3).toBe(null);
                        done();
                    });
            });

            it('handles single argument', done => {
                BloodhoundPromise.resolve(123)
                    .spread(arg => {
                        expect(arg).toBe(123);
                        done();
                    });
            });

        });

        describe('timeout', () => {

            it('rejects with default error after timeout', done => {
                BloodhoundPromise.delay(100, 'abc')
                    .timeout(10)
                    .catch(error => {
                        expect(error.message).toBe('Promise timed out.');
                        done();
                    });
            });

            it('uses provided error', done => {
                const error = new Error();
                BloodhoundPromise.delay(100, 'abc')
                    .timeout(10, error)
                    .catch(err => {
                        expect(err).toBe(error);
                        done();
                    });
            });

            it('propagates settled values', done => {
                BloodhoundPromise.all([
                    BloodhoundPromise.reject('abc').timeout(10).catch(value => {
                        expect(value).toBe('abc');
                        return 1;
                    }),
                    BloodhoundPromise.resolve(123).timeout(10).then(value => {
                        expect(value).toBe(123);
                        return 2;
                    })
                ]).then(results => {
                    expect(results).toEqual([1, 2]);
                    done();
                });
            });

        });

        describe('value', () => {

            it('returns fulfilled value', () =>
                expect(BloodhoundPromise.resolve(123).value()).toBe(123));

            it('returns rejection reason', () => {
                const error = new Error();
                expect(BloodhoundPromise.reject(error).value()).toBe(error);
            });

        });

        it('isSettled returns settled status', () => {
            expect(BloodhoundPromise.resolve().isSettled()).toBe(true);
            expect(BloodhoundPromise.reject().isSettled()).toBe(true);
            expect(new BloodhoundPromise(setTimeout).isSettled()).toBe(false);
        });

        it('isResolved returns resolved status', () => {
            expect(BloodhoundPromise.resolve().isResolved()).toBe(true);
            expect(BloodhoundPromise.reject().isResolved()).toBe(false);
            expect(new BloodhoundPromise(setTimeout).isResolved()).toBe(false);
        });

        it('isRejected returns rejection status', () => {
            expect(BloodhoundPromise.resolve().isRejected()).toBe(false);
            expect(BloodhoundPromise.reject().isRejected()).toBe(true);
            expect(new BloodhoundPromise(setTimeout).isRejected()).toBe(false);
        });

        describe('done', () => {

            it('returns undefined', () =>
                expect(BloodhoundPromise.resolve().done()).toBeUndefined());

            it('calls callback if resolved', done => {
                BloodhoundPromise.resolve(123)
                    .done(value => {
                        expect(value).toBe(123);
                        done();
                    });
            });

            it('calls callback if rejected', done => {
                const error = new Error();
                BloodhoundPromise.config.setErrorHandler(Function.prototype);
                BloodhoundPromise.reject(error)
                    .done(value => {
                        expect(value).toBe(error);
                        done();
                    });
            });

            it('ignores rejections', done => {
                setTimeout(done);
                BloodhoundPromise.resolve(123).done(() =>
                    { throw new Error(); });
            });

        });

        describe('unwrap', () => {

            it('returns new Promise resolved with value', done => {
                const promise = BloodhoundPromise.resolve(123).unwrap();
                expect(promise instanceof Promise).toBe(true);
                expect(promise instanceof BloodhoundPromise).toBe(false);
                promise.then(value => {
                    expect(value).toBe(123);
                    done();
                });
            });

            it('returns new Promise rejected with reason', done => {
                const error = new Error();
                const promise = BloodhoundPromise.reject(error).unwrap();
                expect(promise instanceof Promise).toBe(true);
                expect(promise instanceof BloodhoundPromise).toBe(false);
                promise.catch(reason => {
                    expect(reason).toBe(error);
                    done();
                });
            });

        });

    });

});