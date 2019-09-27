import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import ApplicationPanel from '~/components/general/application-panel';
import { i18nType } from 'reducers/base/i18n';
import Records from './application/records';
import CurrentRecord from './application/current-record';
import Vops from './application/vops';
import Hops from './application/hops';
import {StateType} from '~/reducers';
import PrimaryOption from './application/primary';
import Toolbar from './application/toolbar';

interface StudiesApplicationProps {
  aside: React.ReactElement<any>,
  i18n: i18nType
}

interface StudiesApplicationState {
}

class StudiesApplication extends React.Component<StudiesApplicationProps, StudiesApplicationState> {
  constructor(props: StudiesApplicationProps){
    super(props);
  }

  render(){
    let title = this.props.i18n.text.get('plugin.records.pageTitle')
    let primaryOption  = <PrimaryOption />
    let toolbar = <Toolbar />

    return (<div className="application-panel-wrapper">
      <ApplicationPanel modifier="records" toolbar={toolbar} title={title} primaryOption={primaryOption} asideBefore={this.props.aside}>
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
)(StudiesApplication);