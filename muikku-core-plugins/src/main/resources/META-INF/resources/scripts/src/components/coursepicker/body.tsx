import MainFunctionNavbar from "~/components/base/main-function/navbar";
import Application from "./body/application";
import Aside from "./body/aside";

import * as React from "react";

/**
 * CoursepickerBodyProps
 */
interface CoursepickerBodyProps {}

/**
 * CoursepickerBodyState
 */
interface CoursepickerBodyState {}

/**
 * CoursepickerBody
 */
export default class CoursepickerBody extends React.Component<
  CoursepickerBodyProps,
  CoursepickerBodyState
> {
  /**
   * render
   */
  render() {
    const aside = <Aside />;
    return (
      <div>
        <MainFunctionNavbar activeTrail="coursepicker" navigation={aside} />
        <Application aside={aside} />
      </div>
    );
  }
}
