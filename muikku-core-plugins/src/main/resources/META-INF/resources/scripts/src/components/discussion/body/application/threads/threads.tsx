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

export class DiscussionThreadHeader extends React.Component<{},{}> {
  render(){
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