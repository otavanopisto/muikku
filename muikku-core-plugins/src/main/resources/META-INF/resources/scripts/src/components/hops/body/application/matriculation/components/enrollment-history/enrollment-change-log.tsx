import moment from "moment";
import * as React from "react";
import { useTranslation } from "react-i18next";
import Avatar from "~/components/general/avatar";
import { MatriculationExamChangeLogEntry } from "~/generated/client";
import "~/sass/elements/hops.scss";

/**
 * ChangeLogProps
 */
interface ChangeLogProps {
  entryLogs: MatriculationExamChangeLogEntry[];
}

/**
 * ChangeLog
 * @param props props
 */
export const ChangeLog: React.FC<ChangeLogProps> = (props) => {
  const { entryLogs } = props;

  const { t } = useTranslation(["hops_new", "common"]);

  if (!entryLogs || entryLogs.length === 0) {
    return (
      <p>{t("content.matriculationChangeLogEmpty", { ns: "hops_new" })}</p>
    );
  }

  return (
    <div className="hops-container__history">
      {entryLogs.map((logEntry, index) => (
        <ChangeLogItem key={index} logEntry={logEntry} />
      ))}
    </div>
  );
};

/**
 * ChangeLogItemProps
 */
interface ChangeLogItemProps {
  logEntry: MatriculationExamChangeLogEntry;
}

/**
 * ChangeLogItem
 * @param props props
 */
export const ChangeLogItem: React.FC<ChangeLogItemProps> = (props) => {
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

            case "SUPPLEMENTED":
              return "Päivitti ja täydensi lomaketta";

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

        {logEntry.message && (
          <div className="hops-container__history-event-secondary">
            <span>{logEntry.message}</span>
          </div>
        )}
      </div>
    </>
  );
};
