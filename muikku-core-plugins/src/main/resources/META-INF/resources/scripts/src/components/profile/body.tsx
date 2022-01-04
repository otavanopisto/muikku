import MainFunctionNavbar from "../base/main-function/navbar";

import Aside from "./body/aside";
import Application from "./body/application";

import * as React from "react";

export default class ProfileBody extends React.Component {
  render() {
    const aside = <Aside />;
    return (
      <div>
        <MainFunctionNavbar navigation={aside} />
        <Application aside={aside} />
      </div>
    );
  }
}
