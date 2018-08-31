import * as React from "react";
import { HTMLtoReactComponent, guidGenerator } from "~/util/modifiers";
import $ from '~/lib/jquery';
import Toolbar, { MathFieldCommandType } from './toolbar';
import equals = require("deep-equal");
import { toSVG, loadMathJax } from "~/lib/mathjax";

interface FieldProps {
  className?: string,
  formulaClassName: string,
  selectedFormulaId: string,
  value: string,
  onChange: (str: string)=>any,
  onBlur: ()=>any,
  onFocus: ()=>any
}

interface FieldState {
}

export default class MathField extends React.Component<FieldProps, FieldState> {
  value: string;

  constructor(props: FieldProps){
    super(props);
    
    this.value = props.value;
    this.onFocusField = this.onFocusField.bind(this);
    this.onBlurField = this.onBlurField.bind(this);
    this.onChange = this.onChange.bind(this);
    this.calculateOutput = this.calculateOutput.bind(this);
    this.convertToText = this.convertToText.bind(this);
  }
  shouldComponentUpdate(){
    return false;
  }
  componentDidMount(){
    loadMathJax(false);
    this.createMarkup();
  }
  createMarkup(){
    let $markup = $(this.value);
    $markup.appendTo(this.refs.input);
    $(this.refs.input).find("." + this.props.formulaClassName).each((index: number, element: HTMLElement)=>{
      let newImage = $("<img/>").attr("alt", element.textContent).attr("class", $(element).attr("class"));
      $(element).replaceWith(newImage);
      toSVG(newImage[0]);
    });
    console.log($(this.refs.input).html());
  }
  componentDidUpdate(){
    this.value = this.props.value;
  }
  onFocusField(){
    this.props.onFocus();
  }
  calculateOutput(){
    this.value = Array.from((this.refs.input as HTMLDivElement).childNodes).map((node)=>{
      if (node.nodeType === Node.TEXT_NODE){
        return node.textContent;
      } else if (node.nodeType === Node.COMMENT_NODE){
        return "";
      }
      return this.convertToText(node as HTMLElement);
    }).join("");
    return this.value;
  }
  convertToText(node: HTMLElement): string{
    let kids = !(node as HTMLImageElement).alt ? Array.from(node.childNodes).map((node)=>{
      if (node.nodeType === Node.TEXT_NODE){
        return node.textContent;
      } else if (node.nodeType === Node.COMMENT_NODE){
        return "";
      }
      return this.convertToText(node as HTMLElement);
    }).join("") : (node as HTMLImageElement).alt;
    let tag = !(node as HTMLImageElement).alt ? node.tagName.toLowerCase() : "span";
    let extras = "";
    if (node.className){
      extras += ' className="' + node.className + '"';
    }
    return "<" + tag + extras + ">" + kids + "</" + tag + ">";
  }
  onBlurField(){
    this.props.onBlur();
  }
  focus(){
    (this.refs.input as HTMLDivElement).focus();
  }
  onChange(){
    this.props.onChange(this.calculateOutput());
  }
  render(){
    return <div className={this.props.className} contentEditable spellCheck={false} onFocus={this.onFocusField} ref="input" onBlur={this.onBlurField}
       onInput={this.onChange}/>
  }
}