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
