import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { colorIntToHex, getName } from '~/util/modifiers';
import equals = require("deep-equal");

import { i18nType } from '~/reducers/base/i18n';
import { StateType } from '~/reducers';

import '~/sass/elements/empty.scss';
import '~/sass/elements/loaders.scss';
import '~/sass/elements/application-list.scss';

import '~/sass/elements/label.scss';
import '~/sass/elements/message.scss';

import BodyScrollLoader from '~/components/general/body-scroll-loader';
import BodyScrollKeeper from '~/components/general/body-scroll-keeper';
import SelectableList from '~/components/general/selectable-list';
import { loadMoreMessageThreads, removeFromMessagesSelectedThreads, addToMessagesSelectedThreads, LoadMoreMessageThreadsTriggerType, RemoveFromMessagesSelectedThreadsTriggerType, AddToMessagesSelectedThreadsTriggerType } from '~/actions/main-function/messages';
import { MessageThreadListType, MessagesStateType, MessageThreadExpandedType, MessageThreadType, MessagesType, MessageSearchResult } from '~/reducers/main-function/messages';
import ApplicationList, { ApplicationListItemContentWrapper, ApplicationListItemHeader, ApplicationListItemBody, ApplicationListItemFooter, ApplicationListItem } from '~/components/general/application-list';
import { StatusType } from '~/reducers/base/status';


interface CommunicatorMessagesProps {
  threads: MessageThreadListType,
  hasMore: boolean,
  state: MessagesStateType,
  searchMessages: MessageSearchResult[],
  selectedThreads: MessageThreadListType,
  selectedThreadsIds: Array<number>,
  currentThread: MessageThreadExpandedType,
  messages: MessagesType,

  loadMoreMessageThreads: LoadMoreMessageThreadsTriggerType,
  removeFromMessagesSelectedThreads: RemoveFromMessagesSelectedThreadsTriggerType,
  addToMessagesSelectedThreads: AddToMessagesSelectedThreadsTriggerType,

  i18n: i18nType,
  status: StatusType
}

interface CommunicatorMessagesState {
}

class CommunicatorMessages extends BodyScrollLoader<CommunicatorMessagesProps, CommunicatorMessagesState> {
  constructor(props: CommunicatorMessagesProps) {
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
  getThreadUserNames(thread: MessageThreadType, userId: number): string {
    if (thread.senderId !== userId || !thread.recipients) {
      if (thread.senderId === userId) {
        return this.props.i18n.text.get("plugin.communicator.sender.self");
      }
      return getName(thread.sender, !this.props.status.isStudent);
    }

    return thread.recipients.map((recipient) => {
      if (recipient.userId === userId) {
        return this.props.i18n.text.get("plugin.communicator.sender.self");
      }
      return getName(recipient as any, !this.props.status.isStudent);
    })
      .concat(thread.userGroupRecipients.map(group => group.name))
      .concat(thread.workspaceRecipients.filter((w, pos, self) => {
        return self.findIndex((w2) => w2.workspaceEntityId === w.workspaceEntityId) === pos;
      }).map(workspace => workspace.workspaceName))
      .join(", ");
  }
  setCurrentThread(threadOrSearchResult: MessageThreadType | MessageSearchResult) {
    window.location.hash = window.location.hash.split("/")[0] + "/" + threadOrSearchResult.communicatorMessageId;
  }
  render() {
    if (this.props.state === "LOADING") {
      return null;
    } else if (this.props.state === "ERROR") {
      //TODO: put a translation here please! this happens when messages fail to load, a notification shows with the error
      //message but here we got to put something
      return <div className="empty"><span>{"ERROR"}</span></div>
    } else if (this.props.threads.length === 0 && !this.props.currentThread) {
      return <div className="empty"><span>{this.props.i18n.text.get("plugin.communicator.empty.topic")}</span></div>
    }

    if (this.props.searchMessages) {
      return <BodyScrollKeeper hidden={!!this.props.currentThread}>
        {this.props.searchMessages.map((message) => {
          return <ApplicationListItem
            key={message.id}
            className={`message message--search-result ${!message.readByReceiver ? "application-list__item--highlight" : ""}`}
            onClick={this.setCurrentThread.bind(this, message)}>
            <ApplicationListItemHeader modifiers="communicator-message">
              <div className={`application-list__header-primary`}>
                <span className="application-list__header-primary-sender">{message.sender.firstName} {message.sender.nickName && '"' + message.sender.nickName + '"'} {message.sender.lastName}</span>
                <span className="application-list__header-primary-recipients">{message.recipients.map((recipient) => {
                  return (
                    <span className="application-list__header-primary-recipient" key={recipient.userEntityId}>
                      {recipient.displayName}
                    </span>
                  )
                })}</span>
              </div>
              <div className="application-list__header-item-date">
                {this.props.i18n.time.format(message.created)}
              </div>
            </ApplicationListItemHeader>
            <ApplicationListItemBody modifiers="communicator-message">
              <span className="application-list__header-item-body">{message.caption}</span>
            </ApplicationListItemBody>
            {message.labels.length ? <ApplicationListItemFooter modifiers="communicator-message-labels">
              <div className="labels">{message.labels.map((label) => {
                return <span className="label" key={label.id}>
                  <span className="label__icon icon-tag" style={{ color: colorIntToHex(label.labelColor) }}></span>
                  <span className="label__text">{label.labelName}</span>
                </span>
              })}</div>
            </ApplicationListItemFooter> : null}
          </ApplicationListItem>
        })}
      </BodyScrollKeeper>
    }

    return <BodyScrollKeeper hidden={!!this.props.currentThread}>
      <SelectableList as={ApplicationList} selectModeModifiers="select-mode"
        extra={this.props.state === "LOADING_MORE" ?
          <div className="application-list__item loader-empty" />
          : null} dataState={this.props.state}>
        {this.props.threads.map((thread, index: number) => {
          let isSelected: boolean = this.props.selectedThreadsIds.includes(thread.communicatorMessageId);
          return {
            as: ApplicationListItem,
            className: `message ${thread.unreadMessagesInThread ? "application-list__item--highlight" : ""}`,
            onSelect: this.props.addToMessagesSelectedThreads.bind(null, thread),
            onDeselect: this.props.removeFromMessagesSelectedThreads.bind(null, thread),
            onEnter: this.setCurrentThread.bind(this, thread),
            isSelected,
            key: thread.communicatorMessageId,
            contents: (checkbox: React.ReactElement<any>) => {
              return <ApplicationListItemContentWrapper aside={<div className="message__select-container">
                {checkbox}
              </div>}>
                <ApplicationListItemHeader modifiers="communicator-message">
                  <div className={`application-list__header-primary ${thread.unreadMessagesInThread ? "application-list__header-primary--highlight" : ""}`}>
                    <span>{this.getThreadUserNames(thread, this.props.status.userId)}</span>
                  </div>
                  {thread.messageCountInThread > 1 ? <div className="application-list__item-counter">
                    {thread.messageCountInThread}
                  </div> : null}
                  <div className="application-list__header-item-date">
                    {this.props.i18n.time.format(thread.threadLatestMessageDate)}
                  </div>
                </ApplicationListItemHeader>
                <ApplicationListItemBody modifiers="communicator-message">
                  <span className="application-list__header-item-body">{thread.caption}</span>
                </ApplicationListItemBody>
                {thread.labels.length ? <ApplicationListItemFooter modifiers="communicator-message-labels">
                  <div className="labels">{thread.labels.map((label) => {
                    return <span className="label" key={label.id}>
                      <span className="label__icon icon-tag" style={{ color: colorIntToHex(label.labelColor) }}></span>
                      <span className="label__text">{label.labelName}</span>
                    </span>
                  })}</div>
                </ApplicationListItemFooter> : null}
              </ApplicationListItemContentWrapper>
            }
          }
        })
        }
      </SelectableList></BodyScrollKeeper>
  }
}

function mapStateToProps(state: StateType) {
  return {
    threads: state.messages.threads,
    searchMessages: state.messages.searchMessages,
    hasMore: state.messages.hasMore,
    state: state.messages.state,
    selectedThreads: state.messages.selectedThreads,
    selectedThreadsIds: state.messages.selectedThreadsIds,
    currentThread: state.messages.currentThread,
    messages: state.messages,
    i18n: state.i18n,
    status: state.status
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>) {
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
