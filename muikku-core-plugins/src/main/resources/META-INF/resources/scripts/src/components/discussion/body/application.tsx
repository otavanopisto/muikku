import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {i18nType} from '~/reducers/base/i18n';
import NewThread from '../dialogs/new-thread';
//import ApplicationPanel from '~/components/general/application-panel';
import ApplicationPanel from '~/components/general/application-panel/application-panel';
import HoverButton from '~/components/general/hover-button';
import Link from '~/components/general/link';
import Toolbar from './application/toolbar';
import {DiscussionType} from '~/reducers/main-function/discussion';
import {StateType} from '~/reducers';
import DiscussionThreads from './application/discussion-threads';
import CurrentThread from './application/current-thread';
import '~/sass/elements/link.scss';

interface DiscussionApplicationState {
}

interface DiscussionApplicationProps {
  i18n: i18nType,
  discussion: DiscussionType
}

class DiscussionApplication extends React.Component<DiscussionApplicationProps, DiscussionApplicationState> {
  constructor(props: DiscussionApplicationProps){
    super(props);
  }
  render(){
    let title = <h2 className="application-panel__header-title">{this.props.i18n.text.get('plugin.forum.pageTitle')}</h2>
    let toolbar = <Toolbar/>
    let primaryOption = !this.props.discussion.current ? <NewThread><Link className="button button--primary-function">    
    {this.props.i18n.text.get('plugin.discussion.createmessage.topic')}
    </Link></NewThread> : null;

    return <div>
      <ApplicationPanel title={title} modifier="discussion" primaryOption={primaryOption} toolbar={toolbar}>
        <DiscussionThreads/>
        <CurrentThread/>
      </ApplicationPanel>
      <NewThread><HoverButton icon="edit" modifier="new-message"/></NewThread>
    </div>
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    discussion: state.discussion
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DiscussionApplication);