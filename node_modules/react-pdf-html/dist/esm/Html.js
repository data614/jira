import * as React from 'react';
import renderHtml from './render.js';
const Html = (props) => {
    return React.createElement(React.Fragment, null, renderHtml(props.children, props));
};
export default Html;
//# sourceMappingURL=Html.js.map