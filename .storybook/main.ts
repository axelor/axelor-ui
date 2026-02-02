import type { StorybookConfig } from "@storybook/react-vite";
import path from "path";
import { mergeConfig } from "vite";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.tsx"],

  addons: [
    "@storybook/addon-links",
    "@storybook/addon-docs",
    "@chromatic-com/storybook",
  ],

  framework: "@storybook/react-vite",
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
      cacheDir,
      optimizeDeps: {
        entries: [`${src}/**/*.{ts,js,tsx,jsx,mdx,css,scss,html}`],
      },
    });
  },

  typescript: {
    reactDocgen: "react-docgen-typescript",
  },
};

export default config;
