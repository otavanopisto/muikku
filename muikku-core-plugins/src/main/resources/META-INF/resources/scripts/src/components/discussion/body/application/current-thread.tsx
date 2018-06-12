import { UserIndexType } from "~/reducers/main-function/user-index";
import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import { DiscussionType, DiscussionThreadReplyType } from "~/reducers/main-function/discussion";
import { Dispatch, connect } from "react-redux";
import Pager from "~/components/general/pager";
import Link from "~/components/general/link";
import ReplyThread from './reply-thread-dialog';
import ModifyThread from './modify-thread-dialog';
import DeleteThreadComponent from './delete-thread-component-dialog';
import ModifyThreadReply from './modify-thread-reply-dialog';
import { getName, getUserImageUrl } from "~/util/modifiers";
import {StateType} from '~/reducers';

import '~/sass/elements/text.scss';
import '~/sass/elements/container.scss';
import '~/sass/elements/avatar.scss';
import '~/sass/elements/discussion.scss';
import '~/sass/elements/rich-text.scss';
import { DiscussionCurrentThread, DiscussionCurrentThreadElement, DiscussionThreadHeader, DiscussionThreadBody, DiscussionThreadFooter } from "./threads/threads";

interface CurrentThreadProps {
  discussion: DiscussionType,
  i18n: i18nType,
  userIndex: UserIndexType,
  userId: number,
  permissions: any
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
    
    //Again note that the user might not be ready
    let userCreator = this.props.userIndex.users[this.props.discussion.current.creator];
    let userCategory = this.props.discussion.current.creator > 10 ? this.props.discussion.current.creator % 10 + 1 : this.props.discussion.current.creator;
    let avatar;
    if (!userCreator){
      //This is what it shows when the user is not ready
      avatar = <div className="avatar avatar--category-1"></div>;
    } else {
      //This is what it shows when the user is ready
      avatar = <object className="container container--discussion-profile-image"
        data={getUserImageUrl(userCreator)}
        type="image/jpeg">
          <div className={`avatar avatar--category-${userCategory}`}>{userCreator.firstName[0]}</div>
       </object>;
    }
    
    let canRemoveThread = this.props.userId === this.props.discussion.current.creator || areaPermissions.removeThread;
    let canEditThread = this.props.userId === this.props.discussion.current.creator || areaPermissions.editMessage;

        
    return <DiscussionCurrentThread sticky={this.props.discussion.current.sticky} locked={this.props.discussion.current.locked}
      title={<h3 className="text text--discussion-current-thread-title">{this.props.discussion.current.title}</h3>}>
        <DiscussionCurrentThreadElement isOpMessage avatar={<div className="avatar avatar--category-1">{avatar}</div>}>
          <DiscussionThreadHeader aside={<span className="text">{this.props.i18n.time.format(this.props.discussion.current.created)}</span>}>
            <span className="text text--discussion-message-creator">{getName(userCreator)}</span> 
          </DiscussionThreadHeader>
          <DiscussionThreadBody>
            <article className="text text--discussion-message-content rich-text" dangerouslySetInnerHTML={{__html: this.props.discussion.current.message}}></article>
            {this.props.discussion.current.created !== this.props.discussion.current.lastModified ? <span className="text text--discussion-last-modifier">
              {this.props.i18n.text.get("plugin.discussion.content.isEdited", this.props.i18n.time.format(this.props.discussion.current.lastModified))}
            </span> : null}
          </DiscussionThreadBody>
          <DiscussionThreadFooter hasActions>
            <ReplyThread>
              <Link as="span" className="link link--application-list-item-footer">{this.props.i18n.text.get("plugin.discussion.reply.message")}</Link>
            </ReplyThread>              
            <ReplyThread quote={this.props.discussion.current.message} quoteAuthor={getName(userCreator)}>
              <Link as="span" className="link link--application-list-item-footer">{this.props.i18n.text.get("plugin.discussion.reply.quote")}</Link>
            </ReplyThread>                
            {canEditThread ? <ModifyThread thread={this.props.discussion.current}><Link as="span" className="link link--application-list-item-footer">{this.props.i18n.text.get("plugin.discussion.reply.edit")}</Link></ModifyThread> : null}
            {canRemoveThread ? 
            <DeleteThreadComponent>
              <Link as="span" className="link link--application-list-item-footer">{this.props.i18n.text.get("plugin.discussion.reply.delete")}</Link>            
            </DeleteThreadComponent> : null}
          </DiscussionThreadFooter>
        </DiscussionCurrentThreadElement>
            
      {
        
        this.props.discussion.currentReplies.map((reply: DiscussionThreadReplyType)=>{
          //Again note that the user might not be ready
          let user = this.props.userIndex.users[reply.creator];
          let userCategory = reply.creator > 10 ? reply.creator % 10 + 1 : reply.creator;                    
          let canRemoveMessage = this.props.userId === reply.creator || areaPermissions.removeThread;
          let canEditMessage = this.props.userId === reply.creator || areaPermissions.editMessages;
          
          let avatar;
          if (!user){
            //This is what it shows when the user is not ready
            avatar = <div className="avatar avatar--category-1"></div>;
          } else {
            //This is what it shows when the user is ready
            avatar = <object className="container container--discussion-profile-image"
              data={getUserImageUrl(user)}
              type="image/jpeg">
                <div className={`avatar  avatar--category-${userCategory}`}>{user.firstName[0]}</div>
             </object>;
          }          
          
          return (
            <DiscussionCurrentThreadElement key={reply.id} isReplyOfReply={!!reply.parentReplyId} avatar={avatar}>
              <DiscussionThreadHeader aside={<span className="text">{this.props.i18n.time.format(reply.created)}</span>}>
                <span className="text text--discussion-message-creator">{getName(user)}</span> 
              </DiscussionThreadHeader>
              <DiscussionThreadBody>
                {reply.deleted ? 
                  <article className="text text--discussion-message-content">[{this.props.i18n.text.get("plugin.discussion.infomessage.message.removed")}]</article> :
                  <article className="text text--discussion-message-content rich-text" dangerouslySetInnerHTML={{__html: reply.message}}></article>}
                {reply.created !== reply.lastModified ? <span className="text text--discussion-last-modifier">
                  {this.props.i18n.text.get("plugin.discussion.content.isEdited", this.props.i18n.time.format(reply.lastModified))}
                </span> : null}
              </DiscussionThreadBody>
              {!reply.deleted ? <DiscussionThreadFooter>
                <ReplyThread reply={reply}>
                  <Link as="span" className="link link--application-list-item-footer">{this.props.i18n.text.get("plugin.discussion.reply.message")}</Link>
                </ReplyThread>
                <ReplyThread reply={reply}
                 quote={reply.message} quoteAuthor={getName(user)}>
                  <Link as="span" className="link link--application-list-item-footer">{this.props.i18n.text.get("plugin.discussion.reply.quote")}</Link>
                </ReplyThread>
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
    userIndex: state.userIndex,
    userId: state.status.userId,
    permissions: state.status.permissions
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CurrentThread);
