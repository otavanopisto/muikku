import * as moment from "moment";
import * as React from "react";
import AnimateHeight from "react-animate-height";
import { HopsUpdate } from "~/@types/shared";
import Avatar from "~/components/general/avatar";
import Button, { IconButton } from "~/components/general/button";
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
}

/**
 * HopsHistory
 * @param props props
 */
const HopsHistory: React.FC<HopsHistoryProps> = (props) => (
  <div className="hops__history-container">
    {props.hopsUpdates.map((item, i) => (
      <HopsHistoryEvent
        key={i}
        showEdit={
          props.superVisorModifies && item.modifierId === props.loggedUserId
        }
        hopsUpdate={item}
        onHistoryEventClick={props.onHistoryEventClick}
      />
    ))}
    {props.loading && (
      <div className="hops__history-event">
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

  return (
    <div className="hops__history-event">
      <>
        <div
          className="hops__history-event-author"
          style={{ display: "flex", alignItems: "center" }}
        >
          <Avatar
            id={props.hopsUpdate.modifierId}
            firstName={props.hopsUpdate.modifier}
            hasImage={props.hopsUpdate.modifierHasImage}
            size="large"
          />
          <div className="hops__history-event-author-name">
            {props.hopsUpdate.modifier}
          </div>
        </div>

        <div className="hops__history-event-meta">
          <div className="hops__history-event-date">
            {moment(props.hopsUpdate.date).format("l")}
          </div>
          {props.showEdit && (
            <div className="hops__history-event-action">
              <IconButton icon="pencil" onClick={handleEditClick} />
            </div>
          )}
        </div>
      </>
      {props.hopsUpdate.details && (
        <>
          <AnimateHeight
            height={descrptionOpen}
            className={animateHeightClass}
            contentClassName="content-description"
          >
            {props.hopsUpdate.details}
          </AnimateHeight>
          <div>
            <Button onClick={() => setShowDescription(!showDescription)}>
              Lue lisää
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
