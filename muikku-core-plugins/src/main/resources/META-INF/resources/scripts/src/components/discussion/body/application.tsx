import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {i18nType} from '~/reducers/base/i18n';
import NewThread from './application/new-thread';
import ApplicationPanel from '~/components/general/application-panel';
import HoverButton from '~/components/general/hover-button';
import Link from '~/components/general/link';
import Toolbar from './application/toolbar';
import {DiscussionType} from '~/reducers/main-function/discussion/discussion-threads';

import DiscussionThreads from './application/discussion-threads';

import '~/sass/elements/text.scss';
import '~/sass/elements/link.scss';
import '~/sass/elements/container.scss';

interface DiscussionApplicationState {
  
}

interface DiscussionApplicationProps {
  i18n: i18nType,
  discussionThreads: DiscussionType
}

class DiscussionApplication extends React.Component<DiscussionApplicationProps, DiscussionApplicationState> {
  constructor(props: DiscussionApplicationProps){
    super(props);
  }
  render(){
    let title = <h2 className="text text--application-title">{this.props.i18n.text.get('plugin.forum.pageTitle')}</h2>
    let toolbar = <Toolbar/>
    let primaryOption = <NewThread><Link className="button button--primary-function">    
    {this.props.i18n.text.get('plugin.discussion.createmessage.topic')}
    </Link></NewThread>

    return <div className="container container--full">
      <ApplicationPanel title={title} modifier="discussion" primaryOption={primaryOption} toolbar={toolbar}>
        <DiscussionThreads hidden={!!this.props.discussionThreads.current}/>
      </ApplicationPanel>
      <HoverButton icon="edit" modifier="new-message"/>
    </div>
  }
}

function mapStateToProps(state: any){
  return {
    i18n: state.i18n,
    discussionThreads: state.discussionThreads
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(DiscussionApplication);