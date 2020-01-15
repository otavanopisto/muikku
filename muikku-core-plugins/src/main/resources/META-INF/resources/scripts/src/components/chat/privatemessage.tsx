/*global converse */
import * as React from 'react'
import '~/sass/elements/chat.scss';

interface Iprops{
  message?: any
}

interface Istate {
  groupMessage: any,
  senderClass: string,
  from: string,
  realName: string,
  timeStamp: any,
  content: string,
  showName: boolean,
  message: any
}

declare namespace JSX {
  interface ElementClass {
    render: any,
    converse: any;
  }
}

declare global {
  interface Window {
    MUIKKU_IS_STUDENT:boolean,
    PROFILE_DATA: any,
    MUIKKU_LOGGED_USER: string
  }
}


export class PrivateMessage extends React.Component<Iprops, Istate> {

  private myRef: any;

  constructor(props: any){
    super(props);
    this.state = {
      groupMessage: null,
      senderClass:"",
      from: "",
      realName: "",
      timeStamp: "",
      content: "",
      showName: false,
      message: []
  }
  this.myRef = null;
  this.showRealName = this.showRealName.bind(this);
  }

  showRealName (){
    if (this.state.showName === false && window.MUIKKU_IS_STUDENT === false){
      this.setState({
        showName: true
      });
    } else{
      this.setState({
        showName: false
      });
    }
  }

  componentDidMount (){


      let reactComponent = this;

      let message = this.props.message;
      let stamp = new Date(this.props.message.stamp);


      reactComponent.setState({
        message: message.message,
        senderClass: message.senderClass,
        from: message.from,
        realName: message.alt || message.from,
        timeStamp: stamp,
        content: message.content

      });

    }

    componentDidUpdate (){


    }


    render() {

      return  (
              <div className={this.state.senderClass + " chat__message-item"}>

                <p className={this.state.senderClass + " chat__message-item--timestamp"}>
                <b onClick={this.showRealName} className={this.state.senderClass}>{this.state.from}
                {(this.state.showName === true) && <i>({this.state.realName}) </i>}
                </b>{new Intl.DateTimeFormat('en-GB', {
                    year: 'numeric', month: 'numeric', day: 'numeric',
                    hour: 'numeric', minute: 'numeric', second: 'numeric',
                    hour12: false
                }).format(this.state.timeStamp)}</p>
                <p className={this.state.senderClass + " chat__message-item--text"}>{this.state.message}</p>

            </div>





      );
    }
  }
