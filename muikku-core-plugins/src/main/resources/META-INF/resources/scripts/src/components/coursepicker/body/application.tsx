import * as React from 'react';
import {connect, Dispatch} from 'react-redux';

import ApplicationPanel from '~/components/general/application-panel';
import HoverButton from '~/components/general/hover-button';
import Dropdown from '~/components/general/dropdown';
import Link from '~/components/general/link';

import Toolbar from './application/toolbar';
import CoursepickerWorkspaces from './application/courses';
import {i18nType} from '~/reducers/base/i18n';

import '~/sass/elements/text.scss';
import '~/sass/elements/link.scss';
import '~/sass/elements/container.scss';

interface CoursepickerApplicationProps {
  aside: React.ReactElement<any>,
  i18n: i18nType
}

interface CoursepickerApplicationState {
}

class CommunicatorApplication extends React.Component<CoursepickerApplicationProps, CoursepickerApplicationState> {
  constructor(props: CoursepickerApplicationProps){
    super(props);
  }

  render(){
    let title = <h2 className="text text--application-title">{this.props.i18n.text.get('plugin.coursepicker.pageTitle')}</h2>
    let toolbar = <Toolbar/>
      
    return (<div className="container container--full">
      <ApplicationPanel modifier="coursepicker" toolbar={toolbar} title={title} aside={this.props.aside}>
  
      </ApplicationPanel>
    </div>);
  }
}

function mapStateToProps(state: any){
  return {
    i18n: state.i18n,
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(CommunicatorApplication);