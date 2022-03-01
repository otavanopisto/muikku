import * as React from "react";
import { UseJournals } from "~/@types/journal-center";

/**
 * JournalListProps
 */
interface JournalListProps {
  journals: UseJournals;
}

/**
 * Creater Journal list component
 * @param props props
 * @returns JSX.Element
 */
const JournalList: React.FC<JournalListProps> = (props) => {
  const { children, journals } = props;

  if (journals.isLoadingList) {
    return <div className="loader-empty" />;
  }

  return (
    //const { children } = props;

    <div
      style={{
        overflowY: "scroll",
        height: "calc(100% - 50px)",
        paddingRight: "10px",
      }}
    >
      {children}
    </div>
  );
};
export default JournalList;
