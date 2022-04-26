import * as React from "react";
import { connect, Dispatch } from "react-redux";
import Dialog from "~/components/general/dialog";
import { AnyActionType } from "~/actions";
import { i18nType } from "~/reducers/base/i18n";
import "~/sass/elements/link.scss";
import "~/sass/elements/form-elements.scss";
import "~/sass/elements/form.scss";
import "~/sass/elements/buttons.scss";
import { StateType } from "~/reducers";
import Button from "~/components/general/button";
import { bindActionCreators } from "redux";
import { Suggestion } from "~/@types/shared";

/**
 * WorkspaceSignupDialogProps
 */
interface WorkspaceDescriptionDialogProps {
  i18n: i18nType;
  children?: React.ReactElement<any>;
  isOpen?: boolean;
  onClose?: () => void;
  course: Suggestion;
}

/**
 * WorkspaceSignupDialogState
 */
interface WorkspaceDescriptionDialogState {
  locked: boolean;
  message: string;
}

/**
 * WorkspaceSignupDialog
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
   * @returns JSX.Element
   */
  render() {
    /**
     * content
     * @param closeDialog closeDialog
     * @returns JSX.Element
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
        <Button onClick={closeDialog} buttonModifiers={["standard-ok", "info"]}>
          Sulje
        </Button>
      </div>
    );

    return (
      <Dialog
        modifier="workspace-signup-dialog"
        title={this.props.i18n.text.get("plugin.workspaceSignUp.title")}
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

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({}, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkspaceDescriptionDialog);
