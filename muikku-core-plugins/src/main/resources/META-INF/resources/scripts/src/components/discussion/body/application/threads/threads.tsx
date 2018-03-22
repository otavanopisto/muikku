import '~/sass/elements/discussion.scss';
import * as React from 'react';
import Pager from '~/components/general/pager';

export class DiscussionThreads extends React.Component<{}, {}> {
  render(){
    return <div className="discussion-threads">
      {this.props.children}
    </div>
  }
}

export class DiscussionThread extends React.Component<{
  onClick: (event: React.MouseEvent<HTMLDivElement>)=>any,
  avatar: React.ReactNode
}, {}> {
  render(){
    return <div className="discussion-thread" onClick={this.props.onClick}>
      <div className="discussion-thread__content">
        <div className="discussion-thread__avatar-container">{this.props.avatar}</div>
        <div className="discussion-thread__main-container">{this.props.children}</div>
      </div>
    </div>
  }
}

export class DiscussionThreadHeader extends React.Component<{
  aside?: React.ReactNode
},{}> {
  render(){
    if (this.props.aside){
      return <div className="discussion-thread__header">
        <div className="discussion-thread__header-main">
          {this.props.children}
        </div>
        <div className="discussion-thread__header-aside">
          {this.props.aside}
        </div>
      </div>
    }
    return <div className="discussion-thread__header">{this.props.children}</div>
  }
}

export class DiscussionThreadBody extends React.Component<{},{}> {
  render(){
    return <div className="discussion-thread__body">{this.props.children}</div>
  }
}

export class DiscussionThreadFooter extends React.Component<{},{}> {
  render(){
    return <div className="discussion-thread__footer">{this.props.children}</div>
  }
}

export class DiscussionCurrentThread extends React.Component<{
  title: React.ReactNode
},{}> {
  render(){
    return <div className="discussion-current-thread">
      <div className="discussion-current-thread__title">{this.props.title}</div>
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
    let internalClass = this.props.isOpMessage ? "discussion-current-thread__op-message" : (
        this.props.isReplyOfReply ? "discussion-current-thread__reply-of-reply" : "discussion-current-thread__reply-of-op"
    )
    return <div className="discussion-current-thread__element">
      <div className={internalClass}>
        <div className="discussion-current-thread__message-container">
          <div className="discussion-thread__avatar-container">
            {this.props.avatar}
          </div>
          <div className="discussion-thread__main-container">
            {this.props.children}
          </div>
        </div>
      </div>
    </div>
  }
}