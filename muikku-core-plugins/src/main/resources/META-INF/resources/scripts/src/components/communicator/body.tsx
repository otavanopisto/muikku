/* eslint-disable react/no-string-refs */

/**
 * Deprecated refs should be refactored
 */

import MainFunctionNavbar from "~/components/base/main-function/navbar";
import Application from "./body/application";
import Aside from "./body/aside";

import * as React from "react";

/**
 * CommunicatorBody
 */
export default class CommunicatorBody extends React.Component<
  Record<string, unknown>,
  Record<string, unknown>
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: Record<string, unknown>) {
    super(props);

    this.openSignatureDialog = this.openSignatureDialog.bind(this);
  }

  /**
   * openSignatureDialog
   */
  openSignatureDialog() {
    return (this.refs["application"] as any)
      .getWrappedInstance()
      .openDialogSignature();
  }

  /**
   * render
   */
  render() {
    const aside = <Aside openSignatureDialog={this.openSignatureDialog} />;
    return (
      <div>
        <MainFunctionNavbar activeTrail="communicator" navigation={aside} />
        <Application aside={aside} ref="application" />
      </div>
    );
  }
}
