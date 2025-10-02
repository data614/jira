export declare const createCache: ({ limit }?: {
    limit?: number | undefined;
}) => {
    get: (key: string) => any;
    set: (key: string, value: any) => void;
    reset: () => void;
    length: () => number;
};
