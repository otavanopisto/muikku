import MainFunctionNavbar from "../base/main-function/navbar";
import * as React from "react";
import ScreenContainer from "~/components/general/screen-container";
import Application from "../guardian_hops/body/application";

/**
 * RecordsBody
 */
export default class GuardianHopsBody extends React.Component<
  Record<string, unknown>,
  Record<string, unknown>
> {
  /**
   * render
   */
  render() {
    return (
      <div>
        <MainFunctionNavbar activeTrail="guardian_hops" />
        <ScreenContainer>
          <Application />
        </ScreenContainer>
      </div>
    );
  }
}
