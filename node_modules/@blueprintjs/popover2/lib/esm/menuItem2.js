/*
 * Copyright 2022 Palantir Technologies, Inc. All rights reserved.
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
import { __assign, __extends, __rest } from "tslib";
import classNames from "classnames";
import * as React from "react";
import { AbstractPureComponent2, Classes as CoreClasses, DISPLAYNAME_PREFIX, Icon, Menu, removeNonHTMLProps, Text, Utils, } from "@blueprintjs/core";
import * as Classes from "./classes";
import { Popover2 } from "./popover2";
/**
 * Menu item (v2) component.
 *
 * @see https://blueprintjs.com/docs/#popover2-package/menu-item2
 */
var MenuItem2 = /** @class */ (function (_super) {
    __extends(MenuItem2, _super);
    function MenuItem2() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MenuItem2.prototype.render = function () {
        var _a, _b;
        var _c;
        var _d = this.props, active = _d.active, className = _d.className, children = _d.children, disabled = _d.disabled, elementRef = _d.elementRef, intent = _d.intent, labelClassName = _d.labelClassName, labelElement = _d.labelElement, multiline = _d.multiline, popoverProps = _d.popoverProps, _e = _d.roleStructure, roleStructure = _e === void 0 ? "menuitem" : _e, selected = _d.selected, shouldDismissPopover = _d.shouldDismissPopover, submenuProps = _d.submenuProps, text = _d.text, textClassName = _d.textClassName, _f = _d.tagName, tagName = _f === void 0 ? "a" : _f, htmlTitle = _d.htmlTitle, htmlProps = __rest(_d, ["active", "className", "children", "disabled", "elementRef", "intent", "labelClassName", "labelElement", "multiline", "popoverProps", "roleStructure", "selected", "shouldDismissPopover", "submenuProps", "text", "textClassName", "tagName", "htmlTitle"]);
        var _g = roleStructure === "listoption" // "listoption": parent has listbox role, or is a <select>
            ? [
                "option",
                undefined,
                (_c = this.props.icon) !== null && _c !== void 0 ? _c : (selected === undefined ? undefined : selected ? "small-tick" : "blank"),
                Boolean(selected), // aria-selected prop
            ]
            : roleStructure === "menuitem" // "menuitem": parent has menu role
                ? [
                    "none",
                    "menuitem",
                    this.props.icon,
                    undefined, // don't set aria-selected prop
                ]
                : roleStructure === "none" // "none": allows wrapping MenuItem in custom <li>
                    ? [
                        "none",
                        undefined,
                        this.props.icon,
                        undefined, // don't set aria-selected prop
                    ]
                    : // roleStructure === "listitem"
                        [
                            undefined,
                            undefined,
                            this.props.icon,
                            undefined, // don't set aria-selected prop
                        ], liRole = _g[0], targetRole = _g[1], icon = _g[2], ariaSelected = _g[3];
        var hasIcon = icon != null;
        var hasSubmenu = children != null;
        var intentClass = CoreClasses.intentClass(intent);
        var anchorClasses = classNames(CoreClasses.MENU_ITEM, intentClass, (_a = {},
            _a[CoreClasses.ACTIVE] = active,
            _a[CoreClasses.DISABLED] = disabled,
            // prevent popover from closing when clicking on submenu trigger or disabled item
            _a[Classes.POPOVER2_DISMISS] = shouldDismissPopover && !disabled && !hasSubmenu,
            _a[CoreClasses.SELECTED] = active && intentClass === undefined,
            _a), className);
        var target = React.createElement(tagName, __assign(__assign(__assign({ 
            // for menuitems, onClick when enter key pressed doesn't take effect like it does for a button-- fix this
            onKeyDown: Utils.clickElementOnKeyPress(["Enter", " "]), 
            // if hasSubmenu, must apply correct role and tabIndex to the outer Popover2 target <span> instead of this target element
            role: hasSubmenu ? "none" : targetRole, tabIndex: hasSubmenu ? -1 : 0 }, removeNonHTMLProps(htmlProps)), (disabled ? DISABLED_PROPS : {})), { className: anchorClasses }), hasIcon ? (
        // wrap icon in a <span> in case `icon` is a custom element rather than a built-in icon identifier,
        // so that we always render this class
        React.createElement("span", { className: CoreClasses.MENU_ITEM_ICON },
            React.createElement(Icon, { icon: icon, "aria-hidden": true, tabIndex: -1 }))) : undefined, React.createElement(Text, { className: classNames(CoreClasses.FILL, textClassName), ellipsize: !multiline, title: htmlTitle }, text), this.maybeRenderLabel(labelElement), hasSubmenu ? React.createElement(Icon, { className: CoreClasses.MENU_SUBMENU_ICON, icon: "caret-right" }) : undefined);
        var liClasses = classNames((_b = {}, _b[CoreClasses.MENU_SUBMENU] = hasSubmenu, _b));
        return (React.createElement("li", { className: liClasses, ref: elementRef, role: liRole, "aria-selected": ariaSelected }, this.maybeRenderPopover(target, { role: targetRole, tabIndex: 0 }, children)));
    };
    MenuItem2.prototype.maybeRenderLabel = function (labelElement) {
        var _a = this.props, label = _a.label, labelClassName = _a.labelClassName;
        if (label == null && labelElement == null) {
            return null;
        }
        return (React.createElement("span", { className: classNames(CoreClasses.MENU_ITEM_LABEL, labelClassName) },
            label,
            labelElement));
    };
    MenuItem2.prototype.maybeRenderPopover = function (target, popoverTargetProps, children) {
        if (children == null) {
            return target;
        }
        var _a = this.props, disabled = _a.disabled, popoverProps = _a.popoverProps, submenuProps = _a.submenuProps;
        return (React.createElement(Popover2, __assign({ autoFocus: false, captureDismiss: false, disabled: disabled, enforceFocus: false, hoverCloseDelay: 0, interactionKind: "hover", modifiers: SUBMENU_POPOVER_MODIFIERS, targetProps: popoverTargetProps, placement: "right-start", usePortal: false }, popoverProps, { content: React.createElement(Menu, __assign({}, submenuProps), children), minimal: true, popoverClassName: classNames(CoreClasses.MENU_SUBMENU, popoverProps === null || popoverProps === void 0 ? void 0 : popoverProps.popoverClassName) }), target));
    };
    MenuItem2.defaultProps = {
        active: false,
        disabled: false,
        multiline: false,
        popoverProps: {},
        selected: undefined,
        shouldDismissPopover: true,
        text: "",
    };
    MenuItem2.displayName = "".concat(DISPLAYNAME_PREFIX, ".MenuItem2");
    return MenuItem2;
}(AbstractPureComponent2));
export { MenuItem2 };
var SUBMENU_POPOVER_MODIFIERS = {
    // 20px padding - scrollbar width + a bit
    flip: { options: { rootBoundary: "viewport", padding: 20 }, enabled: true },
    // shift popover up 5px so MenuItems align
    offset: { options: { offset: [-5, 0] }, enabled: true },
    preventOverflow: { options: { rootBoundary: "viewport", padding: 20 }, enabled: true },
};
// props to ignore when disabled
var DISABLED_PROPS = {
    href: undefined,
    onClick: undefined,
    onMouseDown: undefined,
    onMouseEnter: undefined,
    onMouseLeave: undefined,
    tabIndex: -1,
};
//# sourceMappingURL=menuItem2.js.map