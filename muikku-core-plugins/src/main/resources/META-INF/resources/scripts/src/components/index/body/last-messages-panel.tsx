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
    return (<div className="ordered-container__item">
      <div className="text text--for-panels-title text--for-panels-title--last-messages">
        <span className="text__panel-icon text__panel-icon--last-messages icon-envelope"></span>
        <span className="text__panel-title">{this.props.i18n.text.get('plugin.frontPage.communicator.lastMessages')}</span>
      </div>
      <div className="panel panel--index">
        {this.props.lastMessages ? (
          <div className="item-list item-list--panel-last-messages">
            {this.props.lastMessages.map((message: CommunicatorMessageType)=>{
              return (<Link key={message.id} className={`item-list__item ${message.unreadMessagesInThread ? "item-list__item--unread" : ""}`}
                      href={`/communicator#inbox/${message.communicatorMessageId}`}>
                <span className={`item-list__icon icon-envelope${message.unreadMessagesInThread ? "-alt" : ""}`}></span>
                <span className="text item-list__text-body item-list__text-body--multiline">
                  {message.caption}
                  <span className="text text--last-message-date">
                    {this.props.i18n.time.format(message.created)}
                  </span>
                </span>
              </Link>);
            })}
          </div>
          ) : (
            <div className="text text--panel-nothing">{this.props.i18n.text.get("plugin.frontPage.messages.noMessages")}</div>
          )}
      </div>
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