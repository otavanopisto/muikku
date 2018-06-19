import NewMessage from '../new-message';
import * as React from 'react';
import { MessageType, MessageThreadLabelListType } from '~/reducers/main-function/messages';
import Link from '~/components/general/link';
import { StateType } from '~/reducers';
import { i18nType } from '~/reducers/base/i18n';
import { connect, Dispatch } from 'react-redux';
import { UserRecepientType, UserGroupRecepientType, WorkspaceRecepientType } from '~/reducers/main-function/user-index';
import { StatusType } from '~/reducers/base/status';
import { colorIntToHex } from '~/util/modifiers';

import '~/sass/elements/rich-text.scss';
import '~/sass/elements/label.scss';
import '~/sass/elements/application-list.scss';
import '~/sass/elements/text.scss';
import '~/sass/elements/link.scss';

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
    let recipientsObject: Array<UserRecepientType> = this.props.message.recipients.map( ( r ): UserRecepientType => ( {
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
  
    //And the workspace recepients
    let workspaceObject: Array<WorkspaceRecepientType> = this.props.message.workspaceRecipients.map((w: any): WorkspaceRecepientType => ({
      type: "workspace",
      value: w
    }));
  
    //The basic reply target is the sender
    let replytarget = [senderObject];
    if (senderObject.value.id === this.props.status.userId) {
      replytarget = [senderObject].concat(recipientsObject as any).concat(userGroupObject as any).concat(workspaceObject as any)
      .filter((t)=>t.value.id !== this.props.status.userId);
    }
    let replyalltarget = [senderObject].concat(recipientsObject as any)
    .concat(userGroupObject as any).concat(workspaceObject as any).filter((t)=>t.value.id !== senderObject.value.id)
    .concat(senderObject as any).filter((t)=>t.value.id !== this.props.status.userId);

    return <div className="application-list__item application-list__item--communicator-message">
      <div className="application-list__item-header application-list__item-header--communicator-message-thread">
        <div className="container container--communicator-message-meta">
          <div className="application-list__item-header-main application-list__item-header-main--communicator-message-participants">
            <span className="text text--communicator-message-sender">
              {this.props.message.sender.firstName ? this.props.message.sender.firstName + " " : ""} {this.props.message.sender.lastName ? this.props.message.sender.lastName : ""}
            </span>
            <span className="text text--communicator-message-recipients">
              {this.props.message.recipients.map( ( recipient ) => {
                return (
                  <span className="text text--communicator-message-recipient" key={recipient.recipientId}>
                    {recipient.firstName ? recipient.firstName + " " : ""} {recipient.lastName ? recipient.lastName + " " : ""}
                  </span>
                )
              } )}
            </span>
          </div>
          <div className="application-list__item-header-aside application-list__item-header-aside--communicator-message-time">
            <span className="text text--communicator-message-created">{this.props.i18n.time.format(this.props.message.created)}</span>
          </div>
        </div>
        {this.props.labels && this.props.labels.length ? <div className="labels labels--communicator-message">
          {this.props.labels && this.props.labels.map((label)=>{
            return <span className="label" key={label.id}>
              <span className="label__icon icon-tag" style={{color: colorIntToHex(label.labelColor)}}></span>
              <span className="text label__text">{label.labelName}</span>
            </span>
          })}
        </div> : null}
      </div>
      <div className="application-list__item-body application-list__item-body--communicator-message-thread">
        <header className="text text--communicator-message-caption">{this.props.message.caption}</header>
        <section className="text text--communicator-message-content rich-text" dangerouslySetInnerHTML={{__html: this.props.message.content}}></section>
      </div>
      <div className="application-list__item-footer application-list__item-footer--communicator-message-thread-actions">
        <NewMessage replyThreadId={this.props.message.communicatorMessageId}
          initialSelectedItems={replytarget}
          initialSubject={this.props.i18n.text.get('plugin.communicator.createmessage.title.replySubject', this.props.message.caption)}>
          <Link className="link link--application-list-item-footer">{this.props.i18n.text.get('plugin.communicator.reply')}</Link>
        </NewMessage>
        <NewMessage replyThreadId={this.props.message.communicatorMessageId}
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