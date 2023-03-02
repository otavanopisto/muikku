import Dialog from "~/components/general/dialog";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import { StateType } from "~/reducers";
import Button from "~/components/general/button";
import { AnyActionType } from "~/actions";

/**
 * MatriculationExaminationWizardDialogProps
 */
interface WarningDialogProps {
  i18n: i18nType;
  title: string;
  content: JSX.Element;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: React.ReactElement<any>;
  onApproveClick?: () => void;
}

/**
 * MatriculationExaminationWizardDialogState
 */
interface WarningDialogState {}

/**
 * MatriculationExaminationWizardDialog
 */
class WarningDialog extends React.Component<
  WarningDialogProps,
  WarningDialogState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: WarningDialogProps) {
    super(props);
    this.state = {};

    this.handleApproveClick = this.handleApproveClick.bind(this);
  }

  /**
   * handleSaveClick
   * @param closeDialog closeDialog
   */
  handleApproveClick(closeDialog: () => void) {
    this.props.onApproveClick && this.props.onApproveClick();
    closeDialog();
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
    const content = (closeDialog: () => void) => this.props.content;

    /**
     * footer
     * @param closeDialog closeDialog
     */
    const footer = (closeDialog: () => void) => (
      <div className="dialog__button-set">
        <Button
          buttonModifiers={["standard-ok", "fatal"]}
          onClick={this.handleApproveClick.bind(this, closeDialog)}
        >
          Olen varma!
        </Button>
        <Button
          buttonModifiers={["standard-cancel", "cancel"]}
          onClick={closeDialog}
        >
          Peruuta
        </Button>
      </div>
    );

    return (
      <Dialog
        modifier="confirm-remove-answer-dialog"
        disableScroll={true}
        title={this.props.title}
        content={content}
        footer={footer}
        closeOnOverlayClick={false}
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
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(WarningDialog);
