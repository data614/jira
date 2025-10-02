"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  getValueFromLocalStorage: () => getValueFromLocalStorage,
  setValueIntoLocalStorage: () => setValueIntoLocalStorage,
  useLocalStorage: () => useLocalStorage,
  useOutsideClickDetector: () => useOutsideClickDetector,
  usePlatformOS: () => usePlatformOS
});
module.exports = __toCommonJS(index_exports);

// src/use-local-storage.tsx
var import_react = require("react");
var getValueFromLocalStorage = (key, defaultValue) => {
  if (typeof window === void 0 || typeof window === "undefined") return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    window.localStorage.removeItem(key);
    return defaultValue;
  }
};
var setValueIntoLocalStorage = (key, value) => {
  if (typeof window === void 0 || typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    return false;
  }
};
var useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = (0, import_react.useState)(() => getValueFromLocalStorage(key, initialValue));
  const setValue = (0, import_react.useCallback)(
    (value) => {
      window.localStorage.setItem(key, JSON.stringify(value));
      setStoredValue(value);
      window.dispatchEvent(new Event(`local-storage:${key}`));
    },
    [key]
  );
  const clearValue = (0, import_react.useCallback)(() => {
    window.localStorage.removeItem(key);
    setStoredValue(null);
    window.dispatchEvent(new Event(`local-storage:${key}`));
  }, [key]);
  const reHydrate = (0, import_react.useCallback)(() => {
    const data = getValueFromLocalStorage(key, initialValue);
    setStoredValue(data);
  }, [key, initialValue]);
  (0, import_react.useEffect)(() => {
    window.addEventListener(`local-storage:${key}`, reHydrate);
    return () => {
      window.removeEventListener(`local-storage:${key}`, reHydrate);
    };
  }, [key, reHydrate]);
  return { storedValue, setValue, clearValue };
};

// src/use-outside-click-detector.tsx
var import_react2 = require("react");
var useOutsideClickDetector = (ref, callback, useCapture = false) => {
  const handleClick = (event) => {
    var _a;
    if (ref.current && !ref.current.contains(event.target)) {
      const preventOutsideClickElement = (_a = event.target) == null ? void 0 : _a.closest(
        "[data-prevent-outside-click]"
      );
      if (preventOutsideClickElement) {
        return;
      }
      callback();
    }
  };
  (0, import_react2.useEffect)(() => {
    document.addEventListener("mousedown", handleClick, useCapture);
    return () => {
      document.removeEventListener("mousedown", handleClick, useCapture);
    };
  });
};

// src/use-platform-os.tsx
var import_react3 = require("react");
var usePlatformOS = () => {
  const [platformData, setPlatformData] = (0, import_react3.useState)({
    isMobile: false,
    platform: ""
  });
  (0, import_react3.useEffect)(() => {
    const detectPlatform = () => {
      const userAgent = window.navigator.userAgent;
      const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
      let platform = "";
      if (!isMobile) {
        if (userAgent.indexOf("Win") !== -1) {
          platform = "Windows";
        } else if (userAgent.indexOf("Mac") !== -1) {
          platform = "MacOS";
        } else if (userAgent.indexOf("Linux") !== -1) {
          platform = "Linux";
        } else {
          platform = "Unknown";
        }
      }
      setPlatformData({ isMobile, platform });
    };
    detectPlatform();
  }, []);
  return platformData;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getValueFromLocalStorage,
  setValueIntoLocalStorage,
  useLocalStorage,
  useOutsideClickDetector,
  usePlatformOS
});
