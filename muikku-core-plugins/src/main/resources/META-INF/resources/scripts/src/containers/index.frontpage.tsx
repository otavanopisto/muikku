import Notifications from "../components/base/notifications";
import Body from "../components/frontpage/body";
import * as React from "react";
import "~/sass/util/base.scss";
import { registerLocale } from "react-datepicker";
import { enGB, fi } from "date-fns/locale";
import EasyToUseToolDrawer from "~/components/easy-to-use-reading-functions/easy-to-use-tool-drawer";
import EasyToUseFunctions from "~/components/easy-to-use-reading-functions/easy-to-use-functions";
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
        <EasyToUseToolDrawer />
        <EasyToUseFunctions />
        <Body></Body>
      </div>
    );
  }
}
