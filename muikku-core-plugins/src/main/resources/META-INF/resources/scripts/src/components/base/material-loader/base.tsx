import TextField from './fields/text-field';
import SelectField from './fields/select-field';
import MultiSelectField from './fields/multiselect-field';
import MemoField from './fields/memo-field';
import * as React from 'react';
import $ from '~/lib/jquery';
import {unstable_renderSubtreeIntoContainer, unmountComponentAtNode, findDOMNode} from 'react-dom';
import { i18nType } from '~/reducers/base/i18n';
import FileField from './fields/file-field';
import ConnectField from './fields/connect-field';
import OrganizerField from './fields/organizer-field';
import AudioField from './fields/audio-field';
import SorterField from './fields/sorter-field';
import { StatusType } from '~/reducers/base/status';
import Image from './static/image';
import WordDefinition from './static/word-definition';
import { extractDataSet, guidGenerator } from '~/util/modifiers';
import { processMathInPage } from '~/lib/mathjax';
import MathField from './fields/math-field';
import { MaterialCompositeRepliesType } from '~/reducers/workspaces';

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

interface BaseProps {
  html: string,
  i18n: i18nType,
  status: StatusType,
  path: string,
  
  compositeReplies?: MaterialCompositeRepliesType,
  readOnly?: boolean
}

interface BaseState {
  
}

const statics:{[componentKey:string]: {
  handler: Function
}} = {
  'figure[class="image"]': {
     handler: Image
   },
   'mark[data-muikku-word-definition]': {
     handler: WordDefinition
   }
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
      
      elem.appendChild(this);
    }
  });
  
  return $html;
}

export default class Base extends React.Component<BaseProps, BaseState> {
  private elements: Array<HTMLElement>;
  private fieldRegistry: {
    node: HTMLElement,
    subtree: any,
    element: HTMLElement
  }[];
  private staticRegistry: {
    node: HTMLElement,
    subtree: any,
    element: HTMLElement,
    componentKey: string
  }[];
  constructor(props: BaseProps){
    super(props);
    
    this.elements = preprocessor($(props.html)).toArray() as Array<HTMLElement>;
    this.fieldRegistry = [];
    this.staticRegistry = [];
  }
  shouldComponentUpdate(){
    return false;
  }
  componentDidMount(){
    this.setupEverything();
  }
  componentWillReceiveProps(nextProps: BaseProps){
    if (nextProps.html !== this.props.html){
      this.unmountEverything();
      this.elements = preprocessor($(nextProps.html)).toArray() as Array<HTMLElement>;
      this.setupEverything(nextProps);
      return;
    }
    
    this.updateEverything(nextProps);
  }
  updateEverything(props: BaseProps = this.props){
    this.fieldRegistry.forEach((field)=>{
      let element = field.element;
      let rElement:React.ReactElement<any> = this.getObjectElement(element, props);
    
      field.subtree = unstable_renderSubtreeIntoContainer(
        this,
        rElement,
        field.node
      );
    });
    
    this.staticRegistry.forEach((statice)=>{
      let rElement:React.ReactElement<any> = statics[statice.componentKey].handler({
        element: statice.element,
        dataset: extractDataSet(statice.element),
        i18n: props.i18n,
        path: props.path
      });
      
      statice.subtree = unstable_renderSubtreeIntoContainer(
        this,
        rElement,
        statice.node
      );
    });
  }
  unmountEverything(){
    this.fieldRegistry.forEach((field)=>{
      unmountComponentAtNode(field.node);
    });
    
    this.staticRegistry.forEach((statice)=>{
      unmountComponentAtNode(statice.node);
    });
  }
  setupEverything(props: BaseProps = this.props){
    this.elements.forEach((e)=>(this.refs["base"] as HTMLElement).appendChild(e));
    
    $(this.elements).find("object").addBack("object").each((index: number, element: HTMLElement)=>{
      let rElement:React.ReactElement<any> = this.getObjectElement(element, props);
      let parentElement = element.parentElement;
      parentElement.removeChild(element);
      
      let newParentElement = document.createElement('p');
      parentElement.appendChild(newParentElement);
      
      this.fieldRegistry.push({
        node: newParentElement,
        subtree: unstable_renderSubtreeIntoContainer(
           this,
           rElement,
           newParentElement
        ),
        element
      });
    });
    
    Object.keys(statics).forEach((componentKey)=>{
      console.log("searching for statics in", componentKey, this.elements);
      $(this.elements).find(componentKey).addBack(componentKey).toArray().forEach((element: HTMLElement)=>{
        console.log("found", element);
        let rElement:React.ReactElement<any> = statics[componentKey].handler({
          element,
          dataset: extractDataSet(element),
          i18n: props.i18n,
          path: props.path
        });
        let parentElement = element.parentElement;
        parentElement.removeChild(element);
        
        let newParentElement = document.createElement('p');
        parentElement.appendChild(newParentElement);
        
        this.staticRegistry.push({subtree: unstable_renderSubtreeIntoContainer(
          this,
          rElement,
          newParentElement
        ), node: newParentElement, element, componentKey});
      });
    });
    
    processMathInPage();
  }
  componentWillUnmount(){
    this.unmountEverything();
  }
  getObjectElement(element: HTMLElement, props: BaseProps = this.props){
    let ActualElement = objects[element.getAttribute("type")];
    if (!ActualElement){
      return <span>Invalid Element {element.getAttribute("type")} {element.innerHTML}</span>;
    }
    let parameters: {[key: string]: any} = {};
    for (let i = 0; i < element.childNodes.length; i++){
      let node:HTMLElement = element.childNodes[i] as HTMLElement;
      if (node.tagName === "PARAM"){
        parameters[node.getAttribute("name")] = node.getAttribute("value");
      }
    }
    
    if (parameters["type"] === "application/json"){
      try {
        parameters["content"] = parameters["content"] && JSON.parse(parameters["content"]);
      } catch (e){}
    }
    
    parameters["i18n"] = props.i18n;
    parameters["status"] = props.status;
    parameters["readOnly"] = props.readOnly;
    parameters["value"] = props.compositeReplies && props.compositeReplies.answers.find((answer)=>{
      return answer.fieldName === (parameters.content && parameters.content.name);
    });
    parameters["value"] = parameters["value"] && parameters["value"].value;
    return <ActualElement {...parameters}/>
  }
  render(){
    return <div ref="base" className="page-content"/>;
  }
}