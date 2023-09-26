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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  myRef: any;

  /**
   * constructor
   * @param props props
   */
  constructor(props: Record<string, unknown>) {
    super(props);

    this.myRef = React.createRef();

    this.openSignatureDialog = this.openSignatureDialog.bind(this);
  }

  /**
   * openSignatureDialog
   */
  openSignatureDialog() {
    this.myRef.current.getWrappedInstance().openDialogSignature();
  }

  /**
   * render
   */
  render() {
    const aside = <Aside openSignatureDialog={this.openSignatureDialog} />;
    return (
      <div>
        <MainFunctionNavbar activeTrail="communicator" navigation={aside} />
        <Application aside={aside} ref={this.myRef} />
      </div>
    );
  }
}
