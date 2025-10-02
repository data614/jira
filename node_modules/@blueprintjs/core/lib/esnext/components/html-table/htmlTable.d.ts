import * as React from "react";
import { AbstractPureComponent2, IElementRefProps } from "../../common";
export declare type HTMLTableProps = IHTMLTableProps;
/** @deprecated use HTMLTableProps */
export interface IHTMLTableProps extends React.TableHTMLAttributes<HTMLTableElement>, IElementRefProps<HTMLTableElement> {
    /** Enable borders between rows and cells. */
    bordered?: boolean;
    /** Use compact appearance with less padding. */
    compact?: boolean;
    /**
     * Use small, condensed appearance.
     *
     * @deprecated use `compact` instead
     */
    condensed?: boolean;
    /** Enable hover styles on rows. */
    interactive?: boolean;
    /** Use an alternate background color on odd-numbered rows. */
    striped?: boolean;
}
/**
 * HTML table component.
 *
 * @see https://blueprintjs.com/docs/#core/components/html-table
 */
export declare class HTMLTable extends AbstractPureComponent2<HTMLTableProps> {
    render(): JSX.Element;
}
