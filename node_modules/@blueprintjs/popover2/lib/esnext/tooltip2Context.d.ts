import * as React from "react";
export interface Tooltip2ContextState {
    forceDisabled?: boolean;
}
declare type Tooltip2Action = {
    type: "FORCE_DISABLED_STATE";
} | {
    type: "RESET_DISABLED_STATE";
};
export declare const Tooltip2Context: React.Context<[Tooltip2ContextState, React.Dispatch<Tooltip2Action>]>;
interface Tooltip2ProviderProps {
    children: React.ReactNode | ((ctxState: Tooltip2ContextState) => React.ReactNode);
    forceDisable?: boolean;
}
export declare const Tooltip2Provider: ({ children, forceDisable }: Tooltip2ProviderProps) => JSX.Element;
export {};
