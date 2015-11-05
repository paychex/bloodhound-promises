## Bloodhound
### Promises in JavaScript

## Installation

To install for node:

    npm install bloodhound-promises

Or the bower component:

    bower install bloodhound-promises

### Additional NPM Scripts

To run the Bloodhound-specific Jasmine unit tests:

    npm test

To execute Bloodhound against the Promise/A+ specification test suite:

    npm run-script verify

To generate JSDoc documentation in the build/dev/doc/bloodhound-promises folder:
    
    npm run-script doc

## Why Promises?

Promises are fantastic. They encapsulate a long-running operation into a simple object that
invokes callbacks based on the operation's success or failure.

But more than that, promises can be chained together into complex trees, where the root's
success or failure will depend on the success or failure of all its children.

This tree-like structure accurately represents much of the real-world transactional logic of
modern web applications.

## How Does Bloodhound Work?

Bloodhound promises work just like regular promises (in fact, it fully implements the
[A+ spec](https://promisesaplus.com/)), with a lot of the syntactic sugar that other promise
implementations have popularized.

`promise.done() : Promise`

Not all promise libraries have a done method, but it's vital to using promises correctly.
Basically, the golden rule of promises is:

    If you don't return the promise, you must call done.

Calling `done` is what tells Bloodhound to throw any unhandled rejections / exceptions so you
know if there is an error in your application. (Otherwise, your app could end up in an inconsistent
state.)

Let's look at an example:

    function loadMessages() {
        return new Promise(function(resolve, reject) {
            // do real stuff here and
            // call resolve(...) when done
        });
    }
    
    function loadAppData() {
        return new Promise(function(resolve, reject) {
            // do real stuff here and
            // call resolve(...) when done
        });
    }
    
    Promise.all([
        loadMessages(),
        loadAppData()
    ]).done();

What does the code do? Both `loadMessages` and `loadAppData` return a promise that would
be resolved once their data calls completed. Because the promises are being returned, we
do not call `done()` here -- after all, someone else will be consuming our promise, so we
can't throw any unhandled errors just yet.

Finally, we wrap our example promises in a call to `Promise.all`, a static method that
returns a promise which is only resolved if all child promises resolve.

Then we call `done()`, which waits until the promise is either resolved or rejected to
check for unhandled exceptions and also persist the timing data to any registered
collectors.

## Configuration

Bloodhound provides a number of ways to configure timings, collectors, and how
asynchronous operations are invoked.

### Scheduling Asynchronous Operations

`Promise.config.setScheduler(mySchedulerFunction)`

Use the specified function to invoke an asynchronous operation. By default, Bloodhound
uses `window.setTimeout` to execute an operation on the next tick of the clock.

In node environments, you may wish to use `process.nextTick`.

In Angular environments, you may wish to use `$rootScope.$digest.bind($rootScope)` to
ensure promise resolution occurs within the digest cycle.

Finally, if you're looking for the fastest possible async execution in modern browsers,
you could set the scheduler to use the MutationObserver:

    var i = 0,
        scheduled,
        node = document.createTextNode(''),
		o = new MutationObserver(run);

    o.observe(node, { characterData: true });

    function run() {
        var fn = scheduled;
        scheduled = void 0;
        fn();
    }

    Promise.config.setScheduler(function scheduler(fn) {
        scheduled = fn;
        node.data = (i ^= 1);
    });

### Pretty Stack Traces

In an effort to improve stack traces during errors, Bloodhound provides a few useful
features and configuration options.

First, any named callback methods will be passively tracked automatically. Anonymous
functions are not very helpful in stack traces, so by using named functions, you gain
both better stack traces.

    Promise.resolve('abc')
      .then(function myNamedCallback() { ... })
      .done();

Here is the resulting promise tree:

    parent
     └ myNamedCallback

You can enable pretty stack traces using the following method:

`Promise.config.prettyStacks.enable()`

With pretty stacks enabled, code like this...

    Promise.all([
        Promise.delay(50, 'child-1'),
        Promise.delay(20, 'child-2')
    ]).then(function callback(values) {
        return new Promise(function(resolve) {
            resolve('some value');
        }).then(function resolved() {
            throw new Error('inner');
        });
    }).done();

...will produce error output like this:

    ERROR
       at constructor: Promise
       at function: callback
       at constructor: Promise
       at function: resolved

      Error: inner
          at inner (filename:<line>)
          at parentSettled (Promise.js:<line>)
          at push (Promise.js:<line>)
          at ThenPromise (Promise.js:<line>)
          at invoke (Promise.js:<line>)
          at invoke (Promise.js:<line>)
          at throwError (Promise.js:<line>)
          at invoke (Promise.js:<line>)
          at Promise.js:<line>

**NOTE:** For performance reasons, the default state of Bloodhound is to *disable*
pretty stack traces. If you have enabled pretty stacks and wish to disable them again,
simply call:

`Promise.config.prettyStacks.disable()`

### Random Errors

`Promise.config.setRandomErrorRate(Number)`

Configures Bloodhound to randomly reject promises at the rate specified. You can pass
a number between 0 and 100 or between 0 and 1. The number represents the percent of time
a promise should be randomly rejected.

	Promise.config.setRandomErrorRate(0); // never reject; the default
	Promise.config.setRandomErrorRate(50); // reject half the time
	Promise.config.setRandomErrorRate(100); // reject 100% of the time

These are equivalent to:

	Promise.config.setRandomErrorRate(0); // never reject; the default
	Promise.config.setRandomErrorRate(0.5); // reject half the time
	Promise.config.setRandomErrorRate(1); // reject 100% of the time

Why Enable Random Errors? Unhandled promise rejections represent potential logical errors,
unexpected network problems, and/or inconsistent application state. Identifying and fixing
unhandled promise rejections ensures your application always recovers gracefully.

**NOTE:** The random error rate does *not* apply to `Promise.resolve` or `Promise.reject`.
These methods will always work as expected by resolving or rejecting with the specified
value or reason.

## Full API

### Promise constructor

You create a new instance of a Bloodhound promise by calling the constructor and
passing your 'resolver' function -- the method that will be run asynchronously
and either resolve or reject the promise:

    new Promise(function(resolve, reject, notify) {
        // this method will be invoked asynchronously;
        // when it completes, call resolve or reject;
        // if it throws an exception, reject will be
        // called automatically; if you want to notify
        // any listeners of progress updates, call
        // notify with any data you want your listeners
        // to receive (such as a progress percentage)
    });
    
### Static Methods

#### Promise.all(Array) : Promise

Resolves if all child promises resolve; rejects if any child promise rejects.

    Promise.all([
        Promise.delay(50, 'hello'),
        Promise.reject('world')
    ]).catch(function(reason) {
        log(reason); // 'world'
    }).done();

#### Promise.any(Array) : Promise

Resolves if any child promise resolves; rejects if all child promises reject.

    Promise.any([
        Promise.delay(50, 'hello'),
        Promise.reject('world')
    ]).then(function(value) {
        log(value); // 'hello'
    }).done();

#### Promise.apply(Function*[, Array]*) : Promise

Similar to `Promise.call`, but allows you to specify an optional array
of arguments.

    function someMethod() {
        var args = [].slice.call(arguments);
        return args.reduce(function(result, arg) {
            return result + arg;
        }, 0);
    }
    
    Promise.apply(someMethod, [10, 20, 30, 40])
        .then(function(result) {
            log(result); // 100
        }).done();

#### Promise.call(Function*[, arg1, arg2...]*) : Promise

Invokes the specified function with any optionally supplied arguments
passed in as parameters, and returns a promise. The promise will be
resolved with the return value of the function. If the function throws
an exception, the promise will be rejected with the exception data.

    function someMethod(a, b) {
        return a + b;
    }
    
    Promise.call(someMethod, 10, 20)
        .then(function(result) {
            log(result); // 30
        }).done();

#### Promise.cast(\*) : Promise

Converts the specified value into a Bloodhound promise using the following
rules:

 - If the value is a Bloodhound promise, it will be returned unaltered.
 - If the value is an Error, a promise will be returned that was immediately
   rejected with the Error data.
 - If the value is a "thenable" -- like a promise from another library, the
   returned promise will be resolved or rejected when the value is.
 - Otherwise, the returned promise will be immediately resolved with the
   given value.

Sample code:

    Promise.cast(new Date()).then(function(now) {
        log(now); // outputs the current date and time
    }).done();
    
    Promise.cast(new Error()).catch(function(err) {
        log(err); // outputs the error instance
    }).done();
    
    Promise.cast($q.when(123)).then(function(value) {
        log(value); // 123
    }).done();

#### Promise.defer() : Object

*DEPRECATED!* This method is only provided for compatibility with any existing
legacy promise code you may be using. You are encouraged instead to use the
Promise constructor to return a promise.

Returns an object with properties and methods you can use to manage an
asynchronous operation. 

    function doAsyncOperation() {
        var defer = Promise.defer();
        try {
            window.setTimeout(function() {
                // do some long-running
                // operation, then resolve
                // with the value you want
                // to pass to handlers:
                defer.resolve(...);
            });
        } catch (err) {
            defer.reject(err);
        }
        return defer.promise;
    }
    
    doAsyncOperation().then(...).done();

The preferred approach is to use the Promise constructor:

    function doAsyncOperation() {
        return new Promise(function(resolve, reject) {
            // do some long-running operation, then
            // resolve with the value you want to
            // pass to handlers; reject will be called
            // automatically if your method throws an
            // exception
            resolve(...);
        });
    }
    
    // how you use the result is the same:
    doAsyncOperation().then(...).done();

#### Promise.delay(Number*[, *]*) : Promise

Returns a promise that will be resolved with the specified value
after the given number of milliseconds. If you provide an instance
of an Error, the returned promise will be rejected when the given
number of milliseconds have elapsed.

This is more of a utility method that you can use during development
to simulate an asynchronous operation that results in a success or
failure.

    Promise.delay(100).then(function(value) {
        log(value); // undefined
    }).done();
    
    Promise.delay(45, 'abc').then(function(value) {
        log(value); // 'abc'
    }).done()
    
    Promise.delay(85, new Error()).catch(function(err) {
        log(err); // Error
    }).done();

#### Promise.hash(Object) : Promise

Returns a promise that will be resolved with an object. The object's keys will
match the keys of the object passed in, and the object's values will represent
the resolved values of the incoming object's promises, or the reasons it was
rejected.

    Promise.hash({
        'key1': 'you can use normal values',
        'key2': Promise.delay(30, 'and resolved values'),
        'key3': Promise.reject('even rejections')
    }).then(function(results) {
        log(results.key1); // 'you can use normal values'
        log(results.key2); // 'and resolved values'
        log(results.key3); // 'even rejections'
    }).done();

#### Promise.isPromise(\*) : Boolean

Returns `true` if the value is a Bloodhound promise or "thenable"
object; otherwise, returns `false`.

    log(Promise.isPromise(Q.when())); // true
    log(Promise.isPromise(Promise.cast())); // true
    log(Promise.isPromise(new Date())); // false

#### Promise.race(Array) : Promise

Resolves with the value of the first child to resolve. If no children
resolve, the promise will be rejected.

    Promise.race([
        Promise.delay(50, 'hello'),
        Promise.delay(20, 'world'),
        Promise.reject('reason')
    ]).then(function(value) {
        log(value); // 'world'
    }).done();

#### Promise.settle(Array) : Promise

Resolves with an array of all child promises once they have been resolved
or rejected. The resolved array will contain the values of any resolved
child promises and the reasons for any rejected child promises.

    Promise.settle([
        Promise.delay(50, 'hello'),
        Promise.delay(20, 'world'),
        Promise.reject(new Error('reason'))
    ]).then(function(results) {
        log(results); // ['hello', 'world', Error]
    }).done();

#### Promise.some(Array, Number) : Promise

Resolves if the specified number of child promises resolve; rejects if enough
promises reject that the specified count can't be reached.

    Promise.some([
        Promise.delay(50, 'hello'),
        Promise.delay(100, 'world'),
        Promise.reject('reason')
    ], 2).then(function(values) {
        log(values); // ['hello', 'world']
    }).done();

### Instance Methods

#### promise.then(*[Function[, Function[, Function]]]*) : Promise

Registers optional callbacks for success, failure, and notification,
and returns a new promise. If your success or failure callback returns
a value, it will become the new value of the returned promise. If
either callback throws an exception the returned promise will be rejected
with the error. If either callback returns a promise, the original
promise will be resolved or rejected with the returned promise.

    Promise.delay(20, (Math.random() * 10) % 2 === 0 ?
        new Error() : 'hello').then(
            function success(value) {
                log(value); // 'hello'
            },
            function failure(err) {
                log(err); // Error
            }).done();

    Promise.delay(10, 'a')
        .then(function(value) {
            log(value); // 'a'
            return 'b';
        }).then(function(value) {
            log(value); // 'b'
            return Promise.delay(30, 'c');
        }).then(function(value) {
            log(value); // 'c'
            return Promise.reject('some reason');
        }).catch(function(reason) {
            log(reason); // 'some reason'
        }).done();

#### promise.tap(*[Function]*) : Promise

Registers a callback that will be invoked when the promise resolves.
The callback will be provided with the resolved value, but anything
you return from the callback will be ignored. If your callback throws
an error, it will be ignored.

    Promise.delay(50, 'hello')
        .tap(function(value) {
            log(value); // 'hello'
            return 'world'; // ignored
        }).then(function(value) {
            log(value); // still 'hello'
            return value + ' world'; // not ignored
        }).then(function(value) {
            log(value); // 'hello world'
            return value;
        }).tap(function(value) {
            throw new Error('this is ignored');
        }).then(function(value) {
            log(value); // still 'hello world'
        }).done();

#### promise.catch(*[Function]*) : Promise

Registers a callback that will be invoked only if the promise is
rejected, and returns a new promise that will be resolved or rejected
based on the callback's behavior.

If the callback does not return anything, the returned promise will
be resolved. If the callback returns a value, the returned promise
will be resolved with that value. If the callback throws an exception
or returns a rejected promise, the child promise will be rejected.

    Promise.delay(50, new Error())
        .catch(function(err) {
            // by handling the error, the original
            // promise will switch from rejected
            // to resolve UNLESS we re-throw the
            // error or return a rejected promise
            throw err;
            // or: return Promise.reject(err);
        }).done();

    Promise.delay(40, new Error())
        .catch(function(err) {
            // let's handle the error; if we
            // do not return anything, then we
            // effectively "swallowed" the
            // rejection and converted this
            // to a resolved promise; if we
            // explicitly return a value, it
            // will become the new resolved
            // value for any chained handlers:
            return 'new value';
        }).then(function(value) {
            log(value); // 'new value'
        }).done();

The ability to swallow exceptions is just one reason why calling
`done()` is so important at the end of a promise chain. It ensures
that any *un-*handled exceptions are rethrown so your application
won't end up in an inconsistent state.

Finally, there is a subtle but important difference between using
`catch` and `then` to register failure callbacks. Look at the
following 2 code samples:

    var doStuff = function(resolve) {
            // pretend stuff happens here
            resolve(values);
        },
        
        success = function(results) {
            // process results
        },
        
        failure = function() {
            // log failure
        }

    return new Promise(doStuff).then(success, failure);
    return new Promise(doStuff).then(success).catch(failure);
    
What is the difference in the last 2 lines? In the first line, we
attached the failure callback to the `doStuff` method -- it will only
be invoked if that method throws an error or rejects.

But in the second line, we've attached the failure callback to
*both* `doStuff` and `success` -- now, if an error occurs in either
of those methods, `failure` will be called. This may be the behavior
you want. Or you may want to handle errors in `success` with special
logic:

    return new Promise(doStuff)
        .then(success, failure)
        .catch(function() {
            // success must have failed
        });

#### promise.notified(*[Function]*) : Promise

You can schedule a notification callback to be invoked whenever an
update is announced. Long-running operations can take advantage of
notification callbacks to present status data to the user (e.g. in
the form of a progress bar).

    new Promise(function(resolve, reject, update) {
        $('#myBar).css({width: 0}).show();
        // do long-running operation #1
        update(20); // 20% done
        // do long-running operation #2
        update(45);
        // do long-running operation #3
        update(70);
        // do long-running operation #4
        update(100);
    }).notified(function(percent) {
        $('#myBar').css({width: percent});
    }).finally(function() {
        $('#myBar').hide();
    });

The static methods `hash` and `settle` will call any registered
notification handlers automatically with the percent of promises
that have been settled at any point in time.

#### promise.finally(*[Function]*) : Promise

Allows you to register a callback that will be invoked when the
promise is settled, regardless of whether it was resolved or
rejected.

    Promise.delay(50, 'resolved')
        .finally(function(value) {
            log(value); // resolved
        }).done();

    Promise.delay(50, new Error())
        .finally(function(value) {
            log(value); // Error
        }).done();

#### promise.done() : Promise

This is a very important method. The golden rule of promises is:

    If you do not return the promise, you must call done.

Calling `done()` is what throws any unhandled rejections up to
the browser, ensuring any errors in your application can be found
and handled correctly. Look at the following example:

    Promise.resolve(new Date()).then(myHandler);

    // because we don't call done here, what would
    // happen if an exception occurred in the myHandler
    // method? we would never know the error occurred
    // because it would have been converted into a
    // rejected promise!

    Promise.resolve(new Date()).then(myHandler).done();
    
    // now any unhandled rejections will be propagated
    // up to the UI so we know a problem occurred

Calling `done()` also persists timing data to your collectors.
Because promises can be chained together into complex trees,
there is no other way for Bloodhound to know that you are done
constructing the promise tree and that it is safe to persist.

    function myLongRunningOperation() {
        // because we are returning the promise,
        // we DO NOT call done(); this ensures
        // callers can incorporate this promise
        // into their trees -- we have to rely
        // on them calling done() at the correct
        // time and place
        return Promise.delay(2000, 'sample data');
    }
    
    Promise.all([
        myLongRunningOperation(),
        someOtherLongRunningOperation(),
        anotherLongRunningOperation(),
        ...
    ]).done();
    
    // we call done() when it's finally safe to
    // look for unhandled exceptions

#### promise.timeout(Number*[, String]*) : Promise

If the promise is not settled in the amount of time specified,
automatically reject it. You can provide a custom rejection
string, or use the default of 'timed out'.

    Promise.delay(50).timeout(20); // rejects after 20ms with 'timed out'
    Promise.delay(50).timeout(100); // does not time out
    Promise.delay(50).timeout(20, 'too slow'); // rejects with 'too slow'

The original promise is returned from this method, so you can
continue chaining handlers:

    Promise.delay(50)
        .timeout(Math.random() * 100)
        .then(success, failure);

#### promise.spread(*[Function]*) : Promise

If the promise is resolved with an array, this method will invoke
the specified callback with each array value passed in as arguments.

    Promise.all([
        Promise.delay(40, 'a'),
        Promise.delay(10, 'b'),
        Promise.delay(20, 'c')
    ]).spread(function(a, b, c) {
        log(a, b, c); // 'a', 'b', 'c'
    }).done();

This can be a useful alternative to nesting promises. Without `all`,
you would've had to write code like this:

    Promise.delay(40, 'a').then(function(a) {
        Promise.delay(10, 'b').then(function(b) {
            Promise.delay(20, 'c').then(function(c) {
                log(a, b, c); // 'a', 'b', 'c'
            }).done();
        }).done();
    }).done();

#### promise.isRejected() : Boolean

Returns `true` if the promise has been rejected. If the promise
is resolved or has not yet been settled, it will return `false`.

    Promise.reject('reason').isRejected(); // true
    
    // but this returns false, because the promise has not
    // yet been rejected:
    Promise.delay(50, new Error()).isRejected();

#### promise.isResolved() : Boolean

Returns `true` if the promise has been resolved. If the promise
is rejected or not yet settled, returns `false`.

#### promise.isSettled() : Boolean

Returns `true` if the promise has either been resolved or
rejected. If the promise is still pending, returns `false`.

## Copyright

Copyright (c) 2015 Paychex, Inc.