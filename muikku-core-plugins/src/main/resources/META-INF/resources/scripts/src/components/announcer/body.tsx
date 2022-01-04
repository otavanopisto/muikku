import MainFunctionNavbar from "~/components/base/main-function/navbar";
import * as React from "react";
import Playground from "../__playground";
import Application from "./body/application";
import Aside from "./body/aside";

interface AnnouncerBodyProps {}

interface AnnouncerBodyState {}

export default class AnnouncerBody extends React.Component<
  AnnouncerBodyProps,
  AnnouncerBodyState
> {
  render() {
    let aside = <Aside />;
    return (
      <div>
        <MainFunctionNavbar activeTrail="announcer" navigation={aside} />
        <Application aside={aside} />
      </div>
    );
  }
}
