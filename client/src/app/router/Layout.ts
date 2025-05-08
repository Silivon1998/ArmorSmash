import { JSX, ReactNode } from "react";

export type LayoutStackBehavior = 'accumulate' | 'replace';
export const DEFAULT_LAYOUT_BEHAVIOR: LayoutStackBehavior = "replace";


export type LayoutProps = {
  children: ReactNode;
};

export interface LayoutComponent extends React.FC<LayoutProps> {
  stackBehavior?: LayoutStackBehavior;
}

export function Layout(
  render: (props: LayoutProps) => JSX.Element,
  behavior: LayoutStackBehavior = DEFAULT_LAYOUT_BEHAVIOR
): LayoutComponent {
  var Layout : LayoutComponent = (props: LayoutProps) => render(props);
  Layout.stackBehavior = behavior;
  return Layout;
}