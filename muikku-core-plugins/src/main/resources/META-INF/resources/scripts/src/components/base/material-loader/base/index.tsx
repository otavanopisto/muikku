import TextField from '../fields/text-field';
import SelectField from '../fields/select-field';
import MultiSelectField from '../fields/multiselect-field';
import MemoField from '../fields/memo-field';
import * as React from 'react';
import $ from '~/lib/jquery';
import {unstable_renderSubtreeIntoContainer, unmountComponentAtNode, findDOMNode} from 'react-dom';
import { i18nType } from '~/reducers/base/i18n';
import FileField from '../fields/file-field';
import ConnectField from '../fields/connect-field';
import OrganizerField from '../fields/organizer-field';
import AudioField from '../fields/audio-field';
import SorterField from '../fields/sorter-field';
import { StatusType } from '~/reducers/base/status';
import Image from '../static/image';
import WordDefinition from '../static/word-definition';
import IFrame from '../static/iframe';
import { extractDataSet, guidGenerator } from '~/util/modifiers';
import { processMathInPage } from '~/lib/mathjax';
import MathField from '../fields/math-field';
import { MaterialCompositeRepliesType, WorkspaceType, MaterialContentNodeType } from '~/reducers/workspaces';
import { WebsocketStateType } from '~/reducers/util/websocket';
import Link from '~/components/base/material-loader/static/link';

//These are all our supported objects as for now
const objects: {[key: string]: any} = {
  "application/vnd.muikku.field.text": TextField,
  "application/vnd.muikku.field.select": SelectField,
  "application/vnd.muikku.field.multiselect": MultiSelectField,
  "application/vnd.muikku.field.memo": MemoField,
  "application/vnd.muikku.field.file": FileField,
  "application/vnd.muikku.field.connect": ConnectField,
  "application/vnd.muikku.field.organizer": OrganizerField,
  "application/vnd.muikku.field.audio": AudioField,
  "application/vnd.muikku.field.sorter": SorterField,
  "application/vnd.muikku.field.mathexercise": MathField
}

const parentObjects: {[key: string]: any} = {
  "application/vnd.muikku.field.text": "span",
  "application/vnd.muikku.field.select": "span",
  "application/vnd.muikku.field.multiselect": "span",
  "application/vnd.muikku.field.memo": "div",
  "application/vnd.muikku.field.file": "div",
  "application/vnd.muikku.field.connect": "div",
  "application/vnd.muikku.field.organizer": "div",
  "application/vnd.muikku.field.audio": "div",
  "application/vnd.muikku.field.sorter": "div",
  "application/vnd.muikku.field.mathexercise": "div"
}

//Wheteher the object can check or not for an answer
const answerCheckables: {[key: string]: (params:any)=>boolean} = {
  "application/vnd.muikku.field.text": (params: any)=>{
    return params.content.rightAnswers.filter((option:any)=>option.correct).lenght;
  },
  "application/vnd.muikku.field.select": (params: any)=>{
    return params.content.options.filter((option:any)=>option.correct).lenght;
  },
  "application/vnd.muikku.field.multiselect": (params: any)=>{
    return params.content.options.filter((option:any)=>option.correct).lenght;
  },
  "application/vnd.muikku.field.connect": ()=>true,
  "application/vnd.muikku.field.organizer": ()=>true,
  "application/vnd.muikku.field.sorter": ()=>true
}

interface BaseProps {
  material: MaterialContentNodeType,
  i18n: i18nType,
  status: StatusType,
  workspace: WorkspaceType,
  websocket: WebsocketStateType,
  
  compositeReplies?: MaterialCompositeRepliesType,
  readOnly?: boolean,
      
  onConfirmedAndSyncedModification?: ()=>any,
  onModification?: ()=>any,
  displayCorrectAnswers: boolean,
  checkAnswers: boolean,
  onAnswerChange: (name:string, status:boolean)=>any,
  onAnswerCheckableChange: (status: boolean)=>any,
  
  invisible: boolean,
}

interface BaseState {
  
}

//The typing of the user will stack until the user stops typing for this amount of milliseconds
const TIME_IT_TAKES_FOR_AN_ANSWER_TO_BE_SAVED_WHILE_THE_USER_MODIFIES_IT = 600;
//The client will wait this amount of milliseconds and otherwise it will consider the answer unsynced 
const TIME_IT_TAKES_FOR_AN_ANSWER_TO_BE_CONSIDERED_UNSYNCED_IF_SERVER_DOES_NOT_REPLY = 2000;

//The handlers that do more to html static items
//That are somehow brokeeeen
const statics:{[componentKey:string]: any} = {
  'figure[class="image"]': Image,
  'mark[data-muikku-word-definition]': WordDefinition,
  'iframe[data-url]': IFrame,
  'a': Link,
};

//Fixes the html inconsitencies because
//there are some of them which shouldn't
//but hey that's the case
function preprocessor($html: any): any{
  $html.find('img').each(function(){
    if (!$(this).parent('figure').length){
      let elem = document.createElement('figure');
      elem.className = 'image';
      
      $(this).replaceWith(elem);
      const src = this.getAttribute("src");
      if (src) {
        this.dataset.original = src;
        this.src = "";
      }
      
      elem.appendChild(this);
    } else {
      const src = this.getAttribute("src");
      if (src) {
        this.dataset.original = src;
        this.src = "";
      }
    }
  });
  
  return $html;
}

export default class Base extends React.Component<BaseProps, BaseState> {
  //The elements is a list of HTMLElement that compound a specific page
  private elements: Array<HTMLElement>;

  private answerCheckable:boolean;

  //The field registry contain the list of all the fields within a specific
  //page, base represents a specific page
  private fieldRegistry: {
    //this is the node where the react is rooted in, the parent element
    node: HTMLElement,
    //this is the subtree generated by ract
    subtree: any,
    //And this is the element that was destroyed from the dom in replacement for the node
    element: HTMLElement
  }[];
  
  //The static registry represent elements that are static and have no interactivity
  //with them
  private staticRegistry: {
    //same the node that react is rooted in
    node: HTMLElement,
    //the substree generated by react
    subtree: any,
    //And the element destroyed that was used as base
    element: HTMLElement,
    //The component key that generated the static just to save time to what matched
    componentKey: string
  }[];
  
  //whenever a field changes we save it as timeout not to send every keystroke to the server
  //every keystroke cancels the previous timeout given by the TIME_IT_TAKES_FOR_AN_ANSWER_TO_BE_SAVED_WHILE_THE_USER_MODIFIES_IT
  private timeoutChangeRegistry: {
    [name: string]: NodeJS.Timer
  }
  //once a change is emitted to the server we set a timeout to consider the field unsynced (Say if lost connection)
  //which would unsync the specific field, the timeout is triggered if it is not cancelled within the
  //TIME_IT_TAKES_FOR_AN_ANSWER_TO_BE_CONSIDERED_UNSYNCED_IF_SERVER_DOES_NOT_REPLY
  private timeoutUnsyncRegistry: {
    [name: string]: NodeJS.Timer
  }
    
  //This is a helper utility which saves the context of a react component during the change because we handle
  //its sync and unsync state here, so we save it for name, these are page specific so they don't collide
  //as every page has its own base.tsx
  private nameContextRegistry: {
    [name: string]: React.Component<any, any>
  }
    
  constructor(props: BaseProps){
    super(props);
    
    //We preprocess the html
    this.elements = preprocessor($(props.material.html)).toArray() as Array<HTMLElement>;
    
    //prepare the registries
    this.fieldRegistry = [];
    this.staticRegistry = [];
    this.timeoutChangeRegistry = {};
    this.timeoutUnsyncRegistry = {};
    this.nameContextRegistry = {};
    
    //And prepare this one too
    this.onAnswerSavedAtServer = this.onAnswerSavedAtServer.bind(this);
    
    this.answerCheckable = null;
  }
  
  //This is handled manually
  shouldComponentUpdate(){
    return false;
  }
  
  //When it mounts we setup everything
  componentDidMount(){
    this.setupEverything();
  }
  
  //To update everything if we get a brand new html we unmount and remount
  componentWillReceiveProps(nextProps: BaseProps){
    if (nextProps.material.html !== this.props.material.html){
      this.unmountEverything();
      this.elements = preprocessor($(nextProps.material.html)).toArray() as Array<HTMLElement>;
      this.setupEverything(nextProps);
      return;
    }
    
    // TODO make this more efficient, no need to update anything if nothing has changed
    // but it calls it every time, the fields nevertheless are smart and won't trigger an
    // update but the whole component tries to update, because the entire material activity
    // changes when one answer changes state, all the components recieve new props
    // two options, either create one task to refresh only the activity, or
    // make this more efficient by checking every prop, search for: updateWorkspaceActivity function
    // in a tsx file
    this.updateEverything(nextProps);
  }
  
  //unmount just uses the react function to unmount the component that has been stored in the specific node
  unmountEverything(){
    this.fieldRegistry.forEach((field)=>{
      unmountComponentAtNode(field.node);
    });
    
    this.staticRegistry.forEach((statice)=>{
      unmountComponentAtNode(statice.node);
    });
    
    (this.refs["base"] as HTMLElement).innerHTML = "";
  }
  
  setupEverything(props: BaseProps = this.props){
    //So we take all the elements and append them to the base in the reference
    this.elements.forEach((e)=>(this.refs["base"] as HTMLElement).appendChild(e));
    
    let originalAnswerCheckable = this.answerCheckable;
    this.answerCheckable = false;
    
    //First we find all the interactive
    $(this.elements).find("object").addBack("object").each((index: number, element: HTMLElement)=>{
      //We get the object element as in, the react component that it will be replaced with
      const rElement:React.ReactElement<any> = this.getObjectElement(element, props);
    
      const newAnswerCheckableState = answerCheckables[element.getAttribute("type")] &&
        answerCheckables[element.getAttribute("type")](rElement.props);
      if (newAnswerCheckableState && !this.answerCheckable){
        this.answerCheckable = true;
      }
    
      //We get the parent element of that object
      let parentElement = element.parentElement;
      
      //and we replace the object with another parent that will be the root of react
      let newParentElement = document.createElement(parentObjects[element.getAttribute("type")]);
      parentElement.replaceChild(newParentElement, element);
      
      //We take the field registry and register it
      this.fieldRegistry.push({
        //the node where react was mounted is the new parent element that replaced the raw html object
        node: newParentElement,
        //the substree is whatever in the world react gives
        subtree: unstable_renderSubtreeIntoContainer(
           this,
           rElement,
           newParentElement
        ),
        //and this is the element that we rid off in the dom
        element
      });
    });
    
    if (this.props.onAnswerCheckableChange && originalAnswerCheckable !== this.answerCheckable){
      this.props.onAnswerCheckableChange(this.answerCheckable);
    }
    
    //The statics follow a similar process
    Object.keys(statics).forEach((componentKey)=>{
      $(this.elements).find(componentKey).addBack(componentKey).toArray().forEach((element: HTMLElement)=>{
        //we get all the elements but we pass them to a handler
        let ElementClass = statics[componentKey];
        let rElement:React.ReactElement<any> = <ElementClass {...{
          element,
          dataset: extractDataSet(element),
          i18n: props.i18n,
          //This is the path something odd for images
          path: "/workspace/" + props.workspace.urlName + "/materials/" + props.material.path,
          invisible: props.invisible,
        }}/>;

        //we do the same we did in the dynamics
        let parentElement = element.parentElement;
        let newParentElement = document.createElement("div");
        newParentElement.className = "static-container";
        parentElement.replaceChild(newParentElement, element);
        
        //And we push it but we add the content key to save time on updates
        this.staticRegistry.push({subtree: unstable_renderSubtreeIntoContainer(
          this,
          rElement,
          newParentElement
        ), node: newParentElement, element, componentKey});
      });
    });
    
    //this is some mathjax weirdness we need to have here
    processMathInPage();
  }
  
  //to update we go over every registry of fields
  updateEverything(nextProps: BaseProps){
    
    //We go thru each one of them
    this.fieldRegistry.forEach((field)=>{
      //we get the original deleted element
      let element = field.element;
      //the new element as react would give it
      
      let rElement:React.ReactElement<any> = this.getObjectElement(element, nextProps);
      
      //and render the thing again on the parent node
      field.subtree = unstable_renderSubtreeIntoContainer(
        this,
        rElement,
        field.node
      );
    });
    
    //The same with the dynamics
    this.staticRegistry.forEach((statice)=>{
      let ElementClass = statics[statice.componentKey];
      let rElement:React.ReactElement<any> = <ElementClass {...{
        element: statice.element,
        dataset: extractDataSet(statice.element),
        i18n: nextProps.i18n,
        path: "/workspace/" + nextProps.workspace.urlName + "/materials/" + nextProps.material.path,
        invisible: nextProps.invisible,
      }}/>;
      
      statice.subtree = unstable_renderSubtreeIntoContainer(
        this,
        rElement,
        statice.node
      );
    });
    
    processMathInPage();
  }
  //When we mount we need to register the websocket event for the answer saved
  componentWillMount(){
    this.props.websocket.websocket.addEventCallback("workspace:field-answer-saved", this.onAnswerSavedAtServer);
    this.props.websocket.websocket.addEventCallback("workspace:field-answer-error", this.onAnswerSavedAtServer);
  }
  //and we unregister that on unmount and of course unmount all the will be orphaned react components in the dom
  componentWillUnmount(){
    this.props.websocket.websocket.removeEventCallback("workspace:field-answer-saved", this.onAnswerSavedAtServer);
    this.props.websocket.websocket.removeEventCallback("workspace:field-answer-error", this.onAnswerSavedAtServer);
    this.unmountEverything();
  }
  //when an answer is saved from the server, as in the websocket calls this
  onAnswerSavedAtServer(data: any){
    //For some reason the data comes as string
    let actualData = JSON.parse(data);
    //we check the data for a match for this specific page, given that a lot of callbacks will be registered
    //and we are going to get all those events indiscrimately of wheter which page it belongs to as we are
    //registering this event on all the field-answer-saved events
    if (actualData.materialId === this.props.material.materialId && actualData.workspaceMaterialId === this.props.material.workspaceMaterialId &&
        actualData.workspaceEntityId === this.props.workspace.id){
      //We clear the timeout that would mark the field as unsynced given the time had passed
      clearTimeout(this.timeoutUnsyncRegistry[actualData.fieldName]);
      delete this.timeoutUnsyncRegistry[actualData.fieldName];
      
      //if we have an error
      if (actualData.error){
        console.error && console.error(actualData.error);
        //we get the context and check whether it's synced
        this.nameContextRegistry[actualData.fieldName].setState({synced: false, syncError: actualData.error});
        return;
      }
      
      //The answer has been modified so we bubble this event
      this.props.onConfirmedAndSyncedModification();
      
      //we check the name context registry to see if it had been synced, said if you lost connection to the server
      //the field got unsynced, regained the connection and the answer got saved, so the thing above did nothing
      //as the field had been unsynced already
      if (!this.nameContextRegistry[actualData.fieldName].state.synced){
        //we make it synced then and the user is happy can keep typing
        this.nameContextRegistry[actualData.fieldName].setState({synced: true, syncError: null});
      }
    }
  }
  //This takes the raw element and checks what react component it will give
  getObjectElement(element: HTMLElement, props: BaseProps = this.props){
    //So we check from our objects we have on top, to see what class we are getting
    let ActualElement = objects[element.getAttribute("type")];
    
    //This is here in case we get some brand new stuff, it should never come here
    if (!ActualElement){
      return <span>Invalid Element {element.getAttribute("type")} {element.innerHTML}</span>;
    }
    
    //So now we get the parameters of that thing, due to all the updates we gotta unify here
    let parameters: {[key: string]: any} = {};
    //basically we go thru all the childnodes and get all the things with a tagName of param
    for (let i = 0; i < element.childNodes.length; i++){
      let node:HTMLElement = element.childNodes[i] as HTMLElement;
      if (node.tagName === "PARAM"){
        //and add the value to a list of parameters
        parameters[node.getAttribute("name")] = node.getAttribute("value");
      }
    }
    
    //if the type of json
    if (parameters["type"] === "application/json"){
      try {
        //Then we try to parse the content if there's a content, hmmm
        //some fields come differently but hey this works out
        parameters["content"] = parameters["content"] && JSON.parse(parameters["content"]);
      } catch (e){}
    }
    
    //we add our default parameters form redux
    parameters["i18n"] = props.i18n;
    parameters["status"] = props.status;
    parameters["readOnly"] = props.readOnly;
    
    //We set the value if we have one in composite replies
    parameters["initialValue"] = props.compositeReplies && props.compositeReplies.answers && props.compositeReplies.answers.find((answer)=>{
      return answer.fieldName === (parameters.content && parameters.content.name);
    });
    
    //And sometimes the value comes weird in a .value field so we pick that one if its there
    parameters["initialValue"] = parameters["initialValue"] && parameters["initialValue"].value;
    
    //We add the onChange function that will make us try to sync with the server
    parameters["onChange"] = this.onValueChange.bind(this);
    
    parameters["displayCorrectAnswers"] = props.displayCorrectAnswers;
    parameters["checkAnswers"] = props.checkAnswers;
    parameters["onAnswerChange"] = props.onAnswerChange;
    
    parameters["invisible"] = props.invisible;
    
    //and we return that thing
    return <ActualElement {...parameters}/>
  }
  
  //Ok so this is what the element calls every time that changes
  onValueChange(context: React.Component<any, any>, name: string, newValue: any){
    
    //the context is basically the react component, the name the fieldName, and the newValue the value we use
    
    //so we check if it's not modified and if it is, we mark it as modified
    if (!context.state.modified){
      context.setState({modified: true});
    }
    
    this.props.onModification && this.props.onModification();
    
    //we get the name context registry and register that context for future use
    this.nameContextRegistry[name] = context;
    
    //we clear the timeout of possible previous changes
    clearTimeout(this.timeoutChangeRegistry[name]);
    
    //and set a new timeout to change given the TIME_IT_TAKES_FOR_AN_ANSWER_TO_BE_SAVED_WHILE_THE_USER_MODIFIES_IT
    this.timeoutChangeRegistry[name] = setTimeout(()=>{
      
      //Tell the server thru the websocket to save
      this.props.websocket.websocket.sendMessage("workspace:field-answer-save", JSON.stringify({
        answer: newValue,
        //I have no idea what this is for
        embedId: "",
        materialId: this.props.material.materialId,
        fieldName: name,
        workspaceEntityId: this.props.workspace.id,
        workspaceMaterialId: this.props.material.workspaceMaterialId,
        userEntityId: this.props.status.userId
      }), null, name + "-" + this.props.workspace.id + "-" + this.props.material.workspaceMaterialId + "-" + this.props.material.materialId);
      //We set no callback onsent
      //and for the stackId we use this unique id that should represent the only field
      //remember that base.tsx represents a specific page so a name in the registry here suffices
      //but on the websocket there's only one for everyone so it needs more speficic identification
      //the reason why there gotta be an identification is because the websocket will stack answers
      //so if you happen to somehow in some way send an event twice to save to the server while the first hasn't
      //been executed because you are superman and type reeeeeeaaaally fast then the computer will cancel
      //the first send event and use the second instead given the first hasn't been sent anyway
      
      //And we wait the TIME_IT_TAKES_FOR_AN_ANSWER_TO_BE_CONSIDERED_UNSYNCED_IF_SERVER_DOES_NOT_REPLY
      //for considering the answer unsynced if the server does not reply
      this.timeoutUnsyncRegistry[name] = setTimeout(()=>{
        context.setState({synced: false});
      }, TIME_IT_TAKES_FOR_AN_ANSWER_TO_BE_CONSIDERED_UNSYNCED_IF_SERVER_DOES_NOT_REPLY);
    }, TIME_IT_TAKES_FOR_AN_ANSWER_TO_BE_SAVED_WHILE_THE_USER_MODIFIES_IT)
  }
  render(){
    //This is all there is we just glue the HTML in there
    //and pick out the content from there
    return <div ref="base" className="material-page__content rich-text"/>;
  }
}