import { JSX } from "react";

export type PageProps = {
  params?: Record<string, string | undefined>,
  query?: Record<string, string>
};

export interface PageComponent extends React.FC<PageProps> {}

export function Page(render: (props: PageProps) => JSX.Element): PageComponent { 
    return (props: PageProps) => render(props);
}

