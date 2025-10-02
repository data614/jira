"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCache = void 0;
const createCache = ({ limit = 100 } = {}) => {
    let cache = {};
    let keys = [];
    return {
        get: (key) => cache[key],
        set: (key, value) => {
            keys.push(key);
            if (keys.length > limit) {
                delete cache[keys.shift()];
            }
            cache[key] = value;
        },
        reset: () => {
            cache = {};
            keys = [];
        },
        length: () => keys.length,
    };
};
exports.createCache = createCache;
//# sourceMappingURL=cache.js.map