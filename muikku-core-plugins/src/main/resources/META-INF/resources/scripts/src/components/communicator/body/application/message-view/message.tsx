import NewMessage from '../../../dialogs/new-message';
import * as React from 'react';
import { MessageType, MessageThreadLabelListType } from '~/reducers/main-function/messages';
import Link from '~/components/general/link';
import { StateType } from '~/reducers';
import { i18nType } from '~/reducers/base/i18n';
import { connect, Dispatch } from 'react-redux';
import { UserRecepientType, UserGroupRecepientType, WorkspaceRecepientType, UserGroupType, SimpleUserType } from '~/reducers/user-index';
import { StatusType } from '~/reducers/base/status';
import { colorIntToHex, getName } from '~/util/modifiers';

import '~/sass/elements/rich-text.scss';
import '~/sass/elements/label.scss';
import '~/sass/elements/application-list.scss';

import '~/sass/elements/link.scss';
import { WorkspaceType } from '~/reducers/workspaces';

interface MessageProps {
  message: MessageType,
  status: StatusType,
  i18n: i18nType,
  labels?: MessageThreadLabelListType
}

interface MessageState {

}

class Message extends React.Component<MessageProps, MessageState> {
  constructor(props: MessageProps) {
    super(props);

    this.getMessageRecipients = this.getMessageRecipients.bind(this);
    this.getMessageSender = this.getMessageSender.bind(this);

  }
  getMessageSender(sender: SimpleUserType): any {
    if (sender.archived === true) {
      return <span key={sender.id} className="message__user-archived">{this.props.i18n.text.get("plugin.communicator.sender.archived")}</span>;
    }
    if (sender.studiesEnded === true) {
      return <span key={sender.id} className="message__user-studies-ended">{getName(sender as any, !this.props.status.isStudent)}</span>;
    }
    return <span key={sender.id}>{getName(sender as any, !this.props.status.isStudent)}</span>;
  }
  getMessageRecipients(message: MessageType): any {
    let messageRecipientsList = message.recipients.map((recipient) => {
      if (recipient.archived === true) {
        return <span key={recipient.recipientId} className="message__user-archived">{this.props.i18n.text.get("plugin.communicator.sender.archived")}</span>;
      }
      if (recipient.studiesEnded === true) {
        return <span key={recipient.recipientId} className="message__user-studies-ended">{getName(recipient as any, !this.props.status.isStudent)}</span>;
      }
      return <span key={recipient.recipientId}>{getName(recipient as any, !this.props.status.isStudent)}</span>;
    });

    let userGroupRecipientsList = message.userGroupRecipients.map((group) => {
      return <span>{group.name}</span>;
    });

    let workspaceRecipientsList = message.workspaceRecipients.filter((w, pos, self) => {
      return self.findIndex((w2) => w2.workspaceEntityId === w.workspaceEntityId) === pos;
    }).map((workspace) => {
      return <span>{workspace.workspaceName}</span>;
    });

    return [messageRecipientsList, userGroupRecipientsList, workspaceRecipientsList];
  }
  render() {
    // This is the sender of the message
    let senderObject: UserRecepientType = {
      type: "user",
      value: this.props.message.sender
    };

    // These are the receipients of the message
    let recipientsObject: Array<UserRecepientType> = this.props.message.recipients.map(( r ): UserRecepientType => ( {
      type: "user",
      value: {
        id: r.userEntityId,
        firstName: r.firstName,
        lastName: r.lastName,
        nickName: r.nickName,
        studiesEnded: r.studiesEnded,
        archived: r.archived
      }
    })).filter(user => user.value.id !== this.props.status.userId) // We are filtering the sender from the recepient, just in case
      .filter(user => user.value.studiesEnded !== true) // We are filtering recipient who has ended his studies
      .filter(user => user.value.archived !== true); // We are filtering recipient who has been archived

    // These are the usergroup recepients
    let userGroupObject: Array<UserGroupRecepientType> = this.props.message.userGroupRecipients.map((ug: any): UserGroupRecepientType => ( {
      type: "usergroup",
      value: ug
    }));

    let workspaceRecepientsFiltered = this.props.message.workspaceRecipients.filter((w, pos, self)=>{
      return self.findIndex((w2)=>w2.workspaceEntityId === w.workspaceEntityId) === pos;
    });

    // And the workspace recepients, sadly has to force it
    let workspaceObject: Array<WorkspaceRecepientType> = workspaceRecepientsFiltered.map((w): WorkspaceRecepientType => ({
      type: "workspace",
      value: ({
        id: w.workspaceEntityId,
        name: w.workspaceName,
      } as WorkspaceType)
    }));

    //The basic reply target is the sender
    let replytarget = [senderObject];
    if (senderObject.value.id === this.props.status.userId) {
      replytarget = [senderObject].concat(recipientsObject as any)
      .concat(this.props.status.permissions.COMMUNICATOR_GROUP_MESSAGING ? userGroupObject as any : [])
      .concat(this.props.status.permissions.COMMUNICATOR_GROUP_MESSAGING ? workspaceObject as any : [])
      .filter((t)=>t.value.id !== this.props.status.userId);
    }
    let replyalltarget = [senderObject].concat(recipientsObject as any)
    .concat(this.props.status.permissions.COMMUNICATOR_GROUP_MESSAGING ? userGroupObject as any : [])
    .concat(this.props.status.permissions.COMMUNICATOR_GROUP_MESSAGING ? workspaceObject as any : [])
    .filter((t)=>t.value.id !== senderObject.value.id)
    .concat(senderObject as any).filter((t)=>t.value.id !== this.props.status.userId);

    return <div className="application-list__item application-list__item--communicator-message">
      <div className="application-list__item-header application-list__item-header--communicator-message-thread">
        <div className="application-list__item-meta">
          <div className="application-list__item-header-main application-list__item-header-main--communicator-message-participants">
            <span className="application-list__item-header-main-content application-list__item-header-main-content--communicator-sender" aria-label={this.props.i18n.text.get("plugin.wcag.messageSender.aria.label")}>
              {this.getMessageSender(this.props.message.sender)}
            </span>
            <span className="application-list__item-header-main-content application-list__item-header-main-content--communicator-recipients" aria-label={this.props.i18n.text.get("plugin.wcag.messageRecipients.aria.label")}>
              {this.getMessageRecipients(this.props.message)}
            </span>
          </div>
          <div className="application-list__item-header-aside application-list__item-header-aside--communicator-message-time">
            <span aria-label={this.props.i18n.text.get("plugin.wcag.messageSendDate.aria.label")}>{this.props.i18n.time.format(this.props.message.created)}</span>
          </div>
        </div>
        {this.props.labels && this.props.labels.length ? <div className="labels labels--communicator-message">
          {this.props.labels && this.props.labels.map((label)=>{
            return <span className="label" key={label.id} aria-label={this.props.i18n.text.get("plugin.wcag.messageLabel.aria.label")}>
              <span className="label__icon icon-tag" style={{color: colorIntToHex(label.labelColor)}}></span>
              <span className="label__text">{label.labelName}</span>
            </span>
          })}
        </div> : null}
      </div>
      <div className="application-list__item-body application-list__item-body--communicator-message-thread" aria-label={this.props.i18n.text.get("plugin.wcag.messageContent.aria.label")}>
        <header className="application-list__item-content-header">{this.props.message.caption}</header>
        <section className="application-list__item-content-body rich-text" dangerouslySetInnerHTML={{__html: this.props.message.content}}></section>
        <footer className="application-list__item-footer application-list__item-footer--communicator-message-thread-actions">
          {this.props.message.sender.studiesEnded || this.props.message.sender.archived ? null :
            <NewMessage replyThreadId={this.props.message.communicatorMessageId} messageId={this.props.message.id}
              initialSelectedItems={replytarget}
              initialSubject={this.props.i18n.text.get('plugin.communicator.createmessage.title.replySubject', this.props.message.caption)}>
              <Link tabIndex={0} className="link link--application-list-item-footer">{this.props.i18n.text.get('plugin.communicator.reply')}</Link>
            </NewMessage>
          }
          {this.props.message.sender.studiesEnded || this.props.message.sender.archived ? null :
            <NewMessage replyThreadId={this.props.message.communicatorMessageId} messageId={this.props.message.id}
              initialSelectedItems={replyalltarget} replyToAll
              initialSubject={this.props.i18n.text.get('plugin.communicator.createmessage.title.replySubject', this.props.message.caption)}>
              <Link tabIndex={0} className="link link--application-list-item-footer">{this.props.i18n.text.get('plugin.communicator.replyAll')}</Link>
            </NewMessage>
          }
        </footer>
      </div>
    </div>
  }
}

function mapStateToProps( state: StateType ) {
  return {
    i18n: state.i18n,
    status: state.status
  }
};

function mapDispatchToProps( dispatch: Dispatch<any> ) {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Message);
