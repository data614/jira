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
import classNames from "classnames";
import * as React from "react";
import { Classes as CoreClasses, DISPLAYNAME_PREFIX } from "@blueprintjs/core";
import * as Classes from "./classes";
// eslint-disable-next-line import/no-cycle
import { Popover2 } from "./popover2";
import { TOOLTIP_ARROW_SVG_SIZE } from "./popover2Arrow";
import { Tooltip2Context, Tooltip2Provider } from "./tooltip2Context";
/**
 * Tooltip (v2) component.
 *
 * @see https://blueprintjs.com/docs/#popover2-package/tooltip2
 */
export class Tooltip2 extends React.PureComponent {
    static displayName = `${DISPLAYNAME_PREFIX}.Tooltip2`;
    static defaultProps = {
        compact: false,
        hoverCloseDelay: 0,
        hoverOpenDelay: 100,
        interactionKind: "hover-target",
        minimal: false,
        transitionDuration: 100,
    };
    popoverRef = React.createRef();
    render() {
        // if we have an ancestor Tooltip2Context, we should take its state into account in this render path,
        // it was likely created by a parent ContextMenu2
        return (React.createElement(Tooltip2Context.Consumer, null, ([state]) => React.createElement(Tooltip2Provider, { ...state }, this.renderPopover)));
    }
    reposition() {
        this.popoverRef.current?.reposition();
    }
    // any descendant ContextMenu2s may update this ctxState
    renderPopover = (ctxState) => {
        const { children, compact, disabled, intent, popoverClassName, ...restProps } = this.props;
        const popoverClasses = classNames(Classes.TOOLTIP2, CoreClasses.intentClass(intent), popoverClassName, {
            [CoreClasses.COMPACT]: compact,
        });
        return (React.createElement(Popover2, { modifiers: {
                arrow: {
                    enabled: !this.props.minimal,
                },
                offset: {
                    options: {
                        offset: [0, TOOLTIP_ARROW_SVG_SIZE / 2],
                    },
                },
            }, ...restProps, autoFocus: false, canEscapeKeyClose: false, disabled: ctxState.forceDisabled ?? disabled, enforceFocus: false, lazy: true, popoverClassName: popoverClasses, portalContainer: this.props.portalContainer, ref: this.popoverRef }, children));
    };
}
//# sourceMappingURL=tooltip2.js.map