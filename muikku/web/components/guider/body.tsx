import MainFunctionNavbar from "~/components/base/main-function/navbar";
import Application from "./body/application";
import Aside from "./body/aside";

import * as React from "react";

/**
 * GuiderBodyProps
 */
interface GuiderBodyProps {}

/**
 * GuiderBodyState
 */
interface GuiderBodyState {}

/**
 * GuiderBody
 */
export default class GuiderBody extends React.Component<
  GuiderBodyProps,
  GuiderBodyState
> {
  /**
   * render
   */
  render() {
    const aside = <Aside />;
    return (
      <div>
        <MainFunctionNavbar activeTrail="guider" navigation={aside} />
        <Application aside={aside} />
      </div>
    );
  }
}
