/*global converse */
import * as React from 'react'
import '~/sass/elements/chat.scss';
import mApi, { MApiError } from '~/lib/mApi';
import promisify, { promisifyNewConstructor } from '~/util/promisify';

interface Iprops{
  groupMessage?: any,
  setMessageAsRemoved?: any,
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
  deletedTime: string,
  showName: boolean,
  showRemoveButton: boolean,
  userIdentifier: string
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
      deletedTime: "",
      showName: false,
      showRemoveButton: false,
      userIdentifier: ""
    }
    this.myRef = null;
    this.showRealName = this.showRealName.bind(this);
    this.showRemoveButton = this.showRemoveButton.bind(this);
    this.removeMessage = this.removeMessage.bind(this);
  }
  async showRealName (userIdentifier: Object){
    let user: any;
    let userName;

    if (this.state.showName === false && window.MUIKKU_IS_STUDENT === false){
      if (userIdentifier){
        user = (await promisify(mApi().user.users.basicinfo.read(userIdentifier,{}), 'callback')());
        userName = user.firstName + " " + user.lastName;
      }
      this.setState({
        showName: true,
        realName: userName
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
      timeStamp: stamp,
      content: groupMessage.content,
      deleted: groupMessage.deleted,
      deletedTime: groupMessage.deletedTime,
      userIdentifier: groupMessage.userIdentifier
    });
  }
  componentDidUpdate (){

  }
  render() {

    return  (<div className={`chat__message chat__message--${this.props.groupMessage.senderClass}`}>
      <div className="chat__message-meta">
        <span className="chat__message-meta-sender" onClick={() => this.showRealName(this.props.groupMessage.userIdentifier)}>
          {this.props.groupMessage.from} {(this.state.showName === true) && <span className="chat__message-meta-sender-real-name">({this.state.realName}) </span>}
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
          {this.props.groupMessage.deleted ? <i>Viesti poistettu {this.props.groupMessage.deletedTime}</i>  : this.props.groupMessage.content}
        </div>
        {(this.state.showRemoveButton === true) && <div className="chat__message-action-container">
          <div onClick={() => this.props.setMessageAsRemoved(this.state.groupMessage)} className="chat__message-delete">Poista</div>
        </div>}
      </div>
    </div>
    );
  }
}
