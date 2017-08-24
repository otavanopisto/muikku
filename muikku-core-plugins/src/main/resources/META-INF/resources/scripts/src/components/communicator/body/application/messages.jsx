import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {colorIntToHex} from '~/util/modifiers';

import actions from '~/actions/main-function/communicator/communicator-messages';

class CommunicatorMessages extends React.Component {
  constructor(props){
    super(props);
    
    this.touchModeTimeout = null;
    this.firstWasJustSelected = false;
    this.state = {
      touchMode: false
    }
    
    this.toggleMessageSelection = this.toggleMessageSelection.bind(this);
  }
  onTouchStartMessage(message){
    if (!this.state.touchMode){
      this.touchModeTimeout = setTimeout(()=>{
        this.toggleMessageSelection(message);
        this.firstWasJustSelected = true;
        this.setState({
          touchMode: true
        });
      }, 300);
    }
  }
  onTouchEndMessage(message){
    clearTimeout(this.touchModeTimeout);
    if (this.state.touchMode && !this.firstWasJustSelected){
      let isSelected = this.toggleMessageSelection(message);
      if (isSelected && this.props.communicatorMessages.selectedIds.length === 1){
        this.setState({
          touchMode: false
        });
      }
    } else if (this.firstWasJustSelected){
      this.firstWasJustSelected = false;
    }
  }
  toggleMessageSelection(message){
    let isSelected = this.props.communicatorMessages.selectedIds.includes(message.id);
    if (isSelected){
      this.props.removeFromCommunicatorSelectedMessages(message)
    } else {
      this.props.addToCommunicatorSelectedMessages(message);
    }
    return isSelected;
  }
  render(){
    if (this.props.communicatorMessages.state === "WAIT"){
      return null;
    } else if (this.props.communicatorMessages.state === "ERROR"){
      //TODO: put a translation here please! this happens when messages fail to load, a notification shows with the error
      //message but here we got to put something
      return <div className="empty"><span>{"ERROR"}</span></div>
    } else if (this.props.communicatorMessages.messages.length === 0){
      return <div className="empty"><span>{this.props.i18n.text.get("plugin.communicator.empty.topic")}</span></div>
    }
    
    return <div className={`communicator application-list ${this.state.touchMode ? "application-list-select-mode" : ""}`}>{
      this.props.communicatorMessages.messages.map((message, index)=>{
        let isSelected = this.props.communicatorMessages.selectedIds.includes(message.id);
        return <div key={message.id}
          className={`application-list-item ${message.unreadMessagesInThread ? "communicator-application-list-item-unread" : ""} ${isSelected ? "selected" : ""}`}
          onTouchStart={this.onTouchStartMessage.bind(this, message)} onTouchEnd={this.onTouchEndMessage.bind(this, message)}>
          <div className="application-list-item-header">
            <input type="checkbox" checked={isSelected} onClick={this.toggleMessageSelection.bind(this, message)}/>
            <span className="communicator text communicator-text-username">
              {message.sender.firstName ? message.sender.firstName + " " : ""}{message.sender.lastName ? message.sender.lastName : ""}
            </span>
            <span className="communicator-application-list-item-labels">{message.labels.map((label)=>{
              return <span className="communicator text communicator-text-tag" key={label.id}>
                <span className="icon icon-tag" style={{color: colorIntToHex(label.labelColor)}}></span>
                {label.labelName}
              </span>
            })}</span>
            {message.messageCountInthread ? <span className="communicator text communicator-text-counter">
              {message.messageCountInthread}
            </span> : null}
            <span className="communicator text communicator-text-date">
              {this.props.i18n.time.format(message.threadLatestMessageDate)}
            </span>
          </div>
          <div className="application-list-item-body">
            <span className="communicator text communicator-text-body">{message.caption}</span>
          </div>
        </div>
      })
    }</div>
  }
}

function mapStateToProps(state){
  return {
    communicatorMessages: state.communicatorMessages,
    i18n: state.i18n
  }
};

const mapDispatchToProps = (dispatch)=>{
  return bindActionCreators(actions, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommunicatorMessages);