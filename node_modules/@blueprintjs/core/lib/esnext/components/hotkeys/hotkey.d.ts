/// <reference types="react" />
import { AbstractPureComponent2, Props } from "../../common";
import { HotkeyConfig } from "../../hooks";
/** @deprecated */
export declare type IHotkeyProps = Props & HotkeyConfig;
export declare type HotkeyProps = IHotkeyProps;
/**
 * Hotkey component.
 *
 * @see https://blueprintjs.com/docs/#core/components/hotkeys
 */
export declare class Hotkey extends AbstractPureComponent2<HotkeyProps> {
    static displayName: string;
    static defaultProps: {
        allowInInput: boolean;
        disabled: boolean;
        global: boolean;
        preventDefault: boolean;
        stopPropagation: boolean;
    };
    render(): JSX.Element;
    protected validateProps(props: HotkeyProps): void;
}
