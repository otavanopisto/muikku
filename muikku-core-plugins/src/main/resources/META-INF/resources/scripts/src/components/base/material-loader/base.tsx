import TextField from './text-field';
import SelectField from './select-field';
import MultiSelectField from './multiselect-field';
import * as React from 'react';
import $ from '~/lib/jquery';
import {unstable_renderSubtreeIntoContainer, unmountComponentAtNode, findDOMNode} from 'react-dom';

const objects: {[key: string]: any} = {
  "application/vnd.muikku.field.text": TextField,
  "application/vnd.muikku.field.select": SelectField,
  "application/vnd.muikku.field.multiselect": MultiSelectField
}

interface BaseProps {
  html: string
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
    let parameters: {[key: string]: string} = {};
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
    }
    return <ActualElement {...parameters}/>
  }
  render(){
    return <div ref="base" className="page-content"/>;
  }
}