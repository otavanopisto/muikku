import * as React from "react";
import { connect, Dispatch } from "react-redux";
import Link from "~/components/general/link";
import "~/sass/elements/rich-text.scss";
import "~/sass/elements/application-list.scss";
import { StatusType } from "~/reducers/base/status";
import { StateType } from "~/reducers";
import {
  ApplicationListItem,
  ApplicationListItemHeader,
  ApplicationListItemBody,
  ApplicationListItemFooter,
} from "~/components/general/application-list";
import { WorkspaceDataType } from "~/reducers/workspaces";
import Avatar from "~/components/general/avatar";
import { getName } from "~/util/modifiers";
import DeleteJournal from "~/components/workspace/workspaceJournal/dialogs/delete-journal";
import CkeditorContentLoader from "../../../../base/ckeditor-loader/content";
import { bindActionCreators } from "redux";
import {
  SetCurrentJournalTriggerType,
  setCurrentJournal,
} from "~/actions/workspaces/journals";
import { AnyActionType } from "~/actions";
import WorkspaceJournalCommentList from "./workspace-journal-comment-list";
import WorkspaceJournalEditor from "./editors/workspace-journal-editor";
import { WorkspaceJournalWithComments } from "~/reducers/workspaces/journals";
import { withTranslation, WithTranslation } from "react-i18next";
import { localize } from "~/locales/i18n";

/**
 * JournalProps
 */
interface WorkspaceJournalsListItemProps extends WithTranslation {
  status: StatusType;
  journal: WorkspaceJournalWithComments;
  workspace: WorkspaceDataType;
  asCurrent: boolean;
  showCommentList: boolean;
  setCurrentJournal: SetCurrentJournalTriggerType;
}

/**
 * JournalState
 */
interface WorkspaceJournalsListItemState {
  editing: boolean;
}

/**
 * Journal
 */
class WorkspaceJournalsListItem extends React.Component<
  WorkspaceJournalsListItemProps,
  WorkspaceJournalsListItemState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: WorkspaceJournalsListItemProps) {
    super(props);

    this.state = {
      editing: false,
    };
  }

  /**
   * handleJournalItemClick
   */
  handleSetJournalItemClick = () => {
    !this.props.asCurrent &&
      this.props.setCurrentJournal({ currentJournal: this.props.journal });
  };

  /**
   * handleJournalEditClick
   */
  handleJournalEditClick = () => {
    this.setState({
      editing: true,
    });
  };

  /**
   * handleJournalCancelEditClick
   */
  handleJournalCancelEditClick = () => {
    this.setState({
      editing: false,
    });
  };

  /**
   * render
   */
  render() {
    const { t } = this.props;

    const student =
      this.props.workspace.students &&
      this.props.workspace.students.results.find(
        (s) => s.userEntityId === this.props.journal.userEntityId
      );

    const isMandatory = this.props.journal.isMaterialField;
    const isDraft =
      this.props.journal.workspaceMaterialReplyState &&
      this.props.journal.workspaceMaterialReplyState === "ANSWERED";

    if (this.state.editing) {
      return (
        <ApplicationListItem className={"journal"}>
          <WorkspaceJournalEditor
            type="edit"
            journal={this.props.journal}
            onClose={this.handleJournalCancelEditClick}
          />
        </ApplicationListItem>
      );
    }

    return (
      <>
        <ApplicationListItem className="journal">
          <ApplicationListItemHeader
            onClick={this.handleSetJournalItemClick}
            className="application-list__item-header--journal-entry"
            modifiers={
              this.props.asCurrent &&
              "application-list__item-header--journal-entry-current"
            }
            tabIndex={0}
          >
            {!this.props.status.isStudent ? (
              student ? (
                <Avatar
                  id={student.userEntityId}
                  firstName={student.firstName}
                  hasImage={student.hasImage}
                />
              ) : null
            ) : null}
            <div className="application-list__item-header-main application-list__item-header-main--journal-entry">
              {!this.props.status.isStudent ? (
                <span className="application-list__item-header-main-content application-list__item-header-main-content--journal-entry-creator">
                  {student ? getName(student, true) : this.props.journal.title}
                </span>
              ) : (
                <span className="application-list__item-header-main-content application-list__item-header-main-content--journal-entry-title">
                  {this.props.journal.title}
                </span>
              )}
              {isDraft && (
                <span className="label label--draft">
                  <span className="label__text">{t("actions.draft")}</span>
                </span>
              )}

              {isMandatory && (
                <span className="label label--mandatory">
                  <span className="label__text">
                    {t("labels.mandatory", { ns: "workspace" })}
                  </span>
                </span>
              )}
            </div>

            <div className="application-list__item-header-aside">
              <span>
                {localize.date(this.props.journal.created)} -{" "}
                {localize.date(this.props.journal.created, "LT")}
              </span>
            </div>
          </ApplicationListItemHeader>
          <ApplicationListItemBody className="application-list__item-body">
            {!this.props.status.isStudent ? (
              student ? (
                <header className="application-list__item-content-header application-list__item-content-header--journal-entry">
                  {this.props.journal.title}
                </header>
              ) : null
            ) : null}
            <article className="application-list__item-content-body application-list__item-content-body--journal-entry rich-text">
              <CkeditorContentLoader html={this.props.journal.content} />
            </article>
          </ApplicationListItemBody>

          <ApplicationListItemFooter className="application-list__item-footer--journal-entry">
            {(this.props.journal.userEntityId === this.props.status.userId ||
              this.props.showCommentList) && (
              <>
                {this.props.journal.userEntityId ===
                  this.props.status.userId && (
                  <>
                    <div className="application-list__item-footer-content-main">
                      <Link
                        as="span"
                        className="link link--application-list"
                        onClick={this.handleJournalEditClick}
                      >
                        {t("actions.edit")}
                      </Link>

                      <DeleteJournal journal={this.props.journal}>
                        <Link as="span" className="link link--application-list">
                          {t("actions.remove")}
                        </Link>
                      </DeleteJournal>
                    </div>
                  </>
                )}
              </>
            )}
            {!this.props.asCurrent && (
              <div className="application-list__item-footer-content-aside">
                <Link
                  as="span"
                  className="link link--application-list"
                  onClick={this.handleSetJournalItemClick}
                >
                  {t("labels.comments")} ({this.props.journal.commentCount})
                </Link>
              </div>
            )}
          </ApplicationListItemFooter>
        </ApplicationListItem>

        {this.props.showCommentList && <WorkspaceJournalCommentList />}
      </>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    workspace: state.workspaces.currentWorkspace,
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ setCurrentJournal }, dispatch);
}

export default withTranslation(["journal", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(WorkspaceJournalsListItem)
);
