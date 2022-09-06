import Notifications from "../components/base/notifications";
import DisconnectedWarningDialog from "../components/base/disconnect-warning";
import Body from "../components/frontpage/body";
import * as React from "react";
import "~/sass/util/base.scss";
import { registerLocale } from "react-datepicker";
import { enGB, fi } from "date-fns/locale";
registerLocale("fi", fi);
registerLocale("enGB", enGB);

/**
 * IndexFrontpage
 */
export default class IndexFrontpage extends React.Component<
  Record<string, unknown>,
  Record<string, unknown>
> {
  /**
   * render
   */
  render() {
    return (
      <div id="root">
        <Notifications></Notifications>
        <DisconnectedWarningDialog />
        <Body></Body>
      </div>
    );
  }
}
