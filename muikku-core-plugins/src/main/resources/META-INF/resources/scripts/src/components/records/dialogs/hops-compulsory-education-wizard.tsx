import * as React from "react";
import Dialog from "~/components/general/dialog";
import { HopsUser } from "../../general/hops-compulsory-education-wizard";
import CompulsoryEducationHopsWizard from "../../general/hops-compulsory-education-wizard";

/**
 * HopsCompulsoruEducationWizardProps
 */
interface HopsCompulsoruEducationWizardProps {
  user: HopsUser;
  superVisorModifies: boolean;
  children?: React.ReactElement<any>;
  hops?: number;
  disabled: boolean;
  studyTimeEnd: string | null;
}

/**
 * HopsCompulsoruEducationWizardState
 */
interface HopsCompulsoruEducationWizardState {}

/**
 * HopsCompulsoryEducationWizardDialog
 */
class HopsCompulsoryEducationWizardDialog extends React.Component<
  HopsCompulsoruEducationWizardProps,
  HopsCompulsoruEducationWizardState
> {
  /**
   * Constructor method
   * @param props props
   */
  constructor(props: HopsCompulsoruEducationWizardProps) {
    super(props);
  }

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    /**
     * content
     * @param closeDialog closeDialog
     * @returns JSX.Element
     */
    const content = (closeDialog: () => any) => (
      <div>
        <CompulsoryEducationHopsWizard
          user={this.props.user}
          useCase="studies"
          disabled={this.props.disabled}
          superVisorModifies={this.props.superVisorModifies}
          studentId={document
            .querySelector('meta[name="muikku:loggedUser"]')
            .getAttribute("value")}
        />
      </div>
    );

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

export default HopsCompulsoryEducationWizardDialog;
