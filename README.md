# Axelor-UI

React components by Axelor.

## Prerequisite

* node >= v14.17.0
* yarn >= 1.22.10

```bash
# Nodejs
$ curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
$ sudo apt-get install -y nodejs

# Alternatively, `nvm` can be used as a Node Version Manager
$ curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
$ source ~/.profile
$ nvm install 16

# Yarn
$ curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
$ echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
$ sudo apt update && sudo apt install --no-install-recommends yarn
```

## Quick start

Install the library :

```bash
$ yarn add @axelor/ui
```

You can import from the main bundle:

```js
import { Button } from '@axelor/ui';
```

Only `core` components are available from the main bundle.

For others components (`grid`, `kanban`, `gantt`, ...), you have to import the component directly :

```js
import Grid from '@axelor/ui/grid';

import Kanban from '@axelor/ui/kanban';
```

## Development

Before any command, install dependencies running following command:

```bash
$ yarn install
```

### Storybook

Run following commands to build storybook :

```bash
$ yarn storybook:build
```

This build Storybook as a static web application capable of being served by any web server. 
Default build files are located under `apps/stories/dist/*`

To run storybook locally :

```bash
$ yarn storybook
```

the storybook will be served on http://localhost:6006

### Build

Run following command to build components :

```bash
$ yarn build
```

components are generated under `dist/`.
