import MainFunctionNavbar from "../base/main-function/navbar";
import Application from "./body/application";
import Aside from "./body/aside";

import * as React from "react";

export default class EvaluationBody extends React.Component<
  Record<string, unknown>,
  Record<string, unknown>
> {
  constructor(props: Record<string, unknown>) {
    super(props);
  }

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
