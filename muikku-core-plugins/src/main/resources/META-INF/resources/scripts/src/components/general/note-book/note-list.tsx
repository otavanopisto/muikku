import * as React from "react";
import { NoteBookState, WorkspaceNote } from "~/reducers/notebook/notebook";
import { IconButton } from "../button";
import AnimateHeight from "react-animate-height";
import { connect, Dispatch } from "react-redux";
import { AnyActionType } from "~/actions";
import { bindActionCreators } from "redux";
import { StateType } from "~/reducers";
import { i18nType } from "~/reducers/base/i18n";
import CkeditorContentLoader from "../../base/ckeditor-loader/content";
import Button from "../button";
import { useIsOverflow } from "./hooks/useIsOverflowing";

/**
 * NoteBookProps
 */
interface NoteListProps {
  i18n: i18nType;
  notebook: NoteBookState;
}

/**
 * Creates NoteList component
 *
 * @param props props
 */
export const NoteList: React.FC<NoteListProps> = (props) => {
  const { children } = props;

  const listRef = React.useRef<HTMLDivElement>(null);
  const overflowDTopRef = React.useRef<HTMLDivElement>(null);
  const overflowDBottomRef = React.useRef<HTMLDivElement>(null);
  const isOverflowing = useIsOverflow<HTMLDivElement>(listRef);

  const [isOverflowingTop, setIsOverflowingTop] = React.useState(false);
  const [isOverflowingBottom, setIsOverflowingBottom] = React.useState(false);

  React.useLayoutEffect(() => {
    if (overflowDTopRef.current) {
      overflowDTopRef.current.style.display = isOverflowing ? "block" : "none";
    }
    if (overflowDBottomRef.current) {
      overflowDTopRef.current.style.display = isOverflowing ? "block" : "none";
    }
  }, [isOverflowing]);

  React.useLayoutEffect(() => {
    if (overflowDTopRef.current) {
      setIsOverflowingTop(overflowDTopRef.current.offsetTop > 0);
    }
  }, [isOverflowingTop]);

  React.useLayoutEffect(() => {
    if (overflowDBottomRef.current) {
      setIsOverflowingBottom(
        overflowDBottomRef.current.offsetTop <
          listRef.current?.scrollHeight - listRef.current?.clientHeight
      );
    }
  }, [isOverflowingBottom]);

  return (
    <div className="notebook__items" ref={listRef}>
      <div
        ref={overflowDTopRef}
        style={{
          width: "100%",
          textAlign: "center",
          backgroundColor: "black",
          color: "white",
          position: "sticky",
          top: 0,
        }}
      >
        OVERFLOW DETECTOR TOP
      </div>
      {children}
      <div
        ref={overflowDBottomRef}
        style={{
          width: "100%",
          textAlign: "center",
          border: "1px solid black",
          position: "sticky",
          bottom: 0,
        }}
      >
        OVERFLOW DETECTOR BOTTOM
      </div>
    </div>
  );
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
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

/////////  //  ////  ///     /////     ///////     ////////     /////
/////////  //  ////  ///  //  ////  //  /////  ///  ///////    //////
/////////      ////  ///     /////     /////  /////  //////   ///////
/////////  //  ////  ///  ////////  ///////  //  ///  ///////////////
/////////  //  ////  ///  ////////  //////  /////////  ////  ////////

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
    <div className="notebook__item" key={props.note.id}>
      <div className="notebook__item-header">
        <div className="notebook__item-actions">
          <IconButton
            icon="pencil"
            onClick={handleEditClick}
            disabled={props.isEdited}
            buttonModifiers={["notebook-item-action"]}
          />

          <IconButton
            icon="trash"
            onClick={() => setDeleteIsActive(!deleteIsActive)}
            disabled={props.isEdited}
            buttonModifiers={["notebook-item-action"]}
          />
        </div>
      </div>
      <div className="notebook__item-title" onClick={handleOpenClick}>
        {props.note.title}
      </div>

      <AnimateHeight height={showContent ? "auto" : 28}>
        <article className="notebook__item-body rich-text">
          <CkeditorContentLoader html={props.note.workspaceNote} />
        </article>
      </AnimateHeight>

      <AnimateHeight height={deleteIsActive ? "auto" : 0}>
        <article
          className="notebook__item-body rich-text"
          style={{
            backgroundColor: "red",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexFlow: "column",
            padding: "10px",
          }}
        >
          Haluatko varmasti poistaa muistiinpanon?
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Button style={{ width: "100px" }} onClick={handleDeleteClick}>
              Poista
            </Button>
            <Button
              style={{ width: "100px" }}
              onClick={() => setDeleteIsActive(false)}
            >
              Peruuta
            </Button>
          </div>
        </article>
      </AnimateHeight>
    </div>
  );
};
