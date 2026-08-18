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
import WallAbsenceEvent from "./wall/walll-event";
import { withTranslation, WithTranslation } from "react-i18next";
import { MuikkuEvents } from "~/reducers/base/muikku-events";
import AbsenceFeedbackDialog from "~/components/general/events/dialogs/absence-feedback-dialog";
import Button from "~/components/general/button"; // Button component
import {
  createAbsenceEventProperty,
  updateAbsenceEventProperty,
} from "~/actions/base/muikku-events";

/**
 * Wall properties
 */
export interface WallProps extends WithTranslation {
  status: StatusType;
  absenceEvents: MuikkuEvents;
  displayNotification: DisplayNotificationTriggerType;
}

/**
 * Wall component
 * @param props WallProps
 */
const WallPanel: React.FC<WallProps> = (props) => {
  const { status, displayNotification, t, absenceEvents } = props;
  const { notes, updateNoteStatus, updateNote } = useOnGoingNotes(
    status,
    displayNotification
  );

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
      {absenceEvents.events.length > 0 && (
        <>
          <Panel.BodyTitle>
            {t("labels.absences", { ns: "events" })}
          </Panel.BodyTitle>
          <Panel.BodyContent>
            {absenceEvents.events.map((event) => {
              const hasFeedback = event.properties?.find(
                (property) =>
                  property.name == "ABSENCE_REASON" && property.value !== ""
              );
              return (
                <WallAbsenceEvent
                  key={event.id}
                  isUnder18={status.isUnder18}
                  event={event}
                  actions={
                    <AbsenceFeedbackDialog
                      studentId={status.userId}
                      absenceEvent={event}
                      onUpdate={updateAbsenceEventProperty}
                      onCreate={createAbsenceEventProperty}
                    >
                      <Button className="button button--primary-function-content">
                        {hasFeedback
                          ? t("actions.editFeedback", { ns: "events" })
                          : t("actions.giveFeedback", { ns: "events" })}
                      </Button>
                    </AbsenceFeedbackDialog>
                  }
                />
              );
            })}
          </Panel.BodyContent>
        </>
      )}
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
    absenceEvents: state.muikkuEvents.absenceEvents,
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
