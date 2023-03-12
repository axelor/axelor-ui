const [ua] = process.env.npm_config_user_agent.split(" ");
const [pm] = ua.split("/");

if (pm !== "pnpm") {
  console.log(`Use "pnpm" for installation in this project.

If you don't have pnpm, install it via "npm i -g pnpm".
For more details, go to https://pnpm.ip/
`);
  process.exit(1);
}
