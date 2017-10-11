import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import {colorIntToHex} from '~/util/modifiers';
import equals = require("deep-equal");

import actions from '~/actions/main-function/communicator/communicator-messages';

import {LoadMoreMessagesTriggerType, RemoveFromCommunicatorSelectedMessagesTriggerType, AddToCommunicatorSelectedMessagesTriggerType} from '~/actions/main-function/communicator/communicator-messages';
import {CommunicatorMessageListType, CommunicatorStateType, CommunicatorMessageType, CommunicatorMessageRecepientType} from '~/reducers/main-function/communicator/communicator-messages';
import {i18nType} from '~/reducers/base/i18n';

import '~/sass/elements/empty.scss';
import '~/sass/elements/loaders.scss';
import '~/sass/elements/application-list.scss';
import '~/sass/elements/text.scss';

function getMessageUserNames(message:CommunicatorMessageType, userId: number):string {
  if (message.senderId !== userId || !message.recipients){
    if (message.senderId === userId){
      //TODO Ukkonen translate this
      return "me";
    }
    return (message.sender.firstName ? message.sender.firstName + " " : "")+(message.sender.lastName ? message.sender.lastName : "");
  }
  
  return message.recipients.map((recipient: CommunicatorMessageRecepientType)=>{
    if (recipient.userId === userId){
      //TODO Ukkonen translate this
      return "me";
    }
    return (recipient.firstName ? recipient.firstName + " " : "")+(recipient.lastName ? recipient.lastName : "");
  }).join(", ");
}

interface CommunicatorMessagesProps {
  communicatorMessagesSelected: CommunicatorMessageListType,
  communicatorMessagesHasMore: boolean,
  communicatorMessagesState: CommunicatorStateType,
  communicatorMessagesSelectedIds: Array<number>,
  communicatorMessagesMessages: CommunicatorMessageListType,
  loadMoreMessages: LoadMoreMessagesTriggerType,
  removeFromCommunicatorSelectedMessages: RemoveFromCommunicatorSelectedMessagesTriggerType,
  addToCommunicatorSelectedMessages: AddToCommunicatorSelectedMessagesTriggerType,
  i18n: i18nType,
  userId: number
}

interface CommunicatorMessagesState {
  touchMode: boolean
}

class CommunicatorMessages extends React.Component<CommunicatorMessagesProps, CommunicatorMessagesState> {
  private touchModeTimeout: NodeJS.Timer;
  private firstWasJustSelected: boolean;
  private initialXPos: number;
  private initialYPos: number;
  private lastXPos: number;
  private lastYPos: number;
  private cancelSelection: boolean;
  private initialTime: number;
  
  constructor(props: CommunicatorMessagesProps){
    super(props);
    
    this.touchModeTimeout = null;
    this.firstWasJustSelected = false;
    this.state = {
      touchMode: false
    }
    
    this.toggleMessageSelection = this.toggleMessageSelection.bind(this);
    this.onTouchStartMessage = this.onTouchStartMessage.bind(this);
    this.onTouchEndMessage = this.onTouchEndMessage.bind(this);
    this.onTouchMoveMessage = this.onTouchMoveMessage.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.checkCanLoadMore = this.checkCanLoadMore.bind(this);
    this.onContextMenu = this.onContextMenu.bind(this);
    this.setCurrentMessage = this.setCurrentMessage.bind(this);
    this.onCheckBoxChange = this.onCheckBoxChange.bind(this);
    this.onCheckBoxClick = this.onCheckBoxClick.bind(this);
    
    this.initialXPos = null;
    this.initialYPos = null;
    this.lastXPos = null;
    this.lastYPos = null;
    this.cancelSelection = false;
    this.initialTime = null;
  }
  onMessageClick(message: CommunicatorMessageType){
    if (this.props.communicatorMessagesSelected.length === 0){
      this.setCurrentMessage(message);
    }
  }
  setCurrentMessage(message: CommunicatorMessageType){
    window.location.hash = window.location.hash.split("/")[0] + "/" + message.communicatorMessageId;
  }
  checkCanLoadMore(){
    if (this.props.communicatorMessagesState === "READY" && this.props.communicatorMessagesHasMore){
      let list:HTMLElement = this.refs["list"] as HTMLElement;
      let scrollBottomRemaining = list.scrollHeight - (list.scrollTop + list.offsetHeight)
      if (scrollBottomRemaining <= 100){
        this.props.loadMoreMessages();
      }
    }
  }
  onCheckBoxChange(message: CommunicatorMessageType, e: React.MouseEvent<any>){
    this.toggleMessageSelection(message);
  }
  onCheckBoxClick(e: React.MouseEvent<any>){
    e.stopPropagation();
  }
  onTouchStartMessage(message: CommunicatorMessageType, e: React.TouchEvent<any>){
    if (!this.state.touchMode){
      this.touchModeTimeout = setTimeout(()=>{
        this.toggleMessageSelection(message);
        this.firstWasJustSelected = true;
        this.setState({
          touchMode: true
        });
      }, 600);
    }
    this.cancelSelection = false;
    this.initialXPos = e.touches[0].pageX;
    this.initialYPos = e.touches[0].pageY;
    this.initialTime = (new Date()).getTime();
  }
  onTouchMoveMessage(message: CommunicatorMessageType, e: React.TouchEvent<any>){
    this.lastXPos = e.touches[0].pageX;
    this.lastYPos = e.touches[0].pageY;
    
    if (Math.abs(this.initialXPos - this.lastXPos) >= 5 || Math.abs(this.initialYPos - this.lastYPos) >= 5){
      clearTimeout(this.touchModeTimeout);
      this.cancelSelection = true;
    }
  }
  onTouchEndMessage(message: CommunicatorMessageType, e: React.TouchEvent<any>){
    clearTimeout(this.touchModeTimeout);
    
    if (this.cancelSelection){
      return;
    }
    
    let currentTime = (new Date()).getTime();
    if (currentTime - this.initialTime <= 300 && !this.state.touchMode){
      this.setCurrentMessage(message);
      return;
    }
    
    if (this.state.touchMode && !this.firstWasJustSelected){
      let isSelected = this.toggleMessageSelection(message);
      if (isSelected && this.props.communicatorMessagesSelectedIds.length === 1){
        this.setState({
          touchMode: false
        });
      }
    } else if (this.firstWasJustSelected){
      this.firstWasJustSelected = false;
    }
  }
  onContextMenu(e: React.MouseEvent<any>){
    e.preventDefault();
    e.stopPropagation();
  }
  toggleMessageSelection(message: CommunicatorMessageType){
    let isSelected = this.props.communicatorMessagesSelectedIds.includes(message.communicatorMessageId);
    if (isSelected){
      this.props.removeFromCommunicatorSelectedMessages(message)
    } else {
      this.props.addToCommunicatorSelectedMessages(message);
    }
    return isSelected;
  }
  componentWillReceiveProps(nextProps: CommunicatorMessagesProps){
    if (nextProps.communicatorMessagesState === "LOADING"){
      this.setState({
        touchMode: false
      });
    }
  }
  componentDidUpdate(){
    if (this.props.communicatorMessagesState === "READY" && this.props.communicatorMessagesHasMore){
      let list:HTMLElement = this.refs["list"] as HTMLElement;
      let doesNotHaveScrollBar = list.scrollHeight === list.offsetHeight;
      if (doesNotHaveScrollBar){
        this.props.loadMoreMessages();
      }
    }
    this.checkCanLoadMore();
  }
  onScroll(e: React.UIEvent<any>){
    this.checkCanLoadMore();
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
    
    return <div className={`application-list application-list--communicator-messages ${this.state.touchMode ? "application-list--select-mode" : ""}`}
     ref="list" onScroll={this.onScroll}>{
      this.props.communicatorMessagesMessages.map((message: CommunicatorMessageType, index: number)=>{
        let isSelected = this.props.communicatorMessagesSelectedIds.includes(message.communicatorMessageId);
        return (
          <div key={message.communicatorMessageId} className={`application-list__item ${message.unreadMessagesInThread ? "application-list__item--communicator-unread" : ""} ${isSelected ? "selected" : ""}`}
            onTouchStart={this.onTouchStartMessage.bind(this, message)} onTouchEnd={this.onTouchEndMessage.bind(this, message)} onTouchMove={this.onTouchMoveMessage.bind(this, message)} 
            onClick={this.onMessageClick.bind(this, message)} onContextMenu={this.onContextMenu}>
            <div className="application-list__item__header">
            <input type="checkbox" checked={isSelected} onChange={this.onCheckBoxChange.bind(this, message)} onClick={this.onCheckBoxClick}/>
            <div className="text text--communicator-usernames">
              <span className="text text--communicator-username">{getMessageUserNames(message, this.props.userId)}</span>
            </div>
            {message.messageCountInThread > 1 ? <div className="text text--communicator-counter">
              {message.messageCountInThread}
            </div> : null}
            <div className="text text--communicator-date">
              {this.props.i18n.time.format(message.threadLatestMessageDate)}
            </div>                
          </div>
          <div className="application-list__item__body">
            <span className="text text--communicator-body">{message.caption}</span>
          </div>
          <div className="application-list__item__footer">
            <div className="text text--communicator-labels">{message.labels.map((label)=>{
              return <span className="text text--communicator-label" key={label.id}>
                <span className="icon icon-tag" style={{color: colorIntToHex(label.labelColor)}}></span>
                <span>{label.labelName}</span>
              </span>
            })}</div>            
          </div>                      
        </div>
       )
      })
    }{
      this.props.communicatorMessagesState === "LOADING_MORE" ? 
        <div className="application-list__item loader-empty"/>
    : null}</div>
  }
}

function mapStateToProps(state: any){
  return {
    communicatorMessagesMessages: state.communicatorMessages.messages,
    communicatorMessagesHasMore: state.communicatorMessages.hasMore,
    communicatorMessagesState: state.communicatorMessages.state,
    communicatorMessagesSelected: state.communicatorMessages.selected,
    communicatorMessagesSelectedIds: state.communicatorMessages.selectedIds,
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