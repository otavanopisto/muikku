import Notifications from "../components/base/notifications";
import DisconnectedWarningDialog from "../components/base/disconnect-warning";
import Body from "../components/frontpage/body";
import * as React from "react";
import "~/sass/util/base.scss";
import { registerLocale } from "react-datepicker";
import { enGB, fi } from "date-fns/locale";
import EasyToUseFunctions from "~/components/easy-to-use-reading-functions/easy-to-use-functions";
import "../locales/i18n";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
registerLocale("fi", fi);
registerLocale("enGB", enGB);

/**
 * IndexFrontpage
 */
const IndexFrontpage = () => {
  const { t } = useTranslation(["common"]);

  const appName = t("appName", { ns: "pageTitles" });

  return (
    /**
     * render
     */
    <HelmetProvider>
      <Helmet>
        <title>{appName}</title>

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
        <Notifications></Notifications>
        <DisconnectedWarningDialog />
        <EasyToUseFunctions />
        <Body></Body>
      </div>
    </HelmetProvider>
  );
};
export default IndexFrontpage;
