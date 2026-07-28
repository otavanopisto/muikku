import * as React from "react";

/**
 * NoteBookProps
 */
interface NoteListProps {}

/**
 * Creates NoteList component
 *
 * @param props props
 */
export const NoteList: React.FC<NoteListProps> = (props) => {
  const { children } = props;

  return <div className="notebook__items">{children}</div>;
};

export default NoteList;
