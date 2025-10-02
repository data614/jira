import * as React from 'react';
import { HtmlRenderers } from './render.js';
import { HtmlStyle, HtmlStyles } from './styles.js';
export type HtmlProps = {
    collapse?: boolean;
    renderers?: HtmlRenderers;
    style?: HtmlStyle | (HtmlStyle | undefined)[];
    stylesheet?: HtmlStyles | HtmlStyles[];
    resetStyles?: boolean;
    children: string;
};
declare const Html: React.FC<HtmlProps>;
export default Html;
