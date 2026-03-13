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
    return mergeConfig(config, {
      base: configType === 'PRODUCTION' ? '/deveditor-ui/' : '/',
    });
  }
};

export default config;

function getAbsolutePath(value: string): any {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
