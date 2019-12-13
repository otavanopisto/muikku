/*global converse */
import * as React from 'react'
import './index.scss';
import converse from '~/lib/converse';

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
      
      
      let reactComponent = this;

      let groupMessage = this.props.groupMessage;
      
      let stamp = new Date(groupMessage.timeStamp);
      
      reactComponent.setState({
        groupMessage: groupMessage,
        senderClass: groupMessage.senderClass,
        from: groupMessage.from,
        realName: groupMessage.alt || groupMessage.from,
        timeStamp: stamp,
        content: groupMessage.content,
        deleted: groupMessage.deleted
        
      });
      
      console.log(groupMessage.content + " / " + groupMessage.deleted);
      
    }
    
    componentDidUpdate (){
     
    }
    
    
    render() {
      
      return  (
              <div>
              {<div className={this.state.senderClass + " message-item"}>
                
                <p className={this.state.senderClass + " timestamp"}>
                <b onClick={this.showRealName} className={this.state.senderClass + " message-item-sender"}>{this.state.from} 
                {(this.state.showName === true) && <i>({this.state.realName}) </i>}
                </b>
               {new Intl.DateTimeFormat('en-GB', { 
                   year: 'numeric', month: 'numeric', day: 'numeric',
                   hour: 'numeric', minute: 'numeric', second: 'numeric',
                   hour12: false
               }).format(this.state.timeStamp)}</p>
               <div className={this.state.senderClass}>
                {(this.state.showRemoveButton === true) && <div onClick={() => this.props.removeMessage(this.state.groupMessage)} className={this.state.senderClass + " message-remove-button"}><span className="icon-delete"></span></div>}
                <p onClick={this.showRemoveButton} className={this.state.senderClass + " message-item-content"}>{this.props.groupMessage.deleted ? <i>Viesti poistettu</i> : this.props.groupMessage.content}</p>
              </div>
            </div>}
            </div>

        
        

      
      );
    }
  }
