import * as React from "react";
import { AbstractPureComponent2 } from "../../common";
import { Props } from "../../common/props";
export interface DialogBodyProps extends Props {
    /** Dialog body contents. */
    children?: React.ReactNode;
    /**
     * Enable scrolling for the container
     *
     * @default true
     */
    useOverflowScrollContainer?: boolean;
}
/**
 * Dialog body component.
 *
 * @see https://blueprintjs.com/docs/#core/components/dialog.dialog-body-props
 */
export declare class DialogBody extends AbstractPureComponent2<DialogBodyProps> {
    static defaultProps: DialogBodyProps;
    render(): JSX.Element;
}
