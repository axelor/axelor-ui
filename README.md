# Axelor-UI

React components by Axelor.

## Prerequisite

* node >= v14.17.0
* yarn >= 1.22.10

```bash
# Nodejs
curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
sudo apt-get install -y nodejs

# Alternatively, `nvm` can be used as a Node Version Manager
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash 
source ~/.profile 
nvm install 16

# Yarn
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update && sudo apt install --no-install-recommends yarn
```

## Quickstart

Run following commands from terminal:

```bash
# Install the project dependencies
yarn install

# Launch storybook
yarn storybook
```

The storybook app will start on http://localhost:6006/

## Build

### Build and publish storybook

Run following commands to build storybook : `yarn storybook:build`

This build Storybook as a static web application capable of being served by any web server. 
Default build files are located under `apps/stories/dist/*`

### Build components

Run following command to build components :

```bash
yarn build
```

Components are ready to be used by `axelor-web` !
