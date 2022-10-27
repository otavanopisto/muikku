import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import { StatusType } from "~/reducers/base/status";
import { StateType } from "~/reducers";
import { connect } from "react-redux";
import { Panel } from "~/components/general/panel";
import { UseNotes } from "~/hooks/useNotes";
import { displayNotification } from "~/actions/base/notifications";
import { Note } from "./wall/note";

/**
 * Wall properties
 */
export interface WallProps {
  i18n: i18nType;
  status: StatusType;
}

/**
 * Wall component
 * @param props WallProps
 */
const WallPanel: React.FC<WallProps> = (props) => {
  const { i18n, status } = props;
  const { notes, updateNoteStatus, updateNote } = UseNotes(
    status.userId,
    i18n,
    displayNotification
  );

  return (
    <Panel header="SeinäMä" modifier="wall" icon="icon-star-empty">
      <Panel.BodyTitle>Annetut tehtävät</Panel.BodyTitle>
      <Panel.BodyContent>
        {notes.map((note) => (
          <Note
            i18n={i18n}
            isCreator={note.creator === status.userId}
            key={note.id}
            note={note}
            onUpdate={updateNote}
            onStatusUpdate={updateNoteStatus}
          />
        ))}
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

export default connect(mapStateToProps)(WallPanel);
