import Dialog from "~/components/general/dialog";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import { StateType } from "~/reducers";
import Button from "~/components/general/button";
import NotesListItem, { NotesListItemProps } from "../notes-item-list-item";
import { AnyActionType } from "~/actions";

/**
 * MatriculationExaminationWizardDialogProps
 */
interface NoteInformationDialogProps extends NotesListItemProps {
  i18n: i18nType;
  children?: React.ReactElement<any>;
}

/**
 * MatriculationExaminationWizardDialogState
 */
interface NoteInformationDialogState {}

/**
 * MatriculationExaminationWizardDialog
 */
class NoteInformationDialog extends React.Component<
  NoteInformationDialogProps,
  NoteInformationDialogState
> {
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
    const content = (closeDialog: () => any) => {
      const { children, ...item } = this.props;
      return (
        <NotesListItem
          {...item}
          containerModifier={["dialog-information"]}
          openInformationToDialog={false}
        />
      );
    };

    /**
     * footer
     * @param closeDialog closeDialog
     */
    const footer = (closeDialog: () => any) => (
      <div className="dialog__button-set">
        <Button
          buttonModifiers={["standard-cancel", "cancel"]}
          onClick={closeDialog}
        >
          Sulje
        </Button>
      </div>
    );

    return (
      <Dialog
        modifier="note-information"
        disableScroll={true}
        title={this.props.i18n.text.get(
          "plugin.records.notes.dialog.noteDetails.title"
        )}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NoteInformationDialog);
