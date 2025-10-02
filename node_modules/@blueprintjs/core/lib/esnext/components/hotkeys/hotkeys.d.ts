import * as React from "react";
import { AbstractPureComponent2 } from "../../common";
import { IHotkeysProps } from "./hotkeysTypes";
/**
 * Hotkeys component.
 *
 * @see https://blueprintjs.com/docs/#core/components/hotkeys
 */
export declare class Hotkeys extends AbstractPureComponent2<IHotkeysProps> {
    static displayName: string;
    static defaultProps: {
        tabIndex: number;
    };
    render(): JSX.Element | null;
    protected validateProps(props: IHotkeysProps & {
        children: React.ReactNode;
    }): void;
}
