import MainFunctionNavbar from '~/components/base/main-function/navbar';

import * as React from 'react';

interface DiscussionBodyProps {
  
}

interface DiscussionBodyState {
  
}

export default class AnnouncerBody extends React.Component<DiscussionBodyProps,DiscussionBodyState> {
  render(){
    return (<div className="container container--full">
      <MainFunctionNavbar activeTrail="discussion"/>
    </div>);
  }
}