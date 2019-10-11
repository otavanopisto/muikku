import * as React from 'react';
import mApi from '~/lib/mApi';

interface ReturnCredentialsProps {
  feedReadTarget: string,
  queryOptions: any
}

interface ReturnCredentialsState {
  entries: Array<any>
}

export default class ReturnCredentials extends React.Component<ReturnCredentialsProps, ReturnCredentialsState> {
  constructor(props: ReturnCredentialsProps){
    super(props);
    
    this.state = {
      entries: []
    }
  }
  
  componentDidMount(){
  }
  
  render(){
    return (<div />);
  }
}