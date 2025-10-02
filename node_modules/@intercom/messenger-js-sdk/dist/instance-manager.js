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
exports.getIntercomRef = exports.ref = exports.init = void 0;
const scriptElementId = "_intercom_npm_loader";
// This holds a queue of commands to be passed to the messenger widget API after it is added to the page
const queueHolder = function () {
    queueHolder.loaderQueue(arguments);
};
queueHolder.q = [];
queueHolder.loaderQueue = function (args) {
    queueHolder.q.push(args);
};
const addWidgetToPage = function () {
    var _a, _b;
    var d = document;
    if (d.getElementById(scriptElementId)) {
        // script is already in DOM
        return;
    }
    var s = d.createElement("script");
    s.type = "text/javascript";
    s.async = true;
    s.id = scriptElementId;
    s.src =
        "https://widget.intercom.io/widget/" + ((_a = window.intercomSettings) === null || _a === void 0 ? void 0 : _a.app_id);
    var x = d.getElementsByTagName("script")[0];
    (_b = x.parentNode) === null || _b === void 0 ? void 0 : _b.insertBefore(s, x);
};
const isDocumentReady = () => document.readyState === "complete" || document.readyState === "interactive";
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    var w = window;
    var ic = w.Intercom;
    if (w.intercomSettings) {
        w.intercomSettings.installation_type = "npm-package";
    }
    if (typeof ic === "function") {
        ic("reattach_activator");
        ic("update", w.intercomSettings);
    }
    else {
        w.Intercom = queueHolder;
        if (isDocumentReady()) {
            addWidgetToPage();
        }
        else {
            document.addEventListener("readystatechange", function () {
                if (isDocumentReady()) {
                    addWidgetToPage();
                }
            });
            if (w.attachEvent) {
                w.attachEvent("onload", addWidgetToPage);
            }
            else {
                w.addEventListener("load", addWidgetToPage, false);
            }
        }
    }
});
exports.init = init;
exports.ref = undefined;
const getIntercomRef = () => {
    if (typeof window !== "undefined" && !exports.ref) {
        exports.ref = window.Intercom;
    }
    if (!exports.ref || typeof window === "undefined") {
        console.warn("Intercom not booted or setup incomplete.");
        if (typeof window === "undefined") {
            console.warn("Are you sure you are running on client-side?");
        }
        return () => { };
    }
    return exports.ref;
};
exports.getIntercomRef = getIntercomRef;
