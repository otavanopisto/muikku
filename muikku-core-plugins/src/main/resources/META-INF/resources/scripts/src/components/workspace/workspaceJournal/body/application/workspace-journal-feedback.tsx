import * as React from "react";
import { WorkspaceJournalFeedback } from "~/reducers/workspaces/journals";
import CkeditorContentLoader from "../../../../base/ckeditor-loader/content";
import * as moment from "moment";

/**
 * WorkspaceJournalFeedback
 */
interface WorkspaceJournalFeedbackProps {
  journalFeedback: WorkspaceJournalFeedback;
}

/**
 * WorkspaceJournalFeedback
 * @param props props
 * @returns JSX.Element
 */
const WorkspaceJournalFeedback: React.FC<WorkspaceJournalFeedbackProps> = (
  props
) => {
  const { journalFeedback } = props;

  return (
    <div>
      <h2>TODO: Kokonaispalaute</h2>
      <article className="application-list__item-content-body application-list__item-content-body--journal-comment rich-text">
        <CkeditorContentLoader html={journalFeedback.feedback} />
      </article>
      <div>
        <div>TODO: Arvioitu: {moment(journalFeedback.created).format("l")}</div>
        <div>TODO: Arvioija: {journalFeedback.creatorName}</div>
      </div>
    </div>
  );
};

export default WorkspaceJournalFeedback;
