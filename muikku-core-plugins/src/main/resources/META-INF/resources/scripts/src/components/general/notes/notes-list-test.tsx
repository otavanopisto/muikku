import * as React from "react";

/**
 * NotesItemListProps
 */
interface NotesItemListProps {
  isLoadingList: boolean;
}

/**
 * Creater NotesItem list component
 * @param props props
 * @returns JSX.Element
 */
const NotesItemListWithoutAnimation: React.FC<NotesItemListProps> = (props) => {
  const { children, isLoadingList } = props;

  if (isLoadingList) {
    return <div className="loader-empty" />;
  }

  if (React.Children.count(children) === 0) {
    return (
      <div className="empty">
        <span>Ei nootteja</span>
      </div>
    );
  }

  return <>{children}</>;
};
export default NotesItemListWithoutAnimation;
