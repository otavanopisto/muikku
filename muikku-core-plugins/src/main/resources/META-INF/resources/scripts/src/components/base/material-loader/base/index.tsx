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
import { HTMLtoReactComponent } from "~/util/modifiers";
import Table from '~/components/base/material-loader/static/table';

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

// Wheteher the object can check or not for an answer
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
  elements: Array<HTMLElement>;
}

//The typing of the user will stack until the user stops typing for this amount of milliseconds
const TIME_IT_TAKES_FOR_AN_ANSWER_TO_BE_SAVED_WHILE_THE_USER_MODIFIES_IT = 666;
//The client will wait this amount of milliseconds and otherwise it will consider the answer unsynced
const TIME_IT_TAKES_FOR_AN_ANSWER_TO_BE_CONSIDERED_FAILED_IF_SERVER_DOES_NOT_REPLY = 2000;
//The client will wait this amount of milliseconds to trigger an update
const TIME_IT_WAITS_TO_TRIGGER_A_CHANGE_EVENT_IF_NO_OTHER_CHANGE_EVENT_IS_IN_QUEUE = 666;

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
  
  const $newHTML = $html.map(function() {
    if (this.tagName === "TABLE") {
      let elem = document.createElement("div");
      elem.className = "material-page__table-wrapper";
      elem.appendChild(this);
      return elem;
    }
    return this;
  });
  
  $newHTML.find("table").each(function(){
    if ($(this).parent().attr("class") === "material-page__table-wrapper") {
      return;
    }
    
    let elem = document.createElement("div");
    elem.className = "material-page__table-wrapper";
    
    $(this).replaceWith(elem);
    elem.appendChild(this);
  });

  return $newHTML;
}

export default class Base extends React.Component<BaseProps, BaseState> {
  private answerCheckable:boolean;

  //whenever a field changes we save it as timeout not to send every keystroke to the server
  //every keystroke cancels the previous timeout given by the TIME_IT_TAKES_FOR_AN_ANSWER_TO_BE_SAVED_WHILE_THE_USER_MODIFIES_IT
  private timeoutChangeRegistry: {
    [name: string]: NodeJS.Timer
  }
  //once a change is emitted to the server we set a timeout to consider the field unsynced (Say if lost connection)
  //which would unsync the specific field, the timeout is triggered if it is not cancelled within the
  //TIME_IT_TAKES_FOR_AN_ANSWER_TO_BE_CONSIDERED_UNSYNCED_IF_SERVER_DOES_NOT_REPLY
  private timeoutConnectionFailedRegistry: {
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
    this.state = {
      elements: preprocessor($(props.material.html)).toArray() as Array<HTMLElement>,
    }

    //prepare the registries
    this.timeoutChangeRegistry = {};
    this.timeoutConnectionFailedRegistry = {};
    this.nameContextRegistry = {};

    //And prepare this one too
    this.onAnswerSavedAtServer = this.onAnswerSavedAtServer.bind(this);

    this.answerCheckable = null;
  }

  //When it mounts we setup everything
  componentDidMount(){
    this.setupEverything(this.props, this.state.elements);
  }

  //To update everything if we get a brand new html we unmount and remount
  componentWillReceiveProps(nextProps: BaseProps){
    if (nextProps.material.html !== this.props.material.html){
      const elements = preprocessor($(nextProps.material.html)).toArray() as Array<HTMLElement>;
      this.setState({
        elements,
      });
      
      this.setupEverything(this.props, elements);
    }
  }

  setupEverything(props: BaseProps = this.props, elements: Array<HTMLElement>){
    let originalAnswerCheckable = this.answerCheckable;
    this.answerCheckable = false;

    //First we find all the interactive
    $(elements).find("object").addBack("object").each((index: number, element: HTMLElement)=>{
      //We get the object element as in, the react component that it will be replaced with
      const rElement:React.ReactElement<any> = this.getObjectElement(element, props);

      const newAnswerCheckableState = answerCheckables[element.getAttribute("type")] &&
        answerCheckables[element.getAttribute("type")](rElement.props);
      if (newAnswerCheckableState && !this.answerCheckable){
        this.answerCheckable = true;
      }
    });

    if (this.props.onAnswerCheckableChange && originalAnswerCheckable !== this.answerCheckable){
      this.props.onAnswerCheckableChange(this.answerCheckable);
    }

    //this is some mathjax weirdness we need to have here
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
      clearTimeout(this.timeoutConnectionFailedRegistry[actualData.fieldName]);
      delete this.timeoutConnectionFailedRegistry[actualData.fieldName];

      //if we have an error
      if (actualData.error){
        console.error && console.error(actualData.error);
        //we get the context and check whether it's synced
        this.nameContextRegistry[actualData.fieldName].setState({synced: false, syncError: actualData.error});
        return;
      }

      //The answer has been modified so we bubble this event
      this.props.onConfirmedAndSyncedModification();

      if (this.nameContextRegistry[actualData.fieldName]) {
        //we check the name context registry to see if it had been synced, said if you lost connection to the server
        //the field got unsynced, regained the connection and the answer got saved, so the thing above did nothing
        //as the field had been unsynced already
        if (
          !this.nameContextRegistry[actualData.fieldName].state.synced ||
          this.nameContextRegistry[actualData.fieldName].state.syncError
        ){
          //we make it synced then and the user is happy can keep typing
          this.nameContextRegistry[actualData.fieldName].setState({synced: true, syncError: null});
        }
      }
    }
  }
  //This takes the raw element and checks what react component it will give
  getObjectElement(element: HTMLElement, props: BaseProps = this.props, key?: number){
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
    if (parameters["initialValue"] && parameters["initialValue"].value) {
      parameters["initialValue"] = parameters["initialValue"].value;
    }

    //We add the onChange function that will make us try to sync with the server
    parameters["onChange"] = this.onValueChange.bind(this);

    parameters["displayCorrectAnswers"] = props.displayCorrectAnswers;
    parameters["checkAnswers"] = props.checkAnswers;
    parameters["onAnswerChange"] = props.onAnswerChange;

    parameters["invisible"] = props.invisible;

    //and we return that thing
    return <ActualElement {...parameters} key={key}/>
  }

  //Ok so this is what the element calls every time that changes
  onValueChange(context: React.Component<any, any>, name: string, newValue: any){

    //the context is basically the react component, the name the fieldName, and the newValue the value we use

    //so we check if it's not modified and if it is, we mark it as modified
    if (!context.state.modified){
      context.setState({modified: true});
    }
    context.setState({synced: false});

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
      this.timeoutConnectionFailedRegistry[name] = setTimeout(()=>{
        context.setState({syncError: "server does not reply"});
      }, TIME_IT_TAKES_FOR_AN_ANSWER_TO_BE_CONSIDERED_FAILED_IF_SERVER_DOES_NOT_REPLY);
    }, TIME_IT_WAITS_TO_TRIGGER_A_CHANGE_EVENT_IF_NO_OTHER_CHANGE_EVENT_IS_IN_QUEUE)
  }
  render(){
    const processingFunction = (dontProcessTag: string, reprocessFunction: any, Tag: string, elementProps: any, children: Array<any>, element: HTMLElement)=>{
      if (Tag !== dontProcessTag) {
        if (Tag === "object") {
          const rElement:React.ReactElement<any> = this.getObjectElement(element, this.props, elementProps.key);
          return rElement;
        } else if (
          Tag === "iframe" ||
          (Tag === "mark" && element.dataset.muikkuWordDefinition) ||
          (Tag === "figure" && element.classList.contains("image")) ||
          (Tag === "a" && (element as HTMLAnchorElement).href) ||
          Tag === "table"
        ) {
          const path = "/workspace/" + this.props.workspace.urlName + "/materials/" + this.props.material.path;
          const invisible = this.props.invisible;
          const i18n = this.props.i18n;
          const dataset = extractDataSet(element);
          const key = elementProps.key;
          if (Tag === "iframe") {
            return <IFrame key={elementProps.key} element={element} path={path} invisible={invisible} dataset={dataset} i18n={i18n}/>
          } else if (Tag === "table") {
            return <Table key={elementProps.key} element={element} props={elementProps} children={children}/>
          } else if (Tag === "mark") {
            return <WordDefinition key={elementProps.key} invisible={invisible} dataset={dataset} i18n={i18n}>{children}</WordDefinition>
          } else if (Tag === "figure") {
            return <Image key={elementProps.key} element={element} path={path} invisible={invisible} dataset={dataset} i18n={i18n} processingFunction={processingFunction.bind(this)}/>
          } else {
            return <Link key={elementProps.key} element={element} path={path} dataset={dataset} i18n={i18n}/>
          }
        } else if (
          Tag === "source"
        ) {
          const src = elementProps.src;
          const isAbsolute = (src.indexOf('/') == 0) || (src.indexOf('mailto:') == 0) ||
          (src.indexOf('data:') == 0) || (src.match("^(?:[a-zA-Z]+:)?\/\/"));
          if (!isAbsolute){
            const path = "/workspace/" + this.props.workspace.urlName + "/materials/" + this.props.material.path;
            elementProps.src = path + "/" + src;
          }
        }
      }
      
      if (reprocessFunction) {
        return reprocessFunction(Tag, elementProps, children, element);
      }

      return <Tag {...elementProps}>{children}</Tag>
    };
    //This is all there is we just glue the HTML in there
    //and pick out the content from there
    return <div className="material-page__content rich-text">
      {this.state.elements.map((rootElement, index) => {
        return HTMLtoReactComponent(rootElement, processingFunction.bind(this, null, null), index);
      })}
    </div>;
  }
}