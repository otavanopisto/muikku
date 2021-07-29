import * as React from "react";
import Dialog from "~/components/general/dialog";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import Button from "~/components/general/button";
import { AnyActionType } from "~/actions";
import { StateType } from "~/reducers";
import "~/sass/elements/form-elements.scss";
import "~/sass/elements/form.scss";
import { EvaluationState } from "../../../reducers/main-function/evaluation/index";
import {
  RemoveWorkspaceEvent,
  removeWorkspaceEventFromServer,
} from "../../../actions/main-function/evaluation/evaluationActions";
import { EvaluationEnum } from "~/@types/evaluation";

const KEYCODES = {
  ENTER: 13,
};

/**
 * DeleteDialogProps
 */
interface DeleteDialogProps {
  children: React.ReactElement<any>;
  isOpen?: boolean;
  onClose?: () => any;
  evaluations: EvaluationState;
  removeWorkspaceEventFromServer: RemoveWorkspaceEvent;
}

/**
 * DeleteDialogState
 */
interface DeleteDialogState {}

/**
 * DeleteDialog
 */
class DeleteDialog extends React.Component<
  DeleteDialogProps,
  DeleteDialogState
> {
  /**
   * constructor
   * @param props
   */
  constructor(props: DeleteDialogProps) {
    super(props);

    this.handleDeleteEventClick = this.handleDeleteEventClick.bind(this);
  }

  /**
   * handleDeleteEventClick
   */
  handleDeleteEventClick(closeDialog: () => any) {
    const { evaluationAssessmentEvents } = this.props.evaluations;
    const latestIndex = evaluationAssessmentEvents.length - 1;

    this.props.removeWorkspaceEventFromServer({
      identifier: evaluationAssessmentEvents[latestIndex].identifier,
      eventType: evaluationAssessmentEvents[latestIndex].type,
      onSuccess: () => {
        const eventId = evaluationAssessmentEvents[latestIndex].identifier;

        cleanWorkspaceAndSupplementationDrafts(eventId);

        closeDialog();
      },
      onFail: () => closeDialog(),
    });
  }

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    let footer = (closeDialog: () => any) => {
      return (
        <div className="dialog__button-set">
          <Button
            buttonModifiers={["fatal", "standard-ok"]}
            onClick={this.handleDeleteEventClick.bind(this, closeDialog)}
          >
            Kyllä
          </Button>
          <Button
            buttonModifiers={["cancel", "standard-cancel"]}
            onClick={closeDialog}
          >
            Peruuta
          </Button>
        </div>
      );
    };
    let content = (closeDialog: () => any) => {
      return (
        <div>
          Oletko varma, että haluat poistaa merkinnän opiskelijalta "(Student)"?
        </div>
      );
    };
    return (
      <Dialog
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        modifier="guider-delete-file"
        title="Merkinnän poisto"
        content={content}
        footer={footer}
      >
        {this.props.children}
      </Dialog>
    );
  }
}

/**
 * cleanWorkspaceAndSupplementationDrafts
 * @param eventId
 */
export const cleanWorkspaceAndSupplementationDrafts = (eventId: string) => {
  if (
    localStorage.getItem(
      `supplementation-editor-edit.${eventId}.literalEvaluation`
    )
  ) {
    localStorage.removeItem(
      `supplementation-editor-edit.${eventId}.literalEvaluation`
    );
  }
  if (
    localStorage.getItem(
      `supplementation-editor-new.${eventId}.literalEvaluation`
    )
  ) {
    localStorage.removeItem(
      `supplementation-editor-new.${eventId}.literalEvaluation`
    );
  }

  if (
    localStorage.getItem(
      `workspace-editor-edit.${eventId}.literalEvaluation`
    ) ||
    localStorage.getItem(`workspace-editor-edit.${eventId}.grade`)
  ) {
    localStorage.removeItem(
      `workspace-editor-edit.${eventId}.literalEvaluation`
    );
    localStorage.removeItem(`workspace-editor-edit.${eventId}.grade`);
  }
  if (
    localStorage.getItem(`workspace-editor-new.${eventId}.literalEvaluation`) ||
    localStorage.getItem(`workspace-editor-new.${eventId}.grade`)
  ) {
    localStorage.removeItem(
      `workspace-editor-new.${eventId}.literalEvaluation`
    );
    localStorage.removeItem(`workspace-editor-new.${eventId}.grade`);
  }
};

/**
 * mapStateToProps
 * @param state
 */
function mapStateToProps(state: StateType) {
  return {
    evaluations: state.evaluations,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ removeWorkspaceEventFromServer }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteDialog);
