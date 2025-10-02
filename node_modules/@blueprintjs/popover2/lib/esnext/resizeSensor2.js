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
import { ResizeObserver } from "@juggle/resize-observer";
import * as React from "react";
import { AbstractPureComponent2, DISPLAYNAME_PREFIX } from "@blueprintjs/core";
export class ResizeSensor2 extends AbstractPureComponent2 {
    static displayName = `${DISPLAYNAME_PREFIX}.ResizeSensor2`;
    targetRef = React.createRef();
    prevElement = undefined;
    observer = new ResizeObserver(entries => this.props.onResize?.(entries));
    render() {
        const onlyChild = React.Children.only(this.props.children);
        // if we're provided a ref to the child already, we don't need to attach one ourselves
        if (this.props.targetRef !== undefined) {
            return onlyChild;
        }
        return React.cloneElement(onlyChild, { ref: this.targetRef });
    }
    componentDidMount() {
        this.observeElement();
    }
    componentDidUpdate(prevProps) {
        this.observeElement(this.props.observeParents !== prevProps.observeParents);
    }
    componentWillUnmount() {
        this.observer.disconnect();
    }
    /**
     * Observe the DOM element, if defined and different from the currently
     * observed element. Pass `force` argument to skip element checks and always
     * re-observe.
     */
    observeElement(force = false) {
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
            let parent = this.targetRef.current.parentElement;
            while (parent != null) {
                this.observer.observe(parent);
                parent = parent.parentElement;
            }
        }
    }
}
//# sourceMappingURL=resizeSensor2.js.map