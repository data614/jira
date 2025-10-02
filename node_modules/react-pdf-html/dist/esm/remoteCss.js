import { parse } from 'node-html-parser';
import { convertStylesheet } from './parse.js';
import { createCache } from './cache.js';
export const CSS_CACHE = createCache({ limit: 30 });
export const fetchStylesheet = async (src, fetchOptions, cache = true) => {
    let image;
    if (cache && CSS_CACHE.get(src)) {
        return CSS_CACHE.get(src);
    }
    else {
        image = await (await fetch(src, fetchOptions)).text();
    }
    if (!image) {
        throw new Error('Cannot resolve image');
    }
    if (cache) {
        CSS_CACHE.set(src, image);
    }
    return image;
};
export const fetchStylesheets = async (html, fetchOptions) => {
    const document = parse(html, { comment: false });
    const stylesheets = [];
    const promises = document
        .querySelectorAll('link[rel="stylesheet"][href]')
        .map(async (styleNode) => {
        try {
            const styleText = await fetchStylesheet(styleNode.getAttribute('href'), fetchOptions);
            if (styleText) {
                stylesheets.push(convertStylesheet(styleText));
            }
        }
        catch (e) {
            console.error(`Unable to get remote CSS file ${styleNode.getAttribute('href')}`, e);
        }
    });
    try {
        await Promise.all(promises);
    }
    catch (e) { }
    return stylesheets;
};
//# sourceMappingURL=remoteCss.js.map