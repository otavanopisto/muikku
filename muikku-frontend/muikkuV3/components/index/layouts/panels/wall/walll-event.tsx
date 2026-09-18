import * as React from "react";
import { useTranslation } from "react-i18next";
import "~/sass/elements/note.scss";
import WallItem from "./components/wall-item";
import { MuikkuEvent } from "~/generated/client";
import { localize } from "~/locales/i18n";
import "~/sass/elements/wall-event.scss";
import { absentFromLabel, absenceReasonLabel } from "~/util/events";

/**
 * WallAbsenceEventsProps
 */
interface WallAbsenceEventsProps {
  modifier?: string;
  event: MuikkuEvent;
  canEdit?: boolean;
  actions?: React.ReactElement;
}

/**
 * A Wall absence event component
 * @param props WallAbsenceEventPRops
 * @returns JSX.Element
 */
const WallAbsenceEvent: React.FC<WallAbsenceEventsProps> = (props) => {
  const { modifier, event, actions, canEdit } = props;
  const { t } = useTranslation("tasks");

  const absenceEventProperty = event.properties?.find(
    (prop) => prop.name === "ABSENCE_REASON"
  );
  const absenceState =
    absenceEventProperty && absenceEventProperty.value !== ""
      ? "REVIEWED"
      : "REVIEW-PENDING";
  const eventDate = (
    <>
      {" "}
      {localize.date(event.start, "l - LT")}
      <span className="icon icon-long-arrow-right wall-event__date-decoration" />
      {localize.date(event.end, "l - LT")}
    </>
  );

  return (
    <WallItem
      customDate={eventDate}
      modifier={modifier}
      state={absenceState}
      title={
        absentFromLabel(event) +
        (event.containerName ? " - " + event.containerName : "")
      }
    >
      <div className="wall-event">
        {event.description && (
          <div className="wall-event__description rich-text">
            {event.description}
          </div>
        )}

        {event.properties && (
          <div className="wall-event__body">
            {event.properties.map((prop) =>
              prop.name === "ABSENCE_REASON" ? (
                <div key={prop.id} className="wall-event__property">
                  <span className="wall-event__property-name">
                    {t("labels.property", {
                      ns: "events",
                      context: prop.name,
                    })}
                    :
                  </span>
                  <span className="wall-event__property-value">
                    {absenceReasonLabel(prop.value)}
                  </span>
                </div>
              ) : (
                <div key={prop.id} className="wall-event__property">
                  <span className="wall-event__property-name">
                    {t("labels.property", {
                      ns: "events",
                      context: prop.name,
                    })}
                    :
                  </span>
                  <span className="wall-event__property-value">
                    {prop.value}
                  </span>
                </div>
              )
            )}
          </div>
        )}
        {event.creatorName && (
          <div className="wall-event__creator-name">
            {t("labels.absenceCreator", {
              ns: "events",
              creator: event.creatorName,
            })}
          </div>
        )}
        {actions && canEdit && (
          <div className="wall-event__footer">{actions}</div>
        )}
      </div>
    </WallItem>
  );
};

export default WallAbsenceEvent;
