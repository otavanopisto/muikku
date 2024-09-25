import MainFunctionNavbar from "../base/main-function/navbar";
import Application from "./body/application";
import * as React from "react";
import ScreenContainer from "~/components/general/screen-container";

/**
 * RecordsBody
 */
export default class HopsBody extends React.Component<
  Record<string, unknown>,
  Record<string, unknown>
> {
  /**
   * render
   */
  render() {
    return (
      <div>
        <MainFunctionNavbar activeTrail="hops" />
        <ScreenContainer>
          <Application />
        </ScreenContainer>
      </div>
    );
  }
}
