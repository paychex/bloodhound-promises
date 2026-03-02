# bloodhound-promises

Promises with extra features.

## Installation

```bash
npm install bloodhound-promises
```

### Additional Commands

#### run unit tests

```bash
npm test
```

#### verify against the Promise/A+ specification test suite

```bash
npm run verify
```

#### generate documentation in the `docs/` folder

```bash
npm run docs
```

#### generate UMD bundle in the `dist/` folder

```bash
npm run build
```

## Why Promises

Promises are fantastic. They encapsulate a long-running operation into a simple object that invokes callbacks based on the operation's success or failure.

## Why Bloodhound

Bloodhound wraps (but will not modify) your favorite Promise implementation. This means you can continue to use the Promise library you like best, but now with extra syntactic sugar that makes writing Promise code a bit easier.

### API

Wrapping a Promise constructor in Bloodhound makes the following changes:

#### Static Changes

- `Promise.timeout` created.
- `Promise.unwrap` created.
- `Promise.apply/fapply` created.
- `Promise.call/fcall/try/attempt` created.
- `Promise.config.setErrorHandler` created.
- `Promise.config.setAsyncNotifier` created.
- Promise constructor callback will be invoked with a 3rd "notify" function…which does nothing.
- `Promise.defer.resolve` will reject the promise if an Error instance if provided.
- `Promise.some` will accept an array or object and resolve with the same type.
- `Promise.all` will accept an array or object and resolve with the same type.
- `Promise.any` will accept an array or object and resolve with the same type.
- `Promise.settle` will accept an array or object and resolve with the same type.
- `Promise.resolve` will return a rejected promise if an Error instance is provided.
- `Promise.cast/when` will return a rejected promise if an Error instance is provided.
- `Promise.delay` will return a rejected promise if an Error instance is provided.

#### Instance Changes

- `promise.done` created.
- `promise.spread` created.
- `promise.timeout` created.
- `promise.value/getValue` created.
- `promise.isResolved` created.
- `promise.isRejected` created.
- `promise.isSettled` created.
- `promise.unwrap` created.
- `promise.then` will return a rejected promise if an Error instance is returned from a callback.
- `promise.then` will invoke the handler registered using `Promise.config.setAsyncNotifier.`
- `promise.catch/else` will return a rejected promise if an Error instance is returned from a callback.
- `promise.catch/else` can be passed an array of Error types to conditionally invoke the callback.
- `promise.catch/else` will swallow a rejection if no callback is provided.
- `Promise.tap` will not reject, even when a rejected promise is returned from the callback.
- `Promise.finally` will pass the callback the resolved value or rejection reason.

These API changes enable code like the following:

```js
import asBloodhound from 'bloodhound-promises';

const BloodhoundPromise = asBloodhound(Promise);
const stop = log.startTiming('async operation');

BloodhoundPromise.delay(10)
  .then(() => doSomethingAsync())
  .timeout(15000, new Error('async operation timed out'))
  .tap((result) => log.event('received value:', result))
  .catch('TypeError', 'EvalError', (e) => log.error(e))
  .done((result) => stop({ result }));
```

Here are some additional benefits of using Bloodhound:

### Scheduling

Because Bloodhound uses the wrapped Promise's own microtask scheduler, you never have to worry about timing issues between Bloodhound and your chose Promise implementation.

For example:

```javascript
import asBloodhound from 'bloodhound-promises';

const unmodified = Promise.resolve();
const bloodhound = asBloodhound(Promise).resolve();

unmodified.then(() => console.log('called 1'));
bloodhound.then(() => console.log('called 2')); // our callback
unmodified.then(() => console.log('called 3'));
```

Output:

```
> "called 1"
> "called 2"
> "called 3"
```

### Original Promise Unmodified

Bloodhound doesn't modify the Promise implementation it wraps. This ensures that your legacy and 3rd-party code remains unaffected. You can also get access to a new instance of your original promise at any time by calling `unwrap()`.

### Explicit Promise Chains

Promise implementations have no deterministic way to know when a promise chain has ended. This makes it impossible to know when to announce an unhandled rejection. Bloodhound adds a special chain terminator method called `done()` that indicates the promise chain has ended and it is safe to announce any unhandled rejections.

Basically, the golden rule of promises is:

> If you don't return the promise, you must call done().

Calling `done()` is what tells Bloodhound to throw any unhandled rejections so you
know if there is an error in your application. Without this feature, your app could end up in an inconsistent state.

Let's look at an example:

```javascript
import asBloodhound from 'bloodhound-promises';

const BloodhoundPromise = asBloodhound(Promise);

function getUserData(userId) {
    return new BloodhoundPromise(function(resolve, reject) {
        // do real stuff here and
        // call resolve(...) when done
    });
}

function getFeatureSwitches() {
    return new BloodhoundPromise(function(resolve, reject) {
        // do real stuff here and
        // call resolve(...) when done
    });
}

BloodhoundPromise.all([
    getUserData(),
    getFeatureSwitches()
]).done();
```

What does the code do? Both `loadMessages` and `loadAppData` return a promise that will resolve once their data calls complete. Because the promises are being returned, we do not call `done()` -- after all, we need these promises for our call to `BloodhoundPromise.all`, so we can't end the chain just yet.

Then, we wrap our promises in a call to `BloodhoundPromise.all`, a static method that returns a promise which is only resolved if all child promises resolve.

Finally, we call `done()`, which waits until the promise is either resolved or rejected to check for unhandled exceptions. If one of our data calls failed, an error will be thrown at this point. Otherwise, the error might be swallowed.

### Easy Configuration

Bloodhound is configurable.

#### custom handler for any unhandled rejections

When `done()` is called on a rejected promise, Bloodhound's default behavior is to throw that rejection reason in a new stack frame. You can change this behavior:

```javascript
BloodhoundPromise.config.setErrorHandler(function handler(reason) {
    myTrackingLibrary.logError(reason);
});
```

#### callback for asynchronous operations

Sometimes you want to know that an asynchronous operation has occurred so you can perform change detection. Frameworks like AngularJS need this information to ensure that bindings are updated correctly.

```javascript
angular.module('myapp', ['ng'])
    .run(['$rootScope', function checkForChanges($rootScope) {
        function checkChanges() {
            $rootScope.$applyAsync();
        }
        BloodhoundPromise.config.setAsyncNotifier(checkChanges);
    }]);
```

### Promise Interop

Bloodhound works with any Promise implementation.

```javascript
import Q from 'q';
import when from 'when';
import * as Bluebird from "bluebird";
import asBloodhound from 'bloodhound-promises';

const BloodhoundPromise = asBloodhound(Promise);

BloodhoundPromise.resolve('xyz')
    .then(() => Q('abc'))
    .then(() => when.resolve('def'))
    .then(() => Bluebird.resolve('ghi'))
    .then(console.log); // 'ghi'
```

## Copyright

Copyright (c) 2019 Paychex, Inc.
