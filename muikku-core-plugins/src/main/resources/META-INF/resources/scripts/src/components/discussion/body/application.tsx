import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {i18nType} from '~/reducers/base/i18n';

import ApplicationPanel from '~/components/general/application-panel';
import HoverButton from '~/components/general/hover-button';
import Link from '~/components/general/link';
import Toolbar from './application/toolbar';

import '~/sass/elements/text.scss';
import '~/sass/elements/link.scss';
import '~/sass/elements/container.scss';

interface DiscussionApplicationState {
  
}

interface DiscussionApplicationProps {
  i18n: i18nType
}

class DiscussionApplication extends React.Component<DiscussionApplicationProps, DiscussionApplicationState> {
  constructor(props: DiscussionApplicationProps){
    super(props);
  }
  render(){
    let title = <h2 className="text text--application-title">{this.props.i18n.text.get('plugin.forum.pageTitle')}</h2>
    let toolbar = <Toolbar/>
    
    return <div className="container container--full">
      <ApplicationPanel title={title} modifier="discussion" toolbar={toolbar}></ApplicationPanel>
      <HoverButton icon="edit" modifier="new-message"/>
    </div>
  }
}

function mapStateToProps(state: any){
  return {
    i18n: state.i18n
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(DiscussionApplication);