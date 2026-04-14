import * as React from "react";
import { StatusType } from "~/reducers/base/status";

import { StateType } from "~/reducers";
import { connect } from "react-redux";
import { Action, bindActionCreators, Dispatch } from "redux";
import { AnyActionType } from "~/actions";
import { Panel } from "~/components/general/panel";
import { useOnGoingNotes } from "~/hooks/useNotes";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import WallNote from "./wall/wall-note";
import WallEvent from "./wall/walll-event";
import { withTranslation, WithTranslation } from "react-i18next";
import { UserEventService } from "~/mock/absence";

/**
 * Wall properties
 */
export interface WallProps extends WithTranslation {
  status: StatusType;
  displayNotification: DisplayNotificationTriggerType;
}

/**
 * Wall component
 * @param props WallProps
 */
const WallPanel: React.FC<WallProps> = (props) => {
  const { status, displayNotification, t } = props;
  const { notes, updateNoteStatus, updateNote } = useOnGoingNotes(
    status,
    displayNotification
  );
  const service = new UserEventService(status.userId);

  const absenceEvents = service.getAbsenceEvents();

  return (
    <Panel
      header={t("labels.wall", { ns: "frontPage" })}
      modifier="wall"
      icon="icon-star-empty"
    >
      <Panel.BodyTitle>{t("labels.wall", { ns: "frontPage" })}</Panel.BodyTitle>
      <Panel.BodyContent>
        {notes.length > 0 ? (
          notes.map((note) => (
            <WallNote
              isCreator={note.creator === status.userId}
              key={note.id}
              note={note}
              onUpdate={updateNote}
              onStatusUpdate={updateNoteStatus}
            />
          ))
        ) : (
          <div className="empty empty--front-page">
            {t("content.empty", { ns: "tasks", context: "student" })}
          </div>
        )}
      </Panel.BodyContent>

      <Panel.BodyTitle>
        {t("labels.events", { ns: "frontPage" })}
      </Panel.BodyTitle>
      <Panel.BodyContent>
        {absenceEvents.length > 0 ? (
          absenceEvents.map((event) => (
            <WallEvent key={event.id} event={event} />
          ))
        ) : (
          <div className="empty empty--front-page">
            {t("content.empty", { ns: "frontPage" })}
          </div>
        )}
      </Panel.BodyContent>
    </Panel>
  );
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators({ displayNotification }, dispatch);
}

export default withTranslation(["frontPage", "tasks"])(
  connect(mapStateToProps, mapDispatchToProps)(WallPanel)
);
