import MainFunctionNavbar from "../base/main-function/navbar";
import Application from "./body/application";
import * as React from "react";
import ScreenContainer from "../general/screen-container";

/**
 * RecordsBody2
 * This will replace old record component altogether when time happens
 */
export default class RecordsBody2 extends React.Component<
  Record<string, unknown>,
  Record<string, unknown>
> {
  /**
   * Component render method
   * @returns JSX.Element
   */
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
