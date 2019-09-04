import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import { uglify } from 'rollup-plugin-uglify';

export default [{
    input: 'index.js',
    output: {
        format: 'umd',
        name: 'Bloodhound',
        file: 'dist/bloodhound.js'
    },
    external: [],
    plugins: [
        json(),
        resolve({
            browser: true,
            preferBuiltins: true
        }),
        commonjs(),
        builtins(),
        globals(),
        babel({
            'presets': [
                ['@babel/env', {
                    'modules': false,
                    'targets': 'ie 11, last 2 versions'
                }]
            ]
        }),
    ]
}, {
    input: 'dist/bloodhound.js',
    output: {
        format: 'umd',
        name: 'Bloodhound',
        file: 'dist/boodhound.min.js'
    },
    external: [],
    plugins: [
        commonjs(),
        uglify()
    ]
}];