// import * as React from "react";
// import { NotebookNoteType } from "~/generated/client";
// import {
//   getNotebookItemClassName,
//   getNotebookNoteBodyHtml,
//   getNotebookNoteListTitle,
// } from "../helpers/notebook-display";
// import { MaterialNotebookNote } from "../helpers/notebook-layout";
// import NotebookItemShell from "./notebook-item-shell";

// /**
//  * NotebookMaterialItemProps
//  */
// interface NotebookMaterialItemProps {
//   note: MaterialNotebookNote;
//   open: boolean;
//   onToggle: (noteId: number) => void;
// }

// /**
//  * Material page note row.
//  * @param props props
//  * @returns React.ReactNode
//  */
// const NotebookMaterialItem = (props: NotebookMaterialItemProps) => {
//   const { note, open, onToggle } = props;

//   if (note.type !== NotebookNoteType.WorkspaceMaterial) {
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

// export default NotebookMaterialItem;
