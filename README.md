# Setup Storybook for AEM

Read the blog post at [engineering.icf.com/setup-storybook-with-aem](https://engineering.icf.com/setup-storybook-with-aem/) or follow the instructions here.

Storybook is an open source tool for developing UI components with various technologies, including AEM. It allows frontend developers to develop components in isolation and it captures functional test scenarios for each component. Let's find out how to setup a new project created with the AEM Project Archetype for use with @storybook/aem. These steps will also work for configuring an existing project. We will assume the project name is "culebra-peak" for the purpose of illustration.

## Create a project using the AEM Project Archetype

To begin we simply want to use the AEM Project Archetype to create a new project. We will want to include the frontend module. Modify the other configurations as needed for your project or skip this step if you already have a project that you want to use.

```bash
mvn -B archetype:generate \
 -D archetypeGroupId=com.adobe.granite.archetypes \
 -D archetypeArtifactId=aem-project-archetype \
 -D archetypeVersion=23 \
 -D aemVersion=6.5 \
 -D appTitle="Culebra Peak" \
 -D appId="culebra-peak" \
 -D groupId="com.culebrapeak" \
 -D frontendModule=general \
 -D includeExamples=n
```

[See the changes for this step](https://github.com/megazear7/culebra-peak/commit/7e600c34ecfd3c9785578f4b03cd8daa896e86df)

## Install the project

Now that we have the project created, let's install it to AEM. This blog post assumes that you have AEM running on localhost:4502. I had to update the uber-jar version from the pom.xml file from 6.5 to 6.5.0 in order to get Maven to install.

```
cd culebra-peak
mvn clean install -PautoInstallPackage
```

Now open /editor.html/content/culebra-peak/us/en.html and make sure that the page loads as expected. You will see some initial content without much in the way of styling.

[See the changes for this step](https://github.com/megazear7/culebra-peak/commit/ca317e014934bf9493e153acefe981a6328e3f13)

## Configure Storybook AEM

Now that we have installed the project to AEM we can begin to configure @storybook/aem. To start we need to add a script to your package.json and add some configurations to the @storybook/aem-cli section. These configurations will be used to create stories for Storybook and content in AEM for those stories. Here is what it should look like:

```json
{
  ...
  "scripts": {
    ...
    "storybook": "start-storybook -p 4501"
  },
  "@storybook/aem-cli": {
    "storybookLocation": ".storybook",
    "storybookStoryLocation": "./stories",
    "localPackagePath": ".storybook/aem-library/",
    "appsPath": "../ui.apps/src/main/content/jcr_root/apps",
    "componentPaths": [
      "../ui.apps/src/main/content/jcr_root/apps/culebra-peak/components"
    ],
    "storybookAEMStyleSystem": true,
    "storybookAEMGrid": true,
    "storybookAEMPageTemplate": true,
    "storybookAEMConfluence": false,
    "storybookAEMFoundation": false,
    "aemContentDefaultPageResourceType": "culebra-peak/components/page",
    "aemContentDefaultPageTemplate": "/conf/culebra-peak/settings/wcm/templates/page-content",
    "aemContentDefaultPageContentPath": "/root/container/container",
    "aemStoryHeadingComponentResourceType": "culebra-peak/components/title",
    "aemStoryHeadingComponentTitleProperty": "jcr:title",
    "storyRoot": "Components",
    "packageGroup": "culebrapeak",
    "packageName": "Culebra Peak Storybook Library.zip",
    "aemContentPath": "/content/culebra-peak-design-system",
    "createAEMContent": true
  }
}
```

We will also need to configure some files under the ui.frontend/.stories directory. We will need a few files here in order for Storybook to work. Create a ui.frontend/.storybook folder and a ui.frontend/stories folder. Next we need to tell Storybook where to look for our stories with a ui.frontend/.storybook/main.js file.

```js
module.exports = {
  stories: [
    `../stories/**/*.stories.*`,
  ],
  addons: [
  ]
};
```

Now we will need to configure our stories with a ui.frontend/.storybook/preview.js file.

```js
import { addParameters, addDecorator } from '@storybook/client-api';
import { aemMetadata } from '@storybook/aem';

addDecorator(aemMetadata({
  components: [
  ],
  models: {
  }
}));
```

Finally, we will need to tell Storybook how to connect to AEM with a ui.frontend/.storybook/middleware.js file.

```js
const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function expressMiddleware (router) {
    router.use('/content', createProxyMiddleware({
        target: 'http://admin:admin@localhost:4502',
        changeOrigin: true
    }));
    router.use('/etc.clientlibs', createProxyMiddleware({
        target: 'http://admin:admin@localhost:4502',
        changeOrigin: true
    }));
    router.use('/apps', createProxyMiddleware({
        target: 'http://admin:admin@localhost:4502',
        changeOrigin: true
    }));
    router.use('/conf', createProxyMiddleware({
        target: 'http://admin:admin@localhost:4502',
        changeOrigin: true
    }));
}
```

[See the changes for this step](https://github.com/megazear7/culebra-peak/commit/d10a862e0e7b4fd7ffe0f35cf3bdf6c84c98beda)

## Install the needed dependencies

Now that the package.json is configured let's add the NPM dependencies that we will need available. These are needed for our stories to properly connect to AEM.

```bash
# Make sure you are use NodeJS version 12+
cd ui.frontend
npm install --global @storybook/aem-cli
npm install --save-dev @storybook/aem
npm install --save-dev storybook-aem-wrappers
npm install --save-dev storybook-aem-style-system
npm install --save-dev storybook-aem-grid
npm install --save-dev http-proxy-middleware
npm install --save-dev @babel/preset-typescript
npm run storybook
```

This should open localhost:4501 with the message: "Sorry, but you either have no stories or none are selected somehow." This is okay since we have not created any stories yet. However, we have added all the proper configurations so now we can use the @storybook/aem-cli to create stories for all of our components.

[See the changes for this step](https://github.com/megazear7/culebra-peak/commit/1719964c608efe589aea534bbb4f35331a471328)

## Create empty stories for each component

Run the sba story command. This will ask us some questions about what we want to do. The prompts and answers are shown below. If these steps are followed correctly it will create an empty story for each component in our project.

```bash
sba story
# Do you want to create a story or create stories for all components? > All stories
# Create content in AEM for the stories? > yes
```

This will create a page for every component at /content/culebra-peak-design-system and will create a stories file for each component under ui.frontend/stories. Now run npm run storybook. You should now see a bunch of empty stories. Depending on the component they will either look totally blank or have some basic visual elements such as an empty button. This is because by default the sba story command creates a single empty story for each component.

[See the changes for this step](https://github.com/megazear7/culebra-peak/commit/9a9766c036e8c2784828b1f982e04fcce0a935d5)

## Create stories for the button component

Let's create some extra stories for the button component. The goal would be to create enough stories to fully test all the functional requirements of the component. For our purposes here we will just create a 'long text' variation and a 'short text' variation to see what the button looks like with various amounts of text within it. To do this we will again run the sba story command but will answer the prompts differently. The prompts and answers are shown below.

```bash
$ sba story
# Do you want to create a story or create stories for all components? > Single story
# Generate a Storybook Story for which component? > button
# Would you like to add some initial stories? We will add the default empty story for you > yes
# Add a comma separated list of stories: > Long Text, Short Text
# Create content in AEM for the stories? > yes
```

Now you should see two more empty stories for the button component in storybook. Let's create some content for them. The story generator built content in AEM for our button stories here: /content/culebra-peak-design-system/button.html. Open this page and you should see some headings with the name of the stories and some button components. These button components is what is getting pulled into Storybook.

For the long text button edit the text field to contain "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua".

For the short text button edit the text field to contain "Short text".

Now go back to Storybook and refresh the page. You should see the buttons updated to reflect the content changes that we made.

[See the changes for this step](https://github.com/megazear7/culebra-peak/commit/e3876dc80c150b00126fdc2d20c3b337b4498743)

## Make style changes to the button component

Let's go ahead and update the style of these buttons. First we need to make sure our component styles make it into our AEM client library. It looks like the AEM Project Archetype has a bug at this point. To fix this go to the ui.frontend/src/main/webpack/site/main.scss file and update the component import line as shown below. Notice the ./ was replaced with ../.

```scss
@import '../components/*.scss';
```

Now go to ui.frontend/src/main/webpack/components/\_button.scss and add some button styles as shown below.

```css
.cmp-button {
  padding: 1rem;
  background-color: white;
  transition: all 300ms;
}

.cmp-button:hover {
  background-color: #0e83cd;
  color: white;
}
```

After this rerun the mvn clean install -PautoInstallPackage command from the project root directory. After this is done you should see the button style updates at /content/culebra-peak-design-system/button.html?wcmmode=disabled. However they will not be available in Storybook because the client libraries have not been added yet.

To add our project's client libraries to Storybook open up /content/culebra-peak/us/en.html?wcmmode=disabled and open DevTools to go to the Network tab. Filter for CSS and JS to check for all the dependencies that you need. For this project it is the following:

1. /etc.clientlibs/culebra-peak/clientlibs/clientlib-base.css
2. /etc.clientlibs/culebra-peak/clientlibs/clientlib-dependencies.css
3. /etc.clientlibs/culebra-peak/clientlibs/clientlib-site.css
4. /etc.clientlibs/culebra-peak/clientlibs/clientlib-base.js
5. /etc.clientlibs/culebra-peak/clientlibs/clientlib-dependencies.js
6. /etc.clientlibs/culebra-peak/clientlibs/clientlib-site.js

Now add these to Storybook by creating a file at ui.frontend/.storybook/preview-head.html and adding the following:

```html
<link rel="stylesheet" type="text/css" href="/etc.clientlibs/culebra-peak/clientlibs/clientlib-base.css">
<link rel="stylesheet" type="text/css" href="/etc.clientlibs/culebra-peak/clientlibs/clientlib-dependencies.css">
<link rel="stylesheet" type="text/css" href="/etc.clientlibs/culebra-peak/clientlibs/clientlib-site.css">
<script src="/etc.clientlibs/culebra-peak/clientlibs/clientlib-base.js"></script>
<script src="/etc.clientlibs/culebra-peak/clientlibs/clientlib-dependencies.js"></script>
<script src="/etc.clientlibs/culebra-peak/clientlibs/clientlib-site.js"></script>
```

[See the changes for this step](https://github.com/megazear7/culebra-peak/commit/047d7c773969486a8f322c29b64e0075b04e8384)

Now refresh Storybook in your browser and you should see your new button styles reflected in Storybook. You now have successfully integrated Storybook with AEM!

## Where to go from here

Now that you have @storybook/aem integrated into your AEM project you can create stories for each component. These stories should functionally test all of the features of those components. Frontend developers can develop components and work on enhancements in an isolated context that is more friendly to their development workflow. Storybook also had many powerful plugins for accessibility, color branding, AEM style system integration, and many more. These can help empower the development process. The powerful world of Storybook plugins is now in the hands of the frontend AEM developers.

However, we can do more to improve how we are making use of Storybook.

#### Version controlled content

What we have done so far requires content in AEM for our stories to work. However, we do not want to be required to constantly share out of sync AEM content packages between developers. To make this a more reliable part of your development workflow we can use the @storybook/aem-cli to add content to the codebase, commit it to version control, and auto install changes when developers the latest code. This means that the content that drives the library of functional tests becomes a part of the version controlled codebase. Stay tuned for a future blog post on how to do this.

#### Sharing with the team

Wouldn't it be nice if other team members could see Storybook? Testers could use Storybook as a library of functional tests for doing regression testing. Product owners could refer to it as a place to demo functionality. User experience engineers could go to it as a reference for existing functionality. It could be more holistically integrated into the teams workflow as a design system should be. What's more, wouldn't it be nice if Storybook was automatically deployed to AEM environments; from a development environment, to a test environment, to a staging environment, and even production? Component versions could be compared as they are released to higher environments. Well, we can do all of that by hosting Storybook in AEM. Stay tuned for a future blog post on how to do this.
