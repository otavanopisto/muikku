import MainFunctionNavbar from "~/components/base/main-function/navbar";
import * as React from "react";
import Application from "./body/application";
import Aside from "./body/aside";

/**
 * AnnouncerBodyProps
 */
interface AnnouncerBodyProps {}

/**
 * AnnouncerBodyState
 */
interface AnnouncerBodyState {}

/**
 * AnnouncerBody
 */
export default class AnnouncerBody extends React.Component<
  AnnouncerBodyProps,
  AnnouncerBodyState
> {
  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const aside = <Aside />;
    return (
      <div>
        <MainFunctionNavbar activeTrail="announcer" navigation={aside} />
        <Application aside={aside} />
      </div>
    );
  }
}
