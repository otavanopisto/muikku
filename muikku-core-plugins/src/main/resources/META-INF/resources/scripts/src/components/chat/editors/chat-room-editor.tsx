import * as React from "react";
import { useChatContext } from "../context/chat-context";

/**
 * ChatRoomEditor
 * @returns JSX.Element
 */
function ChatRoomEditor() {
  const {
    updateRoomEditor,
    closeView,
    currentEditorValues,
    saveEditorChanges,
  } = useChatContext();

  return (
    <div
      className="chat-rooms-editor"
      style={{
        margin: "10px",
      }}
    >
      <h3>Uusi chatti huone</h3>
      <div
        className="new-room-form"
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <label>Nimi</label>
        <input
          type="text"
          value={currentEditorValues.name}
          onChange={(e) => updateRoomEditor("name", e.target.value)}
        />

        <label>Kuvaus</label>
        <textarea
          value={currentEditorValues.description}
          onChange={(e) => updateRoomEditor("description", e.target.value)}
        />
        <button onClick={saveEditorChanges}>Tallenna</button>
        <button onClick={closeView}>Peruuta</button>
      </div>
    </div>
  );
}

export default ChatRoomEditor;
