"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function walk(obj) {
    if (!obj || typeof obj !== 'object') {
        return obj;
    }
    if (isDate(obj) || isRegex(obj)) {
        return obj;
    }
    if (isArray(obj)) {
        return map(obj, walk);
    }
    return reduce(objectKeys(obj), function (acc, key) {
        const camel = camelCase(key);
        acc[camel] = walk(obj[key]);
        return acc;
    }, {});
}
function camelCase(str) {
    return str.replace(/[_.-](\w|$)/g, function (_, x) {
        return x.toUpperCase();
    });
}
const isArray = Array.isArray ||
    function (obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    };
const isDate = function (obj) {
    return Object.prototype.toString.call(obj) === '[object Date]';
};
const isRegex = function (obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]';
};
const has = Object.prototype.hasOwnProperty;
const objectKeys = Object.keys ||
    function (obj) {
        const keys = [];
        for (const key in obj) {
            if (has.call(obj, key)) {
                keys.push(key);
            }
        }
        return keys;
    };
function map(xs, f) {
    if (xs.map) {
        return xs.map(f);
    }
    const res = [];
    for (let i = 0; i < xs.length; i++) {
        res.push(f(xs[i], i));
    }
    return res;
}
function reduce(xs, f, acc) {
    if (xs.reduce) {
        return xs.reduce(f, acc);
    }
    for (let i = 0; i < xs.length; i++) {
        acc = f(acc, xs[i], i);
    }
    return acc;
}
const camelize = function (obj) {
    if (typeof obj === 'string') {
        return camelCase(obj);
    }
    return walk(obj);
};
exports.default = camelize;
//# sourceMappingURL=camelize.js.map