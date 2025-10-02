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
import * as React from "react";
const noOpDispatch = () => null;
export const Tooltip2Context = React.createContext([
    {},
    noOpDispatch,
]);
const tooltip2Reducer = (state, action) => {
    switch (action.type) {
        case "FORCE_DISABLED_STATE":
            return { forceDisabled: true };
        case "RESET_DISABLED_STATE":
            return {};
        default:
            return state;
    }
};
export const Tooltip2Provider = ({ children, forceDisable }) => {
    const [state, dispatch] = React.useReducer(tooltip2Reducer, {});
    React.useEffect(() => {
        if (forceDisable) {
            dispatch({ type: "FORCE_DISABLED_STATE" });
        }
        else {
            dispatch({ type: "RESET_DISABLED_STATE" });
        }
    }, [forceDisable]);
    return (React.createElement(Tooltip2Context.Provider, { value: [state, dispatch] }, typeof children === "function" ? children(state) : children));
};
//# sourceMappingURL=tooltip2Context.js.map