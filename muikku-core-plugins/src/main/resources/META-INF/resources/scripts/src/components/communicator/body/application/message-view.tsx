import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import equals = require("deep-equal");

import Link from '~/components/general/link';
import {MessageThreadExpandedType, MessageThreadLabelListType} from '~/reducers/main-function/messages';
import {i18nType} from '~/reducers/base/i18n';
import TouchPager from '~/components/general/touch-pager';
import {StateType} from '~/reducers';
import Message from './message-view/message';
import { UserRecepientType, UserGroupRecepientType, WorkspaceRecepientType } from '~/reducers/main-function/user-index';

import '~/sass/elements/link.scss';
import '~/sass/elements/text.scss';
import '~/sass/elements/label.scss';
import '~/sass/elements/application-list.scss';
import '~/sass/elements/message.scss';

interface MessageViewProps {
  i18n: i18nType,
  currentThread: MessageThreadExpandedType
}

interface MessageViewState {
}

class MessageView extends React.Component<MessageViewProps, MessageViewState> {
  private initialXPos: number;
  private initialYPos: number;
  private closeInterval: NodeJS.Timer;
  
  constructor(props: MessageViewProps){
    super(props);
    
    this.loadMessage = this.loadMessage.bind(this);
  }
  loadMessage(messageId: number){
    if (history.replaceState){
      history.replaceState('', '', location.hash.split("/")[0] + "/" + messageId);
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    } else {
      location.hash = location.hash.split("/")[0] + "/" + messageId;
    }
  }
  render(){ 
    if (this.props.currentThread === null){
      return null;
    }
    return <TouchPager hasNext={!!this.props.currentThread.newerThreadId}
      hasPrev={!!this.props.currentThread.olderThreadId}
      goForward={this.loadMessage.bind(this, this.props.currentThread.newerThreadId)}
      goBackwards={this.loadMessage.bind(this, this.props.currentThread.olderThreadId)}>
        {this.props.currentThread.messages.map((message, index)=>{
          let labels:MessageThreadLabelListType = null;
          if (index === 0){
            labels = this.props.currentThread.labels;
          }
          return <Message key={message.id} message={message} labels={labels}/>
        })}
      </TouchPager>
  }
}

function mapStateToProps(state: StateType){
  return {
    currentThread: state.messages.currentThread,
    i18n: state.i18n
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessageView);