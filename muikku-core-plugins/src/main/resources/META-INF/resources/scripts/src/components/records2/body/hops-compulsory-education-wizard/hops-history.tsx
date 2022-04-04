import * as moment from "moment";
import * as React from "react";
import { HopsUpdate } from "~/@types/shared";
import Avatar from "~/components/general/avatar";
import { StatusType } from "~/reducers/base/status";
import { IconButton } from "~/components/general/button";
import "~/sass/elements/hops.scss";

/**
 * HopsHistoryProps
 */
interface HopsHistoryProps {
  hopsUpdates: HopsUpdate[];
  loggedUserId: number;
  loading: boolean;
  superVisorModifies: boolean;
  onHistoryEventClick: (eventId: number) => void;
  status: StatusType;
}

/**
 * HopsHistory
 * @param props props
 */
const HopsHistory: React.FC<HopsHistoryProps> = (props) => (
  <div className="hops-container__history">
    {props.hopsUpdates.map((item, i) => (
      <HopsHistoryEvent
        key={i}
        showEdit={
          props.superVisorModifies && item.modifierId === props.loggedUserId
        }
        hopsUpdate={item}
        onHistoryEventClick={props.onHistoryEventClick}
        status={props.status}
      />
    ))}
    {props.loading && (
      <div className="hops-container__history-event">
        <div className="loader-empty" />
      </div>
    )}
  </div>
);

export default HopsHistory;

/**
 * HopsHistoryEventProps
 */
interface HopsHistoryEventProps {
  hopsUpdate: HopsUpdate;
  showEdit: boolean;
  onHistoryEventClick: (eventId: number) => void;
  status: StatusType;
}

/**
 * HopsHistoryEvent
 * @param props props
 */
const HopsHistoryEvent: React.FC<HopsHistoryEventProps> = (props) => {
  const [showDescription, setShowDescription] = React.useState(false);

  /**
   * handleEditClick
   */
  const handleEditClick = () => {
    props.onHistoryEventClick(props.hopsUpdate.id);
  };

  const descrptionOpen = showDescription ? "auto" : 35;
  const animateHeightClass = showDescription
    ? "animate-height--open"
    : "animate-height";

  const viewingOwnHistorEvent =
    props.status.userId === props.hopsUpdate.modifierId;

  return (
    <>
      {viewingOwnHistorEvent ? (
        <div className="hops-container__history-event hops-container__history-event--created-by-me">
          <div className="hops-container__history-event-primary">
            <span className="hops-container__history-event-text">
              Muokkasit HOPS:sia
            </span>
            <span className="hops-container__history-event-date">
              {moment(props.hopsUpdate.date).format("l")}
            </span>
            {props.showEdit && (
              <span className="hops-container__history-event-action">
                <IconButton
                  buttonModifiers={["edit-hops-history-event-description"]}
                  icon="pencil"
                  onClick={handleEditClick}
                />
              </span>
            )}
          </div>

          {props.hopsUpdate.details && (
            <div className="hops-container__history-event-secondary">
              <span>{props.hopsUpdate.details}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="hops-container__history-event hops-container__history-event--created-by-other">
          <div className="hops-container__history-event-primary">
            <span className="hops-container__history-event-author">
              <Avatar
                id={props.hopsUpdate.modifierId}
                firstName={props.hopsUpdate.modifier}
                hasImage={props.hopsUpdate.modifierHasImage}
                size="small"
              />
              <span className="hops-container__history-event-author-name">
                {props.hopsUpdate.modifier}
              </span>
            </span>
            <span className="hops-container__history-event-text">
              muokkasi HOPS:sia
            </span>
            <span className="hops-container__history-event-date">
              {moment(props.hopsUpdate.date).format("l")}
            </span>
          </div>

          {props.hopsUpdate.details && (
            <div className="hops-container__history-event-secondary">
              <span>{props.hopsUpdate.details}</span>
            </div>
          )}
        </div>
      )}
    </>
  );
};
