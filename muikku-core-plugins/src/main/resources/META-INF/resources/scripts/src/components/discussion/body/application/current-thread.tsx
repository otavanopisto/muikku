import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import { DiscussionType, DiscussionUserType, DiscussionThreadReplyType } from "~/reducers/discussion";
import { Dispatch, connect } from "react-redux";
import Pager from "~/components/general/pager";
import Link from "~/components/general/link";
import ReplyThread from '../../dialogs/reply-thread';
import ModifyThread from '../../dialogs/modify-thread';
import DeleteThreadComponent from '../../dialogs/delete-thread-component';
import ModifyThreadReply from '../../dialogs/modify-thread-reply';
import { getName, getUserImageUrl } from "~/util/modifiers";
import {StatusType} from '~/reducers/base/status';
import {StateType} from '~/reducers';

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

}

class CurrentThread extends React.Component<CurrentThreadProps, CurrentThreadState> {
  getToPage(n: number){
    if (this.props.discussion.areaId === this.props.discussion.current.forumAreaId){
      window.location.hash = this.props.discussion.current.forumAreaId + "/" + this.props.discussion.page +
      "/" + this.props.discussion.current.id + "/" + n;
    }
    window.location.hash = this.props.discussion.current.forumAreaId + "/1" +
      "/" + this.props.discussion.current.id + "/" + n;
  }

  render(){
    if (!this.props.discussion.current){
      return null;
    }
    let areaPermissions = this.props.permissions.AREA_PERMISSIONS[this.props.discussion.current.forumAreaId] || {};
    
    let userCreator:DiscussionUserType = this.props.discussion.current.creator;
    let userCategory = this.props.discussion.current.creator.id > 10 ? this.props.discussion.current.creator.id % 10 + 1 : this.props.discussion.current.creator.id;
    let avatar;
    if (!userCreator){
      //This is what it shows when the user is not ready
      avatar = <div className="avatar avatar--category-1"></div>;
    } else {
      //This is what it shows when the user is ready
      avatar = <object className="avatar-container"
        data={getUserImageUrl(userCreator)}
        type="image/jpeg">
          <div className={`avatar avatar--category-${userCategory}`}>{userCreator.firstName[0]}</div>
       </object>;
    }

    let canRemoveThread = this.props.userId === this.props.discussion.current.creator.id || areaPermissions.removeThread;
    let canEditThread = this.props.userId === this.props.discussion.current.creator.id || areaPermissions.editMessages;
    let threadLocked = this.props.discussion.current.locked === true;
    let student = this.props.status.isStudent === true;

    return <DiscussionCurrentThread sticky={this.props.discussion.current.sticky} locked={this.props.discussion.current.locked}
      title={<h3 className="application-list__header-title">{this.props.discussion.current.title}</h3>}>
        <DiscussionCurrentThreadElement isOpMessage avatar={<div className="avatar avatar--category-1">{avatar}</div>}>
          <DiscussionThreadHeader aside={<span>{this.props.i18n.time.format(this.props.discussion.current.created)}</span>}>
            <span className="application-list__item-header-main-content application-list__item-header-main-content--discussion-message-creator">{getName(userCreator, this.props.status.permissions.FORUM_SHOW_FULL_NAMES)}</span>
          </DiscussionThreadHeader>
          <DiscussionThreadBody>
            <article className="rich-text" dangerouslySetInnerHTML={{__html: this.props.discussion.current.message}}></article>
            {this.props.discussion.current.created !== this.props.discussion.current.lastModified ? <span className="application-list__item-edited">
              {this.props.i18n.text.get("plugin.discussion.content.isEdited", this.props.i18n.time.format(this.props.discussion.current.lastModified))}
            </span> : null}
          </DiscussionThreadBody>
          <DiscussionThreadFooter hasActions>
            {!threadLocked || !student ?
              <ReplyThread>
                <Link as="span" className="link link--application-list-item-footer">{this.props.i18n.text.get("plugin.discussion.reply.message")}</Link>
              </ReplyThread> : null}
            {!threadLocked || !student ?
              <ReplyThread quote={this.props.discussion.current.message} quoteAuthor={getName(userCreator, this.props.status.permissions.FORUM_SHOW_FULL_NAMES)}>
                <Link as="span" className="link link--application-list-item-footer">{this.props.i18n.text.get("plugin.discussion.reply.quote")}</Link>
              </ReplyThread> : null}
            {canEditThread ? <ModifyThread thread={this.props.discussion.current}><Link as="span" className="link link--application-list-item-footer">{this.props.i18n.text.get("plugin.discussion.reply.edit")}</Link></ModifyThread> : null}
            {canRemoveThread ? 
            <DeleteThreadComponent>
              <Link as="span" className="link link--application-list-item-footer">{this.props.i18n.text.get("plugin.discussion.reply.delete")}</Link>
            </DeleteThreadComponent> : null}
          </DiscussionThreadFooter>
        </DiscussionCurrentThreadElement>

      {

        this.props.discussion.currentReplies.map((reply: DiscussionThreadReplyType)=>{
          let user: DiscussionUserType = reply.creator;
          let userCategory = reply.creator.id > 10 ? reply.creator.id % 10 + 1 : reply.creator;
          let canRemoveMessage = this.props.userId === reply.creator.id || areaPermissions.removeThread;
          let canEditMessage = this.props.userId === reply.creator.id || areaPermissions.editMessages;

          let avatar;
          if (!user){
            //This is what it shows when the user is not ready
            avatar = <div className="avatar avatar--category-1"></div>;
          } else {
            //This is what it shows when the user is ready
            avatar = <object className="avatar-container"
              data={getUserImageUrl(user)}
              type="image/jpeg">
                <div className={`avatar  avatar--category-${userCategory}`}>{user.firstName[0]}</div>
             </object>;
          }
          return (
            <DiscussionCurrentThreadElement key={reply.id} isReplyOfReply={!!reply.parentReplyId} avatar={avatar}>
              <DiscussionThreadHeader aside={<span>{this.props.i18n.time.format(reply.created)}</span>}>
                <span className="application-list__item-header-main-content application-list__item-header-main-content--discussion-message-creator">{getName(user, this.props.status.permissions.FORUM_SHOW_FULL_NAMES)}</span> 
              </DiscussionThreadHeader>
              <DiscussionThreadBody>
                {reply.deleted ? 
                  <article className="rich-text">[{this.props.i18n.text.get("plugin.discussion.infomessage.message.removed")}]</article> :
                  <article className="rich-text" dangerouslySetInnerHTML={{__html: reply.message}}></article>}
                {reply.created !== reply.lastModified ? <span className="application-list__item-edited">
                  {this.props.i18n.text.get("plugin.discussion.content.isEdited", this.props.i18n.time.format(reply.lastModified))}
                </span> : null}
              </DiscussionThreadBody>
              {!reply.deleted ? <DiscussionThreadFooter>
                  {!threadLocked || !student ?
                  <ReplyThread reply={reply}>
                    <Link as="span" className="link link--application-list-item-footer">{this.props.i18n.text.get("plugin.discussion.reply.message")}</Link>
                  </ReplyThread> : null}
              {!threadLocked || !student ?
                  <ReplyThread reply={reply}
                   quote={reply.message} quoteAuthor={getName(user, this.props.status.permissions.FORUM_SHOW_FULL_NAMES)}>
                    <Link as="span" className="link link--application-list-item-footer">{this.props.i18n.text.get("plugin.discussion.reply.quote")}</Link>
                  </ReplyThread> : null}
                {canEditMessage ? <ModifyThreadReply reply={reply}>
                    <Link as="span" className="link link--application-list-item-footer">{this.props.i18n.text.get("plugin.discussion.reply.edit")}</Link>
                </ModifyThreadReply> : null}
                {canRemoveMessage ? <DeleteThreadComponent reply={reply}>
                  <Link as="span" className="link link--application-list-item-footer">{this.props.i18n.text.get("plugin.discussion.reply.delete")}</Link>
                </DeleteThreadComponent> : null} 
              </DiscussionThreadFooter> : null}
            </DiscussionCurrentThreadElement>
          )})
      }
      <Pager onClick={this.getToPage} current={this.props.discussion.currentPage} pages={this.props.discussion.currentTotalPages}/>
    </DiscussionCurrentThread>
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    discussion: state.discussion,
    userId: state.status.userId,
    permissions: state.status.permissions,
    status: state.status
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CurrentThread);
