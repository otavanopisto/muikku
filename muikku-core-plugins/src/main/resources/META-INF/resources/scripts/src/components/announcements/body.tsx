import MainFunctionNavbar from "~/components/base/main-function/navbar";
import * as React from "react";
import Application from "./body/application";
import Aside from "./body/aside";
import ScreenContainer from "../general/screen-container";

/**
 * AnnouncementsBodyProps
 */
interface AnnouncementsBodyProps {}

/**
 * AnnouncementsBodyState
 */
interface AnnouncementsBodyState {}

/**
 * AnnouncementsBody
 */
export default class AnnouncementsBody extends React.Component<
  AnnouncementsBodyProps,
  AnnouncementsBodyState
> {
  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const aside = <Aside />;
    return (
      <div>
        <MainFunctionNavbar navigation={aside} activeTrail="announcements" />
        <ScreenContainer viewModifiers="announcements">
          <Application aside={aside} />
        </ScreenContainer>
      </div>
    );
  }
}
