import * as React from "react";
import { useTranslation } from "react-i18next";

/**
 * NotesItemListProps
 */
interface NotesItemListProps {
  isLoadingList: boolean;
}

/**
 * Creater NotesItem list component
 * @param props props
 * @returns React.JSX.Element
 */
const NotesItemListWithoutAnimation: React.FC<NotesItemListProps> = (props) => {
  const { children, isLoadingList } = props;
  const { t } = useTranslation("tasks");

  if (isLoadingList) {
    return <div className="loader-empty" />;
  }

  if (React.Children.count(children) === 0) {
    return (
      <div className="empty">
        <span>{t("content.empty", { context: "tasks" })}</span>
      </div>
    );
  }

  return <>{children}</>;
};
export default NotesItemListWithoutAnimation;
