import MainFunctionNavbar from '~/components/base/main-function/navbar';
import * as React from 'react';
import Playground from '../__playground';
import Application from './body/application';
import Aside from './body/aside';

interface AnnouncementsBodyProps {
}

interface AnnouncementsBodyState {
}

export default class AnnouncerBody extends React.Component<AnnouncementsBodyProps,AnnouncementsBodyState> {

  render(){
    let aside = <Aside />  
    return (<div className="embbed embbed-full">
        <Application aside={aside} />        
        <MainFunctionNavbar navigation={aside}/>

    </div>);
  }
}