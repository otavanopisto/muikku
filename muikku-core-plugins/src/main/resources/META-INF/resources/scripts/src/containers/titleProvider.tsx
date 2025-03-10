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
          href="/gfx/favicons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/gfx/favicons/favicon-16x16.png"
        />

        {/* For Google and Android */}
        <link
          rel="icon"
          type="image/png"
          sizes="48x48"
          href="/gfx/favicons/favicon-48x48.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/gfx/favicons/favicon-192x192.png"
        />

        {/* For iPad */}
        <link
          rel="apple-touch-icon"
          type="image/png"
          sizes="167x167"
          href="/gfx/favicons/favicon-167x167.png"
        />
        <link
          rel="apple-touch-icon"
          type="image/png"
          sizes="180x180"
          href="/gfx/favicons/favicon-180x180.png"
        />
      </Helmet>
      {children}
    </>
  );
}

export default TitleProvider;
