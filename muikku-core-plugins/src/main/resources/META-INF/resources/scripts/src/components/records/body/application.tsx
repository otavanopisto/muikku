import * as React from 'react';
import {connect, Dispatch} from 'react-redux';

import ApplicationPanel from '~/components/general/application-panel';
import Dropdown from '~/components/general/dropdown';
import Link from '~/components/general/link';
import { i18nType } from 'reducers/base/i18n';

import Records from './application/records';
import CurrentRecord from './application/current-record';
import Vops from './application/vops';
import Hops from './application/hops';
import {StateType} from '~/reducers';

interface GuiderApplicationProps {
  aside: React.ReactElement<any>,
  i18n: i18nType
}

interface GuiderApplicationState {
}

class GuiderApplication extends React.Component<GuiderApplicationProps, GuiderApplicationState> {
  constructor(props: GuiderApplicationProps){
    super(props);
  }
  
  render(){
    let title = <h2 className="text text--application-title">{this.props.i18n.text.get('plugin.records.records')}</h2>
  
    return (<div className="container container--full">
      <ApplicationPanel modifier="records" title={title} asideBefore={this.props.aside}>
        <Records/>
        <CurrentRecord/>
        <Vops/>
        <Hops/>
      </ApplicationPanel>
    </div>);
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GuiderApplication);