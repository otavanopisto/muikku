/*global converse */
import * as React from 'react'
import '~/sass/elements/chat.scss';

interface Iprops{
  groupMessage?: any,
  removeMessage?: any,
  deleted?: any,
  onDeleted?: any
}

interface Istate {
  groupMessage: any,
  senderClass: string,
  from: string,
  realName: string,
  timeStamp: any,
  content: string,
  deleted: boolean,
  showName: boolean,
  showRemoveButton: boolean
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

export class ChatMessage extends React.Component<Iprops, Istate> {

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
      deleted: null,
      showName: false,
      showRemoveButton: false
    }
    this.myRef = null;
    this.showRealName = this.showRealName.bind(this);
    this.showRemoveButton = this.showRemoveButton.bind(this);
    this.removeMessage = this.removeMessage.bind(this);
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
  showRemoveButton () {
    if (window.MUIKKU_IS_STUDENT && this.state.senderClass === "sender-me"){
      this.setState({
        showRemoveButton: !this.state.showRemoveButton
      });
    } else if (!window.MUIKKU_IS_STUDENT){
      this.setState({
        showRemoveButton: !this.state.showRemoveButton
      });
    }
  }
  removeMessage (){

  }
  componentDidMount (){
    let groupMessage = this.props.groupMessage;
    let stamp = new Date(groupMessage.timeStamp);

    this.setState({
      groupMessage: groupMessage,
      senderClass: groupMessage.senderClass,
      from: groupMessage.from,
      realName: groupMessage.alt || groupMessage.from,
      timeStamp: stamp,
      content: groupMessage.content,
      deleted: groupMessage.deleted
    });
  }
  componentDidUpdate (){

  }
  render() {

    return  (<div className={`chat__message chat__message--${this.state.senderClass}`}>
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
      <div className="chat__message-content-container" onClick={this.showRemoveButton}>
        <div className="chat__message-content" onClick={this.showRemoveButton}>
          {this.props.groupMessage.deleted ? <i>Viesti poistettu</i> : this.props.groupMessage.content}
        </div>
        {(this.state.showRemoveButton === true) && <div className="chat__message-action-container">
          <div onClick={() => this.props.removeMessage(this.state.groupMessage)} className="chat__message-delete">Poista</div>
        </div>}
      </div>
    </div>
    );
  }
}
