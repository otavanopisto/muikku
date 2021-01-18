import MainFunctionNavbar from '../base/main-function/navbar';
import Application from './body/application';
import Aside from './body/aside';
import $ from "~/lib/jquery";

import * as React from 'react';

// TODO remove once merged with new branch
let hasLoadedNecessaryLibs = false;

export default class RecordsBody extends React.Component<{},{}> {
  render(){
    let aside = <Aside />
    return (<div>
      <MainFunctionNavbar activeTrail="records" navigation={aside}/>
      <Application aside={aside}/>
    </div>);
  }
}
