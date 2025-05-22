import * as React from "react";
import { connect } from "react-redux";
import { Action, bindActionCreators, Dispatch } from "redux";
import { AnyActionType } from "~/actions";
import { StateType } from "~/reducers";
import { IconButton } from "~/components/general/button";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import {
  CreateNewFromCutContent,
  createNewFromCutContent,
} from "../../../../actions/notebook/notebook";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * testProps
 */
interface LocalPopoverProps {
  createNewFromCutContent: CreateNewFromCutContent;
}

/**
 * LocalPopover
 * @param props props
 */
const LocalPopover: React.FC<LocalPopoverProps> = (props) => {
  const [selectedText, setSelectedText] = React.useState("");
  const [showPopover, setShowPopover] = React.useState(false);
  const [popoverPos, setPopoverPos] = React.useState<DOMRect | null>(null);

  /**
   * handleCreateNoteFromSelection
   * @param e event
   */
  const handleCreateNoteFromSelection = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.stopPropagation();
    props.createNewFromCutContent({ cutContent: selectedText });

    unstable_batchedUpdates(() => {
      setShowPopover(false);
      setSelectedText("");
    });

    if (window.getSelection().empty) {
      // Chrome
      window.getSelection().empty();
    } else if (window.getSelection().removeAllRanges) {
      // Firefox
      window.getSelection().removeAllRanges();
    }
  };

  /**
   * Handles mouse up
   * @param e event
   */
  const handleMouseUp = (e: React.MouseEvent) => {
    e.stopPropagation();

    const domRect = window.getSelection().getRangeAt(0).getBoundingClientRect();
    const selection = window.getSelection().toString();

    // If selection is empty no need to show popover
    if (selection !== "") {
      unstable_batchedUpdates(() => {
        setShowPopover(true);
        setPopoverPos(domRect);
        setSelectedText(`<em>${selection}</em>`);
      });
    } else {
      unstable_batchedUpdates(() => {
        setShowPopover(false);
        setPopoverPos(null);
        setSelectedText("");
      });
    }
  };

  return (
    <div
      onMouseUp={handleMouseUp}
      style={{ display: "contents", position: "relative" }}
    >
      {showPopover && (
        <div
          style={{
            position: "fixed",
            top: popoverPos.top - 40,
            left: popoverPos.right,
            zIndex: "100",
          }}
        >
          <IconButton
            buttonModifiers={["workspace-add-note-from-context"]}
            icon="note-add"
            onClick={handleCreateNoteFromSelection}
          />
        </div>
      )}
      {props.children}
    </div>
  );
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {};
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators(
    {
      createNewFromCutContent,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(LocalPopover);
