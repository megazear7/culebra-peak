/**
 * Storybook stories for the carousel component
 */

import { fetchFromAEM } from 'storybook-aem-wrappers';
import { aemMetadata } from '@storybook/aem';
import { StyleSystem } from 'storybook-aem-style-system';
import { Grid } from 'storybook-aem-grid';

export default {
    title: 'Components/button',
    decorators: [
        aemMetadata({
            decorationTag: {
                cssClasses: ['button', 'component', StyleSystem, Grid],
                tagName: 'div'
            }
        })
    ],
};


const emptyContentPath = "/content/culebra-peak-design-system/button/jcr:content/root/container/container/empty";
export const empty = () => ({
    template: async () => fetchFromAEM(emptyContentPath)
});
empty.story = {
    name: 'Empty Story',
    parameters: {}
};

const longTextContentPath = "/content/culebra-peak-design-system/button/jcr:content/root/container/container/longtext";
export const longText = () => ({
    template: async () => fetchFromAEM(longTextContentPath)
});
longText.story = {
    name: 'Long Text Story',
    parameters: {}
};



const shortTextContentPath = "/content/culebra-peak-design-system/button/jcr:content/root/container/container/shorttext";
export const shortText = () => ({
    template: async () => fetchFromAEM(shortTextContentPath)
});
shortText.story = {
    name: 'Short Text Story',
    parameters: {}
};