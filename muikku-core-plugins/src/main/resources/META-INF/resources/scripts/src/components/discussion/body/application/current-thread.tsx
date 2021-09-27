import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import { DiscussionType, DiscussionUserType, DiscussionThreadReplyType, DiscussionThreadReplyListType } from "~/reducers/discussion";
import { Dispatch, connect } from "react-redux";
import Pager from "~/components/general/pager";
import Link from "~/components/general/link";
import ReplyThread from '../../dialogs/reply-thread';
import ModifyThread from '../../dialogs/modify-thread';
import DeleteThreadComponent from '../../dialogs/delete-thread-component';
import ModifyThreadReply from '../../dialogs/modify-thread-reply';
import { getName } from "~/util/modifiers";
import { StatusType } from '~/reducers/base/status';
import { StateType } from '~/reducers';
import Avatar from '~/components/general/avatar';
import '~/sass/elements/rich-text.scss';
import '~/sass/elements/avatar.scss';
import '~/sass/elements/discussion.scss';
import { DiscussionCurrentThread, DiscussionCurrentThreadElement, DiscussionThreadHeader, DiscussionThreadBody, DiscussionThreadFooter } from "./threads/threads";

interface CurrentThreadProps {
  discussion: DiscussionType,
  i18n: i18nType,
  userId: number,
  permissions: any,
  status: StatusType
}

interface CurrentThreadState {
  hiddenParentsLists: number[]
}

class CurrentThread extends React.Component<CurrentThreadProps, CurrentThreadState> {

  constructor(props: CurrentThreadProps) {
    super(props);

    this.state = {
      hiddenParentsLists: []
    }
  }

  /**
   * getToPage
   * @param n
   */
  getToPage(n: number) {
    if (this.props.discussion.areaId === this.props.discussion.current.forumAreaId) {
      window.location.hash = this.props.discussion.current.forumAreaId + "/" + this.props.discussion.page +
        "/" + this.props.discussion.current.id + "/" + n;
    }
    window.location.hash = this.props.discussion.current.forumAreaId + "/1" +
      "/" + this.props.discussion.current.id + "/" + n;
  }

  /**
   * onHideShowSubReplies
   * @param parentId
   * Adds or removes parent elements from/to list depending wheter it is already in list.
   */
  onHideShowSubRepliesClick = (parentId: number) => (e: React.MouseEvent) => {

    if (this.state.hiddenParentsLists.includes(parentId)) {
      this.setState({
        hiddenParentsLists: this.state.hiddenParentsLists.filter(id => id !== parentId)
      })

    } else {
      const updatedList = [...this.state.hiddenParentsLists];

      updatedList.push(parentId);

      this.setState({
        hiddenParentsLists: updatedList
      })
    }
  }

  /**
   * render
   * @returns
   */
  render() {
    if (!this.props.discussion.current) {
      return null;
    }
    const areaPermissions = this.props.permissions.AREA_PERMISSIONS[this.props.discussion.current.forumAreaId] || {};
    const userCreator: DiscussionUserType = this.props.discussion.current.creator;
    const userCategory = this.props.discussion.current.creator.id > 10 ? this.props.discussion.current.creator.id % 10 + 1 : this.props.discussion.current.creator.id;
    let avatar;
    if (!userCreator) {
      //This is what it shows when the user is not ready
      avatar = <div className="avatar avatar--category-1"></div>;
    } else {
      //This is what it shows when the user is ready
      avatar = <Avatar key={userCreator.id} id={userCreator.id} firstName={userCreator.firstName} hasImage={userCreator.hasImage} userCategory={userCategory} avatarAriaLabel={this.props.i18n.text.get("plugin.wcag.userAvatar.label")} />
    }

    const student: boolean = this.props.status.isStudent === true;
    const threadOwner: boolean = this.props.userId === this.props.discussion.current.creator.id
    const canRemoveThread: boolean = (!student && threadOwner) || areaPermissions.removeThread || this.props.permissions.WORKSPACE_DELETE_FORUM_THREAD;
    let studentCanRemoveThread: boolean = threadOwner ? true : false;
    const canEditThread: boolean = threadOwner || areaPermissions.editMessages;
    const threadLocked: boolean = this.props.discussion.current.locked === true;
    const replies: DiscussionThreadReplyListType = this.props.discussion.currentReplies;

    // If the thread has someone elses messages, student can't remove the thread

    if (studentCanRemoveThread == true) {
      for (let i = 0; i < replies.length; i++) {
        if (this.props.userId !== replies[i].creator.id) {
          studentCanRemoveThread = false;
        }
      }
    }

    return <DiscussionCurrentThread sticky={this.props.discussion.current.sticky} locked={this.props.discussion.current.locked}
      title={<h2 className="application-list__title">{this.props.discussion.current.title}</h2>}>
      <DiscussionCurrentThreadElement isOpMessage avatar={<div className="avatar avatar--category-1">{avatar}</div>} hidden={false}>
        <DiscussionThreadHeader aside={<span>{this.props.i18n.time.format(this.props.discussion.current.created)}</span>}>
          <span className="application-list__item-header-main-content application-list__item-header-main-content--discussion-message-creator">{getName(userCreator, this.props.status.permissions.FORUM_SHOW_FULL_NAMES)}</span>
        </DiscussionThreadHeader>
        <DiscussionThreadBody>
          <div className="rich-text" dangerouslySetInnerHTML={{ __html: this.props.discussion.current.message }}></div>
          {this.props.discussion.current.created !== this.props.discussion.current.lastModified ? <span className="application-list__item-edited">
            {this.props.i18n.text.get("plugin.discussion.content.isEdited", this.props.i18n.time.format(this.props.discussion.current.lastModified))}
          </span> : null}
        </DiscussionThreadBody>
        <DiscussionThreadFooter hasActions>
          {!threadLocked || !student ?
            <ReplyThread>
              <Link className="link link--application-list-item-footer">{this.props.i18n.text.get("plugin.discussion.reply.message")}</Link>
            </ReplyThread> : null}
          {!threadLocked || !student ?
            <ReplyThread quote={this.props.discussion.current.message} quoteAuthor={getName(userCreator, this.props.status.permissions.FORUM_SHOW_FULL_NAMES)}>
              <Link className="link link--application-list-item-footer">{this.props.i18n.text.get("plugin.discussion.reply.quote")}</Link>
            </ReplyThread> : null}
          {canEditThread ? <ModifyThread thread={this.props.discussion.current}><Link className="link link--application-list-item-footer">{this.props.i18n.text.get("plugin.discussion.reply.edit")}</Link></ModifyThread> : null}
          {canRemoveThread || studentCanRemoveThread ?
            <DeleteThreadComponent>
              <Link className="link link--application-list-item-footer">{this.props.i18n.text.get("plugin.discussion.reply.delete")}</Link>
            </DeleteThreadComponent> : null}
        </DiscussionThreadFooter>
      </DiscussionCurrentThreadElement>

      {

        this.props.discussion.currentReplies.map((reply: DiscussionThreadReplyType) => {
          /**
           * user can be null in situtations where whole user is removed completely
           * from muikku. Then there is no reply.creator to use.
           */
          const user: DiscussionUserType = reply.creator;

          /**
           * By default setting remove message is false
           */
          let canRemoveMessage = false;

          /**
           * By default setting edit message is false
           */
          let canEditMessage = false;
          let avatar;

          if (!user) {
            /**
             * This is what it shows when the user is not ready
             * Also if reply creator is null aka deleted
             * These situtations don't allow changing user specific color, so
             * color is same for all of those cases
             */
            avatar = <div className="avatar avatar--category-1"></div>;
          } else {
            const userCategory = reply.creator.id > 10 ? reply.creator.id % 10 + 1 : reply.creator.id;
            canRemoveMessage = this.props.userId === reply.creator.id || areaPermissions.removeThread;
            canEditMessage = this.props.userId === reply.creator.id || areaPermissions.editMessages;
            avatar = <Avatar key={reply.id} id={user.id} firstName={user.firstName} hasImage={user.hasImage} userCategory={userCategory}/>
          }

          /**
           * Checks if element parent has hide its siblings
           */
          const isHiddenElement = this.state.hiddenParentsLists.includes(reply.parentReplyId);

          /**
           * Checks if element has siblings that are hidden
           */
          const parentHasHiddenSiblings = this.state.hiddenParentsLists.includes(reply.id);

          return (
            <DiscussionCurrentThreadElement key={reply.id} isReplyOfReply={!!reply.parentReplyId} avatar={avatar} hidden={isHiddenElement}>
              <DiscussionThreadHeader aside={<span>{this.props.i18n.time.format(reply.created)}</span>}>
                <span className="application-list__item-header-main-content application-list__item-header-main-content--discussion-message-creator">{getName(user, this.props.status.permissions.FORUM_SHOW_FULL_NAMES)}</span>
              </DiscussionThreadHeader>
              <DiscussionThreadBody>
                {reply.deleted ?
                  <div className="rich-text">[{this.props.i18n.text.get("plugin.discussion.infomessage.message.removed")}]</div> :
                  <div className="rich-text" dangerouslySetInnerHTML={{ __html: reply.message }}></div>}
                {reply.created !== reply.lastModified ? <span className="application-list__item-edited">
                  {this.props.i18n.text.get("plugin.discussion.content.isEdited", this.props.i18n.time.format(reply.lastModified))}
                </span> : null}
              </DiscussionThreadBody>
              {!reply.deleted ? <DiscussionThreadFooter>
                {!threadLocked || !student ?
                  <ReplyThread reply={reply}>
                    <Link tabIndex={0} as="span" className="link link--application-list-item-footer">{this.props.i18n.text.get("plugin.discussion.reply.message")}</Link>
                  </ReplyThread> : null}
                {!threadLocked || !student ?
                  <ReplyThread reply={reply}
                    quote={reply.message} quoteAuthor={getName(user, this.props.status.permissions.FORUM_SHOW_FULL_NAMES)}>
                    <Link tabIndex={0} as="span" className="link link--application-list-item-footer">{this.props.i18n.text.get("plugin.discussion.reply.quote")}</Link>
                  </ReplyThread> : null}
                {canEditMessage ? <ModifyThreadReply reply={reply}>
                  <Link tabIndex={0} as="span" className="link link--application-list-item-footer">{this.props.i18n.text.get("plugin.discussion.reply.edit")}</Link>
                </ModifyThreadReply> : null}
                {canRemoveMessage ? <DeleteThreadComponent reply={reply}>
                  <Link tabIndex={0} as="span" className="link link--application-list-item-footer">{this.props.i18n.text.get("plugin.discussion.reply.delete")}</Link>
                </DeleteThreadComponent> : null}
                {reply.childReplyCount > 0 ?
                  <Link tabIndex={0} as="span" onClick={this.onHideShowSubRepliesClick(reply.id)} className="link link--application-list-item-footer">
                    {parentHasHiddenSiblings ?
                      this.props.i18n.text.get("plugin.discussion.reply.showAllReplies")
                      :
                      this.props.i18n.text.get("plugin.discussion.reply.hideAllReplies")
                    }
                  </Link>
                  : null}
              </DiscussionThreadFooter> : null}
            </DiscussionCurrentThreadElement>
          )
        })
      }
      <Pager onClick={this.getToPage.bind(this)} current={this.props.discussion.currentPage} pages={this.props.discussion.currentTotalPages} />
    </DiscussionCurrentThread>
  }
}

/**
 * mapStateToProps
 * @param state
 * @returns
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    discussion: state.discussion,
    userId: state.status.userId,
    permissions: state.status.permissions,
    status: state.status
  }
};

/**
 * mapDispatchToProps
 * @param dispatch
 * @returns
 */
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CurrentThread);
