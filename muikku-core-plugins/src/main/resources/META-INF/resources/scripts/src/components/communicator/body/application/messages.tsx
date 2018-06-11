import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import {colorIntToHex} from '~/util/modifiers';
import equals = require("deep-equal");

import {i18nType} from '~/reducers/base/i18n';
import {StateType} from '~/reducers';

import '~/sass/elements/empty.scss';
import '~/sass/elements/loaders.scss';
import '~/sass/elements/application-list.scss';
import '~/sass/elements/text.scss';
import '~/sass/elements/label.scss';
import '~/sass/elements/message.scss';

import BodyScrollLoader from '~/components/general/body-scroll-loader';
import BodyScrollKeeper from '~/components/general/body-scroll-keeper';
import SelectableList from '~/components/general/selectable-list';
import { loadMoreMessageThreads, removeFromMessagesSelectedThreads, addToMessagesSelectedThreads, LoadMoreMessageThreadsTriggerType, RemoveFromMessagesSelectedThreadsTriggerType, AddToMessagesSelectedThreadsTriggerType } from '~/actions/main-function/messages';
import { MessageThreadListType, MessagesStateType, MessageThreadExpandedType, MessageThreadType, MessagesType } from '~/reducers/main-function/messages';


interface CommunicatorMessagesProps {
  threads: MessageThreadListType,
  hasMore: boolean,
  state: MessagesStateType,
  selectedThreads: MessageThreadListType,
  selectedThreadsIds: Array<number>,
  currentThread: MessageThreadExpandedType,
  messages: MessagesType,
  
  loadMoreMessageThreads: LoadMoreMessageThreadsTriggerType,
  removeFromMessagesSelectedThreads: RemoveFromMessagesSelectedThreadsTriggerType,
  addToMessagesSelectedThreads: AddToMessagesSelectedThreadsTriggerType,
  
  i18n: i18nType,
  userId: number
}

interface CommunicatorMessagesState {
}

class CommunicatorMessages extends BodyScrollLoader<CommunicatorMessagesProps, CommunicatorMessagesState> {
  constructor(props: CommunicatorMessagesProps){
    super(props);
    
    this.getThreadUserNames = this.getThreadUserNames.bind(this);
    this.setCurrentThread = this.setCurrentThread.bind(this);
    
    //once this is in state READY only then a loading more event can be triggered
    this.statePropertyLocation = "state";
    //it will only call the function if this is true
    this.hasMorePropertyLocation = "hasMore";
    //this is the function that will be called
    this.loadMoreTriggerFunctionLocation = "loadMoreMessageThreads";
    //abort if this is true (in this case it causes the current element to be invisible)
    this.cancellingLoadingPropertyLocation = "currentThread";
  }
  getThreadUserNames(thread:MessageThreadType, userId: number):string {
    if (thread.senderId !== userId || !thread.recipients){
      if (thread.senderId === userId){
        return this.props.i18n.text.get("plugin.communicator.sender.self");
      }
      return (thread.sender.firstName ? thread.sender.firstName + " " : "")+(thread.sender.lastName ? thread.sender.lastName : "");
    }
    
    return thread.recipients.map((recipient)=>{
      if (recipient.userId === userId){
        return this.props.i18n.text.get("plugin.communicator.sender.self");
      }
      return (recipient.firstName ? recipient.firstName + " " : "")+(recipient.lastName ? recipient.lastName : "");
    }).join(", ");
  }
  setCurrentThread(thread: MessageThreadType){
    window.location.hash = window.location.hash.split("/")[0] + "/" + thread.communicatorMessageId;
  }
  render(){
    if (this.props.state === "LOADING"){
      return null;
    } else if (this.props.state === "ERROR"){
      //TODO: put a translation here please! this happens when messages fail to load, a notification shows with the error
      //message but here we got to put something
      return <div className="empty"><span>{"ERROR"}</span></div>
    } else if (this.props.threads.length === 0){
      return <div className="empty"><span>{this.props.i18n.text.get("plugin.communicator.empty.topic")}</span></div>
    }
    
    //DO NOT DELETE
    //VERY CRITICAL CODE
    //REMOVAL WILL CAUSE EXPLOSION
    return <BodyScrollKeeper hidden={!!this.props.currentThread}>
      <SelectableList className="application-list" selectModeClassAddition="application-list--select-mode"
        extra={this.props.state === "LOADING_MORE" ?
          <div className="application-list__item loader-empty"/>
         : null} dataState={this.props.state}>
        {this.props.threads.map((thread, index: number)=>{
          let isSelected:boolean = this.props.selectedThreadsIds.includes(thread.communicatorMessageId);
          return {
            className: `application-list__item message message--communicator ${thread.unreadMessagesInThread ? "message--unread" : ""}`,
            onSelect: this.props.addToMessagesSelectedThreads.bind(null, thread),
            onDeselect: this.props.removeFromMessagesSelectedThreads.bind(null, thread),
            onEnter: this.setCurrentThread.bind(this, thread),
            isSelected,
            key: thread.communicatorMessageId,
            contents: (checkbox: React.ReactElement<any>)=>{
              return <div className="application-list__item-content-wrapper">
                  <div className="application-list__item-content-aside">
                    <div className="message__select-container">
                      {checkbox}
                    </div>
                  </div>              
                  <div className="application-list__item-content-main">
                    <div className="application-list__item-header application-list__item-header--message">
                      <div className="text text--list-item-title">
                        <span>{this.getThreadUserNames(thread, this.props.userId)}</span>
                      </div>
                      {thread.messageCountInThread > 1 ? <div className="text text--item-counter">
                      {thread.messageCountInThread}
                      </div> : null}
                      <div className="text text--communicator-date">
                        {this.props.i18n.time.format(thread.threadLatestMessageDate)}
                      </div>                
                    </div>
                    <div className="application-list__item-body">
                      <span className="text text--communicator-item-body">{thread.caption}</span>
                    </div>
                    {thread.labels.length ? <div className="application-list__item-footer application-list__item-footer--message">
                      <div className="labels">{thread.labels.map((label)=>{
                        return <span className="label" key={label.id}>
                          <span className="label__icon icon-tag" style={{color: colorIntToHex(label.labelColor)}}></span>
                          <span className="text label__text">{label.labelName}</span>
                        </span>
                      })}</div>
                    </div> : null}
                  </div>    
                </div>
              }
            }
          })
        }
      </SelectableList></BodyScrollKeeper>
  }
}

function mapStateToProps(state: StateType){
  return {
    threads: state.messages.threads,
    hasMore: state.messages.hasMore,
    state: state.messages.state,
    selectedThreads: state.messages.selectedThreads,
    selectedThreadsIds: state.messages.selectedThreadsIds,
    currentThread: state.messages.currentThread,
    messages: state.messages,
    i18n: state.i18n,
    userId: state.status.userId
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return bindActionCreators({
    loadMoreMessageThreads,
    removeFromMessagesSelectedThreads,
    addToMessagesSelectedThreads
  }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommunicatorMessages);