import * as React from "react";
import Dialog from "~/components/general/dialog";
import "~/sass/elements/link.scss";
import "~/sass/elements/form.scss";
import "~/sass/elements/buttons.scss";
import Button from "~/components/general/button";
import { WorkspaceSuggestion } from "~/generated/client";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * WorkspaceSignupDialogProps
 */
interface WorkspaceDescriptionDialogProps extends WithTranslation {
  children?: React.ReactElement<any>;
  isOpen?: boolean;
  onClose?: () => void;
  course: WorkspaceSuggestion;
}

/**
 * WorkspaceSignupDialogState
 */
interface WorkspaceDescriptionDialogState {
  locked: boolean;
  message: string;
}

/**
 * WorkspaceDescriptionDialog
 */
class WorkspaceDescriptionDialog extends React.Component<
  WorkspaceDescriptionDialogProps,
  WorkspaceDescriptionDialogState
> {
  /**
   * constructor method
   * @param props props
   */
  constructor(props: WorkspaceDescriptionDialogProps) {
    super(props);
    this.state = {
      locked: false,
      message: "",
    };
  }

  /**
   * createHtmlMarkup
   * This should sanitize html
   * @param htmlString string that contains html
   */
  createHtmlMarkup = (htmlString: string) => ({
    __html: htmlString,
  });

  /**
   * Component render method
   * @returns React.JSX.Element
   */
  render() {
    /**
     * content
     * @param closeDialog closeDialog
     * @returns React.JSX.Element
     */
    const content = (closeDialog: () => void) => (
      <div
        dangerouslySetInnerHTML={this.createHtmlMarkup(
          this.props.course.description
        )}
      />
    );

    /**
     * footer
     * @param closeDialog closeDialog
     */
    const footer = (closeDialog: () => void) => (
      <div className="dialog__button-set">
        <Button
          onClick={closeDialog}
          buttonModifiers={["standard-ok", "cancel"]}
        >
          Sulje
        </Button>
      </div>
    );

    return (
      <Dialog
        modifier="course-description"
        title={this.props.t("labels.description", { ns: "workspace" })}
        content={content}
        footer={footer}
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
      >
        {this.props.children}
      </Dialog>
    );
  }
}

export default withTranslation("workspace")(WorkspaceDescriptionDialog);
