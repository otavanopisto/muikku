import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import Link from '../../general/link';
import {CommunicatorMessageListType, CommunicatorMessageType} from '~/reducers/main-function/communicator/communicator-messages';
import {i18nType} from '~/reducers/base/i18n';

interface LastMessagesPanelProps {
  i18n: i18nType,
  lastMessages: CommunicatorMessageListType
}

interface LastMessagesPanelState {
  
}

class LastMessagesPanel extends React.Component<LastMessagesPanelProps, LastMessagesPanelState> {
  render(){
    return (<div className="ordered-container-item index panel">
      <div className="index text index-text-for-panels-title index-text-for-panels-title-last-messages">
        <span className="icon icon-envelope"></span>
        <span>{this.props.i18n.text.get('plugin.frontPage.communicator.lastMessages')}</span>
      </div>
      {this.props.lastMessages ? (
        <div className="index item-list index-item-list-panel-last-messages">
          {this.props.lastMessages.map((message: CommunicatorMessageType)=>{
            return (<Link key={message.id} className={`item-list-item ${message.unreadMessagesInThread ? "item-list-item-unread" : ""}`}
                    href={`/communicator#inbox/${message.communicatorMessageId}`}>
              <span className={`icon icon-envelope${message.unreadMessagesInThread ? "-alt" : ""}`}></span>
              <span className="text item-list-text-body item-list-text-body-multiline">
                {message.caption}
                <span className="index text index-text-last-message-date">
                  {this.props.i18n.time.format(message.created)}
                </span>
              </span>
            </Link>);
          })}
        </div>
      ) : (
        <div className="index text index-text-panel-no-last-messages">{this.props.i18n.text.get("plugin.frontPage.messages.noMessages")}</div>
      )}
    </div>);
  }
}

function mapStateToProps(state: any){
  return {
    i18n: state.i18n,
    lastMessages: state.lastMessages
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(LastMessagesPanel);