import MainFunctionNavbar from "../base/main-function/navbar";
import Application from "./body/application";
import * as React from "react";
import ScreenContainer from "../general/screen-container";

export default class RecordsBody2 extends React.Component<{}, {}> {
  render() {
    return (
      <div>
        <MainFunctionNavbar activeTrail="records" />
        <ScreenContainer>
          <Application />
        </ScreenContainer>
      </div>
    );
  }
}
