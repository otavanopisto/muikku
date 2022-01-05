import MainFunctionNavbar from "~/components/base/main-function/navbar";
import * as React from "react";
import Application from "./body/application";
import Aside from "./body/aside";
import ScreenContainer from "../general/screen-container";

interface AnnouncementsBodyProps {}

interface AnnouncementsBodyState {}

export default class AnnouncementsBody extends React.Component<
  AnnouncementsBodyProps,
  AnnouncementsBodyState
> {
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
