import MainFunctionNavbar from '~/components/base/main-function/navbar';
import * as React from 'react';
import Playground from '../__playground';
import Application from './body/application';
import Aside from './body/aside';
import ScreenContainer from '../general/screen-container';

interface AnnouncementsBodyProps {
}

interface AnnouncementsBodyState {
}

export default class AnnouncementsBody extends React.Component<AnnouncementsBodyProps,AnnouncementsBodyState> {

  render(){
    let aside = <Aside />  
    return (<div>
        <MainFunctionNavbar navigation={aside} activeTrail="index"/>
        <ScreenContainer>
          <Application aside={aside} />
        </ScreenContainer>
    </div>);
  }
}