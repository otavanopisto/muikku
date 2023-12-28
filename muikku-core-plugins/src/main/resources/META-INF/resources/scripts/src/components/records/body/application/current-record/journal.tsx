import * as React from "react";
import AnimateHeight from "react-animate-height";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { AnyActionType } from "~/actions";
import ApplicationList, {
  ApplicationListItem,
  ApplicationListItemBody,
  ApplicationListItemHeader,
} from "~/components/general/application-list";
import CkeditorContentLoader from "../../../../base/ckeditor-loader/content";
import { useJournalComments } from "../assignments-and-diaries/hooks/useJournalComments";
import { useTranslation } from "react-i18next";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import JournalComment from "./journalComment";
import { WorkspaceJournal } from "~/generated/client";
import { localize } from "~/locales/i18n";

/**
 * JournalProps
 */
interface JournalProps {
  displayNotification: DisplayNotificationTriggerType;
  journal: WorkspaceJournal;
  open: boolean;
  onJournalClick: (
    id: number
  ) => (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

/**
 * Journal Component
 * @param props props
 * @returns JSX.Element
 */
const Journal: React.FC<JournalProps> = (props) => {
  const { displayNotification, journal, onJournalClick, open } = props;
  const [showComments, setShowComments] = React.useState<boolean>(false);
  const { t } = useTranslation("journal");
  const { journalComments, loadJournalComments } = useJournalComments(
    journal.workspaceEntityId,
    journal.id,
    displayNotification
  );

  /**
   * handleShowCommentsClick
   * @param e event
   */
  const handleShowCommentsClick = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();
    await loadJournalComments();
    setShowComments(!showComments);
  };

  const arrowClass = showComments ? "open" : "closed";

  return (
    <ApplicationListItem className="journal journal--studies" key={journal.id}>
      <ApplicationListItemHeader
        className="application-list__item-header--journal-entry"
        onClick={onJournalClick(journal.id)}
      >
        <div
          className={`application-list__item-header-main application-list__item-header-main--journal-entry ${
            journal.isMaterialField
              ? "application-list__item-header-main--journal-entry-mandatory"
              : ""
          }`}
        >
          <span className="application-list__item-header-main-content application-list__item-header-main-content--journal-entry-title-in-studies">
            {journal.title}
          </span>
        </div>
        <div className="application-list__item-header-aside">
          <span>
            {localize.date(journal.created)} -{" "}
            {localize.date(journal.created, "LT")}
          </span>
        </div>
      </ApplicationListItemHeader>
      <ApplicationListItemBody className="application-list__item-body">
        <AnimateHeight height={open ? "auto" : 0}>
          <article className="application-list__item-content-body application-list__item-content-body--journal-entry rich-text">
            <CkeditorContentLoader html={journal.content} />
          </article>

          <div
            onClick={handleShowCommentsClick}
            style={{ display: "flex", alignItems: "center" }}
          >
            <div className={`icon-arrow-right ${arrowClass}`} />
            <div className="evaluation-modal__item-subheader-title evaluation-modal__item-subheader-title--journal-comment">
              {t("labels.comments", { ns: "common" })} ({journal.commentCount})
            </div>
          </div>

          <AnimateHeight height={showComments ? "auto" : 0}>
            {journalComments.isLoading ? (
              <div className="loader-empty" />
            ) : journalComments.journalComments.length === 0 ? (
              <div className="empty">
                <span>{t("content.empty", { context: "comments" })}</span>
              </div>
            ) : (
              <ApplicationList>
                {journalComments.journalComments.map((c) => (
                  <JournalComment key={c.id} {...c} />
                ))}
              </ApplicationList>
            )}
          </AnimateHeight>
        </AnimateHeight>
      </ApplicationListItemBody>
    </ApplicationListItem>
  );
};

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ displayNotification }, dispatch);
}

export default connect(null, mapDispatchToProps)(Journal);
