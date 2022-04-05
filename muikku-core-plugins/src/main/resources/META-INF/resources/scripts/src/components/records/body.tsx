import MainFunctionNavbar from "../base/main-function/navbar";
import Application from "./body/application";
import Aside from "./body/aside";
import * as React from "react";
import ScreenContainer from "~/components/general/screen-container";

/**
 * RecordsBody
 */
export default class RecordsBody extends React.Component<
  Record<string, unknown>,
  Record<string, unknown>
> {
  /**
   * render
   */
  render() {
    const aside = <Aside />;
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
