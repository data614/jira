import { ResizeObserverEntry } from "@juggle/resize-observer";
import * as React from "react";
import { AbstractPureComponent2 } from "@blueprintjs/core";
/** `ResizeSensor2` requires a single DOM element child and will error otherwise. */
export interface ResizeSensor2Props {
    /**
     * Single child, must be an element and not a string or fragment.
     */
    children: JSX.Element;
    /**
     * Callback invoked when the wrapped element resizes.
     *
     * The `entries` array contains an entry for each observed element. In the
     * default case (no `observeParents`), the array will contain only one
     * element: the single child of the `ResizeSensor`.
     *
     * Note that this method is called _asynchronously_ after a resize is
     * detected and typically it will be called no more than once per frame.
     */
    onResize: (entries: ResizeObserverEntry[]) => void;
    /**
     * If `true`, all parent DOM elements of the container will also be
     * observed for size changes. The array of entries passed to `onResize`
     * will now contain an entry for each parent element up to the root of the
     * document.
     *
     * Only enable this prop if a parent element resizes in a way that does
     * not also cause the child element to resize.
     *
     * @default false
     */
    observeParents?: boolean;
    /**
     * If you attach a `ref` to the child yourself when rendering it, you must pass the
     * same value here (otherwise, ResizeSensor won't be able to attach its own).
     */
    targetRef?: React.Ref<any>;
}
export declare class ResizeSensor2 extends AbstractPureComponent2<ResizeSensor2Props> {
    static displayName: string;
    private targetRef;
    private prevElement;
    private observer;
    render(): JSX.Element;
    componentDidMount(): void;
    componentDidUpdate(prevProps: ResizeSensor2Props): void;
    componentWillUnmount(): void;
    /**
     * Observe the DOM element, if defined and different from the currently
     * observed element. Pass `force` argument to skip element checks and always
     * re-observe.
     */
    private observeElement;
}
