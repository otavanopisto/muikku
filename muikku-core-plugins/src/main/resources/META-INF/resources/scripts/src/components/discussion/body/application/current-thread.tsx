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
    
    let canRemoveThread = this.props.userId === this.props.discussionThreads.current.creator || areaPermissions.removeThread;
    let canEditThread = this.props.userId === this.props.discussionThreads.current.creator || areaPermissions.editMessage;
    
    return <div className="application-list application-list__items">
      <div className="application-list__item application-list__item--discussion-current-thread">
        <div className="application-list__item__header">
          <h1 className="text">{this.props.discussionThreads.current.title}</h1>
        </div>
        <div className="application-list__item__body">
          <article className="text" dangerouslySetInnerHTML={{__html: this.props.discussionThreads.current.message}}></article>
        </div>
        <div className="application-list__item__footer">
          <ReplyThread thread={this.props.discussionThreads.current}>
            <Link as="span" className="link link--discussion-item-action">TODO translate reply</Link>
          </ReplyThread>
          <Link as="span" className="link link--discussion-item-action">TODO translate quote</Link>
          {canEditThread ? <Link as="span" className="link link--discussion-item-action">TODO translate edit</Link> : null}
          {canRemoveThread ? <Link as="span" className="link link--discussion-item-action">TODO translate poista</Link> : null}
        </div>
      </div>
      {
        this.props.discussionThreads.currentReplies.map((reply: DiscussionThreadReplyType)=>{
          //Again note that the user might not be ready
          let user = this.props.userIndex[reply.creator];
          
          let canRemoveMessage = this.props.userId === reply.creator || areaPermissions.removeThread;
          let canEditMessage = this.props.userId === reply.creator || areaPermissions.editMessages;
          
          return <div key={reply.id} className={`application-list__item application-list__item--discussion-reply ${reply.parentReplyId ? "application-list__item--discussion-reply--of-reply" : "application-list__item--discussion-reply--main"}`}>
            <div className="application-list__item__body" dangerouslySetInnerHTML={{__html: reply.message}} />
            <div className="application-list__item__footer">
              <ReplyThread thread={this.props.discussionThreads.current} message={reply}>
                <Link as="span" className="link link--discussion-item-action">TODO translate reply</Link>
              </ReplyThread>
              <Link as="span" className="link link--discussion-item-action">TODO translate quote</Link>
              {canEditMessage ? <Link as="span" className="link link--discussion-item-action">TODO translate edit</Link> : null}
              {canRemoveMessage ? <Link as="span" className="link link--discussion-item-action">TODO translate poista</Link> : null}
            </div>
          </div>
        })
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