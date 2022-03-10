import MainFunctionNavbar from "~/components/base/main-function/navbar";
import * as React from "react";
import Application from "./body/application";
import Aside from "./body/aside";
import ScreenContainer from "../general/screen-container";

/**
 * OrganizationManagementBodyProps
 */
interface OrganizationManagementBodyProps {}

/**
 * OrganizationManagementBodyState
 */
interface OrganizationManagementBodyState {}

/**
 * OrganizationManagementBody
 */
export default class OrganizationManagementBody extends React.Component<
  OrganizationManagementBodyProps,
  OrganizationManagementBodyState
> {
  /**
   * render
   */
  render() {
    const aside = <Aside />;
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
