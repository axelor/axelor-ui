# Axelor-UI

React components by Axelor.

## Prerequisite

- node >= v22.17
- pnpm >= 10

```bash
#Nodejs

# Install Node Version Manager
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
$ source "$HOME/.nvm/nvm.sh"
# Install and use node version found in .nvmrc of the project
$ nvm install && nvm use

# pnpm
$ corepack enable pnpm
```

## Quick start

Install the library :

```bash
$ pnpm add @axelor/ui
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
$ pnpm install
```

### Storybook

Run following commands to build storybook :

```bash
$ pnpm build-storybook
```

This build Storybook as a static web application capable of being served by any web server.
Default build files are located under `storybook-static/*`

To run storybook locally :

```bash
$ pnpm storybook
```

the storybook will be served on http://localhost:6006

### Build

Run following command to build components :

```bash
$ pnpm build
```

components are generated under `dist/`.
