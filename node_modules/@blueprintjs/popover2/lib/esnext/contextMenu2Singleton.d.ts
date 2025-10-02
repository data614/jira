import { ContextMenu2PopoverProps } from "./contextMenu2Popover";
/**
 * Show a context menu at a particular offset from the top-left corner of the document.
 * The menu will appear below-right of this point and will flip to below-left if there is not enough
 * room onscreen. Additional props like `onClose`, `isDarkTheme`, etc. can be forwarded to the `<ContextMenu2Popover>`.
 *
 * Context menus created with this API will automatically close when a user clicks outside the popover.
 * You may force them to close by using `hideContextMenu()`.
 *
 * Note that this API relies on global state in the @blueprintjs/popover2 package, and should be used with caution,
 * especially if your build system allows multiple copies of Blueprint libraries to be bundled into an application at
 * once.
 *
 * Alternative APIs to consider which do not have the limitations of global state:
 *  - `<ContextMenu2>`
 *  - `<ContextMenu2Popover>`
 *
 * @see https://blueprintjs.com/docs/#popover2-package/context-menu2-popover.imperative-api
 */
export declare function showContextMenu(props: Omit<ContextMenu2PopoverProps, "isOpen">): void;
/**
 * Hide a context menu that was created using `showContextMenu()`.
 *
 * Note that this API relies on global state in the @blueprintjs/popover2 package, and should be used with caution.
 *
 * @see https://blueprintjs.com/docs/#popover2-package/context-menu2-popover.imperative-api
 */
export declare function hideContextMenu(): void;
