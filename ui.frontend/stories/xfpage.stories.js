/**
 * Storybook stories for the carousel component
 */

import { fetchFromAEM } from 'storybook-aem-wrappers';
import { aemMetadata } from '@storybook/aem';
import { StyleSystem } from 'storybook-aem-style-system';
import { Grid } from 'storybook-aem-grid';

export default {
    title: 'Components/xfpage',
    decorators: [
        aemMetadata({
            decorationTag: {
                cssClasses: ['xfpage', 'component', StyleSystem, Grid],
                tagName: 'div'
            }
        })
    ],
};


const emptyContentPath = "/content/culebra-peak-design-system/xfpage/jcr:content/root/container/container/empty";
export const empty = () => ({
    template: async () => fetchFromAEM(emptyContentPath)
});
empty.story = {
    name: 'Empty Story',
    parameters: {}
};