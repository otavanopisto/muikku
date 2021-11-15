import MainFunctionNavbar from "../base/main-function/navbar";
import Application from "./body/application";
import Aside from "./body/aside";

import * as React from "react";
import ScreenContainer from "../general/screen-container";

export default class RecordsBody2 extends React.Component<{}, {}> {
  render() {
    let aside = <Aside />;
    return (
      <div>
        <MainFunctionNavbar activeTrail="records" navigation={aside} />
        <ScreenContainer>
          <Application aside={aside} />
        </ScreenContainer>
      </div>
    );
  }
}
