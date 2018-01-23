import * as React from 'react';
import {connect, Dispatch} from 'react-redux';

import ApplicationPanel from '~/components/general/application-panel';
import Dropdown from '~/components/general/dropdown';
import Link from '~/components/general/link';
import { i18nType } from 'reducers/base/i18n';

import Students from './application/students';
import Toolbar from './application/toolbar';
import CurrentStudent from './application/current-student';

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
    let title = <h2 className="text text--application-title">{this.props.i18n.text.get('plugin.guider.guider')}</h2>
    let toolbar = <Toolbar/>
    let primaryOption = <select className="form-field__select form-field__select--primary-function">
      <option>TODO: caption</option>
    </select>
  
    return (<div className="container container--full">
      <ApplicationPanel modifier="coursepicker" primaryOption={primaryOption} toolbar={toolbar} title={title} aside={this.props.aside}>
        <Students/>
        <CurrentStudent/>
      </ApplicationPanel>
    </div>);
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
)(GuiderApplication);