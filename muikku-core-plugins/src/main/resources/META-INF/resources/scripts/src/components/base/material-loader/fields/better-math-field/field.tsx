import * as React from "react";
import { HTMLtoReactComponent, guidGenerator } from "~/util/modifiers";
import $ from '~/lib/jquery';
import Toolbar, { MathFieldCommandType } from './toolbar';
import equals = require("deep-equal");
import { toSVG, loadMathJax, getMQInterface } from "~/lib/mathjax";
import loadingImage from './loading-image';
import warningImage from './warning-image';

interface FieldProps {
  className?: string,
  formulaClassName: string,
  editorClassName: string,
  toolbarClassName: string,
  value: string,
  onChange: (str: string)=>any,
  onBlur: ()=>any,
  onFocus: ()=>any
}

interface FieldState {
}

function checkIsParentOrSelf(element: HTMLElement, comparer: HTMLElement | string): boolean{
  if (typeof comparer === "string" ? element && element.className.indexOf(comparer) !== -1 : element === comparer){
    return true;
  }
  
  return element.parentElement ? checkIsParentOrSelf(element.parentElement, comparer) : false;
}

export default class MathField extends React.Component<FieldProps, FieldState> {
  value: string;
  MQInterface: any;

  selectedFormula: HTMLImageElement;
  selectedMathField: any;
  selectedMathFieldContainer: HTMLDivElement;
  aceEditor: any;
  isOnAceEditor: boolean;
  changedSelected: boolean;

  lastMouseedDownElement: HTMLElement;

  cancelBlur: boolean;
  isBlurDelayed: boolean;

  constructor(props: FieldProps){
    super(props);
    
    this.value = props.value;
    this.MQInterface = getMQInterface();
    
    this.onFocusField = this.onFocusField.bind(this);
    this.onBlurField = this.onBlurField.bind(this);
    this.onChange = this.onChange.bind(this);
    this.calculateOutput = this.calculateOutput.bind(this);
    this.convertToText = this.convertToText.bind(this);
    this.selectFormula = this.selectFormula.bind(this);
    this.handleAllClicks = this.handleAllClicks.bind(this);
    this.unselect = this.unselect.bind(this);
    this.checkTheFocus = this.checkTheFocus.bind(this);
    this.onAceEditorFocus = this.onAceEditorFocus.bind(this);
    this.onDeleteSomethingInMathMode = this.onDeleteSomethingInMathMode.bind(this);
  }
  shouldComponentUpdate(){
    //this field is uncontrolled by react
    return false;
  }
  componentDidMount(){
    //we want to load mathjax and create the markup from the property value of the field
    loadMathJax(false);
    this.createMarkup();
    
    document.body.addEventListener('click', this.handleAllClicks);
  }
  createMarkup(){
    //straightforward process we find all the formulas and convert it to svg
    (this.refs.input as HTMLInputElement).innerHTML = this.value;
    Array.from((this.refs.input as HTMLInputElement).querySelectorAll("." + this.props.formulaClassName)).forEach((element: HTMLElement)=>{
      toSVG(element, warningImage, null, loadingImage);
    });
  }
  componentDidUpdate(){
    this.value = this.props.value;
  }
  onFocusField(e: React.FocusEvent<any>){
    console.log("focus");
    
    if (this.isBlurDelayed){
      console.log("cancelling next blur");
      this.cancelBlur = true;
    }
    
    //because we cannot get on wheter we are focusing on the mathquill via a focus event we use the contenteditable event
    //because blur lags when the selectedfield is open, we can use it to figure out if mathquill has the focus
    //and cancel the blur event, this would only active if I was on ace editor before
    let target = e.target;
    if (this.selectedMathField && checkIsParentOrSelf(target as HTMLElement, this.selectedMathField.el())){
      this.isOnAceEditor = false;
    }
    
    //On focus field gets called every time the contenteditable gains focus
    //Because there might be elements inside the contenteditable like an image that represents an equation
    //we might check whether the element that allowed us to gain focus was a formula
    if (this.lastMouseedDownElement && this.lastMouseedDownElement.className === this.props.formulaClassName){
      let elem = this.lastMouseedDownElement;
      this.lastMouseedDownElement = null;
      //And we select it
      this.selectFormula(elem);
    }
    
    //Disable any last element just in case of overlap
    this.lastMouseedDownElement = null;
    
    //And trigger the onfocus event for the parent (it will make the toolbar visible and stuff)
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
    if (node.className === this.props.editorClassName){
      return `<span class="${this.props.formulaClassName}">${this.selectedMathField.latex()}</span>`
    }
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
  onBlurField(e: React.ChangeEvent<any> | Event){
    console.log("blur detected");
    
    let actualExecution = ()=>{
      this.isBlurDelayed = false;
      
      //We might want to cancel the blur when
      //A formula is selected this causes the actual field
      //To blur the hell out, however we want to still be focused
      //Even when what it concerns to the browser we are not focused
      if (this.cancelBlur){
        console.log("blur cancelled");
        
        //So we just set the variable to phantom blurred true reset the boolean and exit
        this.cancelBlur = false;
        return;
      }
      console.log("blur");
      
      this.unselect();
      this.props.onBlur();
    }
    
    console.log("delaying blur execution");
    this.isBlurDelayed = true;
    setTimeout(actualExecution, 10);
  }
  focus(){
    console.log("forced focus event");
    
    if (this.isBlurDelayed){
      console.log("cancelling next blur");
      this.cancelBlur = true;
    } else {
      console.log("preemtively cancelling blur");
      this.cancelBlur = true;
      setTimeout(()=>{
        this.cancelBlur = false;
      }, 300);
    }
    
    //This gets called by the parent component to force the focus back
    //as in like when we use the toolbar
    if (this.selectedMathField){
      console.log("forcing onto the math field");
      if (this.isOnAceEditor){
        this.aceEditor.focus();
      } else {
        this.selectedMathField.focus();
      }
    } else {
      (this.refs.input as HTMLDivElement).focus();
    }
  }
  onChange(){
    //This gets called every time the contenteditable changes
    //very good actually and simple
    this.props.onChange(this.calculateOutput());
    
    //The good thing is that it even detects when the formula changes
    //Without even needed to use the event listeners of the formula with
    //the mathquill API
    if (this.selectedFormula){
      //We set it as the selected formula changed
      this.changedSelected = true;
      
      //and set the value of the editor in such case
      //this only happens of course if we are not on the ace editor
      if (!this.isOnAceEditor){
        this.aceEditor.setValue(this.selectedMathField.latex(), -1);
      } else {
        this.selectedMathField.latex(this.aceEditor.getValue());
      }
    }
  }
  execute(command:MathFieldCommandType){
    //This is called by the parent on the case of a toolbar executed command
    if (!this.selectedFormula){
      //Simple as pie in the case of the contenteditable
      document.execCommand("insertHTML", false, command.html);
    } else {
      console.log("executing", command);
      if (!this.isOnAceEditor){
        //This one is more complicated, we want to force the focus back yet again
        //just in case because of madness of all the blur and focus, doesn't hurt
        this.selectedMathField.focus();
        if (!command.useWrite){
          //we call the latex command if not use write
          this.selectedMathField.cmd(command.latex);
        } else {
          //otherwise we call write
          this.selectedMathField.write(command.latex);
        }
      } else {
        this.aceEditor.focus();
        this.aceEditor.session.insert(this.aceEditor.getCursorPosition(), command.latexText);
      }
      
      //Trigger an onchange event as these are not figured by the contenteditable
      //as there is no input per say
      this.onChange();
    }
  }
  selectFormula(target: HTMLElement){
    
    //Sometimes select formula might trigger with the same formula in that case
    //just cancel it out, this might happen eg, with the focus and handle all clicks that both
    //detect the event on first click
    if (target === this.selectedFormula){
      console.log("cancelling due to duplication");
      return;
    }
    
    //We set the cancel the blur to true as the focus will go out of the contenteditable
    //once we are done
    console.log("cancelling next blur");
    this.cancelBlur = true;
    
    //we unselect any previously selected equations
    this.unselect();
    
    //we set is as clear, this comes from an image hence it hasn't been changed
    //and its true to the image
    this.changedSelected = false;
    this.selectedFormula = target as HTMLImageElement;
    
    //Now we do all this garbage of
    //creating the component by hand
    this.selectedMathFieldContainer = document.createElement('div');
    this.selectedMathFieldContainer.setAttribute("contenteditable", "false");
    this.selectedMathFieldContainer.className = this.props.editorClassName;
    
    //shitty styles
    this.selectedMathFieldContainer.style.border = "solid 1px red";
    this.selectedMathFieldContainer.style.display = "block";
    this.selectedMathFieldContainer.style.margin = "30px";
    this.selectedMathFieldContainer.style.position = "relative";
    
    let newElement = document.createElement('span');
    newElement.textContent = this.selectedFormula.alt;
    
    let actualContainerForTheMathField = document.createElement('div');
    actualContainerForTheMathField.className = this.props.editorClassName + "--formula-container";
    
    //shitty styles
    actualContainerForTheMathField.style.border = "solid 1px blue";
    actualContainerForTheMathField.style.padding = "5px 10px";
    actualContainerForTheMathField.style.position = "relative";
    actualContainerForTheMathField.style.alignItems = "center";
    actualContainerForTheMathField.style.justifyContent = "center";
    actualContainerForTheMathField.style.display = "flex";
    
    actualContainerForTheMathField.appendChild(newElement);
    this.selectedMathFieldContainer.appendChild(actualContainerForTheMathField);
    
    let editorContainer = document.createElement('div');
    editorContainer.className = this.props.editorClassName + "--formula-text-editor";
    
    //shitty styles
    editorContainer.style.border = "solid 1px green";
    editorContainer.style.height = "100px";
    editorContainer.style.position = "relative";
    
    let editor = document.createElement('div');
    editor.style.position = "absolute";
    editor.style.width = "100%"
    editor.style.height = "100%";
    editor.textContent = this.selectedFormula.alt;
    
    editorContainer.appendChild(editor);
    
    this.selectedMathFieldContainer.appendChild(editorContainer);
    
    this.selectedFormula.parentElement.replaceChild(this.selectedMathFieldContainer, this.selectedFormula);
    
    //Now we create the math field from the span in the middle
    this.selectedMathField = this.MQInterface.MathField(newElement);

    //And we give it focus, this is when the onblur event of the contenteditable will
    //be called and we will be phantom blurred
    this.selectedMathField.focus();
    
    //And we create the editor for the fields
    this.aceEditor = (window as any).ace.edit(editor);
    this.aceEditor.session.setMode("ace/mode/latex");
    this.aceEditor.renderer.setShowGutter(false);
    this.aceEditor.renderer.setOption("fontSize", "20px");
    this.aceEditor.session.setUseWrapMode(true);
    this.aceEditor.on("focus", this.onAceEditorFocus);
    
    this.isOnAceEditor = false;
    
    window.addEventListener("keyup", this.onDeleteSomethingInMathMode, false);
  }
  onDeleteSomethingInMathMode(e: KeyboardEvent){
    console.log("wut", e);
    let key = (e as any).keyCode || e.charCode;
    if (key === 8 || key === 46){
      this.onChange();
    }
  }
  onAceEditorFocus(){
    console.log("focus on ace");
    //we want to make sure that the event
    //we should cancel the blur if there's a blur event
//    if (this.isBlurDelayed){
//      console.log("cancelling next blur");
//      this.cancelBlur = true;
//    }
    this.isOnAceEditor = true;
  }
  handleAllClicks(e: Event){
    //This detects clicks everywhere in any element
    console.log("detected click at", e.target);
    let clickedTarget:HTMLElement = e.target as HTMLElement;
    
    if (clickedTarget.className === this.props.formulaClassName){
      //if we click on a formula, we want to select it
      //this is the part where select formula might be called twice because
      //of the onfocus event and this one both see it, but no problem
      //since there is duplication cancelling in select formula
      //and focus will win every time because it trigger first
      this.selectFormula(clickedTarget);
    } else {
      //If we didn't click a formula  we need to check whether this is the field
      let areWeInsideTheElement = checkIsParentOrSelf(clickedTarget, this.refs.input as HTMLElement);
      
      //If this is the field
      if (areWeInsideTheElement){
        
        //we might check wheter we are inside the formula editor
        let areWeInsideFormulaEditor = this.selectedMathFieldContainer && checkIsParentOrSelf(clickedTarget, this.selectedMathFieldContainer);
        
        //if we are not, yet we clicked somewhere in the contenteditable
        //we just unselect it
        if (!areWeInsideFormulaEditor){
          this.unselect();
        }
        return;
      }
      
      //We force the focus back if we are in the mathfield as it tends to lose it
      if (this.selectedMathField){
        this.focus();
      }
    }
  }
  unselect(){
    if (this.selectedFormula){
      console.log("unselect");

      
      this.selectedMathFieldContainer.parentElement.replaceChild(this.selectedFormula, this.selectedMathFieldContainer);
      if (this.changedSelected){
        let latex = this.selectedMathField.latex();
        this.selectedMathField.revert();
        this.selectedFormula.alt = latex;
        toSVG(this.selectedFormula, warningImage);
      }
      
      this.selectedMathField = null;
      this.selectedMathFieldContainer = null;
      this.selectedFormula = null;
      
      this.aceEditor.destroy();
      this.aceEditor = null;
      this.isOnAceEditor = false;
      
      window.removeEventListener("keyup", this.onDeleteSomethingInMathMode);
    }
  }
  componentWillUnmount(){
    document.body.removeEventListener('click', this.handleAllClicks);
  }
  checkTheFocus(e: React.MouseEvent<any>){
    console.log("checking the focus at", e.target);
    this.lastMouseedDownElement = e.target as HTMLElement;
  }
  render(){
    return <div className={this.props.className} contentEditable spellCheck={false} onFocus={this.onFocusField} ref="input" onBlur={this.onBlurField}
       onInput={this.onChange} style={{position: "relative"}} onMouseDown={this.checkTheFocus}/>
  }
}