import '~/sass/elements/application-list.scss';
import '~/sass/elements/message.scss';

import * as React from 'react';
import Pager from '~/components/general/pager';

export class DiscussionThreads extends React.Component<{}, {}> {
  render(){
    return <div className="application-list application-list__items">
      {this.props.children}
    </div>
  }
}

export class DiscussionThread extends React.Component<{
  onClick: (event: React.MouseEvent<HTMLDivElement>)=>any,
  avatar: React.ReactNode
}, {}> {
  render(){
    return <div className="application-list__item message message--discussion" onClick={this.props.onClick}>
      <div className="application-list__item-content-wrapper message__content">
        <div className="application-list__item-content--aside message__content-aside--discussion">{this.props.avatar}</div>
        <div className="application-list__item-content--main">{this.props.children}</div>
      </div>
    </div>
  }
}

export class DiscussionThreadHeader extends React.Component<{
  aside?: React.ReactNode
},{}> {
  render(){
    if (this.props.aside){
      return <div className="application-list__item-header">
        <div className="application-list__item-header-main">
          {this.props.children}
        </div>
        <div className="application-list__item-header-aside">
          {this.props.aside}
        </div>
      </div>
    }
    return <div className="application-list__item-header application-list__item-header--discussion-item-header">{this.props.children}</div>
  }
}

export class DiscussionThreadBody extends React.Component<{},{}> {
  render(){
    return <div className="application-list__item__body">{this.props.children}</div>
  }
}

export class DiscussionThreadFooter extends React.Component<{
  hasActions?: boolean
},{}> {
  render(){
    return <div className={`application-list__item-footer application-list__item-footer--discussion ${this.props.hasActions ? "container container--message-actions" : ""}`}>{this.props.children}</div>
  }
}

export class DiscussionCurrentThread extends React.Component<{
  title: React.ReactNode
},{}> {
  render(){
    return <div className="application-list application-list--open">
      <div className="application-list__item-header">{this.props.title}</div>
      {this.props.children}
    </div>
  }
}

export class DiscussionCurrentThreadElement extends React.Component<{
  isOpMessage?: boolean,
  isReplyOfReply?: boolean,
  isReply?: boolean,
  avatar: React.ReactNode
}, {}> {
  render(){
    let internalClass = this.props.isOpMessage ? "application-list__item-content-container message message--discussion message--discussion-thread-op" : (
        this.props.isReplyOfReply ? "application-list__item-content-container message message--discussion message--discussion-reply-of-reply" :
          "application-list__item-content-container message message--discussion message--discussion-reply-of-op"
    )
    let baseClass = this.props.isOpMessage ? "application-list__item--discussion-current-thread" : "application-list--open application-list__item--discussion-reply";
    return <div className={baseClass}>
      <div className={internalClass}>
        <div className="application-list__item-content-wrapper message__content">
          <div className="application-list__item-content--aside message__content-aside--discussion">
            {this.props.avatar}
          </div>
          <div className="application-list__item-content--main">
            {this.props.children}
          </div>
        </div>
      </div>
    </div>
  }
}