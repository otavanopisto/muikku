// import * as React from "react";
// import { NotebookNoteType } from "~/generated/client";
// import {
//   getNotebookNoteBodyHtml,
//   getNotebookNoteListTitle,
// } from "../helpers/notebook-display";
// import { WorkspaceNotebookNote } from "../helpers/notebook-layout";
// import NotebookItemShell from "./notebook-item-shell";

// /**
//  * NotebookWorkspaceItemProps
//  */
// interface NotebookWorkspaceItemProps {
//   note: WorkspaceNotebookNote;
//   open: boolean;
//   onToggle: (noteId: number) => void;
// }

// /**
//  * Workspace note row.
//  * @param props props
//  * @returns React.ReactNode
//  */
// const NotebookWorkspaceItem = (props: NotebookWorkspaceItemProps) => {
//   const { note, open, onToggle } = props;

//   if (note.type !== NotebookNoteType.Workspace) {
//     return null;
//   }

//   return (
//     <NotebookItemShell
//       title={getNotebookNoteListTitle(note)}
//       bodyHtml={getNotebookNoteBodyHtml(note)}
//       open={open}
//       onToggle={() => onToggle(note.id)}
//     />
//   );
// };

// export default NotebookWorkspaceItem;
