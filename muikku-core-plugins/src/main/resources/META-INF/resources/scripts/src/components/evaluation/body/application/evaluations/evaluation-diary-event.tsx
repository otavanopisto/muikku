import * as React from "react";
import * as moment from "moment";
import AnimateHeight from "react-animate-height";
import { WorkspaceJournalType } from "../../../../../reducers/workspaces/index";
/**
 * EvaluationEventContentCardProps
 */
interface EvaluationDiaryEventProps extends WorkspaceJournalType {}

/**
 * EvaluationEventContentCard
 */
const EvaluationDiaryEvent: React.FC<EvaluationDiaryEventProps> = ({
  title,
  content,
  created,
}) => {
  const [height, setHeight] = React.useState<0 | "auto">(0);

  /**
   * handleOpenContentClick
   */
  const handleOpenContentClick = () => {
    setHeight(height === 0 ? "auto" : 0);
  };

  const formatedDate = `${moment(created).format("l")} - ${moment(
    created
  ).format("LT")} `;

  return (
    <div className="journal-event-container">
      <div
        className="journal-entry-title-wrapper"
        onClick={handleOpenContentClick}
      >
        <div className="journal-entry-title">{title}</div>
        <div className="journal-entry-date">
          <span className="journal-entry-written-label">Kirjoitettu</span>
          <span className="journal-entry-written-data">{formatedDate}</span>
        </div>
      </div>
      <AnimateHeight duration={500} height={height}>
        <div className="journal-entry-content">
          <p>{content}</p>
        </div>
      </AnimateHeight>
    </div>
  );
};

export default EvaluationDiaryEvent;
