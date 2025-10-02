import * as React from "react";
import { AbstractPureComponent2, Position } from "../../common";
import { Props } from "../../common/props";
import { ToastProps } from "./toast";
export declare type ToastOptions = IToastOptions;
/** @deprecated use ToastOptions */
export declare type IToastOptions = ToastProps & {
    key: string;
};
export declare type ToasterPosition = typeof Position.TOP | typeof Position.TOP_LEFT | typeof Position.TOP_RIGHT | typeof Position.BOTTOM | typeof Position.BOTTOM_LEFT | typeof Position.BOTTOM_RIGHT;
/** @deprecated use ToasterInstance */
export declare type IToaster = ToasterInstance;
/** Public API methods available on a `<OverlayToaster>` component instance. */
export interface ToasterInstance {
    /**
     * Shows a new toast to the user, or updates an existing toast corresponding to the provided key (optional).
     *
     * Returns the unique key of the toast.
     */
    show(props: ToastProps, key?: string): string;
    /** Dismiss the given toast instantly. */
    dismiss(key: string): void;
    /** Dismiss all toasts instantly. */
    clear(): void;
    /** Returns the props for all current toasts. */
    getToasts(): ToastOptions[];
}
/**
 * Props supported by the `OverlayToaster` component.
 *
 * These props can be passed as an argument to the static `OverlayToaster.create(props?, container?)` method.
 */
export interface OverlayToasterProps extends Props {
    /**
     * Whether a toast should acquire application focus when it first opens.
     * This is disabled by default so that toasts do not interrupt the user's flow.
     * Note that `enforceFocus` is always disabled for `Toaster`s.
     *
     * @default false
     */
    autoFocus?: boolean;
    /**
     * Whether pressing the `esc` key should clear all active toasts.
     *
     * @default true
     */
    canEscapeKeyClear?: boolean;
    /** Optional toast elements. */
    children?: React.ReactNode;
    /**
     * Whether the toaster should be rendered into a new element attached to `document.body`.
     * If `false`, then positioning will be relative to the parent element.
     *
     * This prop is ignored by `OverlayToaster.create()` as that method always appends a new element
     * to the container.
     *
     * @default true
     */
    usePortal?: boolean;
    /**
     * Position of `Toaster` within its container.
     *
     * @default Position.TOP
     */
    position?: ToasterPosition;
    /**
     * The maximum number of active toasts that can be displayed at once.
     *
     * When the limit is about to be exceeded, the oldest active toast is removed.
     *
     * @default undefined
     */
    maxToasts?: number;
}
export interface IToasterState {
    toasts: ToastOptions[];
}
/**
 * Default Toaster component which renders toasts inside an Overlay.
 *
 * @see https://blueprintjs.com/docs/#core/components/toast.toaster
 */
export declare class OverlayToaster extends AbstractPureComponent2<OverlayToasterProps, IToasterState> implements ToasterInstance {
    static displayName: string;
    static defaultProps: OverlayToasterProps;
    /**
     * Create a new `Toaster` instance that can be shared around your application.
     * The `Toaster` will be rendered into a new element appended to the given container.
     */
    static create(props?: OverlayToasterProps, container?: HTMLElement): ToasterInstance;
    state: IToasterState;
    private toastId;
    show(props: ToastProps, key?: string): string;
    dismiss(key: string, timeoutExpired?: boolean): void;
    clear(): void;
    getToasts(): IToastOptions[];
    render(): JSX.Element;
    protected validateProps({ maxToasts }: OverlayToasterProps): void;
    private isNewToastKey;
    private dismissIfAtLimit;
    private renderToast;
    private createToastOptions;
    private getPositionClasses;
    private getDismissHandler;
    private handleClose;
}
/** @deprecated use the new, more specific component name `OverlayToaster` instead (forwards-compatible with v5) */
export declare const Toaster: typeof OverlayToaster;
/** @deprecated use the new, more specific type `ToasterInstance` instead (forwards-compatible with v5) */
export declare type Toaster = OverlayToaster;
/** @deprecated use `OverlayToasterProps` instead */
export declare type IToasterProps = OverlayToasterProps;
