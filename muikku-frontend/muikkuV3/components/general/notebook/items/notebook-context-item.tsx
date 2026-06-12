// import * as React from "react";
// import { NotebookNoteType } from "~/generated/client";
// import {
//   getNotebookItemClassName,
//   getNotebookNoteBodyHtml,
//   getNotebookNoteListTitle,
// } from "../helpers/notebook-display";
// import { ContextNotebookNote } from "../helpers/notebook-layout";
// import NotebookItemShell from "./notebook-item-shell";

// /**
//  * NotebookContextItemProps
//  */
// interface NotebookContextItemProps {
//   note: ContextNotebookNote;
//   open: boolean;
//   onToggle: (noteId: number) => void;
// }

// /**
//  * Context highlight / note row.
//  * @param props props
//  * @returns React.ReactNode
//  */
// const NotebookContextItem = (props: NotebookContextItemProps) => {
//   const { note, open, onToggle } = props;

//   if (
//     note.type !== NotebookNoteType.WorkspaceMaterialContextHighlight &&
//     note.type !== NotebookNoteType.WorkspaceMaterialContextNote
//   ) {
//     return null;
//   }

//   return (
//     <NotebookItemShell
//       title={getNotebookNoteListTitle(note)}
//       bodyHtml={getNotebookNoteBodyHtml(note)}
//       open={open}
//       onToggle={() => onToggle(note.id)}
//       itemClassName={getNotebookItemClassName(note)}
//     />
//   );
// };

// export default NotebookContextItem;
