const [ua] = process.env.npm_config_user_agent.split(' ');
const [pm] = ua.split('/');

if (pm !== 'yarn') {
  console.log(`Use "yarn" for installation in this project.

If you don't have Yarn, install it via "npm i -g yarn".
For more details, go to https://yarnpkg.com/
`);
  process.exit(1);
}
