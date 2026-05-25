import * as React from "react";
import { useTranslation } from "react-i18next";
import "~/sass/elements/note.scss";
import WallItem from "./components/wall-item";
import { MuikkuEvent } from "~/generated/client";
import { localize } from "~/locales/i18n";
import "~/sass/elements/wall-event.scss";

/**
 * WallAbsenceEventsProps
 */
interface WallAbsenceEventsProps {
  modifier?: string;
  event: MuikkuEvent;
  isUnder18?: boolean;
  actions?: React.ReactElement;
}

/**
 * A Wall absence event component
 * @param props WallAbsenceEventPRops
 * @returns JSX.Element
 */
const WallAbsenceEvent: React.FC<WallAbsenceEventsProps> = (props) => {
  const { modifier, event, actions, isUnder18 = true } = props;
  const { t } = useTranslation("tasks");
  const absenceEventProperty = event.properties.find(
    (prop) => prop.name === "ABSENCE_REASON"
  );
  const absenceState =
    absenceEventProperty && absenceEventProperty.value !== ""
      ? "REVIEWED"
      : isUnder18
        ? "REVIEW-PENDING"
        : "REVIEWED";

  return (
    <WallItem modifier={modifier} state={absenceState} title={event.title}>
      <div className="wall-event">
        <div className="wall-event__header">
          <div className="wall-event__description">{event.description}</div>
          <div className="wall-event__date">
            {localize.date(event.start, "l - LT")}
            <span className="icon icon-long-arrow-right wall-event__date-decoration" />
            {localize.date(event.end, "l - LT")}
          </div>
        </div>
        <div className="wall-event__body">
          {event.properties &&
            event.properties.map((prop) => (
              <div key={prop.id} className="wall-event__property">
                <span className="wall-event__property-name">
                  {t("labels.property", { ns: "events", context: prop.name })}:
                </span>
                <span className="wall-event__property-value">{prop.value}</span>
              </div>
            ))}
        </div>
        {actions && <div className="wall-event__footer">{actions}</div>}
      </div>
    </WallItem>
  );
};

export default WallAbsenceEvent;
