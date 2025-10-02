"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchStylesheet = exports.fetchStylesheets = exports.renderHtml = exports.Html = exports.default = void 0;
var Html_js_1 = require("./Html.js");
Object.defineProperty(exports, "default", { enumerable: true, get: function () { return __importDefault(Html_js_1).default; } });
Object.defineProperty(exports, "Html", { enumerable: true, get: function () { return __importDefault(Html_js_1).default; } });
var render_js_1 = require("./render.js");
Object.defineProperty(exports, "renderHtml", { enumerable: true, get: function () { return __importDefault(render_js_1).default; } });
var remoteCss_js_1 = require("./remoteCss.js");
Object.defineProperty(exports, "fetchStylesheets", { enumerable: true, get: function () { return remoteCss_js_1.fetchStylesheets; } });
Object.defineProperty(exports, "fetchStylesheet", { enumerable: true, get: function () { return remoteCss_js_1.fetchStylesheet; } });
//# sourceMappingURL=index.js.map