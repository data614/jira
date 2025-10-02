"use strict";
/*
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextMenu2 = void 0;
var tslib_1 = require("tslib");
var classnames_1 = tslib_1.__importDefault(require("classnames"));
var React = tslib_1.__importStar(require("react"));
var core_1 = require("@blueprintjs/core");
var Classes = tslib_1.__importStar(require("./classes"));
var contextMenu2Popover_1 = require("./contextMenu2Popover");
var tooltip2Context_1 = require("./tooltip2Context");
/**
 * Context menu (v2) component.
 *
 * @see https://blueprintjs.com/docs/#popover2-package/context-menu2
 */
exports.ContextMenu2 = React.forwardRef(function (props, userRef) {
    var className = props.className, children = props.children, content = props.content, _a = props.disabled, disabled = _a === void 0 ? false : _a, onClose = props.onClose, onContextMenu = props.onContextMenu, popoverProps = props.popoverProps, _b = props.tagName, tagName = _b === void 0 ? "div" : _b, restProps = tslib_1.__rest(props, ["className", "children", "content", "disabled", "onClose", "onContextMenu", "popoverProps", "tagName"]);
    // ancestor Tooltip2Context state doesn't affect us since we don't care about parent ContextMenu2s, we only want to
    // force disable parent Tooltip2s in certain cases through dispatching actions
    // N.B. any calls to this dispatch function will be no-ops if there is no Tooltip2Provider ancestor of this component
    var _c = React.useContext(tooltip2Context_1.Tooltip2Context), tooltipCtxDispatch = _c[1];
    // click target offset relative to the viewport (e.clientX/clientY), since the target will be rendered in a Portal
    var _d = React.useState(undefined), targetOffset = _d[0], setTargetOffset = _d[1];
    // hold a reference to the click mouse event to pass to content/child render functions
    var _e = React.useState(), mouseEvent = _e[0], setMouseEvent = _e[1];
    var _f = React.useState(false), isOpen = _f[0], setIsOpen = _f[1];
    // we need a ref on the child element (or the wrapper we generate) to check for dark theme
    var childRef = React.useRef(null);
    // If disabled prop is changed, we don't want our old context menu to stick around.
    // If it has just been enabled (disabled = false), then the menu ought to be opened by
    // a new mouse event. Users should not be updating this prop in the onContextMenu callback
    // for this component (that will lead to unpredictable behavior).
    React.useEffect(function () {
        setIsOpen(false);
        tooltipCtxDispatch({ type: "RESET_DISABLED_STATE" });
    }, [disabled]);
    var handlePopoverClose = React.useCallback(function () {
        setIsOpen(false);
        setMouseEvent(undefined);
        tooltipCtxDispatch({ type: "RESET_DISABLED_STATE" });
        onClose === null || onClose === void 0 ? void 0 : onClose();
    }, []);
    // if the menu was just opened, we should check for dark theme (but don't do this on every render)
    var isDarkTheme = React.useMemo(function () { return core_1.Utils.isDarkTheme(childRef.current); }, [childRef, isOpen]);
    var contentProps = React.useMemo(function () { return ({
        isOpen: isOpen,
        mouseEvent: mouseEvent,
        targetOffset: targetOffset,
    }); }, [isOpen, mouseEvent, targetOffset]);
    // create a memoized function to render the menu so that we can call it if necessary in the "contextmenu" event
    // handler which runs before this render function has a chance to re-run and update the `menu` variable
    var renderMenu = React.useCallback(function (menuContentProps) {
        return disabled ? undefined : core_1.Utils.isFunction(content) ? content(menuContentProps) : content;
    }, [disabled, content]);
    var menuContent = React.useMemo(function () { return renderMenu(contentProps); }, [contentProps, renderMenu]);
    // only render the popover if there is content in the context menu;
    // this avoid doing unnecessary rendering & computation
    var maybePopover = menuContent === undefined ? undefined : (React.createElement(contextMenu2Popover_1.ContextMenu2Popover, tslib_1.__assign({}, popoverProps, { content: menuContent, isDarkTheme: isDarkTheme, isOpen: isOpen, targetOffset: targetOffset, onClose: handlePopoverClose })));
    var handleContextMenu = React.useCallback(function (e) {
        // support nested menus (inner menu target would have called preventDefault())
        if (e.defaultPrevented) {
            return;
        }
        // If disabled, we should avoid the extra work in this event handler.
        // Otherwise: if using the child or content function APIs, we need to make sure contentProps gets updated,
        // so we handle the event regardless of whether the consumer returned an undefined menu.
        var shouldHandleEvent = !disabled && (core_1.Utils.isFunction(children) || core_1.Utils.isFunction(content) || content !== undefined);
        if (shouldHandleEvent) {
            setIsOpen(true);
            e.persist();
            setMouseEvent(e);
            var newTargetOffset = { left: e.clientX, top: e.clientY };
            setTargetOffset(newTargetOffset);
            tooltipCtxDispatch({ type: "FORCE_DISABLED_STATE" });
            var newMenuContent = renderMenu({ isOpen: true, mouseEvent: e, targetOffset: newTargetOffset });
            if (newMenuContent === undefined) {
                // If there is no menu content, we shouldn't automatically swallow the contextmenu event, since the
                // user probably wants to fall back to default browser behavior. If they still want to disable the
                // native context menu in that case, they can do so with their own `onContextMenu` handler.
            }
            else {
                e.preventDefault();
            }
        }
        onContextMenu === null || onContextMenu === void 0 ? void 0 : onContextMenu(e);
    }, [children, onContextMenu, menuContent, renderMenu]);
    var containerClassName = (0, classnames_1.default)(className, Classes.CONTEXT_MENU2);
    var child = core_1.Utils.isFunction(children) ? (children({
        className: containerClassName,
        contentProps: contentProps,
        onContextMenu: handleContextMenu,
        popover: maybePopover,
        ref: childRef,
    })) : (React.createElement(React.Fragment, null,
        maybePopover,
        React.createElement(tagName, tslib_1.__assign({ className: containerClassName, onContextMenu: handleContextMenu, ref: (0, core_1.mergeRefs)(childRef, userRef) }, restProps), children)));
    // force descendant Tooltip2s to be disabled when this context menu is open
    return React.createElement(tooltip2Context_1.Tooltip2Provider, { forceDisable: isOpen }, child);
});
exports.ContextMenu2.displayName = "Blueprint.ContextMenu2";
//# sourceMappingURL=contextMenu2.js.map