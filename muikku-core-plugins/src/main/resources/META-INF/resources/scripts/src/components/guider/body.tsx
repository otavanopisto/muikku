import MainFunctionNavbar from "~/components/base/main-function/navbar";
import Application from "./body/application";
import Aside from "./body/aside";

import * as React from "react";

interface GuiderBodyProps {}

interface GuiderBodyState {}

export default class GuiderBody extends React.Component<
  GuiderBodyProps,
  GuiderBodyState
> {
  render() {
    let aside = <Aside />;
    return (
      <div>
        <MainFunctionNavbar activeTrail="guider" navigation={aside} />
        <Application aside={aside} />
      </div>
    );
  }
}
