import * as React from "react";
import { NoteBookState, WorkspaceNote } from "~/reducers/notebook/notebook";
import { IconButton } from "../button";
import AnimateHeight from "react-animate-height";
import { connect, Dispatch } from "react-redux";
import { AnyActionType } from "~/actions";
import { bindActionCreators } from "redux";
import { StateType } from "~/reducers";
import CkeditorContentLoader from "../../base/ckeditor-loader/content";
import Button from "../button";
import Dropdown from "~/components/general/dropdown";

/**
 * NoteBookProps
 */
interface NoteListProps {
  notebook: NoteBookState;
}

/**
 * Creates NoteList component
 *
 * @param props props
 */
export const NoteList: React.FC<NoteListProps> = (props) => {
  const { children } = props;

  return <div className="notebook__items">{children}</div>;
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    notebook: state.notebook,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NoteList);

/**
 * NoteListItemProps
 */
interface NoteListItemProps {
  note: WorkspaceNote;
  isEdited: boolean;
  open: boolean;
  onOpenClick?: (noteId: number) => void;
  onEditClick?: (note: WorkspaceNote) => void;
  onDeleteClick?: (noteId: number) => void;
}

/**
 * Creates NoteListItem component
 *
 * @param props props
 * @returns JSX.Element
 */
export const NoteListItem: React.FC<NoteListItemProps> = (props) => {
  const { open, onOpenClick, note } = props;

  const [showContent, setShowContent] = React.useState<boolean>(false);
  const [deleteIsActive, setDeleteIsActive] = React.useState<boolean>(false);

  React.useEffect(() => {
    setShowContent(open);
  }, [open]);

  /**
   * Shows diary content
   */
  const handleOpenClick = () => {
    if (onOpenClick) {
      onOpenClick(note.id);
    }

    setShowContent(!showContent);
  };

  /**
   * Handles edit click
   */
  const handleEditClick = () => {
    if (props.onEditClick) {
      props.onEditClick(props.note);
    }
  };

  /**
   * Handles delete click
   */
  const handleDeleteClick = () => {
    if (props.onDeleteClick) {
      props.onDeleteClick(props.note.id);
    }
  };

  return (
    <div
      className={`notebook__item ${deleteIsActive ? "state-DELETING" : ""}`}
      key={props.note.id}
    >
      <div className="notebook__item-header">
        <div className="notebook__item-title" onClick={handleOpenClick}>
          {props.note.title}
        </div>
        <div className="notebook__item-actions">
          <Dropdown
            openByHover
            content={showContent ? <p>Sulje sisältö</p> : <p>Näytä sisältö</p>}
          >
            <IconButton
              icon="arrow-down"
              onClick={handleOpenClick}
              className={showContent ? "state-OPEN" : ""}
              buttonModifiers={["notebook-item-action", "note-item-content"]}
            />
          </Dropdown>
          <Dropdown openByHover content={<p>Muokkaa muistiinpanoa</p>}>
            <IconButton
              icon="pencil"
              onClick={handleEditClick}
              disabled={props.isEdited}
              buttonModifiers={["notebook-item-action"]}
            />
          </Dropdown>
          <Dropdown openByHover content={<p>Poista muistiinpano</p>}>
            <IconButton
              icon="trash"
              onClick={() => setDeleteIsActive(!deleteIsActive)}
              disabled={props.isEdited}
              buttonModifiers={["notebook-item-action"]}
            />
          </Dropdown>
        </div>
      </div>
      <AnimateHeight
        height={deleteIsActive ? "auto" : 0}
        contentClassName="notebook__item-delete-container"
      >
        <div className="notebook__item-delete">
          <div className="notebook__item-description">
            Haluatko varmasti poistaa muistiinpanon?
          </div>
          <div className="notebook__item-buttonset">
            <Button buttonModifiers={["fatal"]} onClick={handleDeleteClick}>
              Poista
            </Button>
            <Button
              buttonModifiers={["cancel"]}
              onClick={() => setDeleteIsActive(false)}
            >
              Peruuta
            </Button>
          </div>
        </div>
      </AnimateHeight>

      <AnimateHeight height={showContent ? "auto" : 40}>
        <article className="notebook__item-body rich-text">
          <CkeditorContentLoader html={props.note.workspaceNote} />
        </article>
      </AnimateHeight>
    </div>
  );
};
