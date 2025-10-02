import * as IntercomTypes from "./types";
import { regionAPIs } from "./constants";
import { init, getIntercomRef, ref } from "./instance-manager";

export const Intercom = (props: IntercomTypes.InitType) => {
  if (typeof props !== "object") {
    console.warn("Intercom initialiser called with invalid parameters.");
    return;
  }
  const { region = "us", ...args } = props;
  if (typeof window !== "undefined" && !ref) {
    window.intercomSettings = {
      ...args,
      api_base: regionAPIs.get(region),
    };
    init();
  }
};
// Public functions that can be called from outside the module
export default Intercom;
export const boot = (arg: IntercomTypes.IntercomSettings) => {
  getIntercomRef()("boot", arg);
};
export const shutdown = () => {
  getIntercomRef()("shutdown");
};
export const update = (arg: IntercomTypes.UserArgs) => {
  getIntercomRef()("update", arg);
};
export const hide = () => {
  getIntercomRef()("hide");
};
export const show = () => {
  getIntercomRef()("show");
};
export const showSpace = (spaceName: string) => {
  getIntercomRef()("showSpace", spaceName);
};
export const showMessages = () => {
  getIntercomRef()("showMessages");
};
export const showNewMessage = (prePopulatedContent: string) => {
  getIntercomRef()("showNewMessage", prePopulatedContent);
};
export const onHide = (callback: Function) => {
  getIntercomRef()("onHide", callback);
};
export const onShow = (callback: Function) => {
  getIntercomRef()("onShow", callback);
};
export const onUnreadCountChange = (callback: Function) => {
  getIntercomRef()("onUnreadCountChange", callback);
};
export const trackEvent = (...args: any) => {
  getIntercomRef()("trackEvent", ...args);
};
export const getVisitorId = () => {
  getIntercomRef()("getVisitorId");
};
export const startTour = (tourId: string) => {
  getIntercomRef()("startTour", tourId);
};
export const showArticle = (articleId: string) => {
  getIntercomRef()("showArticle", articleId);
};
export const showNews = (newsItemId: string) => {
  getIntercomRef()("showNews", newsItemId);
};
export const startSurvey = (surveyId: string) => {
  getIntercomRef()("startSurvey", surveyId);
};
export const startChecklist = (checklistId: string) => {
  getIntercomRef()("startChecklist", checklistId);
};
export const showTicket = (ticketId: string) => {
  getIntercomRef()("showTicket", ticketId);
};
export const showConversation = (conversationId: string) => {
  getIntercomRef()("showConversation", conversationId);
};
export const onUserEmailSupplied = (callback: Function) => {
  getIntercomRef()("onUserEmailSupplied", callback);
};
