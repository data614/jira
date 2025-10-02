import * as React from 'react';
import { Circle, ClipPath, Defs, Ellipse, G, Image, Line, LinearGradient, Link, Path, Polygon, Polyline, RadialGradient, Rect, Stop, Svg, Text, Tspan, View, } from '@react-pdf/renderer';
import { lowerAlpha, orderedAlpha, upperAlpha } from './ordered.type.js';
import camelize from './camelize.js';
import { NodeType } from 'node-html-parser';
export const renderNoop = ({ children }) => React.createElement(React.Fragment, null);
export const renderPassThrough = ({ children, }) => children;
const convertSvgAttributes = (attrs) => {
    const result = {};
    for (const key in attrs) {
        result[camelize(key)] = attrs[key];
    }
    return result;
};
const convertSvgStyles = (stylesTags) => {
    return stylesTags.reduce((acc, cur) => ({ ...acc, ...cur }), {});
};
export function toRoman(num) {
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
export const renderSvgs = (Wrapper, { element, style, children }) => {
    return (React.createElement(Wrapper, { ...convertSvgAttributes(element?.attributes), ...convertSvgStyles(style) }, children));
};
export const renderBlock = ({ style, children }) => (React.createElement(View, { style: style }, children));
export const renderInline = ({ style, children }) => (React.createElement(Text, { style: style }, children));
export const childElements = (element, tagNames) => element.childNodes.filter((child) => child.nodeType === NodeType.ELEMENT_NODE &&
    (!tagNames ||
        tagNames.includes(child.tagName.toLowerCase())));
export const getRows = (table) => {
    let rows = childElements(table, ['tr']);
    const sections = childElements(table, ['tbody', 'thead']);
    sections.forEach((section) => {
        rows = rows.concat(childElements(section, ['tr']));
    });
    return rows;
};
export const getMaxColumns = (table) => {
    if (!table) {
        return 1;
    }
    let rows = getRows(table);
    const colCounts = rows.map((row) => {
        let colCount = 0;
        childElements(row, ['td', 'th']).forEach((col) => {
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
export const renderCell = ({ style, element, children }) => {
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
    const colCount = getMaxColumns(table);
    const basePercent = 100 / colCount;
    baseStyles.width = basePercent.toFixed(5) + '%';
    if (element.attributes && element.attributes.colspan) {
        const colspan = parseInt(element.attributes.colspan, 10);
        if (!isNaN(colspan)) {
            baseStyles.width = (colspan * basePercent).toFixed(5) + '%';
        }
    }
    return React.createElement(View, { style: [baseStyles, ...style] }, children);
};
const renderers = {
    style: renderNoop,
    script: renderNoop,
    html: renderPassThrough,
    li: ({ element, stylesheets, style, children }) => {
        const bulletStyles = stylesheets.map((stylesheet) => stylesheet.li_bullet);
        const contentStyles = stylesheets.map((stylesheet) => stylesheet.li_content);
        const list = element.closest('ol, ul');
        const ordered = list?.tag === 'ol' || element.parentNode.tag === 'ol';
        const listStyle = list?.style?.reduce((combined, listStyle) => Object.assign(combined, listStyle), {}) || {};
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
            bullet = (React.createElement(Image, { src: listStyleType.match(/\((.*?)\)/)[1].replace(/(['"])/g, '') }));
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
            if (lowerAlpha.includes(listStyleType)) {
                bullet = React.createElement(Text, null,
                    orderedAlpha[updatedIndex].toLowerCase(),
                    ".");
            }
            else if (upperAlpha.includes(listStyleType)) {
                bullet = React.createElement(Text, null,
                    orderedAlpha[updatedIndex].toUpperCase(),
                    ".");
            }
            else if (listStyleType == 'lower-roman') {
                bullet = React.createElement(Text, null,
                    toRoman(element.indexOfType + 1).toLowerCase(),
                    ".");
            }
            else if (listStyleType == 'upper-roman') {
                bullet = React.createElement(Text, null,
                    toRoman(element.indexOfType + 1).toUpperCase(),
                    ".");
            }
            else {
                bullet = React.createElement(Text, null,
                    updatedIndex + 1,
                    ".");
            }
        }
        else {
            // if (listStyleType.includes('square')) {
            //   bullet = <Text>■</Text>;
            // } else {
            bullet = React.createElement(Text, null, "\u2022");
            // }
        }
        return (React.createElement(View, { style: style },
            bullet && React.createElement(View, { style: bulletStyles }, bullet),
            React.createElement(View, { style: contentStyles }, children)));
    },
    a: ({ style, element, children }) => (React.createElement(Link, { style: style, src: element.attributes.href }, children)),
    img: ({ style, element }) => (React.createElement(Image, { style: style, source: {
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
        return React.createElement(View, { style: [...style, overrides] }, children);
    },
    tr: ({ style, children }) => (React.createElement(View, { wrap: false, style: style }, children)),
    br: ({ style }) => (React.createElement(Text, { wrap: false, style: style }, '\n')),
    td: renderCell,
    th: renderCell,
    svg: renderSvgs.bind(null, Svg),
    line: renderSvgs.bind(null, Line),
    polyline: renderSvgs.bind(null, Polyline),
    polygon: renderSvgs.bind(null, Polygon),
    path: renderSvgs.bind(null, Path),
    rect: renderSvgs.bind(null, Rect),
    circle: renderSvgs.bind(null, Circle),
    ellipse: renderSvgs.bind(null, Ellipse),
    text: renderSvgs.bind(null, Text),
    tspan: renderSvgs.bind(null, Tspan),
    g: renderSvgs.bind(null, G),
    stop: renderSvgs.bind(null, Stop),
    defs: renderSvgs.bind(null, Defs),
    clippath: renderSvgs.bind(null, ClipPath),
    lineargradient: renderSvgs.bind(null, LinearGradient),
    radialgradient: renderSvgs.bind(null, RadialGradient),
};
export default renderers;
//# sourceMappingURL=renderers.js.map