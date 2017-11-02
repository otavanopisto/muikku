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
import Pager from '~/components/general/pager';
import BodyScrollKeeper from '~/components/general/body-scroll-keeper';

interface DiscussionThreadsProps {
  discussionThreads: DiscussionType,
  i18n: i18nType,
  userIndex: UserIndexType
}

interface DiscussionThreadsState {
}

class DiscussionThreads extends React.Component<DiscussionThreadsProps, DiscussionThreadsState> {
  constructor(props: DiscussionThreadsProps){
    super(props);
    
    this.getToThread = this.getToThread.bind(this);
    this.getToPage = this.getToPage.bind(this);
  }
  getToPage(n: number){
    window.location.hash = (this.props.discussionThreads.areaId || 0) + "/" + n;
  }
  getToThread(thread: DiscussionThreadType){
    if (this.props.discussionThreads.areaId === thread.forumAreaId){
      window.location.hash = thread.forumAreaId + "/" + this.props.discussionThreads.page +
      "/" + thread.id + "/1";
    }
    window.location.hash = thread.forumAreaId + "/1" +
      "/" + thread.id + "/1";
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
    
    return <BodyScrollKeeper hidden={!!this.props.discussionThreads.current}><div className="application-list application-list__items">{
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
              <div className="application-list__item__header application-list__item__header--discussion-item-header">
                <div className="icon-lock"></div>
                <div className="icon-pin"></div>
                <div className="text text--discussion-thread-item-title">{thread.title}</div></div>
              <div className="application-list__item__body">
                <div className="text text--discussion-thread-item-body" dangerouslySetInnerHTML={{__html: thread.message}}></div>
              </div>
              <div className="application-list__item__footer">
                <div className="text text--discussion-thread-user">
                  <span>{user && user.firstName +  ' ' + user.lastName}</span> 
                  <span>{this.props.i18n.time.format()}</span>
                </div>                
                <div className="text text--discussion-thread-meta">
                  <div className="text text--item-counter">
                    <span>15</span>
                  </div>
                  <div className="text text--discussion-thread-meta-latest-reply">
                    <span>TODO Viimeisin viesti: {this.props.i18n.time.format()}</span>
                  </div>
                </div>  
              </div>  
            </div>
          </div>
       )
      })
    }<Pager onClick={this.getToPage} current={this.props.discussionThreads.page} pages={this.props.discussionThreads.totalPages}/></div></BodyScrollKeeper>
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
)(DiscussionThreads);