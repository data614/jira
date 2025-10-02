/* !
 * (c) Copyright 2022 Palantir Technologies Inc. All rights reserved.
 */
import React, { forwardRef, useEffect, useRef, useState } from "react";
import { Classes, DISPLAYNAME_PREFIX } from "../../common";
export const ResizableInput = forwardRef(function ResizableInput(props, ref) {
    const [content, setContent] = useState("");
    const [width, setWidth] = useState(0);
    const span = useRef(null);
    useEffect(() => {
        if (span.current != null) {
            setWidth(span.current.offsetWidth);
        }
    }, [content]);
    const { onChange, style, ...otherProps } = props;
    const handleInputChange = evt => {
        onChange?.(evt);
        setContent(evt?.target?.value ?? "");
    };
    return (React.createElement(React.Fragment, null,
        React.createElement("span", { ref: span, className: Classes.RESIZABLE_INPUT_SPAN, "aria-hidden": true }, content.replace(/ /g, "\u00a0")),
        React.createElement("input", { ...otherProps, type: "text", style: { ...style, width }, onChange: handleInputChange, ref: ref })));
});
ResizableInput.displayName = `${DISPLAYNAME_PREFIX}.ResizableInput`;
//# sourceMappingURL=resizableInput.js.map