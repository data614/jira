// src/use-local-storage.tsx
import { useState, useEffect, useCallback } from "react";
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
  const [storedValue, setStoredValue] = useState(() => getValueFromLocalStorage(key, initialValue));
  const setValue = useCallback(
    (value) => {
      window.localStorage.setItem(key, JSON.stringify(value));
      setStoredValue(value);
      window.dispatchEvent(new Event(`local-storage:${key}`));
    },
    [key]
  );
  const clearValue = useCallback(() => {
    window.localStorage.removeItem(key);
    setStoredValue(null);
    window.dispatchEvent(new Event(`local-storage:${key}`));
  }, [key]);
  const reHydrate = useCallback(() => {
    const data = getValueFromLocalStorage(key, initialValue);
    setStoredValue(data);
  }, [key, initialValue]);
  useEffect(() => {
    window.addEventListener(`local-storage:${key}`, reHydrate);
    return () => {
      window.removeEventListener(`local-storage:${key}`, reHydrate);
    };
  }, [key, reHydrate]);
  return { storedValue, setValue, clearValue };
};

// src/use-outside-click-detector.tsx
import { useEffect as useEffect2 } from "react";
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
  useEffect2(() => {
    document.addEventListener("mousedown", handleClick, useCapture);
    return () => {
      document.removeEventListener("mousedown", handleClick, useCapture);
    };
  });
};

// src/use-platform-os.tsx
import { useState as useState2, useEffect as useEffect3 } from "react";
var usePlatformOS = () => {
  const [platformData, setPlatformData] = useState2({
    isMobile: false,
    platform: ""
  });
  useEffect3(() => {
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
export {
  getValueFromLocalStorage,
  setValueIntoLocalStorage,
  useLocalStorage,
  useOutsideClickDetector,
  usePlatformOS
};
