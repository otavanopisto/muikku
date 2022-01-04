import MainFunctionNavbar from "~/components/base/main-function/navbar";
import * as React from "react";
import Playground from "../__playground";
import Application from "./body/application";
import Aside from "./body/aside";
import ScreenContainer from "../general/screen-container";

interface OrganizationManagementBodyProps {}

interface OrganizationManagementBodyState {}

export default class OrganizationManagementBody extends React.Component<
  OrganizationManagementBodyProps,
  OrganizationManagementBodyState
> {
  render() {
    let aside = <Aside />;
    return (
      <div>
        <MainFunctionNavbar navigation={aside} activeTrail="organization" />
        <ScreenContainer>
          <Application aside={aside} />
        </ScreenContainer>
      </div>
    );
  }
}
