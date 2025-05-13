import Body from "../components/error/body2";
import * as React from "react";
import "~/sass/util/base.scss";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

/**
 * Error
 */
const Error = () => {
  const { t } = useTranslation(["common"]);

  const appName = t("appName", { ns: "pageTitles" });
  const title = `${t("error", { ns: "pageTitles" })} | ${appName}`;

  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>

        {/* For all browsers */}
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/gfx/favicons/favicon-16x16.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/gfx/favicons/favicon-32x32.png"
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
      <div id="root">
        <Body></Body>
      </div>
    </HelmetProvider>
  );
};

export default Error;
