import * as React from "react";
import { HTMLtoReactComponent, guidGenerator } from "~/util/modifiers";
import $ from '~/lib/jquery';
import Toolbar, { MathFieldCommandType } from './toolbar';
import equals = require("deep-equal");
import { toSVG, loadMathJax, getMQInterface } from "~/lib/mathjax";
import loadingImage from './loading-image';
import warningImage from './warning-image';

const TIMEOUT_FOR_BLUR_EVENT = 10;
const TIMEOUT_FOR_CANCELLING_BLUR = 300;

interface FieldProps {
  className?: string,
  formulaClassName: string,
  editorClassName: string,
  toolbarClassName: string,
  value: string,
  latexPlaceholderText: string,
  onChange: (str: string)=>any,
  onBlur: ()=>any,
  onFocus: ()=>any,
  onLatexModeOpen: ()=>any,
  onLatexModeClose: ()=>any,
  readOnly?: boolean
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
    this.MQInterface = getMQInterface;

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
    this.onAceEditorInput = this.onAceEditorInput.bind(this);
    this.onDeleteSomethingInMathMode = this.onDeleteSomethingInMathMode.bind(this);
  }
  shouldComponentUpdate(){
    //this field is uncontrolled by react
    return false;
  }
  componentDidMount(){
    //we want to load mathjax and create the markup from the property value of the field
    loadMathJax();
    this.createMarkup();

    document.execCommand("enableObjectResizing", false);

    if (!this.props.readOnly){
      document.body.addEventListener('click', this.handleAllClicks);
    }
  }
  componentWillReceiveProps(nextProps: FieldProps){
    if (nextProps.className !== this.props.className){
      (this.refs.input as HTMLElement).className = nextProps.className;
    }

    if (nextProps.readOnly !== this.props.readOnly){
      if (nextProps.readOnly){
        (this.refs.input as HTMLElement).classList.add("disabled");
        (this.refs.input as HTMLElement).removeAttribute("contentEditable");
        document.body.removeEventListener('click', this.handleAllClicks);
      } else {
        (this.refs.input as HTMLElement).classList.remove("disabled");
        (this.refs.input as HTMLElement).contentEditable = "true";
        document.body.addEventListener('click', this.handleAllClicks);
      }
    }

    if (nextProps.value === this.value){
      //console.log("change denied");
      return;
    }

    this.value = nextProps.value;
    this.createMarkup();
  }
  createMarkup(){
    //we might unselect any previously selected equation
    //this is for when the field updates
    this.unselect();

    //straightforward process we find all the formulas and convert it to svg
    (this.refs.input as HTMLInputElement).innerHTML = this.value;
    Array.from((this.refs.input as HTMLInputElement).querySelectorAll("." + this.props.formulaClassName)).forEach((element: HTMLElement)=>{
      toSVG(element, warningImage, null, loadingImage);
    });
  }
  onFocusField(e: React.FocusEvent<any>){
    //console.log("focus");

    if (this.isBlurDelayed){
      //console.log("cancelling next blur");
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
      this.selectFormula(elem as HTMLImageElement);
    }

    //Disable any last element just in case of overlap
    this.lastMouseedDownElement = null;

    //And trigger the onfocus event for the parent (it will make the toolbar visible and stuff)
    (this.refs.input as HTMLElement).classList.add("focused");
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
      let latex = this.selectedMathField.latex();
      if (latex.trim() === ""){
        return "";
      }
      return `<span class="${this.props.formulaClassName}">${latex}</span>`
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
      extras += ' class="' + node.className + '"';
    }
    return "<" + tag + extras + ">" + kids + "</" + tag + ">";
  }
  onBlurField(e: React.ChangeEvent<any> | Event){
    //console.log("blur detected");

    let actualExecution = ()=>{
      this.isBlurDelayed = false;

      //We might want to cancel the blur when
      //A formula is selected this causes the actual field
      //To blur the hell out, however we want to still be focused
      //Even when what it concerns to the browser we are not focused
      if (this.cancelBlur){
        //console.log("blur cancelled");

        //So we just set the variable to phantom blurred true reset the boolean and exit
        this.cancelBlur = false;

        //I have no idea why the contenteditable loses focus unless it's recalled on
        //the blur event but this works
        if (!this.selectedMathField){
          this.focus();
        }
        return;
      }
      //console.log("blur");

      this.unselect();
      (this.refs.input as HTMLElement).classList.remove("focused");
      this.props.onBlur();
    }

    if (this.cancelBlur){
      //console.log("cancelling blur right away");
      this.cancelBlur = false;

      //I have no idea why the contenteditable loses focus unless it's recalled on
      //the blur event but this works
      if (!this.selectedMathField){
        this.focus();
      }
      return;
    }
    //We want to delay blur execution in order to catch focus events that
    //might want to stop the blur execution
    //console.log("delaying blur execution");
    this.isBlurDelayed = true;
    setTimeout(actualExecution, TIMEOUT_FOR_BLUR_EVENT);
  }
  focus(avoidCancellingBlur?: boolean){
    //console.log("forced focus event");

    if (!avoidCancellingBlur){
      //We want to cancel a possible blur if there's a blur event but the focus is forced back
      if (this.isBlurDelayed){
        //console.log("cancelling next blur");
        this.cancelBlur = true;
      } else {
        //Sometimes however the blur event hasn't been called when the thing
        //wants to be focused back, for example, on the mousedown event on an external source
        //it might still want to cancel the blur but we still haven't gotten the blur event
        //So we cancel the blur just in case
        //We still reset the variable in case this was just a random blur event
        //From all the mayhem random focusing that we get
        //console.log("preemtively cancelling blur");
        this.cancelBlur = true;
        setTimeout(()=>{
          this.cancelBlur = false;
        }, TIMEOUT_FOR_CANCELLING_BLUR);
      }
    }

    //This gets called by the parent component to force the focus back
    //as in like when we use the toolbar
    if (this.selectedMathField){
      //console.log("forcing onto the math field");
      if (this.isOnAceEditor){
        this.aceEditor.focus();
      } else {
        this.selectedMathField.focus();
      }
    } else {
      (this.refs.input as HTMLDivElement).focus();
    }

    (this.refs.input as HTMLElement).classList.add("focused");
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
      (this.refs.input as HTMLDivElement).focus();
      if (command.html){
        //Simple as pie in the case of the contenteditable
        document.execCommand("insertHTML", false, command.html);
      } else {
        this.createNewLatex();
        this.execute(command);
      }
    } else {
      //console.log("executing", command);
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
  createNewLatex(){
    document.execCommand("insertHTML", false, `<img class="${this.props.formulaClassName}"/>`);
    let image:HTMLImageElement = (this.refs.input as HTMLDivElement).querySelector("img:not([alt])") as HTMLImageElement;
    this.selectFormula(image);
  }
  selectFormula(target: HTMLImageElement){

    //Sometimes select formula might trigger with the same formula in that case
    //just cancel it out, this might happen eg, with the focus and handle all clicks that both
    //detect the event on first click
    if (target === this.selectedFormula){
      //console.log("cancelling due to duplication");
      return;
    }

    //console.log("selecting", target);

    //We set the cancel the blur to true as the focus will go out of the contenteditable
    //once we are done
    //console.log("cancelling next blur");
    this.cancelBlur = true;

    //we unselect any previously selected equations
    this.unselect();

    //we set is as clear, this comes from an image hence it hasn't been changed
    //and its true to the image
    this.changedSelected = false;
    this.selectedFormula = target;

    //Now we do all this garbage of
    //creating the component by hand
    this.selectedMathFieldContainer = document.createElement('div');
    this.selectedMathFieldContainer.setAttribute("contenteditable", "false");
    this.selectedMathFieldContainer.className = this.props.editorClassName;

    //styles, to provide functionality without the SCSS
//    this.selectedMathFieldContainer.style.border = "solid 1px red";
//    this.selectedMathFieldContainer.style.display = "block";
//    this.selectedMathFieldContainer.style.margin = "30px";
//    this.selectedMathFieldContainer.style.position = "relative";

    let newElement = document.createElement('span');
    newElement.textContent = this.selectedFormula.alt || "";

    let actualContainerForTheMathField = document.createElement('div');
    actualContainerForTheMathField.className = this.props.editorClassName + "--formula-container";

    //styles, to provide functionality without the SCSS
//    actualContainerForTheMathField.style.border = "solid 1px blue";
//    actualContainerForTheMathField.style.padding = "5px 10px";
//    actualContainerForTheMathField.style.position = "relative";
//    actualContainerForTheMathField.style.alignItems = "center";
//    actualContainerForTheMathField.style.justifyContent = "center";
//    actualContainerForTheMathField.style.display = "flex";

    actualContainerForTheMathField.appendChild(newElement);
    this.selectedMathFieldContainer.appendChild(actualContainerForTheMathField);

    let editorContainer = document.createElement('div');
    editorContainer.className = this.props.editorClassName + "--formula-text-editor";

    //styles, to provide functionality without the SCSS
//    editorContainer.style.border = "solid 1px green";
//    editorContainer.style.height = "100px";
//    editorContainer.style.position = "relative";

    let editor = document.createElement('div');
    editor.style.position = "absolute";
    editor.style.width = "100%"
    editor.style.height = "100%";
    editor.textContent = this.selectedFormula.alt || "";

    editorContainer.appendChild(editor);

    this.selectedMathFieldContainer.appendChild(editorContainer);

    this.selectedFormula.parentElement.replaceChild(this.selectedMathFieldContainer, this.selectedFormula);

    //Now we create the math field from the span in the middle
    this.selectedMathField = this.MQInterface().MathField(newElement);

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
    this.aceEditor.on("input", this.onAceEditorInput);
    setTimeout(this.onAceEditorInput, 100);

    this.isOnAceEditor = false;

    window.addEventListener("keyup", this.onDeleteSomethingInMathMode, false);

    this.props.onLatexModeOpen();
  }
  onDeleteSomethingInMathMode(e: KeyboardEvent){
    //The delete keys are not triggered as an input event so we need to catch them manually
    //console.log("wut", e);
    let key = (e as any).keyCode || e.charCode;
    if (key === 8 || key === 46){
      this.onChange();
    } else if (key === 27){
      this.unselect(true);
    } else if (key === 13 && !this.isOnAceEditor){
      this.unselect(true, true);
    }
  }
  onAceEditorFocus(){
    //console.log("focus on ace");
    this.isOnAceEditor = true;
  }
  onAceEditorInput(){
    let shouldShow = !this.aceEditor.session.getValue().length;
    let node = this.aceEditor.renderer.emptyMessageNode;
    if (!shouldShow && node) {
      this.aceEditor.renderer.scroller.removeChild(this.aceEditor.renderer.emptyMessageNode);
      this.aceEditor.renderer.emptyMessageNode = null;
    } else if (shouldShow && !node) {
      node = this.aceEditor.renderer.emptyMessageNode = document.createElement("div");
      node.textContent = this.props.latexPlaceholderText;
      node.className = "ace_invisible ace_emptyMessage"
      node.style.padding = "0 9px"
      this.aceEditor.renderer.scroller.appendChild(node);
    }
  }
  handleAllClicks(e: Event){
    //This detects clicks everywhere in any element
    //console.log("detected click at", e.target);
    let clickedTarget:HTMLElement = e.target as HTMLElement;

    if (clickedTarget.className === this.props.formulaClassName){
      //if we click on a formula, we want to select it
      //this is the part where select formula might be called twice because
      //of the onfocus event and this one both see it, but no problem
      //since there is duplication cancelling in select formula
      //and focus will win every time because it trigger first
      this.selectFormula(clickedTarget as HTMLImageElement);
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

        if (this.selectedMathField && this.isOnAceEditor){
          //console.log("Ace editor bug refocus");
          this.focus();
        }
        return;
      }

      //We force the focus back if we are in the mathfield as it tends to lose it
      //but we have to make sure that there is no blur event going on
      if (this.selectedMathField){
        //The reason is that if the click event gets triggered in the 10ms room
        //that the blur event has then it  will refocus and you'll never be able to
        //lose the focus
        if (!this.isBlurDelayed){
          //console.log("click focusing refocus on mathquill")
          this.focus();
        }
      }
    }
  }
  unselect(focusAfterImage?: boolean, selectAfterUnselect?: boolean){
    if (this.selectedFormula){
      //console.log("unselect");

      let latex = this.selectedMathField.latex();
      if (latex.trim() === ""){
        this.selectedMathFieldContainer.parentElement.removeChild(this.selectedMathFieldContainer);
      } else {
        this.selectedMathFieldContainer.parentElement.replaceChild(this.selectedFormula, this.selectedMathFieldContainer);
        if (this.changedSelected){
          this.selectedFormula.alt = latex;
          let cb = (newImage:HTMLImageElement)=>{
            if (focusAfterImage){
              this.focus();
              let range = document.createRange()
              range.setStartAfter(newImage);
              const sel = window.getSelection()
              sel.removeAllRanges()
              sel.addRange(range);
            }
          };
          toSVG(this.selectedFormula, warningImage, cb, loadingImage, cb);
        }
      }

      this.selectedMathField && this.selectedMathField.revert();
      this.selectedMathField = null;
      this.selectedMathFieldContainer = null;
      this.selectedFormula = null;

      this.aceEditor && this.aceEditor.destroy();
      this.aceEditor = null;
      this.isOnAceEditor = false;

      window.removeEventListener("keyup", this.onDeleteSomethingInMathMode);

      this.props.onLatexModeClose();
    }
  }
  componentWillUnmount(){
    document.body.removeEventListener('click', this.handleAllClicks);
  }
  checkTheFocus(e: React.MouseEvent<any>){
    if (this.props.readOnly){
      return;
    }
    //console.log("checking the focus at", e.target);
    this.lastMouseedDownElement = e.target as HTMLElement;
  }
  render(){
    return <div className={this.props.className} contentEditable={!this.props.readOnly} spellCheck={false} onFocus={this.onFocusField} ref="input" onBlur={this.onBlurField}
       onInput={this.onChange} onMouseDown={this.checkTheFocus}/>
  }
}
