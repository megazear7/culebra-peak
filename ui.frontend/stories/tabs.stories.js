/**
 * Storybook stories for the carousel component
 */

import { fetchFromAEM } from 'storybook-aem-wrappers';
import { aemMetadata } from '@storybook/aem';
import { StyleSystem } from 'storybook-aem-style-system';
import { Grid } from 'storybook-aem-grid';

export default {
    title: 'Components/tabs',
    decorators: [
        aemMetadata({
            decorationTag: {
                cssClasses: ['tabs', 'component', StyleSystem, Grid],
                tagName: 'div'
            }
        })
    ],
};


const emptyContentPath = "/content/culebra-peak-design-system/tabs/jcr:content/root/container/container/empty";
export const empty = () => ({
    template: async () => fetchFromAEM(emptyContentPath)
});
empty.story = {
    name: 'Empty Story',
    parameters: {}
};