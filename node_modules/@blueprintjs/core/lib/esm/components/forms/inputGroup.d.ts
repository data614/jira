import * as React from "react";
import { AbstractPureComponent2 } from "../../common";
import { ControlledProps2, HTMLInputProps, IControlledProps, IntentProps, MaybeElement, Props } from "../../common/props";
import { IconName } from "../icon/icon";
import type { InputSharedProps } from "./inputSharedProps";
/** @deprecated use InputGroupProps2 */
export declare type InputGroupProps = IInputGroupProps;
/**
 * @deprecated use InputGroupProps2.
 *
 * NOTE: This interface does not extend HTMLInputProps due to incompatiblity with `IControlledProps`.
 * Instead, we union the props in the component definition, which does work and properly disallows `string[]` values.
 */
export interface IInputGroupProps extends IControlledProps, IntentProps, Props {
    /**
     * Set this to `true` if you will be controlling the `value` of this input with asynchronous updates.
     * These may occur if you do not immediately call setState in a parent component with the value from
     * the `onChange` handler, or if working with certain libraries like __redux-form__.
     *
     * @default false
     */
    asyncControl?: boolean;
    /**
     * Whether the input is disabled.
     *
     * Note that `rightElement` must be disabled separately; this prop will not affect it.
     *
     * @default false
     */
    disabled?: boolean;
    /**
     * Whether the component should take up the full width of its container.
     */
    fill?: boolean;
    /** Ref handler or a ref object that receives HTML `<input>` element backing this component. */
    inputRef?: React.Ref<HTMLInputElement>;
    /**
     * Element to render on the left side of input.
     * This prop is mutually exclusive with `leftIcon`.
     */
    leftElement?: JSX.Element;
    /**
     * Name of a Blueprint UI icon to render on the left side of the input group,
     * before the user's cursor.  This prop is mutually exclusive with `leftElement`.
     * Usage with content is deprecated.  Use `leftElement` for elements.
     */
    leftIcon?: IconName | MaybeElement;
    /** Whether this input should use large styles. */
    large?: boolean;
    /** Whether this input should use small styles. */
    small?: boolean;
    /** Placeholder text in the absence of any value. */
    placeholder?: string;
    /**
     * Whether the input is read-only.
     *
     * Note that `rightElement` must be disabled or made read-only separately;
     * this prop will not affect it.
     *
     * @default false
     */
    readOnly?: boolean;
    /**
     * Element to render on right side of input.
     * For best results, use a minimal button, tag, or small spinner.
     */
    rightElement?: JSX.Element;
    /** Whether the input (and any buttons) should appear with rounded caps. */
    round?: boolean;
    /**
     * HTML `input` type attribute.
     *
     * @default "text"
     */
    type?: string;
}
/** @deprecated use InputGroupProps2 */
export declare type IInputGroupProps2 = InputGroupProps2;
export interface InputGroupProps2 extends Omit<HTMLInputProps, keyof ControlledProps2>, ControlledProps2, InputSharedProps {
    /**
     * Set this to `true` if you will be controlling the `value` of this input with asynchronous updates.
     * These may occur if you do not immediately call setState in a parent component with the value from
     * the `onChange` handler, or if working with certain libraries like __redux-form__.
     *
     * @default false
     */
    asyncControl?: boolean;
    /** Whether this input should use large styles. */
    large?: boolean;
    /** Whether this input should use small styles. */
    small?: boolean;
    /** Whether the input (and any buttons) should appear with rounded caps. */
    round?: boolean;
    /**
     * Name of the HTML tag that contains the input group.
     *
     * @default "div"
     */
    tagName?: keyof JSX.IntrinsicElements;
    /**
     * HTML `input` type attribute.
     *
     * @default "text"
     */
    type?: string;
}
export interface IInputGroupState {
    leftElementWidth?: number;
    rightElementWidth?: number;
}
/**
 * Input group component.
 *
 * @see https://blueprintjs.com/docs/#core/components/text-inputs.input-group
 */
export declare class InputGroup extends AbstractPureComponent2<InputGroupProps2, IInputGroupState> {
    static displayName: string;
    state: IInputGroupState;
    private leftElement;
    private rightElement;
    private refHandlers;
    render(): React.ReactElement<{
        className: string;
    }, string | React.JSXElementConstructor<any>>;
    componentDidMount(): void;
    componentDidUpdate(prevProps: InputGroupProps2): void;
    protected validateProps(props: InputGroupProps2): void;
    private maybeRenderLeftElement;
    private maybeRenderRightElement;
    private updateInputWidth;
}
