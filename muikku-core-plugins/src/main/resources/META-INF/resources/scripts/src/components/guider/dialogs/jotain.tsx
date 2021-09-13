import * as React from "react";
import Dialog from "~/components/general/dialog";
import CompulsoryEducationHopsWizard from "~/components/records/body/application/hops/hops-compulsory-education-wizard/hops-compulsory-education-wizard";
import { HopsCompulsory } from "../../../@types/shared";
import JotainWizard from "../body/application/hops/jotain-wizard";

interface JotainWizardProps {
  children?: React.ReactElement<any>;
  hops?: number;
}

interface JotainWizardState {}

class JotainWizardDialog extends React.Component<
  JotainWizardProps,
  JotainWizardState
> {
  constructor(props: JotainWizardProps) {
    super(props);
  }

  render() {
    let content = (closeDialog: () => any) => (
      <div>
        <JotainWizard />
      </div>
    );
    let footer = (closeDialog: () => any) => {
      return <div className="dialog__button-set"></div>;
    };

    return (
      <Dialog
        disableScroll={true}
        title="Henkilökohtainen opintosuunnitelma"
        content={content}
        modifier={["wizard", "hops"]}
        closeOnOverlayClick={false}
      >
        {this.props.children}
      </Dialog>
    );
  }
}

export default JotainWizardDialog;
