/**
 * Button variant configuration type.
 * Matches the variants defined in buttonVariants cva config.
 */
export interface ButtonVariantProps {
  /**
   * The visual style of the button.
   * @default "default"
   */
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | null;

  /**
   * The size of the button.
   * @default "default"
   */
  size?: 'default' | 'sm' | 'lg' | 'icon' | null;
}

/**
 * Props for the Button component.
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariantProps {
  /**
   * When true, the button renders its child as the root element (Radix Slot pattern).
   * Useful for rendering as `<a>`, `<Link>`, or custom elements.
   * @default false
   */
  asChild?: boolean;

  /**
   * When true, strips all visual styles and renders only the consumer's className.
   * Preserves accessibility attributes, event handlers, and data attributes.
   * @default false
   */
  unstyled?: boolean;
}
