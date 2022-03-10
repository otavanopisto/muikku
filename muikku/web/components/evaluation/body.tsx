import MainFunctionNavbar from "../base/main-function/navbar";
import Application from "./body/application";
import Aside from "./body/aside";

import * as React from "react";

/**
 * EvaluationBody
 */
export default class EvaluationBody extends React.Component<
  Record<string, unknown>,
  Record<string, unknown>
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: Record<string, unknown>) {
    super(props);
  }

  /**
   * render
   */
  render() {
    const aside = <Aside />;

    return (
      <div>
        <MainFunctionNavbar activeTrail="evaluation" navigation={aside} />
        <Application />
      </div>
    );
  }
}
