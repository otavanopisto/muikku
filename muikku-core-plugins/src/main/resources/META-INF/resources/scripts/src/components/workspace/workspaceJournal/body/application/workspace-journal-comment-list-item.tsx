import * as moment from "moment";
import * as React from "react";
import { StateType } from "~/reducers";
import { StatusType } from "~/reducers/base/status";
import CkeditorContentLoader from "../../../../base/ckeditor-loader/content";
import { connect, Dispatch } from "react-redux";
import { AnyActionType } from "~/actions";
import WorkspaceJournalCommentEditor from "./editors/workspace-journal-comment-editor";
// eslint-disable-next-line camelcase
import Avatar from "~/components/general/avatar";
import Link from "~/components/general/link";
import DeleteJournalComment from "../../dialogs/delete-journal-comment";
import {
  ApplicationListItem,
  ApplicationListItemHeader,
  ApplicationListItemBody,
  ApplicationListItemFooter,
} from "~/components/general/application-list";
import { bindActionCreators } from "redux";
import { JournalComment } from "~/@types/journal";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import {
  UpdateWorkspaceJournalCommentTriggerType,
  updatedWorkspaceJournalComment,
} from "../../../../../actions/workspaces/journals";
import { useTranslation } from "react-i18next";

/**
 * WorkspaceJournalCommentListProps
 */
interface WorkspaceJournalCommentListItemProps {
  journalComment: JournalComment;
  workspaceEntityId: number;
  status: StatusType;
  updatedWorkspaceJournalComment: UpdateWorkspaceJournalCommentTriggerType;
}

/**
 * WorkspaceJournalCommentList
 * @param props props
 */
export const WorkspaceJournalCommentListItem: React.FC<
  WorkspaceJournalCommentListItemProps
> = (props): JSX.Element => {
  const { t } = useTranslation(["journal", "common"]);
  const { journalComment, status } = props;

  const { authorId, comment, firstName, lastName, created } = journalComment;

  const [editing, setEditing] = React.useState(false);
  const [editorLocked, setEditorLocked] = React.useState(false);

  /**
   * handleStartEditClick
   */
  const handleEditCommentClick = () => {
    setEditing(true);
  };

  /**
   * handleCancelNewComment
   */
  const handleCancelEditingCommentClick = () => {
    setEditing(false);
  };

  /**
   * handleSaveNewCommentClick
   * @param editedComment editedComment
   * @param callback callback
   */
  const handleSaveEditedCommentClick = (
    editedComment: string,
    callback?: () => void
  ) => {
    setEditorLocked(true);

    props.updatedWorkspaceJournalComment({
      updatedCommentPayload: {
        comment: editedComment,
        id: props.journalComment.id,
        journalEntryId: props.journalComment.journalEntryId,
      },
      journalEntryId: props.journalComment.journalEntryId,
      workspaceEntityId: props.workspaceEntityId,
      // eslint-disable-next-line jsdoc/require-jsdoc
      success: () => {
        callback();

        unstable_batchedUpdates(() => {
          setEditing(false);
          setEditorLocked(false);
        });
      },
    });
  };

  const creatorIsMe = status.userId === authorId;
  const creatorName = creatorIsMe ? `Minä` : `${firstName} ${lastName}`;
  const formatedDate = `${moment(created).format("l")} - ${moment(
    created
  ).format("h:mm")}`;

  return (
    <ApplicationListItem className="journal journal--comment">
      <ApplicationListItemHeader
        className="application-list__item-header--journal-comment"
        tabIndex={0}
      >
        <Avatar
          id={authorId}
          firstName={firstName}
          hasImage={status.hasImage}
        />
        <div className="application-list__item-header-main application-list__item-header-main--journal-comment">
          <span className="application-list__item-header-main-content application-list__item-header-main-content--journal-comment-creator">
            {creatorName}
          </span>
        </div>
        <div className="application-list__item-header-aside application-list__item-header-aside--journal-comment">
          {formatedDate}
        </div>
      </ApplicationListItemHeader>

      {editing ? (
        <WorkspaceJournalCommentEditor
          type="edit"
          journalComment={journalComment}
          diaryEventId={journalComment.journalEntryId}
          userEntityId={journalComment.journalEntryId}
          workspaceEntityId={props.workspaceEntityId}
          locked={editorLocked}
          onSave={handleSaveEditedCommentClick}
          onClose={handleCancelEditingCommentClick}
        />
      ) : (
        <ApplicationListItemBody modifiers={["journal-comment"]}>
          <article className="application-list__item-content-body application-list__item-content-body--journal-comment rich-text">
            <CkeditorContentLoader html={comment} />
          </article>

          {creatorIsMe && !editing && (
            <ApplicationListItemFooter className="application-list__item-footer--journal-comment">
              <Link
                as="span"
                className="link link--application-list"
                onClick={handleEditCommentClick}
              >
                {t("actions.edit")}
              </Link>

              <DeleteJournalComment
                journalComment={journalComment}
                workspaceEntityId={props.workspaceEntityId}
              >
                <Link as="span" className="link link--application-list">
                  {t("actions.remove")}
                </Link>
              </DeleteJournalComment>
            </ApplicationListItemFooter>
          )}
        </ApplicationListItemBody>
      )}
    </ApplicationListItem>
  );
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {};
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    {
      updatedWorkspaceJournalComment,
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkspaceJournalCommentListItem);
