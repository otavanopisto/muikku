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
  onHistoryEventClick: (eventId: number) => void;
}

/**
 * HopsHistory
 * @param props props
 */
const HopsHistory: React.FC<HopsHistoryProps> = (props) => (
  <div
    className="history-list"
    style={{
      padding: "10px",
      maxHeight: "400px",
      display: "flex",
      flexDirection: "column",
      overflow: "auto",
      maxWidth: "750px",
    }}
  >
    {props.hopsUpdates.map((item, i) => (
      <HopsHistoryEvent
        key={i}
        showEdit={item.modifierId === props.loggedUserId}
        hopsUpdate={item}
        onHistoryEventClick={props.onHistoryEventClick}
      />
    ))}
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
    <div
      className="history-event-item"
      style={{
        display: "flex",
        marginBottom: "10px",
        flexWrap: "wrap",
        borderBottom: "1px solid black",
        borderBottomStyle: "dashed",
        maxWidth: "750px",
      }}
    >
      <div
        className="history-event-item-row"
        style={{
          display: "flex",
          flexBasis: "100%",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <div
          className="history-event-item-user"
          style={{ display: "flex", alignItems: "center" }}
        >
          <Avatar
            id={props.hopsUpdate.modifierId}
            firstName={props.hopsUpdate.modifier}
            hasImage={props.hopsUpdate.modifierHasImage}
            size="large"
          />
          <div
            className="history-event-item-user-data"
            style={{ marginLeft: "5px" }}
          >
            <h4>{props.hopsUpdate.modifier}</h4>
            <div style={{ fontWeight: "lighter" }}>Titteli</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            className="history-event-item-date"
            style={{ fontWeight: "lighter" }}
          >
            Tapahtui {moment(props.hopsUpdate.date).format("l")}
          </div>
          {props.showEdit && (
            <div className="history-event-item-functions">
              <IconButton icon="pencil" onClick={handleEditClick} />
            </div>
          )}
        </div>
      </div>
      {props.hopsUpdate.details && (
        <div
          className="history-event-item-row"
          style={{
            display: "flex",
            flexBasis: "100%",
            justifyContent: "center",
            flexWrap: "wrap",
            position: "relative",
          }}
        >
          <AnimateHeight
            height={descrptionOpen}
            className={animateHeightClass}
            contentClassName="content-description"
          >
            {props.hopsUpdate.details}
          </AnimateHeight>
          <div
            style={{
              display: "flex",
              flexBasis: "100%",
              justifyContent: "center",
            }}
          >
            <Button onClick={() => setShowDescription(!showDescription)}>
              Lue lisää
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
