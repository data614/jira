import { HtmlStyles } from './styles.js';
export declare const CSS_CACHE: {
    get: (key: string) => any;
    set: (key: string, value: any) => void;
    reset: () => void;
    length: () => number;
};
export declare const fetchStylesheet: (src: string, fetchOptions?: RequestInit, cache?: boolean) => Promise<any>;
export declare const fetchStylesheets: (html: string, fetchOptions?: RequestInit) => Promise<HtmlStyles[]>;
