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
import '~/sass/elements/container.scss';
import '~/sass/elements/message.scss';


import {DiscussionType, DiscussionThreadType} from '~/reducers/main-function/discussion/discussion-threads';
import { UserIndexType, UserType } from '~/reducers/main-function/user-index';
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
        let user:UserType = this.props.userIndex.users[thread.creator];
              
        //UKKONEN hint
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
        
        //UKKONEN hint
        //if you want to know what information you have avaliable, you can ctrl+click on some element, it should take
        //you to the description file, for example, "thread", in this.props.discussionThreads.threads.map((thread: DiscussionThreadType, index: number)
        //says it is of DiscussionThreadType if you want to know what DiscussionThreadType has avaliable for you you can go and ctrl+click over it
        //You would get this
        //export interface DiscussionThreadType {
        //  created: string,
        //  creator: number,
        //  forumAreaId: number,
        //  id: number,
        //  lastModified: string,
        //  locked: boolean,
        //  message: string,
        //  numReplies: number,
        //  sticky: boolean,
        //  title: string,
        //  updated: string
        //}
        //you can pick whatever information you want and use it to build the template eg.
        
        //<div className="application-list__item-header application-list__item-header--discussion-item-header">
        //  <div className="icon-lock"></div>
        
        //can be changed to {thread.locked ? <div className="icon-lock"></div> : null} so you only get the lock when
        //the locked is set to true, other like
        
        //<span>{this.props.i18n.time.format()}</span>
        //you can pick the timee from the thread, as thread.lastModified or thread.created, depends on which one you need there
        
        return (
          <div key={thread.id} className="application-list__item-content-container--message message" onClick={this.getToThread.bind(this, thread)}>            
            <div className="application-list__item-content--aside message__content-aside--discussion">
              {avatar}
            </div>            
            <div className="application-list__item-content--main">
              <div className="application-list__item-header application-list__item-header--discussion-item-header">
                {thread.locked ? 
                  <div className="icon-lock"></div> : null
                }
                {thread.sticky ? 
                    <div className="icon-pin"></div> : null                
                }                                 
                <div className={`text message__title message__title--category-${thread.forumAreaId}`}>{thread.title}</div></div>
              <div className="application-list__item-body">
                <div className="text text--discussion-thread-item-body" dangerouslySetInnerHTML={{__html: thread.message}}></div>
              </div>
              <div className="application-list__item-footer">
                <div className="text text--discussion-thread-user">
                  <span>{user && user.firstName +  ' ' + user.lastName}</span> 
                  <span>{this.props.i18n.time.format(thread.created)}</span>
                </div>                                  
                <div className="text text--discussion-thread-meta">
                  <div className="text text--item-counter">
                    <span>{thread.numReplies}</span>
                  </div>                    
                  <div className="text text--discussion-thread-meta-latest-reply">
                    <span>{this.props.i18n.text.get("plugin.discussion.titleText.lastMessage")} {this.props.i18n.time.format(thread.updated)}</span>
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