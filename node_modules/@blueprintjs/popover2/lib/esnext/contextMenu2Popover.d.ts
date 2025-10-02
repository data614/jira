import * as React from "react";
import { ContextMenu2PopoverOptions, Offset } from "./contextMenu2Shared";
export interface ContextMenu2PopoverProps extends ContextMenu2PopoverOptions {
    isOpen: boolean;
    isDarkTheme?: boolean;
    content: JSX.Element;
    onClose?: () => void;
    targetOffset: Offset | undefined;
}
/**
 * A floating popover which is positioned at a given target offset inside its parent element container.
 * Used to display context menus. Note that this behaves differently from other popover components like
 * Popover2 and Tooltip2, which wrap their children with interaction handlers -- if you're looking for the whole
 * interaction package, use ContextMenu2 instead.
 *
 * @see https://blueprintjs.com/docs/#popover2-package/context-menu2-popover
 */
export declare const ContextMenu2Popover: React.NamedExoticComponent<ContextMenu2PopoverProps>;
