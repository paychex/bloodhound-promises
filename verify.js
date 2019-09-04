require('@babel/register')({
    plugins: [
        '@babel/plugin-transform-modules-commonjs'
    ]
});

const wrap = require('./index').default;
const BloodhoundPromise = wrap(Promise);

exports.resolved = BloodhoundPromise.resolve;
exports.rejected = BloodhoundPromise.reject;
exports.deferred = BloodhoundPromise.defer;

// exports.resolved = function() {
//     return Promise.resolve.apply(Promise, arguments);
// };

// exports.rejected = function() {
//     return Promise.reject.apply(Promise, arguments);
// };

// exports.deferred = function() {
//     var result = {};
//     result.promise = new Promise(function(resolve, reject) {
//         result.resolve = resolve;
//         result.reject = reject;
//     });
//     return result;
// };
