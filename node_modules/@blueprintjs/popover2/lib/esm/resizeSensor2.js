/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
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
import { __extends } from "tslib";
import { ResizeObserver } from "@juggle/resize-observer";
import * as React from "react";
import { AbstractPureComponent2, DISPLAYNAME_PREFIX } from "@blueprintjs/core";
var ResizeSensor2 = /** @class */ (function (_super) {
    __extends(ResizeSensor2, _super);
    function ResizeSensor2() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.targetRef = React.createRef();
        _this.prevElement = undefined;
        _this.observer = new ResizeObserver(function (entries) { var _a, _b; return (_b = (_a = _this.props).onResize) === null || _b === void 0 ? void 0 : _b.call(_a, entries); });
        return _this;
    }
    ResizeSensor2.prototype.render = function () {
        var onlyChild = React.Children.only(this.props.children);
        // if we're provided a ref to the child already, we don't need to attach one ourselves
        if (this.props.targetRef !== undefined) {
            return onlyChild;
        }
        return React.cloneElement(onlyChild, { ref: this.targetRef });
    };
    ResizeSensor2.prototype.componentDidMount = function () {
        this.observeElement();
    };
    ResizeSensor2.prototype.componentDidUpdate = function (prevProps) {
        this.observeElement(this.props.observeParents !== prevProps.observeParents);
    };
    ResizeSensor2.prototype.componentWillUnmount = function () {
        this.observer.disconnect();
    };
    /**
     * Observe the DOM element, if defined and different from the currently
     * observed element. Pass `force` argument to skip element checks and always
     * re-observe.
     */
    ResizeSensor2.prototype.observeElement = function (force) {
        if (force === void 0) { force = false; }
        if (!(this.targetRef.current instanceof Element)) {
            // stop everything if not defined
            this.observer.disconnect();
            return;
        }
        if (this.targetRef.current === this.prevElement && !force) {
            // quit if given same element -- nothing to update (unless forced)
            return;
        }
        else {
            // clear observer list if new element
            this.observer.disconnect();
            // remember element reference for next time
            this.prevElement = this.targetRef.current;
        }
        // observer callback is invoked immediately when observing new elements
        this.observer.observe(this.targetRef.current);
        if (this.props.observeParents) {
            var parent_1 = this.targetRef.current.parentElement;
            while (parent_1 != null) {
                this.observer.observe(parent_1);
                parent_1 = parent_1.parentElement;
            }
        }
    };
    ResizeSensor2.displayName = "".concat(DISPLAYNAME_PREFIX, ".ResizeSensor2");
    return ResizeSensor2;
}(AbstractPureComponent2));
export { ResizeSensor2 };
//# sourceMappingURL=resizeSensor2.js.map