import * as React from "react";
import { Helmet } from "react-helmet-async";
import { usePageTitle } from "../hooks/usePageTitle";

/**
 * Props for the TitleProvider component
 */
interface TitleProviderProps {
  children: React.ReactNode;
}

/**
 * Provider for managing page title and favicon
 * @param props - The component props
 * @returns The rendered component
 */
function TitleProvider(props: TitleProviderProps) {
  const { children } = props;
  const { title, favicon } = usePageTitle();

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <link rel="icon" type="image/x-icon" href={favicon} />
      </Helmet>
      {children}
    </>
  );
}

export default TitleProvider;
