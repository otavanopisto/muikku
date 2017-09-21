import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import equals = require("deep-equal");

import actions from '~/actions/main-function/communicator/communicator-messages';

import Link from '~/components/general/link';
import NewMessage from './new-message';

class MessageView extends React.Component {
  constructor(props){
    super(props);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.loadMessage = this.loadMessage.bind(this);
    this.initialXPos = null;
    this.initialYPos = null;
    this.closeInterval = null;
    
    this.state = {
      drag: 0
    }
  }
  loadMessage(messageId){
    if (history.replaceState){
      history.replaceState('', '', location.hash.split("/")[0] + "/" + messageId);
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    } else {
      location.hash = location.hash.split("/")[0] + "/" + messageId;
    }
  }
  componentWillReceiveProps(nextProps){
    if (!equals(nextProps.communicatorMessagesCurrent, this.props.communicatorMessagesCurrent)){
      this.setState({
        drag: 0
      });
    }
  }
  onTouchStart(e){
    this.initialXPos = e.touches[0].pageX;
    this.initialYPos = e.touches[0].pageY;
    clearInterval(this.closeInterval);
  }
  onTouchMove(e){
    let diff = this.initialXPos - e.touches[0].pageX;
    if (!this.props.communicatorMessagesCurrent.newerThreadId && diff > 0){
      diff = 0;
    } else if (!this.props.communicatorMessagesCurrent.olderThreadId && diff < 0){
      diff = 0;
    } else if (this.refs.centerContainer.offsetWidth < Math.abs(diff)){
      diff = Math.sign(diff)*this.refs.centerContainer.offsetWidth;
    }
    this.setState({
      drag: -diff
    });
  }
  onTouchEnd(e){
    let allDrag = Math.abs(this.state.drag);
    let totalDrag = this.refs.centerContainer.offsetWidth;
    let sign = Math.sign(this.state.drag);
    
    let closeToNext = allDrag >= totalDrag/3;
    this.closeInterval = setInterval(()=>{
      let absoluteDrag = Math.abs(this.state.drag);
      if (absoluteDrag === (closeToNext ? totalDrag : 0)){
        clearTimeout(this.closeInterval);
        if (closeToNext){
          let nextLoadMessage = sign === -1 ? this.props.communicatorMessagesCurrent.newerThreadId : this.props.communicatorMessagesCurrent.olderThreadId;
          this.loadMessage(nextLoadMessage);
        }
        return;
      }
      let newValue = closeToNext ? (absoluteDrag + (absoluteDrag/10)) : (absoluteDrag - (allDrag/10));
      if (!closeToNext && newValue < 0){
        newValue = 0;
      } else if (closeToNext && newValue > totalDrag){
        newValue = totalDrag;
      }
      this.setState({
        drag: sign*newValue
      });
    }, 10);
  }
  render(){ 
    if (this.props.communicatorMessagesCurrent === null){
      return null;
    }
    return <div className="communicator container communicator-container-message-view" onTouchStart={this.onTouchStart} onTouchMove={this.onTouchMove} onTouchEnd={this.onTouchEnd}>
      <div className="communicator container communicator-container-message" style={{right: "100%", transform: `translateX(${this.state.drag}px)`}}></div>
      <div ref="centerContainer" className="communicator application-list communicator-application-list-message-view container communicator-container-message communicator-container-message-center" style={{transform: `translateX(${this.state.drag}px)`}}>
        {this.props.communicatorMessagesCurrent.messages.map((message)=>{
          let senderObject = {
            type: "user",
            value: message.sender
          };
          let recipientsObject = message.recipients.map(r=>({
            type: "user",
            value: {
              id: r.userId,
              firstName: r.firstName,
              lastName: r.lastName,
              nickName: r.nickName
            }
          })).filter(user=>user.id !== this.props.status.userId);
          let userGroupObject = message.userGroupRecipients.map(ug=>({
            type: "usergroup",
            value: ug
          }));
          let workspaceObject = message.workspaceRecipients.map(w=>({
            type: "usergroup",
            value: w
          }));
          return (
            <div key={message.id} className="application-list-item text">            
              <div className="application-list-item-header">
                <div className="communicator-message-participants">
                  <span className="communicator-message-sender">{message.sender.firstName  ? message.sender.firstName +  " " : ""} {message.sender.lastName ? message.sender.lastName : ""}</span>
                  <span className="communicator-message-recipients">
                    {message.recipients.map((recipient) => {
                        return (
                          <span className="communicator-message-recipient" key={recipient.recipientId}>
                            {recipient.firstName ? recipient.firstName + " " : ""} {recipient.lastName ? recipient.lastName + " " : ""}
                          </span>
                        )
                    })}
                  </span>
                  <span className="communicator-message-created">{this.props.i18n.time.format(message.created)}</span>
                </div>
                <div className="communicator-message-labels">
                  {/* TODO: labels are outside of the message object
                  {message.labels.map((label)=>{
                    return <span className="communicator text communicator-text-tag" key={label.id}>
                      <span className="icon icon-tag" style={{color: colorIntToHex(label.labelColor)}}></span>
                      {label.labelName}
                    </span>
                  })} 
                  */}                 
                </div>  
              </div>                  
              <div className="application-list-item-body">
                <header>{message.caption}</header>
                <section dangerouslySetInnerHTML={{ __html: message.content}}></section>
              </div>
              <div className="application-list-item-footer">
                 <NewMessage replyThreadId={message.communicatorMessageId} initialSelectedItems={[senderObject]}>
                   <Link>{this.props.i18n.text.get('plugin.communicator.reply')}</Link>
                 </NewMessage>
                 <NewMessage replyThreadId={message.communicatorMessageId}
                   initialSelectedItems={[senderObject].concat(recipientsObject).concat(userGroupObject).concat(workspaceObject)}>
                   <Link>{this.props.i18n.text.get('plugin.communicator.replyAll')}</Link>
                 </NewMessage>
              </div>                
            </div>
          )
        })}
      </div>
      <div className="communicator container communicator-container-message" style={{left: "100%", transform: `translateX(${this.state.drag}px)`}}></div>
    </div>
  }
}

function mapStateToProps(state){
  return {
    communicatorMessagesCurrent: state.communicatorMessages.current,
    i18n: state.i18n,
    status: state.status
  }
};

const mapDispatchToProps = (dispatch)=>{
  return bindActionCreators(actions, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessageView);