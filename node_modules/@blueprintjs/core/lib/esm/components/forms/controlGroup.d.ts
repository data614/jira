import * as React from "react";
import { AbstractPureComponent2 } from "../../common";
import { HTMLDivProps, IElementRefProps, Props } from "../../common/props";
export declare type ControlGroupProps = IControlGroupProps;
/** @deprecated use ControlGroupProps */
export interface IControlGroupProps extends Props, HTMLDivProps, IElementRefProps<HTMLDivElement> {
    /** Group contents. */
    children?: React.ReactNode;
    /**
     * Whether the control group should take up the full width of its container.
     *
     * @default false
     */
    fill?: boolean;
    /**
     * Whether the control group should appear with vertical styling.
     *
     * @default false
     */
    vertical?: boolean;
}
/**
 * Control group component.
 *
 * @see https://blueprintjs.com/docs/#core/components/control-group
 */
export declare class ControlGroup extends AbstractPureComponent2<ControlGroupProps> {
    static displayName: string;
    render(): JSX.Element;
}
