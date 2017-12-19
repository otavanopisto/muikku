import * as React from 'react';
import {connect, Dispatch} from 'react-redux';

import ApplicationPanel from '~/components/general/application-panel';
import Dropdown from '~/components/general/dropdown';
import Link from '~/components/general/link';
import { i18nType } from 'reducers/base/i18n';

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
    return <div/>;
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