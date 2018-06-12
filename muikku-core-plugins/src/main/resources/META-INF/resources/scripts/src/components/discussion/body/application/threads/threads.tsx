import '~/sass/elements/application-list.scss';
import '~/sass/elements/message.scss';

import * as React from 'react';
import Pager from '~/components/general/pager';

export class DiscussionThreads extends React.Component<{}, {}> {
  render(){
    return <div className="application-list">
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
      <div className="application-list__item-content-wrapper">
        <div className="application-list__item-content-aside application-list__item-content-aside--discussion">{this.props.avatar}</div>
        <div className="application-list__item-content-main application-list__item-content-main--discussion">{this.props.children}</div>
      </div>
    </div>
  }
}

export class DiscussionThreadHeader extends React.Component<{
  aside?: React.ReactNode
},{}> {
  render(){
    if (this.props.aside){
      return <div className="application-list__item-header application-list__item-header--discussion">
        <div className="application-list__item-header-main">
          {this.props.children}
        </div>
        <div className="application-list__item-header-aside">
          {this.props.aside}
        </div>
      </div>
    }
    return <div className="application-list__item-header application-list__item-header--message">{this.props.children}</div>
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
    return <div className="application-list__item-footer application-list__item-footer--discussion-message">{this.props.children}</div>
  }
}

export class DiscussionCurrentThread extends React.Component<{
  title: React.ReactNode,
  sticky: boolean,
  locked: boolean
},{}> {
  render(){
    return <div className="application-list">
      <div className="application-list__header application-list__header--discussion">
        {this.props.locked ?
          <div className="discussion__icon icon-lock"/> : null
        }
        {this.props.sticky ?
          <div className="discussion__icon icon-pin"/> : null
        } 
        {this.props.title}
      </div>
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
    let baseClass = this.props.isOpMessage ? "application-list__item--discussion-message" : (
        this.props.isReplyOfReply ?  "application-list__item--discussion-reply-of-reply" :
          "application-list__item--discussion-reply"
    );
    
    return <div className={`application-list__item ${baseClass}`}>
      <div className="application-list__item-content-wrapper">
        <div className="application-list__item-content-aside application-list__item-content-aside--discussion">
          {this.props.avatar}
        </div>
        <div className="application-list__item-content-main application-list__item-content-main--discussion">
          {this.props.children}
        </div>
      </div>
    </div>
  }
}