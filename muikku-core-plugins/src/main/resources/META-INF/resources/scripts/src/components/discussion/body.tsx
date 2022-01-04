import MainFunctionNavbar from "~/components/base/main-function/navbar";
import * as React from "react";
import Application from "./body/application";

interface DiscussionBodyProps {}

interface DiscussionBodyState {}

export default class DiscussionBody extends React.Component<
  DiscussionBodyProps,
  DiscussionBodyState
> {
  render() {
    return (
      <div>
        <MainFunctionNavbar activeTrail="discussion" />
        <Application />
      </div>
    );
  }
}
