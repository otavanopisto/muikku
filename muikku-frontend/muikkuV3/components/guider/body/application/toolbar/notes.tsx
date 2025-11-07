import * as React from "react";
import { connect } from "react-redux";
import {
  ApplicationPanelToolbar,
  ApplicationPanelToolbarActionsMain,
} from "~/components/general/application-panel/application-panel";
import { ButtonPill } from "~/components/general/button";

import {
  createNote,
  CreateNoteTriggerType,
} from "~/actions/main-function/guider";
import { Action, bindActionCreators, Dispatch } from "redux";
import { AnyActionType } from "~/actions";
import { withTranslation, WithTranslation } from "react-i18next";
import NotesItemNew from "~/components/general/notes//notes-item-new";
import { CreateNoteRequest } from "~/generated/client";

/**
 * GuiderToolbarProps
 */
interface GuiderToolbarProps extends WithTranslation {
  createNote: CreateNoteTriggerType;
}

/**
 * GuiderToolbarState
 */
interface GuiderToolbarState {}

/**
 * GuiderToolbar
 */
class GuiderToolbar extends React.Component<
  GuiderToolbarProps,
  GuiderToolbarState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: GuiderToolbarProps) {
    super(props);
  }

  /**
   * handleNoteCreation
   * @param request request
   * @param onSuccess onSuccess
   */
  handleNoteCreation = (request: CreateNoteRequest, onSuccess: () => void) => {
    this.props.createNote(request, onSuccess);
  };
  /**
   * render
   */
  render() {
    return (
      <ApplicationPanelToolbar>
        <ApplicationPanelToolbarActionsMain>
          <NotesItemNew onNotesItemSaveClick={this.handleNoteCreation}>
            <ButtonPill
              buttonModifiers={["add-note"]}
              icon="plus"
              aria-label={this.props.i18n.t("wcag.createNewNote", {
                ns: "tasks",
              })}
            />
          </NotesItemNew>
        </ApplicationPanelToolbarActionsMain>
      </ApplicationPanelToolbar>
    );
  }
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators(
    {
      createNote,
    },
    dispatch
  );
}

export default withTranslation(["guider"])(
  connect(null, mapDispatchToProps)(GuiderToolbar)
);
