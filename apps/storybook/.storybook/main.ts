import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-vitest")
  ],

  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },

  async viteFinal(config, { configType }) {
    const { mergeConfig } = await import('vite');
    // Vercel (ui.deveditor.io) serves at root; GitHub Pages at /deveditor-ui/
    // Use STORYBOOK_BASE_PATH in Vercel if build runs in CI and you deploy to both.
    const basePath =
      process.env.STORYBOOK_BASE_PATH ??
      (process.env.VERCEL ? '/' : undefined);
    const base =
      configType === 'PRODUCTION'
        ? basePath ?? '/deveditor-ui/'
        : '/';
    return mergeConfig(config, { base });
  }
};

export default config;

function getAbsolutePath(value: string): any {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
