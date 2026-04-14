import * as React from "react";
import AnimateHeight from "react-animate-height";
import { isOverdue } from "~/helper-functions/dates";
import moment from "moment";
import { useTranslation } from "react-i18next";
import "~/sass/elements/wall-item.scss";

/**
 * WallItemProps
 */
interface WallItemProps {
  state: string;
  title: string;
  dueDate?: string;
  modifier?: string;
  isCreator?: boolean;
  children?: React.ReactElement;
}

/**
 * A simple wall item component for panel use
 * @param props WallItemProps
 * @returns JSX.Element
 */
const WallItem: React.FC<WallItemProps> = (props) => {
  const { modifier, state, title, dueDate, children } = props;
  const { t } = useTranslation("tasks");
  const overdue = isOverdue(dueDate);
  const [showDescription, setShowDescription] = React.useState(false);

  /**
   * toggles description visibility
   */
  const toggleShowDescription = () => {
    setShowDescription(!showDescription);
  };

  /**
   * Handles status change
   */

  return (
    <div
      className={`wall-item ${modifier ? "wall-item--" + modifier : ""} state-${
        state
      } ${overdue ? "state-OVERDUE" : ""}`}
    >
      <div
        onClick={toggleShowDescription}
        className={`wall-item__header ${overdue ? "state-OVERDUE" : ""}`}
      >
        <span className="wall-item__title">{title}</span>

        <span
          className="wall-item__date
        "
        >
          {overdue ? (
            <span className="wall-item__overdue-tag">
              {t("labels.status", { context: "overdue" })}
            </span>
          ) : null}
          {dueDate ? <span>{moment(dueDate).format("D.M.YYYY")}</span> : null}
        </span>
      </div>
      <AnimateHeight height={showDescription ? "auto" : 0}>
        {children}
      </AnimateHeight>
    </div>
  );
};

export default WallItem;
