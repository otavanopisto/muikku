import * as React from "react";
import { useTranslation } from "react-i18next";
import { connect, Dispatch } from "react-redux";
import { AnyActionType } from "~/actions";
import {
  ApplicationListItem,
  ApplicationListItemBody,
} from "~/components/general/application-list";
import { WorkspaceJournalComment } from "~/generated/client";
import { StateType } from "~/reducers";
import { localize } from "~/locales/i18n";
import { StatusType } from "~/reducers/base/status";
import CkeditorContentLoader from "../../../../base/ckeditor-loader/content";

/**
 * JournalCommentProps
 */
interface JournalCommentProps extends WorkspaceJournalComment {
  status: StatusType;
}

/**
 * Creates journal comment component
 * @param props props
 * @returns JSX.Element
 */
const WorkspaceJournalComment: React.FC<JournalCommentProps> = (props) => {
  const { comment, status, created, id, firstName, lastName, authorId } = props;
  const creatorIsMe = status.userId === authorId;
  const { t } = useTranslation();
  const creatorName = creatorIsMe
    ? t("labels.self")
    : `${firstName} ${lastName}`;

  const formatedDate = `${localize.date(created)} - ${localize.date(
    created,
    "LT"
  )}`;

  return (
    <ApplicationListItem key={id}>
      <ApplicationListItemBody>
        <article className="application-list__item-content-body application-list__item-content-body--journal-entry rich-text">
          <CkeditorContentLoader html={comment} />
        </article>
        <div className="journal__meta">
          <div className="journal__meta-item">
            <div className="journal__meta-item-label">{creatorName}</div>
            <div className="journal__meta-item-data">{formatedDate}</div>
          </div>
        </div>
      </ApplicationListItemBody>
    </ApplicationListItem>
  );
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkspaceJournalComment);
