import * as React from "react";
import { IntentProps } from "@blueprintjs/core";
import { Popover2InteractionKind } from "./popover2";
import { DefaultPopover2TargetHTMLProps, Popover2SharedProps } from "./popover2SharedProps";
export declare type Tooltip2Props<TProps extends DefaultPopover2TargetHTMLProps = DefaultPopover2TargetHTMLProps> = ITooltip2Props<TProps>;
/** @deprecated use Tooltip2Props */
export interface ITooltip2Props<TProps extends DefaultPopover2TargetHTMLProps = DefaultPopover2TargetHTMLProps> extends Omit<Popover2SharedProps<TProps>, "shouldReturnFocusOnClose">, IntentProps {
    /**
     * The content that will be displayed inside of the tooltip.
     */
    content: JSX.Element | string;
    /**
     * Whether to use a compact appearance, which reduces the visual padding around
     * tooltip content.
     *
     * @default false
     */
    compact?: boolean;
    /**
     * The amount of time in milliseconds the tooltip should remain open after
     * the user hovers off the trigger. The timer is canceled if the user mouses
     * over the target before it expires.
     *
     * @default 0
     */
    hoverCloseDelay?: number;
    /**
     * The amount of time in milliseconds the tooltip should wait before opening
     * after the user hovers over the trigger. The timer is canceled if the user
     * mouses away from the target before it expires.
     *
     * @default 100
     */
    hoverOpenDelay?: number;
    /**
     * The kind of hover interaction that triggers the display of the tooltip.
     * Tooltips do not support click interactions.
     *
     * @default PopoverInteractionKind.HOVER_TARGET_ONLY
     */
    interactionKind?: typeof Popover2InteractionKind.HOVER | typeof Popover2InteractionKind.HOVER_TARGET_ONLY;
    /**
     * Indicates how long (in milliseconds) the tooltip's appear/disappear
     * transition takes. This is used by React `CSSTransition` to know when a
     * transition completes and must match the duration of the animation in CSS.
     * Only set this prop if you override Blueprint's default transitions with
     * new transitions of a different length.
     *
     * @default 100
     */
    transitionDuration?: number;
}
/**
 * Tooltip (v2) component.
 *
 * @see https://blueprintjs.com/docs/#popover2-package/tooltip2
 */
export declare class Tooltip2<T extends DefaultPopover2TargetHTMLProps = DefaultPopover2TargetHTMLProps> extends React.PureComponent<Tooltip2Props<T>> {
    static displayName: string;
    static defaultProps: Partial<Tooltip2Props>;
    private popoverRef;
    render(): JSX.Element;
    reposition(): void;
    private renderPopover;
}
