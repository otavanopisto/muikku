import Notifications from "../components/base/notifications";
import DisconnectedWarningDialog from "../components/base/disconnect-warning";
import { StateType } from "~/reducers";
import { loadCredentials } from "~/actions/base/credentials";
import { Action, Store } from "redux";
import Body from "../components/credentials/body";
import * as React from "react";
import "~/sass/util/base.scss";
import { withTranslation, WithTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { HelmetProvider } from "react-helmet-async";

/**
 * UserCredentialsProps
 */
interface UserCredentialsProps extends WithTranslation {
  store: Store<StateType>;
}

/**
 * UserCredentials
 */
class UserCredentials extends React.Component<
  UserCredentialsProps,
  Record<string, unknown>
> {
  /**
   * componentDidMount
   */
  componentDidMount() {
    const param = new URLSearchParams(location.search);
    const hash: string = param.get("h");
    this.props.store.dispatch(loadCredentials(hash) as Action);
  }

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const { t } = this.props;

    const appName = t("appName", { ns: "pageTitles" });
    const title = `${t("userCredentialsReset", { ns: "pageTitles" })} | ${appName}`;

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
          <Notifications></Notifications>
          <DisconnectedWarningDialog />
          <Body></Body>
        </div>
      </HelmetProvider>
    );
  }
}

export default withTranslation(["common"])(UserCredentials);
