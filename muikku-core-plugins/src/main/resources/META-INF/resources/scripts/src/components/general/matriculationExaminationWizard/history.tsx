import moment from "moment";
import * as React from "react";
import Avatar from "~/components/general/avatar";
import { MatriculationExamChangeLogEntry } from "~/generated/client";
import "~/sass/elements/hops.scss";
import { useMatriculationContext } from "./context/matriculation-context";

/**
 * HopsHistoryProps
 */
interface HistoryProps {}

/**
 * HopsHistory
 * @param props props
 */
export const History: React.FC<HistoryProps> = (props) => {
  const { matriculation } = useMatriculationContext();
  const { examFormChangeLogs } = matriculation;

  if (!examFormChangeLogs || examFormChangeLogs.length === 0) {
    return <p>No history available for this examination at the moment.</p>;
  }

  return (
    <div className="hops-container__history">
      {examFormChangeLogs.map((logEntry, index) => (
        <HistoryEntryItem key={index} logEntry={logEntry} />
      ))}
    </div>
  );
};

/**
 * HopsHistoryEventProps
 */
interface HistoryEntryItemProps {
  logEntry: MatriculationExamChangeLogEntry;
}

/**
 * HopsHistoryEvent
 * @param props props
 */
export const HistoryEntryItem: React.FC<HistoryEntryItemProps> = (props) => {
  const { logEntry } = props;

  /**
   * Translation
   */
  const changeTypeString = () => {
    switch (logEntry.changeType) {
      case "ENROLLMENT_CREATED":
        return "Loi lomakkeen";

      case "ENROLLMENT_UPDATED": {
        if (logEntry.newState) {
          switch (logEntry.newState) {
            case "APPROVED":
              return "Päivitti ja hyväksyi lomakkeen";

            case "REJECTED":
              return "Päivitti ja hylkäsi lomakkeen";

            case "SUPPLEMENTATION_REQUEST":
              return "Päivitti ja pyytää täydennystä lomakkeeseen";

            case "CONFIRMED":
              return "Päivitti ja vahvisti lomakkeen tiedot";

            default:
              return `Päivitti lomaketta`;
          }
        }
        return "Päivitti lomaketta";
      }

      case "STATE_CHANGED": {
        if (logEntry.newState) {
          switch (logEntry.newState) {
            case "APPROVED":
              return "Hyväksyi lomakkeen";

            case "REJECTED":
              return "Peruutti ilmoittautumisen";

            case "SUPPLEMENTATION_REQUEST":
              return "Pyytää täydennystä lomakkeeseen";

            case "CONFIRMED":
              return "Vahvisti lomakkeen tiedot";

            default:
              return `Muutti lomakkeen tilaa`;
          }
        }

        return "Muutti lomakkeen tilan";
      }

      default:
        return "Unknown change";
    }
  };

  return (
    <>
      <div className="hops-container__history-event">
        <div className="hops-container__history-event-primary">
          <span className="hops-container__history-event-author">
            <Avatar
              id={logEntry.modifier.id}
              firstName={logEntry.modifier.firstName}
              hasImage={logEntry.modifier.hasImage}
              size="small"
            />
            <span className="hops-container__history-event-author-name">
              {`${logEntry.modifier.firstName} ${logEntry.modifier.lastName}`}
            </span>
          </span>
          <span className="hops-container__history-event-text">
            {changeTypeString()}
          </span>
          <span className="hops-container__history-event-date">
            {moment(logEntry.timestamp).format("l")}
          </span>
        </div>
      </div>
    </>
  );
};
