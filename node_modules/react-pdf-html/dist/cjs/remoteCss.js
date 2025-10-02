"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchStylesheets = exports.fetchStylesheet = exports.CSS_CACHE = void 0;
const node_html_parser_1 = require("node-html-parser");
const parse_js_1 = require("./parse.js");
const cache_js_1 = require("./cache.js");
exports.CSS_CACHE = (0, cache_js_1.createCache)({ limit: 30 });
const fetchStylesheet = (src, fetchOptions, cache = true) => __awaiter(void 0, void 0, void 0, function* () {
    let image;
    if (cache && exports.CSS_CACHE.get(src)) {
        return exports.CSS_CACHE.get(src);
    }
    else {
        image = yield (yield fetch(src, fetchOptions)).text();
    }
    if (!image) {
        throw new Error('Cannot resolve image');
    }
    if (cache) {
        exports.CSS_CACHE.set(src, image);
    }
    return image;
});
exports.fetchStylesheet = fetchStylesheet;
const fetchStylesheets = (html, fetchOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const document = (0, node_html_parser_1.parse)(html, { comment: false });
    const stylesheets = [];
    const promises = document
        .querySelectorAll('link[rel="stylesheet"][href]')
        .map((styleNode) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const styleText = yield (0, exports.fetchStylesheet)(styleNode.getAttribute('href'), fetchOptions);
            if (styleText) {
                stylesheets.push((0, parse_js_1.convertStylesheet)(styleText));
            }
        }
        catch (e) {
            console.error(`Unable to get remote CSS file ${styleNode.getAttribute('href')}`, e);
        }
    }));
    try {
        yield Promise.all(promises);
    }
    catch (e) { }
    return stylesheets;
});
exports.fetchStylesheets = fetchStylesheets;
//# sourceMappingURL=remoteCss.js.map