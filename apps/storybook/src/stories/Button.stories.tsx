import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@deveditor/ui';

/**
 * **Button** is the primary interactive component for actions.
 *
 * - **Variants:** `default` | `destructive` | `outline` | `secondary` | `ghost` | `link`
 * - **Sizes:** `default` | `sm` | `lg` | `icon`
 * - **asChild:** Render as a link or custom element (Radix Slot)
 * - **unstyled:** Strip default styles for headless use
 */
const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Primary UI button. Supports multiple variants and sizes. Use `asChild` to render as a link or custom element (Radix Slot). Use `unstyled` for headless styling.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: 'Visual style of the button.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'Size of the button.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
      },
    },
    asChild: {
      control: 'boolean',
      description:
        'When true, renders the child as the root element (e.g. `<a>`, `<Link>`). Uses Radix Slot.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    unstyled: {
      control: 'boolean',
      description:
        'When true, strips all default styles. Keeps accessibility and data attributes.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button.',
    },
    children: {
      control: 'text',
      description: 'Button label or content.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: 'Button',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost',
  },
};

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large',
  },
};
