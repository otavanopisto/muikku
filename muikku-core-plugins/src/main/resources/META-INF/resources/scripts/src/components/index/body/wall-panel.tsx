import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import { StatusType } from "~/reducers/base/status";
import { StateType } from "~/reducers";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { AnyActionType } from "~/actions";
import { Panel } from "~/components/general/panel";
import { useOnGoingNotes } from "~/hooks/useNotes";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import { Note } from "./wall/note";

/**
 * Wall properties
 */
export interface WallProps {
  i18n: i18nType;
  status: StatusType;
  displayNotification: DisplayNotificationTriggerType;
}

/**
 * Wall component
 * @param props WallProps
 */
const WallPanel: React.FC<WallProps> = (props) => {
  const { i18n, status, displayNotification } = props;
  const { notes, updateNoteStatus, updateNote } = useOnGoingNotes(
    status,
    i18n,
    displayNotification
  );

  return (
    <Panel
      header={props.i18n.text.get("plugin.frontPage.wall.title")}
      modifier="wall"
      icon="icon-star-empty"
    >
      <Panel.BodyTitle>
        {props.i18n.text.get("plugin.frontPage.wall.subtitle.tasks")}
      </Panel.BodyTitle>
      <Panel.BodyContent>
        {notes.length > 0 ? (
          notes.map((note) => (
            <Note
              i18n={i18n}
              isCreator={note.creator === status.userId}
              key={note.id}
              note={note}
              onUpdate={updateNote}
              onStatusUpdate={updateNoteStatus}
            />
          ))
        ) : (
          <div className="empty empty--front-page">
            {i18n.text.get("plugin.frontPage.wall.tasks.empty")}
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
    i18n: state.i18n,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ displayNotification }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(WallPanel);
