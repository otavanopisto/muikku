import MainFunctionNavbar from "../base/main-function/navbar";
import Application from "./body/application";
import Aside from "./body/aside";

import * as React from "react";

export default class EvaluationBody extends React.Component<{}, {}> {
  constructor(props: {}) {
    super(props);
  }

  render() {
    let aside = <Aside />;

    return (
      <div>
        <MainFunctionNavbar activeTrail="evaluation" navigation={aside} />
        <Application />
      </div>
    );
  }
}
