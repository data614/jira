import { OverlayLifecycleProps } from "@blueprintjs/core";
import { Popover2Props } from "./popover2";
export declare type Offset = {
    left: number;
    top: number;
};
/**
 * A limited subset of props to forward along to the context menu popover overlay.
 *
 * Overriding `placement` is not recommended, as users expect context menus to open towards the bottom right
 * of their cursor, which is the default placement. However, this option is provided to help with rare cases where
 * the menu is triggered at the bottom and/or right edge of a window and the built-in popover flipping behavior does
 * not work effectively.
 */
export declare type ContextMenu2PopoverOptions = OverlayLifecycleProps & Pick<Popover2Props, "placement" | "popoverClassName" | "transitionDuration" | "popoverRef" | "rootBoundary">;
