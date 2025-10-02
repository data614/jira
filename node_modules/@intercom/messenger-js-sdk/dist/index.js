"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onUserEmailSupplied = exports.showConversation = exports.showTicket = exports.startChecklist = exports.startSurvey = exports.showNews = exports.showArticle = exports.startTour = exports.getVisitorId = exports.trackEvent = exports.onUnreadCountChange = exports.onShow = exports.onHide = exports.showNewMessage = exports.showMessages = exports.showSpace = exports.show = exports.hide = exports.update = exports.shutdown = exports.boot = exports.Intercom = void 0;
const constants_1 = require("./constants");
const instance_manager_1 = require("./instance-manager");
const Intercom = (props) => {
    if (typeof props !== "object") {
        console.warn("Intercom initialiser called with invalid parameters.");
        return;
    }
    const { region = "us" } = props, args = __rest(props, ["region"]);
    if (typeof window !== "undefined" && !instance_manager_1.ref) {
        window.intercomSettings = Object.assign(Object.assign({}, args), { api_base: constants_1.regionAPIs.get(region) });
        (0, instance_manager_1.init)();
    }
};
exports.Intercom = Intercom;
// Public functions that can be called from outside the module
exports.default = exports.Intercom;
const boot = (arg) => {
    (0, instance_manager_1.getIntercomRef)()("boot", arg);
};
exports.boot = boot;
const shutdown = () => {
    (0, instance_manager_1.getIntercomRef)()("shutdown");
};
exports.shutdown = shutdown;
const update = (arg) => {
    (0, instance_manager_1.getIntercomRef)()("update", arg);
};
exports.update = update;
const hide = () => {
    (0, instance_manager_1.getIntercomRef)()("hide");
};
exports.hide = hide;
const show = () => {
    (0, instance_manager_1.getIntercomRef)()("show");
};
exports.show = show;
const showSpace = (spaceName) => {
    (0, instance_manager_1.getIntercomRef)()("showSpace", spaceName);
};
exports.showSpace = showSpace;
const showMessages = () => {
    (0, instance_manager_1.getIntercomRef)()("showMessages");
};
exports.showMessages = showMessages;
const showNewMessage = (prePopulatedContent) => {
    (0, instance_manager_1.getIntercomRef)()("showNewMessage", prePopulatedContent);
};
exports.showNewMessage = showNewMessage;
const onHide = (callback) => {
    (0, instance_manager_1.getIntercomRef)()("onHide", callback);
};
exports.onHide = onHide;
const onShow = (callback) => {
    (0, instance_manager_1.getIntercomRef)()("onShow", callback);
};
exports.onShow = onShow;
const onUnreadCountChange = (callback) => {
    (0, instance_manager_1.getIntercomRef)()("onUnreadCountChange", callback);
};
exports.onUnreadCountChange = onUnreadCountChange;
const trackEvent = (...args) => {
    (0, instance_manager_1.getIntercomRef)()("trackEvent", ...args);
};
exports.trackEvent = trackEvent;
const getVisitorId = () => {
    (0, instance_manager_1.getIntercomRef)()("getVisitorId");
};
exports.getVisitorId = getVisitorId;
const startTour = (tourId) => {
    (0, instance_manager_1.getIntercomRef)()("startTour", tourId);
};
exports.startTour = startTour;
const showArticle = (articleId) => {
    (0, instance_manager_1.getIntercomRef)()("showArticle", articleId);
};
exports.showArticle = showArticle;
const showNews = (newsItemId) => {
    (0, instance_manager_1.getIntercomRef)()("showNews", newsItemId);
};
exports.showNews = showNews;
const startSurvey = (surveyId) => {
    (0, instance_manager_1.getIntercomRef)()("startSurvey", surveyId);
};
exports.startSurvey = startSurvey;
const startChecklist = (checklistId) => {
    (0, instance_manager_1.getIntercomRef)()("startChecklist", checklistId);
};
exports.startChecklist = startChecklist;
const showTicket = (ticketId) => {
    (0, instance_manager_1.getIntercomRef)()("showTicket", ticketId);
};
exports.showTicket = showTicket;
const showConversation = (conversationId) => {
    (0, instance_manager_1.getIntercomRef)()("showConversation", conversationId);
};
exports.showConversation = showConversation;
const onUserEmailSupplied = (callback) => {
    (0, instance_manager_1.getIntercomRef)()("onUserEmailSupplied", callback);
};
exports.onUserEmailSupplied = onUserEmailSupplied;
