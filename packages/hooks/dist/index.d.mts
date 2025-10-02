import React from 'react';

declare const getValueFromLocalStorage: (key: string, defaultValue: any) => any;
declare const setValueIntoLocalStorage: (key: string, value: any) => boolean;
declare const useLocalStorage: <T>(key: string, initialValue: T) => {
    readonly storedValue: T | null;
    readonly setValue: (value: T) => void;
    readonly clearValue: () => void;
};

declare const useOutsideClickDetector: (ref: React.RefObject<HTMLElement> | any, callback: () => void, useCapture?: boolean) => void;

declare const usePlatformOS: () => {
    isMobile: boolean;
    platform: string;
};

export { getValueFromLocalStorage, setValueIntoLocalStorage, useLocalStorage, useOutsideClickDetector, usePlatformOS };
