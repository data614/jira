import { IntercomInstance } from "./types";

const scriptElementId = "_intercom_npm_loader";
// This holds a queue of commands to be passed to the messenger widget API after it is added to the page
const queueHolder: {
  (): void;
  q: any[];
  loaderQueue: (args: any) => void;
} = function () {
  queueHolder.loaderQueue(arguments);
};
queueHolder.q = [];
queueHolder.loaderQueue = function (args: any) {
  queueHolder.q.push(args);
};

const addWidgetToPage = function () {
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
    "https://widget.intercom.io/widget/" + window.intercomSettings?.app_id;
  var x = d.getElementsByTagName("script")[0];
  x.parentNode?.insertBefore(s, x);
};

const isDocumentReady = () =>
  document.readyState === "complete" || document.readyState === "interactive";

export const init = async () => {
  var w = window;
  var ic = w.Intercom;
  if (w.intercomSettings) {
    w.intercomSettings.installation_type = "npm-package";
  }
  if (typeof ic === "function") {
    ic("reattach_activator");
    ic("update", w.intercomSettings);
  } else {
    w.Intercom = queueHolder;
    if (isDocumentReady()) {
      addWidgetToPage();
    } else {
      document.addEventListener("readystatechange", function () {
        if (isDocumentReady()) {
          addWidgetToPage();
        }
      });
      if (w.attachEvent) {
        w.attachEvent("onload", addWidgetToPage);
      } else {
        w.addEventListener("load", addWidgetToPage, false);
      }
    }
  }
};

export let ref: IntercomInstance | undefined = undefined;
export const getIntercomRef = () => {
  if (typeof window !== "undefined" && !ref) {
    ref = window.Intercom;
  }
  if (!ref || typeof window === "undefined") {
    console.warn("Intercom not booted or setup incomplete.");
    if (typeof window === "undefined") {
      console.warn("Are you sure you are running on client-side?");
    }
    return () => {};
  }
  return ref;
};
