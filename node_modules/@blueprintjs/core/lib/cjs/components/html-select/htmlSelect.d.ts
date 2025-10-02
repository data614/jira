import * as React from "react";
import { AbstractPureComponent2 } from "../../common";
import { IElementRefProps, OptionProps } from "../../common/props";
import { Extends } from "../../common/utils";
import { IconName, IconProps } from "../icon/icon";
export declare type HTMLSelectIconName = Extends<IconName, "double-caret-vertical" | "caret-down">;
export declare type HTMLSelectProps = IHTMLSelectProps;
/** @deprecated use HTMLSelectProps */
export interface IHTMLSelectProps extends IElementRefProps<HTMLSelectElement>, React.SelectHTMLAttributes<HTMLSelectElement> {
    children?: React.ReactNode;
    /** Whether this element is non-interactive. */
    disabled?: boolean;
    /** Whether this element should fill its container. */
    fill?: boolean;
    /**
     * Name of one of the supported icons for this component to display on the right side of the element.
     *
     * @default "double-caret-vertical"
     */
    iconName?: HTMLSelectIconName;
    /**
     * Props to spread to the `<Icon>` element.
     *
     * Note that `iconProps.icon` is deprecated and will be removed in Blueprint v5; use `iconName` instead.
     */
    iconProps?: Partial<IconProps>;
    /** Whether to use large styles. */
    large?: boolean;
    /** Whether to use minimal styles. */
    minimal?: boolean;
    /** Multiple select is not supported. */
    multiple?: never;
    /** Change event handler. Use `event.currentTarget.value` to access the new value. */
    onChange?: React.ChangeEventHandler<HTMLSelectElement>;
    /**
     * Shorthand for supplying options: an array of basic types or
     * `{ label?, value }` objects. If no `label` is supplied, `value`
     * will be used as the label.
     */
    options?: ReadonlyArray<string | number | OptionProps>;
    /** Controlled value of this component. */
    value?: string | number;
}
/**
 * HTML select component
 *
 * @see https://blueprintjs.com/docs/#core/components/html-select
 */
export declare class HTMLSelect extends AbstractPureComponent2<HTMLSelectProps> {
    render(): JSX.Element;
}
