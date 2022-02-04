import MainFunctionNavbar from "~/components/base/main-function/navbar";
import * as React from "react";
import Application from "./body/application";

/**
 * DiscussionBodyProps
 */
interface DiscussionBodyProps {}

/**
 * DiscussionBodyState
 */
interface DiscussionBodyState {}

/**
 * DiscussionBody
 */
export default class DiscussionBody extends React.Component<
  DiscussionBodyProps,
  DiscussionBodyState
> {
  /**
   * render
   */
  render() {
    return (
      <div>
        <MainFunctionNavbar activeTrail="discussion" />
        <Application />
      </div>
    );
  }
}
