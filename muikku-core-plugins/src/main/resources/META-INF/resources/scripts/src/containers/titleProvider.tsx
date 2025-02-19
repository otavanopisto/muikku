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
 * Provider for managing page title
 * @param props - The component props
 * @returns The rendered component
 */
function TitleProvider(props: TitleProviderProps) {
  const { children } = props;
  const { title } = usePageTitle();

  return (
    <>
      <Helmet>
        <title>{title}</title>

        {/* For all browsers */}
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="favicon-16x16.png"
        />

        {/* For Google and Android */}
        <link
          rel="icon"
          type="image/png"
          sizes="48x48"
          href="favicon-48x48.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="favicon-192x192.png"
        />

        {/* For iPad */}
        <link
          rel="apple-touch-icon"
          type="image/png"
          sizes="167x167"
          href="favicon-167x167.png"
        />
        <link
          rel="apple-touch-icon"
          type="image/png"
          sizes="180x180"
          href="favicon-180x180.png"
        />
      </Helmet>
      {children}
    </>
  );
}

export default TitleProvider;
