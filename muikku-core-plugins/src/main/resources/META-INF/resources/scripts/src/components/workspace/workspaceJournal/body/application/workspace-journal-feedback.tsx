import * as React from "react";
import { WorkspaceJournalFeedback } from "~/reducers/workspaces/journals";
import CkeditorContentLoader from "../../../../base/ckeditor-loader/content";
import { localize } from "~/locales/i18n";
import { useTranslation } from "react-i18next";

/**
 * WorkspaceJournalFeedback
 */
interface WorkspaceJournalFeedbackProps {
  journalFeedback: WorkspaceJournalFeedback;
}

/**
 * WorkspaceJournalFeedback
 * @param props props
 * @returns React.JSX.Element
 */
const WorkspaceJournalFeedback: React.FC<WorkspaceJournalFeedbackProps> = (
  props
) => {
  const { journalFeedback } = props;
  const { t } = useTranslation("journal");
  return (
    <div className="journal journal--feedback">
      <div className="journal__header">{t("labels.feedback")}</div>
      <article className="journal__body rich-text">
        <CkeditorContentLoader html={journalFeedback.feedback} />
      </article>
      <div className="journal__meta">
        <div className="journal__meta-item">
          <div className="journal__meta-item-label">
            {t("labels.feedbackDate")}:
          </div>
          <div className="journal__meta-item-data">
            {localize.date(journalFeedback.created)}
          </div>
        </div>
        <div className="journal__meta-item">
          <div className="journal__meta-item-label">
            {t("labels.feedbackAuthor")}:
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
