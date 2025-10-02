/// <reference types="react" />
import { AbstractPureComponent2, Boundary, BreadcrumbProps, OverflowListProps, Props } from "@blueprintjs/core";
import { Popover2Props } from "./popover2";
export { BreadcrumbProps };
export interface Breadcrumbs2Props extends Props {
    /**
     * Callback invoked to render visible breadcrumbs. Best practice is to
     * render a `<Breadcrumb>` element. If `currentBreadcrumbRenderer` is also
     * supplied, that callback will be used for the current breadcrumb instead.
     *
     * @default Breadcrumb
     */
    breadcrumbRenderer?: (props: BreadcrumbProps) => JSX.Element;
    /**
     * Which direction the breadcrumbs should collapse from: start or end.
     *
     * @default Boundary.START
     */
    collapseFrom?: Boundary;
    /**
     * Callback invoked to render the current breadcrumb, which is the last
     * element in the `items` array.
     *
     * If this prop is omitted, `breadcrumbRenderer` will be invoked for the
     * current breadcrumb instead.
     */
    currentBreadcrumbRenderer?: (props: BreadcrumbProps) => JSX.Element;
    /**
     * All breadcrumbs to display. Breadcrumbs that do not fit in the container
     * will be rendered in an overflow menu instead.
     */
    items: readonly BreadcrumbProps[];
    /**
     * The minimum number of visible breadcrumbs that should never collapse into
     * the overflow menu, regardless of DOM dimensions.
     *
     * @default 0
     */
    minVisibleItems?: number;
    /**
     * Props to spread to `OverflowList`. Note that `items`,
     * `overflowRenderer`, and `visibleItemRenderer` cannot be changed.
     */
    overflowListProps?: Partial<Omit<OverflowListProps<BreadcrumbProps>, "items" | "overflowRenderer" | "visibleItemRenderer">>;
    /**
     * Props to spread to the popover showing the overflow menu.
     */
    popoverProps?: Partial<Omit<Popover2Props, "content" | "defaultIsOpen" | "disabled" | "fill" | "renderTarget" | "targetTagName">>;
}
/**
 * Breadcrumbs (v2) component.
 *
 * @see https://blueprintjs.com/docs/#popover2-package/breadcrumbs2
 */
export declare class Breadcrumbs2 extends AbstractPureComponent2<Breadcrumbs2Props> {
    static defaultProps: Partial<Breadcrumbs2Props>;
    render(): JSX.Element;
    private renderOverflow;
    private renderOverflowBreadcrumb;
    private renderBreadcrumbWrapper;
    private renderBreadcrumb;
}
