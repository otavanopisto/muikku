import { UserIndexType } from "~/reducers/main-function/user-index";
import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import { DiscussionType, DiscussionThreadReplyType } from "~/reducers/main-function/discussion/discussion-threads";
import { Dispatch, connect } from "react-redux";
import Pager from "~/components/general/pager";

import '~/sass/elements/application-list.scss';
import '~/sass/elements/text.scss';
import '~/sass/elements/container.scss';

interface CurrentThreadProps {
  discussionThreads: DiscussionType,
  i18n: i18nType,
  userIndex: UserIndexType
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
    
    //Again note that the user might not be ready
    let userCreator = this.props.userIndex[this.props.discussionThreads.current.creator];
    
    return <div><div className="application-list application-list__items">
      <div className="application-list__item application-list__item--discussion-current-thread">
        <div className="application-list__item__header">
          {this.props.discussionThreads.current.title}
        </div>
        <div className="application-list__item__body" dangerouslySetInnerHTML={{__html: this.props.discussionThreads.current.message}}></div>
        <div className="application-list__item__footer">
        </div>
      </div>
      {
        this.props.discussionThreads.currentReplies.map((reply: DiscussionThreadReplyType)=>{
          //Again note that the user might not be ready
          let user = this.props.userIndex[reply.creator];
          
          return <div className={`application-list__item application-list__item--discussion-reply ${reply.parentReplyId ? "application-list__item--discussion-reply--of-reply" : "application-list__item--discussion-reply--main"}`}>
            <div className="application-list__item__body" dangerouslySetInnerHTML={{__html: reply.message}} />
            <div className="application-list__item__footer">
            </div>
          </div>
        })
      }
    </div><Pager onClick={this.getToPage} current={this.props.discussionThreads.page} pages={this.props.discussionThreads.totalPages}/></div>
  }
}

function mapStateToProps(state: any){
  return {
    i18n: state.i18n,
    discussionThreads: state.discussionThreads,
    userIndex: state.userIndex
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(CurrentThread);