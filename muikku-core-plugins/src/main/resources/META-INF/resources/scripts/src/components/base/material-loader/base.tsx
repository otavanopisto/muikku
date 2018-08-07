import TextField from './text-field';
import SelectField from './select-field';
import MultiSelectField from './multiselect-field';
import MemoField from './memo-field';
import * as React from 'react';
import $ from '~/lib/jquery';
import {unstable_renderSubtreeIntoContainer, unmountComponentAtNode, findDOMNode} from 'react-dom';
import { i18nType } from '~/reducers/base/i18n';
import FileField from './file-field';
import ConnectField from './connect-field';
import OrganizerField from './organizer-field';

const objects: {[key: string]: any} = {
  "application/vnd.muikku.field.text": TextField,
  "application/vnd.muikku.field.select": SelectField,
  "application/vnd.muikku.field.multiselect": MultiSelectField,
  "application/vnd.muikku.field.memo": MemoField,
  "application/vnd.muikku.field.file": FileField,
  "application/vnd.muikku.field.connect": ConnectField,
  "application/vnd.muikku.field.organizer": OrganizerField
}

interface BaseProps {
  html: string,
  i18n: i18nType
}

interface BaseState {
  
}

export default class Base extends React.Component<BaseProps, BaseState> {
  private elements: Array<HTMLElement>;
  constructor(props: BaseProps){
    super(props);
    
    this.elements = $(props.html).toArray() as Array<HTMLElement>;
  }
  componentDidMount(){
    this.elements.forEach((e)=>(this.refs["base"] as HTMLElement).appendChild(e));
    
    $(this.elements).find("object").each((index: number, element: HTMLElement)=>{
      let rElement:React.ReactElement<any> = this.getElement(element);
      let parentElement = element.parentElement;
      parentElement.removeChild(element);
      
      unstable_renderSubtreeIntoContainer(
        this,
        rElement,
        parentElement
      );
    });
  }
  getElement(element: HTMLElement){
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
      
      if (parameters["type"] === "application/json"){
        try {
          parameters["content"] = parameters["content"] && JSON.parse(parameters["content"]);
        } catch (e){}
      }
      
      parameters["i18n"] = this.props.i18n;
    }
    return <ActualElement {...parameters}/>
  }
  render(){
    return <div ref="base" className="page-content"/>;
  }
}