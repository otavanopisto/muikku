import * as React from "react";
import { WorkspaceJournalFeedback } from "~/reducers/workspaces/journals";
import CkeditorContentLoader from "../../../../base/ckeditor-loader/content";
import { i18nType } from "~/reducers/base/i18n";
import * as moment from "moment";

/**
 * WorkspaceJournalFeedback
 */
interface WorkspaceJournalFeedbackProps {
  journalFeedback: WorkspaceJournalFeedback;
  i18n: i18nType;
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
    <div className="journal journal--feedback">
      <div className="journal__header">
        {props.i18n.text.get("plugin.workspace.journal.journalFeedBackTitle")}
      </div>
      <article className="journal__body rich-text">
        <CkeditorContentLoader html={journalFeedback.feedback} />
      </article>
      <div className="journal__meta">
        <div className="journal__meta-item">
          <div className="journal__meta-item-label">
            {props.i18n.text.get(
              "plugin.workspace.journal.journalFeedBackDate"
            )}
            :
          </div>
          <div className="journal__meta-item-data"></div>{" "}
          {moment(journalFeedback.created).format("l")}
        </div>
        <div className="journal__meta-item">
          <div className="journal__meta-item-label">
            {props.i18n.text.get(
              "plugin.workspace.journal.journalFeedBackAuthor"
            )}
            :
          </div>
          <div className="journal__meta-item-data">
            {journalFeedback.creatorName}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceJournalFeedback;
