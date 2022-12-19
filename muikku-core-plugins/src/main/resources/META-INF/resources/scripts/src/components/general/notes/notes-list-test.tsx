import * as React from "react";
import { i18nType } from "~/reducers/base/i18nOLD";

/**
 * NotesItemListProps
 */
interface NotesItemListProps {
  isLoadingList: boolean;
  i18nOLD: i18nType;
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
        <span>{props.i18nOLD.text.get("plugin.records.tasks.empty")}</span>
      </div>
    );
  }

  return <>{children}</>;
};
export default NotesItemListWithoutAnimation;
