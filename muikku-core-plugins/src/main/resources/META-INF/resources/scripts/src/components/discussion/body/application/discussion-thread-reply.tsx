import * as React from "react";
import { connect } from "react-redux";
import Link from "~/components/general/link";
import DeleteThreadComponent from "../../dialogs/delete-thread-component";
import { getName } from "~/util/modifiers";
import { StatusType } from "~/reducers/base/status";
import { StateType } from "~/reducers";
import "~/sass/elements/rich-text.scss";
import "~/sass/elements/avatar.scss";
import "~/sass/elements/discussion.scss";
import {
  DiscussionCurrentThreadElement,
  DiscussionThreadHeader,
  DiscussionThreadBody,
  DiscussionThreadFooter,
} from "./threads/threads";
import ReplyThreadDrawer from "./reply-thread-drawer";
import ModifyThreadReplyDrawer from "./modify-reply-thread-drawer";
import { AnyActionType } from "~/actions";
import { DiscussionThreadReply, DiscussionUser } from "~/generated/client";
import moment from "moment";
import { localize } from "~/locales/i18n";
import { withTranslation, WithTranslation } from "react-i18next";
import { Action, Dispatch } from "redux";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * DiscussionThreadReplyProps
 */
interface DiscussionThreadReplyProps extends WithTranslation {
  discussionItem: DiscussionThreadReply;
  status: StatusType;
  user: DiscussionUser;
  avatar?: JSX.Element;
  isStudent: boolean;
  isHidden: boolean;
  canRemoveMessage: boolean;
  canEditMessage: boolean;
  parentHasHiddenSiblings: boolean;
  threadLocked: boolean;
  onHideShowSubRepliesClick?: (
    parentId: number
  ) => (e: React.MouseEvent) => void;
}

/**
 * DiscussionThreadReplyState
 */
interface DiscussionThreadReplyState {
  openReplyType?: "answer" | "modify" | "quote";
  openedReplyEditor?: number;
}

/**
 * DiscussionThreadReply
 */
class DiscussionThreadReplyComponent extends React.Component<
  DiscussionThreadReplyProps,
  DiscussionThreadReplyState
> {
  /**
   * DiscussionThreadReplyProps
   * @param props props
   */
  constructor(props: DiscussionThreadReplyProps) {
    super(props);

    this.state = {};
  }

  /**
   * handleOnReplyClick
   * @param type type
   */
  handleOnReplyClick =
    (type: "answer" | "modify" | "quote") =>
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      this.setState({
        openReplyType: type !== this.state.openReplyType ? type : undefined,
      });
    };

  /**
   * handleOnCancelClick
   */
  handleOnCancelClick = () => {
    this.setState({
      openReplyType: undefined,
    });
  };

  /**
   * render
   * @returns JSX.Element
   */
  render() {
    const {
      discussionItem,
      user,
      avatar,
      isStudent,
      isHidden,
      canRemoveMessage,
      canEditMessage,
      parentHasHiddenSiblings,
      threadLocked,
      onHideShowSubRepliesClick,
    } = this.props;

    return (
      <DiscussionCurrentThreadElement
        key={discussionItem.id}
        isReplyOfReply={!!discussionItem.parentReplyId}
        avatar={avatar}
        hidden={isHidden}
      >
        <DiscussionThreadHeader
          aside={<span>{localize.date(discussionItem.created)}</span>}
        >
          <span className="application-list__item-header-main-content application-list__item-header-main-content--discussion-message-creator">
            {getName(user, this.props.status.permissions.FORUM_SHOW_FULL_NAMES)}
          </span>
        </DiscussionThreadHeader>

        {this.state.openReplyType && this.state.openReplyType === "modify" ? (
          <ModifyThreadReplyDrawer
            reply={discussionItem}
            onClickCancel={this.handleOnCancelClick}
          />
        ) : (
          <>
            {discussionItem.deleted ? (
              <DiscussionThreadBody
                html={`<p><i> ${this.props.i18n.t("content.removed", {
                  ns: "messaging",
                })} </i></p>`}
              >
                {!moment(discussionItem.created).isSame(
                  discussionItem.lastModified
                ) ? (
                  <div className="application-list__item-edited">
                    {this.props.i18n.t("labels.edited", {
                      context: "in",
                      time: localize.date(discussionItem.lastModified),
                    })}
                  </div>
                ) : null}
              </DiscussionThreadBody>
            ) : (
              <DiscussionThreadBody html={discussionItem.message}>
                {!moment(discussionItem.created).isSame(
                  discussionItem.lastModified
                ) ? (
                  <div className="application-list__item-edited">
                    {this.props.i18n.t("labels.edited", {
                      context: "in",
                      time: localize.date(discussionItem.lastModified),
                    })}
                  </div>
                ) : null}
              </DiscussionThreadBody>
            )}

            {!discussionItem.deleted && user !== null ? (
              <DiscussionThreadFooter>
                {!threadLocked || !isStudent ? (
                  <Link
                    tabIndex={0}
                    as="span"
                    className="link link--application-list"
                    onClick={this.handleOnReplyClick("answer")}
                  >
                    {this.props.i18n.t("actions.reply", { ns: "messaging" })}
                  </Link>
                ) : null}
                {!threadLocked || !isStudent ? (
                  <Link
                    tabIndex={0}
                    as="span"
                    className="link link--application-list"
                    onClick={this.handleOnReplyClick("quote")}
                  >
                    {this.props.i18n.t("actions.quote")}
                  </Link>
                ) : null}
                {canEditMessage ? (
                  <Link
                    tabIndex={0}
                    as="span"
                    className="link link--application-list"
                    onClick={this.handleOnReplyClick("modify")}
                  >
                    {this.props.i18n.t("actions.edit")}
                  </Link>
                ) : null}
                {canRemoveMessage ? (
                  <DeleteThreadComponent reply={discussionItem}>
                    <Link
                      tabIndex={0}
                      as="span"
                      className="link link--application-list"
                    >
                      {this.props.i18n.t("actions.remove")}
                    </Link>
                  </DeleteThreadComponent>
                ) : null}
                {discussionItem.childReplyCount > 0 ? (
                  <Link
                    tabIndex={0}
                    as="span"
                    onClick={onHideShowSubRepliesClick(discussionItem.id)}
                    className="link link--application-list"
                  >
                    {parentHasHiddenSiblings
                      ? this.props.i18n.t("actions.show", {
                          ns: "messaging",
                          context: "comments",
                        })
                      : this.props.i18n.t("actions.hide", {
                          ns: "messaging",
                          context: "comments",
                        })}
                  </Link>
                ) : null}
              </DiscussionThreadFooter>
            ) : null}
          </>
        )}

        {this.state.openReplyType && this.state.openReplyType === "answer" ? (
          <ReplyThreadDrawer
            reply={discussionItem}
            onClickCancel={this.handleOnCancelClick}
          />
        ) : null}

        {this.state.openReplyType && this.state.openReplyType === "quote" ? (
          <ReplyThreadDrawer
            reply={discussionItem}
            quote={discussionItem.message}
            quoteAuthor={getName(
              user,
              this.props.status.permissions.FORUM_SHOW_FULL_NAMES
            )}
            onClickCancel={this.handleOnCancelClick}
          />
        ) : null}
      </DiscussionCurrentThreadElement>
    );
  }
}

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
function mapDispatchToProps(dispatch: AppDispatch) {
  return {};
}

export default withTranslation(["common"])(
  connect(mapStateToProps, mapDispatchToProps)(DiscussionThreadReplyComponent)
);
