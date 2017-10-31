import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import {colorIntToHex} from '~/util/modifiers';
import equals = require("deep-equal");
import {i18nType} from '~/reducers/base/i18n';

import '~/sass/elements/empty.scss';
import '~/sass/elements/loaders.scss';
import '~/sass/elements/application-list.scss';
import '~/sass/elements/text.scss';
import {DiscussionType, DiscussionThreadType} from '~/reducers/main-function/discussion/discussion-threads';
import { UserIndexType } from '~/reducers/main-function/user-index';
import BodyScrollLoader from '~/components/general/body-scroll-loader';
import {loadMoreDiscussionThreads} from '~/actions/main-function/discussion/discussion-threads';

interface DiscussionThreadsProps {
  discussionThreads: DiscussionType,
  i18n: i18nType,
  userIndex: UserIndexType,
  discussionThreadsState: string,
  discussionThreadsHasMore: string
}

interface DiscussionThreadsState {
}

class DiscussionThreads extends BodyScrollLoader<DiscussionThreadsProps, DiscussionThreadsState> {
  constructor(props: DiscussionThreadsProps){
    super(props);
    
    this.getToThread = this.getToThread.bind(this);
    
    this.statePropertyLocation = "discussionThreadsState";
    this.hasMorePropertyLocation = "discussionThreadsHasMore";
    this.loadMoreTriggerFunctionLocation = "loadMoreDiscussionThreads"
  }
  getToThread(thread: DiscussionThreadType){
    window.location.hash = thread.forumAreaId + "/" + thread.id;
  }
  render(){
    if (this.props.discussionThreads.state === "LOADING"){
      return null;
    } else if (this.props.discussionThreads.state === "ERROR"){
      //TODO: put a translation here t! this happens when messages fail to load, a notification shows with the error
      //message but here we got to put something
      return <div className="empty"><span>{"ERROR"}</span></div>
    } else if (this.props.discussionThreads.threads.length === 0){
      return <div className="empty"><span>{this.props.i18n.text.get("plugin.communicator.empty.topic")}</span></div>
    }
    
    return <div className="application-list application-list__items">{
      this.props.discussionThreads.threads.map((thread: DiscussionThreadType, index: number)=>{
        
        //NOTE That the index might not be ready as they load async, this user might be undefined in the first rendering
        //round so put something as a placeholder in order to be efficient and make short rendering cycles
        let user = this.props.userIndex[thread.creator];        
        return (
          <div key={thread.id} className="application-list__item-content-container--avatar" onClick={this.getToThread.bind(this, thread)}>            
            <div className="application-list__item-content--avatar-container">
              <div className="application-list__item-content-avatar">D</div>
            </div>            
            <div className="application-list__item-content--content-container">
              <div className="application-list__item__header">{thread.title}</div>
              <div className="application-list__item__body">
                <span className="text text--discussion-thread-item-body" dangerouslySetInnerHTML={{__html: thread.message}}></span>
                <div className="container container--discussion-thread-user">{user && user.firstName + user.lastName}</div>

              </div>
            </div>
          </div>
       )
      })
    }{
      this.props.discussionThreads.state === "LOADING_MORE" ? 
        <div className="application-list__item loader-empty"/>
    : null}</div>
  }
}

function mapStateToProps(state: any){
  return {
    i18n: state.i18n,
    discussionThreads: state.discussionThreads,
    userIndex: state.userIndex,
    discussionThreadsState: state.discussionThreads.state,
    discussionThreadsHasMore: state.discussionThreads.hasMore
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return bindActionCreators({loadMoreDiscussionThreads}, dispatch);
};

export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(DiscussionThreads);