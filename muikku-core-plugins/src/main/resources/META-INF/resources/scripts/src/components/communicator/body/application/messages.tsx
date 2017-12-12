import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import {colorIntToHex} from '~/util/modifiers';
import equals = require("deep-equal");

import actions from '~/actions/main-function/communicator/communicator-messages';

import {LoadMoreMessagesTriggerType, RemoveFromCommunicatorSelectedMessagesTriggerType, AddToCommunicatorSelectedMessagesTriggerType} from '~/actions/main-function/communicator/communicator-messages';
import {CommunicatorMessageListType, CommunicatorStateType, CommunicatorMessageType, CommunicatorMessageRecepientType, CommunicatorThreadType} from '~/reducers/main-function/communicator/communicator-messages';
import {i18nType} from '~/reducers/base/i18n';

import '~/sass/elements/empty.scss';
import '~/sass/elements/loaders.scss';
import '~/sass/elements/application-list.scss';
import '~/sass/elements/text.scss';
import '~/sass/elements/message.scss';

import BodyScrollLoader from '~/components/general/body-scroll-loader';
import BodyScrollKeeper from '~/components/general/body-scroll-keeper';
import SelectableList from '~/components/general/selectable-list';


interface CommunicatorMessagesProps {
  communicatorMessagesSelected: CommunicatorMessageListType,
  communicatorMessagesHasMore: boolean,
  communicatorMessagesState: CommunicatorStateType,
  communicatorMessagesSelectedIds: Array<number>,
  communicatorMessagesMessages: CommunicatorMessageListType,
  communicatorMessagesCurrent: CommunicatorThreadType,
  loadMoreMessages: LoadMoreMessagesTriggerType,
  removeFromCommunicatorSelectedMessages: RemoveFromCommunicatorSelectedMessagesTriggerType,
  addToCommunicatorSelectedMessages: AddToCommunicatorSelectedMessagesTriggerType,
  i18n: i18nType,
  userId: number
}

interface CommunicatorMessagesState {
}

class CommunicatorMessages extends BodyScrollLoader<CommunicatorMessagesProps, CommunicatorMessagesState> {
  constructor(props: CommunicatorMessagesProps){
    super(props);
    
    this.getMessageUserNames = this.getMessageUserNames.bind(this);
    this.setCurrentMessage = this.setCurrentMessage.bind(this);
    
    //once this is in state READY only then a loading more event can be triggered
    this.statePropertyLocation = "communicatorMessagesState";
    //it will only call the function if this is true
    this.hasMorePropertyLocation = "communicatorMessagesHasMore";
    //this is the function that will be called
    this.loadMoreTriggerFunctionLocation = "loadMoreMessages";
    //abort if this is true (in this case it causes the current element to be invisible)
    this.cancellingLoadingPropertyLocation = "communicatorMessagesCurrent";
  }
  getMessageUserNames(message:CommunicatorMessageType, userId: number):string {
    if (message.senderId !== userId || !message.recipients){
      if (message.senderId === userId){
        return this.props.i18n.text.get("plugin.communicator.sender.self");
      }
      return (message.sender.firstName ? message.sender.firstName + " " : "")+(message.sender.lastName ? message.sender.lastName : "");
    }
    
    return message.recipients.map((recipient: CommunicatorMessageRecepientType)=>{
      if (recipient.userId === userId){
        return this.props.i18n.text.get("plugin.communicator.sender.self");
      }
      return (recipient.firstName ? recipient.firstName + " " : "")+(recipient.lastName ? recipient.lastName : "");
    }).join(", ");
  }
  setCurrentMessage(message: CommunicatorMessageType){
    window.location.hash = window.location.hash.split("/")[0] + "/" + message.communicatorMessageId;
  }
  render(){
    if (this.props.communicatorMessagesState === "LOADING"){
      return null;
    } else if (this.props.communicatorMessagesState === "ERROR"){
      //TODO: put a translation here please! this happens when messages fail to load, a notification shows with the error
      //message but here we got to put something
      return <div className="empty"><span>{"ERROR"}</span></div>
    } else if (this.props.communicatorMessagesMessages.length === 0){
      return <div className="empty"><span>{this.props.i18n.text.get("plugin.communicator.empty.topic")}</span></div>
    }
    
    //DO NOT DELETE
    //VERY CRITICAL CODE
    //REMOVAL WILL CAUSE EXPLOSION
    return <BodyScrollKeeper hidden={!!this.props.communicatorMessagesCurrent}>
      <SelectableList className="application-list" selectModeClassAddition="application-list--select-mode"
        extra={this.props.communicatorMessagesState === "LOADING_MORE" ?
          <div className="application-list__item loader-empty"/>
         : null} dataState={this.props.communicatorMessagesState}>
        {this.props.communicatorMessagesMessages.map((message: CommunicatorMessageType, index: number)=>{
          let isSelected = this.props.communicatorMessagesSelectedIds.includes(message.communicatorMessageId);
          return {
            className: `application-list__item message ${message.unreadMessagesInThread ? "message--unread" : ""}`,
            onSelect: this.props.addToCommunicatorSelectedMessages.bind(null, message),
            onDeselect: this.props.removeFromCommunicatorSelectedMessages.bind(null, message),
            onEnter: this.setCurrentMessage.bind(this, message),
            isSelected,
            key: message.communicatorMessageId,
            contents: (checkbox: React.ReactElement<any>)=>{
              return <div className="application-list__item-content-wrapper message__content">
                  <div className="application-list__item-content application-list__item-content--aside">
                    <div className="message__select-container">
                      {checkbox}
                    </div>
                  </div>
                  <div className="application-list__item-content application-list__item-content--main">
                    <div className="application-list__item-header">
                      <div className="text text--communicator-usernames">
                        <span className="text text--communicator-username">{this.getMessageUserNames(message, this.props.userId)}</span>
                      </div>
                      {message.messageCountInThread > 1 ? <div className="text text--item-counter">
                      {message.messageCountInThread}
                      </div> : null}
                      <div className="text text--communicator-date">
                        {this.props.i18n.time.format(message.threadLatestMessageDate)}
                      </div>                
                    </div>
                    <div className="application-list__item-body">
                      <span className="text text--communicator-body">{message.caption}</span>
                    </div>
                    {message.labels ? <div className="application-list__item-footer">
                      <div className="text text--communicator-labels">{message.labels.map((label)=>{
                        return <span className="text text--communicator-label" key={label.id}>
                          <span className="text__icon text__icon--communicator-label icon-tag" style={{color: colorIntToHex(label.labelColor)}}></span>
                          <span>{label.labelName}</span>
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

function mapStateToProps(state: any){
  return {
    communicatorMessagesMessages: state.communicatorMessages.messages,
    communicatorMessagesHasMore: state.communicatorMessages.hasMore,
    communicatorMessagesState: state.communicatorMessages.state,
    communicatorMessagesSelected: state.communicatorMessages.selected,
    communicatorMessagesSelectedIds: state.communicatorMessages.selectedIds,
    communicatorMessagesCurrent: state.communicatorMessages.current,
    i18n: state.i18n,
    userId: state.status.userId
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return bindActionCreators(actions, dispatch);
};

export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(CommunicatorMessages);