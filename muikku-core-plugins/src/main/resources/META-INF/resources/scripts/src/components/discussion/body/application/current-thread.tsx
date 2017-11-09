import { UserIndexType } from "~/reducers/main-function/user-index";
import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import { DiscussionType, DiscussionThreadReplyType } from "~/reducers/main-function/discussion/discussion-threads";
import { Dispatch, connect } from "react-redux";
import Pager from "~/components/general/pager";
import Link from "~/components/general/link";
import ReplyThread from './reply-thread-dialog';

import '~/sass/elements/application-list.scss';
import '~/sass/elements/text.scss';
import '~/sass/elements/container.scss';
import { getName } from "~/util/modifiers";

interface CurrentThreadProps {
  discussionThreads: DiscussionType,
  i18n: i18nType,
  userIndex: UserIndexType,
  userId: number,
  permissions: any
}

interface CurrentThreadState {
  
}

class CurrentThread extends React.Component<CurrentThreadProps, CurrentThreadState> {
  getToPage(n: number){
    if (this.props.discussionThreads.areaId === this.props.discussionThreads.current.forumAreaId){
      window.location.hash = this.props.discussionThreads.current.forumAreaId + "/" + this.props.discussionThreads.page +
      "/" + this.props.discussionThreads.current.id + "/" + n;
    }
    window.location.hash = this.props.discussionThreads.current.forumAreaId + "/1" +
      "/" + this.props.discussionThreads.current.id + "/" + n;
  }
  render(){
    if (!this.props.discussionThreads.current){
      return null;
    }
    
    let areaPermissions = this.props.permissions.AREA_PERMISSIONS[this.props.discussionThreads.current.forumAreaId] || {};
    
    //Again note that the user might not be ready
    let userCreator = this.props.userIndex[this.props.discussionThreads.current.creator];

    let avatar;
    if (!userCreator){
      //This is what it shows when the user is not ready
      avatar = <div className="application-list__item-content-avatar"></div>;
    } else {
      //This is what it shows when the user is ready
      avatar = <object className="container container--profile-image"
        data={`/rest/user/files/user/${userCreator.id}/identifier/profile-image-96`}
        type="image/jpeg">
          <div className="application-list__item-content-avatar">{userCreator.firstName[0]}</div>
       </object>;
    }    
    
    
    let canRemoveThread = this.props.userId === this.props.discussionThreads.current.creator || areaPermissions.removeThread;
    let canEditThread = this.props.userId === this.props.discussionThreads.current.creator || areaPermissions.editMessage;
    
    return <div className="application-list__items">
      <div className="application-list__item--open application-list__item--discussion-current-thread">
        <div className="application-list__item-content-container--avatar">
          <div className="application-list__item-content--avatar-container">
            <div className="application-list__item-content-avatar">{avatar}</div>
          </div>
          <div className="application-list__item-content--content-container">
            <div className="application-list__item-header">
              <h1 className="text">{this.props.discussionThreads.current.title}</h1>
            </div>    
            <div className="application-list__item-body">
              <article className="text text--item-article" dangerouslySetInnerHTML={{__html: this.props.discussionThreads.current.message}}></article>
            </div>
            <div className="application-list__item-footer">
              <ReplyThread thread={this.props.discussionThreads.current}>
                <Link as="span" className="link link--application-list-item-footer">{this.props.i18n.text.get("plugin.discussion.reply.message")}</Link>
              </ReplyThread>
              <Link as="span" className="link link--application-list-item-footer">{this.props.i18n.text.get("plugin.discussion.reply.quote")}</Link>
              {canEditThread ? <Link as="span" className="link link--application-list-item-footer">{this.props.i18n.text.get("plugin.discussion.reply.edit")}</Link> : null}
              {canRemoveThread ? <Link as="span" className="link link--application-list-item-footer">{this.props.i18n.text.get("plugin.discussion.reply.delete")}</Link> : null}
            </div>              
          </div>
        </div>
      </div>
      {
        
        this.props.discussionThreads.currentReplies.map((reply: DiscussionThreadReplyType)=>{
          //Again note that the user might not be ready
          let user = this.props.userIndex[reply.creator];
          
          let canRemoveMessage = this.props.userId === reply.creator || areaPermissions.removeThread;
          let canEditMessage = this.props.userId === reply.creator || areaPermissions.editMessages;
          
          let avatar;
          if (!user){
            //This is what it shows when the user is not ready
            avatar = <div className="application-list__item-content-avatar"></div>;
          } else {
            //This is what it shows when the user is ready
            avatar = <object className="container container--profile-image"
              data={`/rest/user/files/user/${user.id}/identifier/profile-image-96`}
              type="image/jpeg">
                <div className="application-list__item-content-avatar">{user.firstName[0]}</div>
             </object>;
          }          
          
          
          return ( 
              
            <div key={reply.id} className={`application-list__item--open application-list__item--discussion-reply ${reply.parentReplyId ? "application-list__item--discussion-reply--of-reply" : "application-list__item--discussion-reply--main"}`}>
              <div className="application-list__item-content-container--avatar">            
                <div className="application-list__item-content--avatar-container">
                  {avatar}
                </div>            
                <div className="application-list__item-content--content-container">          
              
                  <div className="application-list__item-body" dangerouslySetInnerHTML={{__html: reply.message}} />
                  <div className="application-list__item-footer">
                    <ReplyThread thread={this.props.discussionThreads.current} reply={reply}>
                      <Link as="span" className="link link--application-list-item-footer">{this.props.i18n.text.get("plugin.discussion.reply.message")}</Link>
                    </ReplyThread>
                    <Link as="span" className="link link--application-list-item-footer">{this.props.i18n.text.get("plugin.discussion.reply.quote")}</Link>
                    {canEditMessage ? <Link as="span" className="link application-list-item-footer">{this.props.i18n.text.get("plugin.discussion.reply.edit")}</Link> : null}
                    {canRemoveMessage ? <Link as="span" className="link application-list-item-footer">{this.props.i18n.text.get("plugin.discussion.reply.delete")}</Link> : null}
                  </div>
                </div>      
              </div>
            </div>
        )})
      }
      <Pager onClick={this.getToPage} current={this.props.discussionThreads.currentPage} pages={this.props.discussionThreads.currentTotalPages}/>
    </div>
  }
}

function mapStateToProps(state: any){
  return {
    i18n: state.i18n,
    discussionThreads: state.discussionThreads,
    userIndex: state.userIndex,
    userId: state.status.userId,
    permissions: state.status.permissions
  }
};




function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(CurrentThread);