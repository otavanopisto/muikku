import * as React from "react";
import AnimateHeight from "react-animate-height";
import { useTranslation } from "react-i18next";
import { localize } from "~/locales/i18n";
import "~/sass/elements/muikku-event.scss";

/**
 * WallItemProps
 */
interface BaseEventComponentProps {
  state: string;
  title: string;
  beginDate?: string;
  endDate?: string;
  actions?: React.ReactElement;
  description?: string;
  children?: React.ReactElement;
  modifier?: string;
}

/**
 * A simple wall item component for panel use
 * @param props EventProps
 * @returns JSX.Element
 */
const BaseEvent: React.FC<BaseEventComponentProps> = (props) => {
  const { modifier, state, title, beginDate, endDate, children } = props;
  const [detailsVisible, setDetailsVisible] = React.useState(false);
  /**
   * toggles description visibility
   */
  const toggleShowDetails = () => {
    setDetailsVisible(!detailsVisible);
  };
  return (
    <div
      className={`muikku-event ${modifier ? "muikku-event--" + modifier : ""} state-${state}`}
    >
      <div onClick={toggleShowDetails} className={`muikku-event__header`}>
        <span className="muikku-event__title">{title}</span>
        {beginDate && endDate && (
          <span>
            {localize.date(beginDate, "l - LT")}
            <span className="icon icon-long-arrow-right muikku-event__date-decoration" />
            {localize.date(endDate, "l - LT")}
          </span>
        )}
      </div>
      <AnimateHeight height={detailsVisible ? "auto" : 0}>
        {children}
      </AnimateHeight>
    </div>
  );
};

export default BaseEvent;
