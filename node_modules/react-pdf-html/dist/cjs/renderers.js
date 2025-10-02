"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderCell = exports.getMaxColumns = exports.getRows = exports.childElements = exports.renderInline = exports.renderBlock = exports.renderSvgs = exports.toRoman = exports.renderPassThrough = exports.renderNoop = void 0;
const React = __importStar(require("react"));
const renderer_1 = require("@react-pdf/renderer");
const ordered_type_js_1 = require("./ordered.type.js");
const camelize_js_1 = __importDefault(require("./camelize.js"));
const node_html_parser_1 = require("node-html-parser");
const renderNoop = ({ children }) => React.createElement(React.Fragment, null);
exports.renderNoop = renderNoop;
const renderPassThrough = ({ children, }) => children;
exports.renderPassThrough = renderPassThrough;
const convertSvgAttributes = (attrs) => {
    const result = {};
    for (const key in attrs) {
        result[(0, camelize_js_1.default)(key)] = attrs[key];
    }
    return result;
};
const convertSvgStyles = (stylesTags) => {
    return stylesTags.reduce((acc, cur) => (Object.assign(Object.assign({}, acc), cur)), {});
};
function toRoman(num) {
    let result = '';
    const conversationMap = new Map([
        [1000, 'M'],
        [900, 'CM'],
        [500, 'D'],
        [400, 'CD'],
        [100, 'C'],
        [90, 'XC'],
        [50, 'L'],
        [40, 'XL'],
        [10, 'X'],
        [9, 'IX'],
        [5, 'V'],
        [4, 'IV'],
        [1, 'I'],
    ]);
    conversationMap.forEach((roman, decimal) => {
        let quotient = BigInt(num) / BigInt(decimal);
        num = num % decimal;
        while (quotient--) {
            result += roman;
        }
    });
    return result;
}
exports.toRoman = toRoman;
const renderSvgs = (Wrapper, { element, style, children }) => {
    return (React.createElement(Wrapper, Object.assign({}, convertSvgAttributes(element === null || element === void 0 ? void 0 : element.attributes), convertSvgStyles(style)), children));
};
exports.renderSvgs = renderSvgs;
const renderBlock = ({ style, children }) => (React.createElement(renderer_1.View, { style: style }, children));
exports.renderBlock = renderBlock;
const renderInline = ({ style, children }) => (React.createElement(renderer_1.Text, { style: style }, children));
exports.renderInline = renderInline;
const childElements = (element, tagNames) => element.childNodes.filter((child) => child.nodeType === node_html_parser_1.NodeType.ELEMENT_NODE &&
    (!tagNames ||
        tagNames.includes(child.tagName.toLowerCase())));
exports.childElements = childElements;
const getRows = (table) => {
    let rows = (0, exports.childElements)(table, ['tr']);
    const sections = (0, exports.childElements)(table, ['tbody', 'thead']);
    sections.forEach((section) => {
        rows = rows.concat((0, exports.childElements)(section, ['tr']));
    });
    return rows;
};
exports.getRows = getRows;
const getMaxColumns = (table) => {
    if (!table) {
        return 1;
    }
    let rows = (0, exports.getRows)(table);
    const colCounts = rows.map((row) => {
        let colCount = 0;
        (0, exports.childElements)(row, ['td', 'th']).forEach((col) => {
            const colspan = parseInt(col.attributes.colspan, 10);
            if (isNaN(colspan)) {
                colCount++;
            }
            else {
                colCount += colspan;
            }
        });
        return colCount;
    });
    // const colCounts = rows.map((row) => childElements(row, ['td', 'th']).length);
    return Math.max(1, ...colCounts);
};
exports.getMaxColumns = getMaxColumns;
const renderCell = ({ style, element, children }) => {
    const table = element.closest('table');
    if (!table) {
        throw new Error('td element rendered outside of a table');
    }
    const tableStyles = table.style.reduce((combined, tableStyle) => Object.assign(combined, tableStyle), {});
    const baseStyles = {
        border: tableStyles.border,
        borderColor: tableStyles.borderColor,
        borderWidth: tableStyles.borderWidth,
        borderStyle: tableStyles.borderStyle,
    };
    if (tableStyles.borderSpacing &&
        tableStyles.borderCollapse !== 'collapse') {
        baseStyles.width = tableStyles.borderWidth;
        baseStyles.margin = tableStyles.borderSpacing;
    }
    else {
        baseStyles.borderRightWidth = 0;
        baseStyles.borderBottomWidth = 0;
        if (element.indexOfType !== 0) {
            baseStyles.borderLeftWidth = tableStyles.borderWidth;
            baseStyles.borderTopWidth = tableStyles.borderWidth;
        }
    }
    const colCount = (0, exports.getMaxColumns)(table);
    const basePercent = 100 / colCount;
    baseStyles.width = basePercent.toFixed(5) + '%';
    if (element.attributes && element.attributes.colspan) {
        const colspan = parseInt(element.attributes.colspan, 10);
        if (!isNaN(colspan)) {
            baseStyles.width = (colspan * basePercent).toFixed(5) + '%';
        }
    }
    return React.createElement(renderer_1.View, { style: [baseStyles, ...style] }, children);
};
exports.renderCell = renderCell;
const renderers = {
    style: exports.renderNoop,
    script: exports.renderNoop,
    html: exports.renderPassThrough,
    li: ({ element, stylesheets, style, children }) => {
        var _a;
        const bulletStyles = stylesheets.map((stylesheet) => stylesheet.li_bullet);
        const contentStyles = stylesheets.map((stylesheet) => stylesheet.li_content);
        const list = element.closest('ol, ul');
        const ordered = (list === null || list === void 0 ? void 0 : list.tag) === 'ol' || element.parentNode.tag === 'ol';
        const listStyle = ((_a = list === null || list === void 0 ? void 0 : list.style) === null || _a === void 0 ? void 0 : _a.reduce((combined, listStyle) => Object.assign(combined, listStyle), {})) || {};
        const itemStyle = element.style.reduce((combined, itemStyle) => Object.assign(combined, itemStyle), {});
        const listStyleType = itemStyle.listStyleType ||
            itemStyle.listStyle ||
            listStyle.listStyleType ||
            listStyle.listStyle ||
            '';
        let bullet;
        if (listStyleType.includes('none')) {
            bullet = false;
        }
        else if (listStyleType.includes('url(')) {
            bullet = (React.createElement(renderer_1.Image, { src: listStyleType.match(/\((.*?)\)/)[1].replace(/(['"])/g, '') }));
        }
        else if (ordered) {
            const currentIndex = element.indexOfType;
            const start = parseInt(element.parentNode.attributes.start, 10);
            const offset = isNaN(start) ? 0 : start - 1; // keep it zero based for later
            let updatedIndex = currentIndex + offset;
            let currentElement = element;
            let sibling = currentElement;
            do {
                currentElement = sibling;
                sibling = currentElement.previousElementSibling;
                if (!currentElement) {
                    break;
                }
                if (currentElement.tag !== 'li') {
                    // skip all other element types because they do not belong in a list
                    continue;
                }
                const startValue = parseInt(currentElement.attributes.value, 10);
                if (!isNaN(startValue)) {
                    updatedIndex =
                        startValue + (currentIndex - currentElement.indexOfType) - 1;
                    break;
                }
            } while (!!sibling);
            if (ordered_type_js_1.lowerAlpha.includes(listStyleType)) {
                bullet = React.createElement(renderer_1.Text, null,
                    ordered_type_js_1.orderedAlpha[updatedIndex].toLowerCase(),
                    ".");
            }
            else if (ordered_type_js_1.upperAlpha.includes(listStyleType)) {
                bullet = React.createElement(renderer_1.Text, null,
                    ordered_type_js_1.orderedAlpha[updatedIndex].toUpperCase(),
                    ".");
            }
            else if (listStyleType == 'lower-roman') {
                bullet = React.createElement(renderer_1.Text, null,
                    toRoman(element.indexOfType + 1).toLowerCase(),
                    ".");
            }
            else if (listStyleType == 'upper-roman') {
                bullet = React.createElement(renderer_1.Text, null,
                    toRoman(element.indexOfType + 1).toUpperCase(),
                    ".");
            }
            else {
                bullet = React.createElement(renderer_1.Text, null,
                    updatedIndex + 1,
                    ".");
            }
        }
        else {
            // if (listStyleType.includes('square')) {
            //   bullet = <Text>■</Text>;
            // } else {
            bullet = React.createElement(renderer_1.Text, null, "\u2022");
            // }
        }
        return (React.createElement(renderer_1.View, { style: style },
            bullet && React.createElement(renderer_1.View, { style: bulletStyles }, bullet),
            React.createElement(renderer_1.View, { style: contentStyles }, children)));
    },
    a: ({ style, element, children }) => (React.createElement(renderer_1.Link, { style: style, src: element.attributes.href }, children)),
    img: ({ style, element }) => (React.createElement(renderer_1.Image, { style: style, source: {
            uri: element.attributes.src,
            body: null,
            method: 'GET',
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        } })),
    table: ({ element, style, children }) => {
        const tableStyles = element.style.reduce((combined, tableStyle) => Object.assign(combined, tableStyle), {});
        const overrides = {};
        if (!tableStyles.borderSpacing ||
            tableStyles.borderCollapse === 'collapse') {
            overrides.borderLeftWidth = 0;
            overrides.borderTopWidth = 0;
        }
        return React.createElement(renderer_1.View, { style: [...style, overrides] }, children);
    },
    tr: ({ style, children }) => (React.createElement(renderer_1.View, { wrap: false, style: style }, children)),
    br: ({ style }) => (React.createElement(renderer_1.Text, { wrap: false, style: style }, '\n')),
    td: exports.renderCell,
    th: exports.renderCell,
    svg: exports.renderSvgs.bind(null, renderer_1.Svg),
    line: exports.renderSvgs.bind(null, renderer_1.Line),
    polyline: exports.renderSvgs.bind(null, renderer_1.Polyline),
    polygon: exports.renderSvgs.bind(null, renderer_1.Polygon),
    path: exports.renderSvgs.bind(null, renderer_1.Path),
    rect: exports.renderSvgs.bind(null, renderer_1.Rect),
    circle: exports.renderSvgs.bind(null, renderer_1.Circle),
    ellipse: exports.renderSvgs.bind(null, renderer_1.Ellipse),
    text: exports.renderSvgs.bind(null, renderer_1.Text),
    tspan: exports.renderSvgs.bind(null, renderer_1.Tspan),
    g: exports.renderSvgs.bind(null, renderer_1.G),
    stop: exports.renderSvgs.bind(null, renderer_1.Stop),
    defs: exports.renderSvgs.bind(null, renderer_1.Defs),
    clippath: exports.renderSvgs.bind(null, renderer_1.ClipPath),
    lineargradient: exports.renderSvgs.bind(null, renderer_1.LinearGradient),
    radialgradient: exports.renderSvgs.bind(null, renderer_1.RadialGradient),
};
exports.default = renderers;
//# sourceMappingURL=renderers.js.map