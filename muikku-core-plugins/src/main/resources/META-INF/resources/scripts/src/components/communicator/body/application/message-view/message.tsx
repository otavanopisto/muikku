import NewMessage from '../../../dialogs/new-message';
import * as React from 'react';
import { MessageType, MessageThreadLabelListType } from '~/reducers/main-function/messages';
import Link from '~/components/general/link';
import { StateType } from '~/reducers';
import { i18nType } from '~/reducers/base/i18n';
import { connect, Dispatch } from 'react-redux';
import { UserRecepientType, UserGroupRecepientType, WorkspaceRecepientType, UserGroupType } from '~/reducers/main-function/user-index';
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
  render() {
    //This is the sender of the message
    let senderObject: UserRecepientType = {
      type: "user",
      value: this.props.message.sender
    };
  
    //These are the receipients of the message
    let recipientsObject: Array<UserRecepientType> = this.props.message.recipients.map(( r ): UserRecepientType => ( {
      type: "user",
      value: {
        id: r.userId,
        firstName: r.firstName,
        lastName: r.lastName,
        nickName: r.nickName
      }
    })).filter(user => user.value.id !== this.props.status.userId); //we are filtering the sender from the recepient, just in case
  
    //These are the usergroup recepients
    let userGroupObject: Array<UserGroupRecepientType> = this.props.message.userGroupRecipients.map((ug: any): UserGroupRecepientType => ( {
      type: "usergroup",
      value: ug
    }));
    
    let workspaceRecepientsFiltered = this.props.message.workspaceRecipients.filter((w, pos, self)=>{
      return self.findIndex((w2)=>w2.workspaceEntityId === w.workspaceEntityId) === pos;
    });
  
    //And the workspace recepients, sadly has to force it
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
            <span className="application-list__item-header-main-content application-list__item-header-main-content--communicator-sender">
              {getName(this.props.message.sender, !this.props.status.isStudent)}
            </span>
            <span className="application-list__item-header-main-content application-list__item-header-main-content--communicator-recipients">
              {this.props.message.recipients.map((recipient)=>{
                return (
                  <span key={recipient.recipientId}>
                    {getName(recipient as any, !this.props.status.isStudent)}
                  </span>
                )
              })}
              {this.props.message.userGroupRecipients.map((userGroupRecepient: UserGroupType)=>{
                return (
                  <span key={userGroupRecepient.id}>
                    {userGroupRecepient.name}
                  </span>
                )
              })}
              {workspaceRecepientsFiltered.map((workspaceRecepient)=>{
                return (
                  <span key={workspaceRecepient.workspaceEntityId}>
                    {workspaceRecepient.workspaceName}
                  </span>
                )
              })}
            </span>
          </div>
          <div className="application-list__item-header-aside application-list__item-header-aside--communicator-message-time">
            <span>{this.props.i18n.time.format(this.props.message.created)}</span>
          </div>
        </div>
        {this.props.labels && this.props.labels.length ? <div className="labels labels--communicator-message">
          {this.props.labels && this.props.labels.map((label)=>{
            return <span className="label" key={label.id}>
              <span className="label__icon icon-tag" style={{color: colorIntToHex(label.labelColor)}}></span>
              <span className="label__text">{label.labelName}</span>
            </span>
          })} 
        </div> : null}
      </div>
      <div className="application-list__item-body application-list__item-body--communicator-message-thread">
        <header className="application-list__item-content-header">{this.props.message.caption}</header>
        <section className="application-list__item-content-body rich-text" dangerouslySetInnerHTML={{__html: this.props.message.content}}></section>
      </div>
      <div className="application-list__item-footer application-list__item-footer--communicator-message-thread-actions">
        <NewMessage replyThreadId={this.props.message.communicatorMessageId} messageId={this.props.message.id}
          initialSelectedItems={replytarget}
          initialSubject={this.props.i18n.text.get('plugin.communicator.createmessage.title.replySubject', this.props.message.caption)}>
          <Link className="link link--application-list-item-footer">{this.props.i18n.text.get('plugin.communicator.reply')}</Link>
        </NewMessage>
        <NewMessage replyThreadId={this.props.message.communicatorMessageId} messageId={this.props.message.id}
          initialSelectedItems={replyalltarget} replyToAll
          initialSubject={this.props.i18n.text.get('plugin.communicator.createmessage.title.replySubject', this.props.message.caption)}>
          <Link className="link link--application-list-item-footer">{this.props.i18n.text.get('plugin.communicator.replyAll')}</Link>
        </NewMessage>
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
)( Message );