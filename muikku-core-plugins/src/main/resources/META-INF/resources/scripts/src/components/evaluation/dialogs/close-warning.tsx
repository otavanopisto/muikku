import * as React from "react";
import Dialog from "~/components/general/dialog";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import Button from "~/components/general/button";
import { AnyActionType } from "~/actions";
import { StateType } from "~/reducers";
import "~/sass/elements/form.scss";
import { i18nType } from "../../../reducers/base/i18nOLD";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * DeleteDialogProps
 */
interface WarningeDialogProps
  extends WithTranslation<["common"]> {
  i18nOLD: i18nType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: React.ReactElement<any>;
  isOpen?: boolean;
  onContinueClick: () => void;
  onClose?: () => void;
}

/**
 * DeleteDialogState
 */
interface WarningDialogState {}

/**
 * DeleteDialog
 */
class WarningDialog extends React.Component<
  WarningeDialogProps,
  WarningDialogState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: WarningeDialogProps) {
    super(props);

    this.handleContinueClick = this.handleContinueClick.bind(this);
  }

  /**
   * handleDeleteEventClick
   * @param closeDialog closeDialog
   */
  handleContinueClick(closeDialog: () => void) {
    this.props.onContinueClick();
    closeDialog();
  }

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    /**
     * footer
     * @param closeDialog closeDialog
     */
    const footer = (closeDialog: () => void) => (
      <div className="dialog__button-set">
        <Button
          buttonModifiers={["fatal", "standard-ok"]}
          onClick={this.handleContinueClick.bind(this, closeDialog)}
        >
          {/* {this.props.t("evaluation:actions.confirmCancel")} */} asd
        </Button>
        <Button
          buttonModifiers={["cancel", "standard-cancel"]}
          onClick={closeDialog}
        >
          {/* {this.props.t("common:actions.cancel")} */} asd
        </Button>
      </div>
    );
    /**
     * content
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => void) => (
      <div>
        {this.props.i18nOLD.text.get(
          "plugin.evaluation.evaluationModal.unsavedVerbalRecordings.description"
        )}
      </div>
    );
    return (
      <Dialog
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        modifier="evaluation-remove-assessment"
        title={this.props.i18nOLD.text.get(
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
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18nOLD: state.i18nOLD,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({}, dispatch);
}

export default withTranslation(["common"])(
  connect(mapStateToProps, mapDispatchToProps)(WarningDialog)
);
