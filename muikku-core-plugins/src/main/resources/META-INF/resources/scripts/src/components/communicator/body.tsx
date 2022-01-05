import MainFunctionNavbar from "~/components/base/main-function/navbar";
import Application from "./body/application";
import Aside from "./body/aside";

import * as React from "react";

interface CommunicatorBodyProps {}

interface CommunicatorBodyState {}

export default class CommunicatorBody extends React.Component<
  CommunicatorBodyProps,
  CommunicatorBodyState
> {
  constructor(props: CommunicatorBodyProps) {
    super(props);

    this.openSignatureDialog = this.openSignatureDialog.bind(this);
  }
  openSignatureDialog() {
    return (this.refs["application"] as any)
      .getWrappedInstance()
      .openDialogSignature();
  }
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
