import * as React from "react";

/**
 * JournalListProps
 */
interface JournalListProps {
  isLoadingList: boolean;
}

/**
 * Creater Journal list component
 * @param props props
 * @returns JSX.Element
 */
const JournalListWithoutAnimation: React.FC<JournalListProps> = (props) => {
  const { children, isLoadingList } = props;

  if (isLoadingList) {
    return <div className="loader-empty" />;
  }

  if (React.Children.count(children) === 0) {
    return <div>Ei nootteja</div>;
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
export default JournalListWithoutAnimation;
