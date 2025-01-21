import Dialog from "~/components/general/dialog";
import React, { useState } from "react";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import Button from "~/components/general/button";
import { Textarea } from "~/components/hops/body/application/wizard/components/text-area";
import { HopsHistoryEntry } from "~/generated/client";
import { Action, bindActionCreators, Dispatch } from "redux";
import { AnyActionType } from "~/actions";
import { StateType } from "~/reducers";
import { connect } from "react-redux";
import {
  UpdateHopsFormHistoryEntryTriggerType,
  updateHopsFormHistoryEntry,
} from "~/actions/main-function/hops/";

/**
 * Props for the EditHopsEventDescriptionDialog component
 */
interface EditHopsEventDescriptionDialogProps {
  historyEntry: HopsHistoryEntry;
  children?: React.ReactElement;
  updateHopsFormHistoryEntry: UpdateHopsFormHistoryEntryTriggerType;
}

/**
 * A dialog component for editing the description of a HOPS event
 * @param props - The component props
 * @returns A React functional component
 */
const EditHopsEventDescriptionDialog: React.FC<
  EditHopsEventDescriptionDialogProps
> = (props) => {
  const { historyEntry, updateHopsFormHistoryEntry, children } = props;
  const [description, setDescription] = useState(historyEntry.details);

  /**
   * Handles changes to the description textarea
   * @param event - The change event
   */
  const handleHopsUpdateDetailsChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(event.target.value);
  };

  /**
   * Handles the save button click
   * @param closePortal - Function to close the dialog
   * @returns Click event handler
   */
  const handleSaveClick =
    (closePortal: () => void) =>
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      updateHopsFormHistoryEntry({
        entryId: historyEntry.id,
        originalEntry: historyEntry,
        updatedEntry: { details: description },
        onSuccess: closePortal,
      });
    };

  /**
   * Handles the cancel button click
   * @param closePortal - Function to close the dialog
   * @returns Click event handler
   */
  const handleCancelClick =
    (closePortal: () => void) =>
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      setDescription(historyEntry.details);
      closePortal();
    };

  /**
   * Renders the dialog content
   * @returns The dialog content
   */
  const dialogContent = () => (
    <div className="hops-container__row">
      <div className="hops__form-element-container">
        <Textarea
          id="hopsUpdateDetailsExplanation"
          label="Vapaa kuvaus tapahtuman muutoksista"
          className="form-element__textarea form-element__textarea--resize__vertically"
          onChange={handleHopsUpdateDetailsChange}
          value={description}
        />
      </div>
    </div>
  );

  /**
   * Renders the dialog footer
   * @param closePortal - Function to close the dialog
   * @returns The dialog footer
   */
  const footer = (closePortal: () => void) => (
    <div className="dialog__button-set">
      <Button
        buttonModifiers={["standard-ok", "fatal"]}
        onClick={handleSaveClick(closePortal)}
      >
        Ok
      </Button>
      <Button
        buttonModifiers={["standard-cancel", "cancel"]}
        onClick={handleCancelClick(closePortal)}
      >
        Peruuta
      </Button>
    </div>
  );

  return (
    <Dialog
      modifier="confirm-remove-answer-dialog"
      disableScroll={true}
      title="Tapahtuman kuvaus"
      content={dialogContent}
      footer={footer}
      closeOnOverlayClick={false}
    >
      {children}
    </Dialog>
  );
};

/**
 * Maps the Redux state to component props
 * @param state - The Redux state
 * @returns An object with the mapped props
 */
function mapStateToProps(state: StateType) {
  return {};
}

/**
 * Maps dispatch functions to component props
 * @param dispatch - The Redux dispatch function
 * @returns An object with the mapped dispatch functions
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators(
    {
      updateHopsFormHistoryEntry,
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditHopsEventDescriptionDialog);
