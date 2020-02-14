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
      let message = this.props.message;
      let stamp = new Date(this.props.message.stamp);

      this.setState({
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
        <div className={`chat__message chat__message--${this.state.senderClass}`}>
        <div className="chat__message-meta">
          <span className="chat__message-meta-sender" onClick={this.showRealName}>
            {this.state.from} {(this.state.showName === true) && <span className="chat__message-meta-sender-real-name">({this.state.realName}) </span>}
          </span>
          <span className="chat__message-meta-timestamp">
            {new Intl.DateTimeFormat('fi-FI', {
              year: 'numeric', month: 'numeric', day: 'numeric',
              hour: 'numeric', minute: 'numeric', second: 'numeric',
              hour12: false
            }).format(this.state.timeStamp)}
          </span>
        </div>
        <div className="chat__message-content-container">
          <div className="chat__message-content">
            {this.state.message}
          </div>
        </div>
      </div>
      );
    }
  }
