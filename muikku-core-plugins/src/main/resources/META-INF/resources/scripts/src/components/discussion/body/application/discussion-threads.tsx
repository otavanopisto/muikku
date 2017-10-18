import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import {colorIntToHex} from '~/util/modifiers';
import equals = require("deep-equal");

import actions from '~/actions/main-function/communicator/communicator-messages';

import {i18nType} from '~/reducers/base/i18n';

import '~/sass/elements/empty.scss';
import '~/sass/elements/loaders.scss';
import '~/sass/elements/application-list.scss';
import '~/sass/elements/text.scss';
import {DiscussionType, DiscussionThreadType} from '~/reducers/main-function/discussion/discussion-threads';

interface DiscussionThreadsProps {
  discussionThreads: DiscussionType,
  i18n: i18nType
}

interface DiscussionThreadsState {
}

class DiscussionThreads extends React.Component<DiscussionThreadsProps, DiscussionThreadsState> {
  constructor(props: DiscussionThreadsProps){
    super(props);
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
    
    return <div className="application-list application-list--discussion-threads">{
      this.props.discussionThreads.threads.map((thread: DiscussionThreadType, index: number)=>{
        return (
          <div key={thread.id} className="application-list__item">
            <div className="application-list__item__header">{thread.title}</div>
            <div className="application-list__item__body">
              <span className="text text--discussion-thread-item-body" dangerouslySetInnerHTML={{__html: thread.message}}></span>
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
    discussionThreads: state.discussionThreads
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return bindActionCreators(actions, dispatch);
};

export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(DiscussionThreads);