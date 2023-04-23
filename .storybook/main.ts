import type { StorybookConfig } from "@storybook/react-vite";
import path from "path";
import { mergeConfig } from "vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.tsx"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  core: {
    disableTelemetry: true,
  },
  viteFinal(config) {
    const src = path.resolve(__dirname, "../src");
    const cacheDir = path.resolve(__dirname, "../node_modules/.cache/vite");
    return mergeConfig(config, {
      resolve: {
        alias: [
          {
            find: /^~(.*)/,
            replacement: "$1",
          },
        ],
      },
      define: {
        "process.env": {},
      },
      cacheDir,
      optimizeDeps: {
        entries: [`${src}/**/*.{ts,js,tsx,jsx,mdx,css,scss,html}`],
      },
    });
  },
};

export default config;
