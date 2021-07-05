import * as React from "react";
import Dialog from "~/components/general/dialog";
import CompulsoryEducationHopsWizard from "~/components/records/body/application/hops/hops-compulsory-education-wizard/hops-compulsory-education-wizard";

interface HopsCompulsoruEducationWizardProps {
  children?: React.ReactElement<any>;
}

interface HopsCompulsoruEducationWizardState {}

class HopsCompulsoryEducationWizardDialog extends React.Component<
  HopsCompulsoruEducationWizardProps,
  HopsCompulsoruEducationWizardState
> {
  constructor(props: HopsCompulsoruEducationWizardProps) {
    super(props);
  }

  render() {
    let content = (closeDialog: () => any) => (
      <div>
        <CompulsoryEducationHopsWizard />
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
      >
        {this.props.children}
      </Dialog>
    );
  }
}

export default HopsCompulsoryEducationWizardDialog;
