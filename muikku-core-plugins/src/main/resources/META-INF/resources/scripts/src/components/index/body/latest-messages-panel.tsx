import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import Link from '../../general/link';
import {MessageThreadListType} from '~/reducers/main-function/messages';
import {i18nType} from '~/reducers/base/i18n';
import {StateType} from '~/reducers';
import Panel from '~/components/general/panel';

interface LastMessagesPanelProps {
  i18n: i18nType,
  lastThreads: MessageThreadListType
}

interface LastMessagesPanelState {
  
}

class LastMessagesPanel extends React.Component<LastMessagesPanelProps, LastMessagesPanelState> {
  render(){
    return (<div className="ordered-container__item ordered-container__item--index-panel-container ordered-container__item--latest-messages">
      <div className="ordered-container__item-header">
        <span className="ordered-container__item-header-icon ordered-container__item-header-icon--latest-messages icon-envelope"></span>
        <span className="ordered-container__item-header-text">{this.props.i18n.text.get('plugin.frontPage.latestMessages.title')}</span>
      </div>
      <Panel modifier="index">
        {this.props.lastThreads.length ? (
          <div className="item-list item-list--panel-latest-messages">
            {this.props.lastThreads.map((thread)=>{
              return (<Link key={thread.id} className={`item-list__item item-list__item--latest-messages ${thread.unreadMessagesInThread ? "item-list__item--unread" : ""}`}
                      to={`/communicator#inbox/${thread.communicatorMessageId}?f`}>
                <span className={`item-list__icon item-list__icon--latest-messages icon-envelope${thread.unreadMessagesInThread ? "-alt" : ""}`}></span>
                <span className="item-list__text-body item-list__text-body--multiline">
                  <span className="item-list__latest-message-caption">
                    {thread.caption}
                  </span>
                  <span className="item-list__latest-message-date">
                    {this.props.i18n.time.format(thread.created)}
                  </span>
                </span>
              </Link>);
            })}
          </div>
          ) : (
            <div className="panel__empty">{this.props.i18n.text.get("plugin.frontPage.latestMessages.noMessages")}</div>
          )}
      </Panel>
    </div>);
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    lastThreads: state.messages.threads
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LastMessagesPanel);