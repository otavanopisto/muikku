import * as React from "react";
import Dialog from "~/components/general/dialog";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import Button from "~/components/general/button";
import { AnyActionType } from "~/actions";
import { StateType } from "~/reducers";
import "~/sass/elements/form-elements.scss";
import "~/sass/elements/form.scss";
import { i18nType } from "../../../reducers/base/i18n";

/**
 * DeleteDialogProps
 */
interface WarningeDialogProps {
  i18n: i18nType;
  children: React.ReactElement<any>;
  isOpen?: boolean;
  onContinueClick: () => void;
  onClose?: () => any;
}

/**
 * DeleteDialogState
 */
interface WarningDialogState { }

/**
 * DeleteDialog
 */
class WarningDialog extends React.Component<
  WarningeDialogProps,
  WarningDialogState
> {
  /**
   * constructor
   * @param props
   */
  constructor(props: WarningeDialogProps) {
    super(props);

    this.handleContinueClick = this.handleContinueClick.bind(this);
  }

  /**
   * handleDeleteEventClick
   */
  handleContinueClick(closeDialog: () => any) {
    this.props.onContinueClick();
    closeDialog();
  }

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const footer = (closeDialog: () => any) => {
      return (
        <div className="dialog__button-set">
          <Button
            buttonModifiers={["fatal", "standard-ok"]}
            onClick={this.handleContinueClick.bind(this, closeDialog)}
          >
            {this.props.i18n.text.get(
              "plugin.evaluation.evaluationModal.unsavedVerbalRecordings.proceedButton"
            )}
          </Button>
          <Button
            buttonModifiers={["cancel", "standard-cancel"]}
            onClick={closeDialog}
          >
            {this.props.i18n.text.get(
              "plugin.evaluation.evaluationModal.unsavedVerbalRecordings.cancelButton"
            )}
          </Button>
        </div>
      );
    };
    const content = (closeDialog: () => any) => {
      return (
        <div>{this.props.i18n.text.get(
          "plugin.evaluation.evaluationModal.unsavedVerbalRecordings.description"
        )}
        </div>
      );
    };
    return (
      <Dialog
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        modifier="evaluation-remove-assessment"
        title={this.props.i18n.text.get(
          "plugin.evaluation.evaluationModal.unsavedVerbalRecordings.title"
        )}
        content={content}
        footer={footer}
      >
        {this.props.children}
      </Dialog>
    );
  }
}

/* localStorage.getItem(`workspace-editor-edit.${draftId}.`)
 */
/**
 * mapStateToProps
 * @param state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(WarningDialog);
