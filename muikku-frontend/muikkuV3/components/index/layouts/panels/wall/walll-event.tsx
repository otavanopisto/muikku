import * as React from "react";
import { useTranslation } from "react-i18next";
import "~/sass/elements/note.scss";
import WallItem from "./components/wall-item";
import { MuikkuEvent } from "~/mock/absence";
import moment from "moment";
import "~/sass/elements/wall-event.scss";

/**
 * WallEventsProps
 */
interface WallEventsProps {
  modifier?: string;
  event: MuikkuEvent;
  actions?: React.ReactElement;
  //  onStatusUpdate: (id: number, status: NoteStatusType) => void;
  //  onUpdate: (id: number, update: UpdateNoteRequest) => void;
}

/**
 * A simple note componet for panel use
 * @param props NoteProps
 * @returns JSX.Element
 */
const WallEvent: React.FC<WallEventsProps> = (props) => {
  const { modifier, event, actions } = props;
  const { t } = useTranslation("tasks");
  const absenceEventProperty = event.properties.find(
    (prop) => prop.name === "ABSENCE_REASON"
  );
  const absenceState =
    absenceEventProperty && absenceEventProperty.value !== ""
      ? "REVIEWED"
      : "REVIEW_PENDING";

  return (
    <WallItem modifier={modifier} state={absenceState} title={event.title}>
      <div className="wall-event">
        <div className="wall-event__header">
          <div className="wall-event__description">{event.description}</div>
          <div className="wall-event__date">
            {moment(event.start).format("D.M.YYYY")} -
            {moment(event.end).format("D.M.YYYY")}
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

export default WallEvent;
