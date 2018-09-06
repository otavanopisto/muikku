import * as React from "react";
import { HTMLtoReactComponent, guidGenerator } from "~/util/modifiers";
import $ from '~/lib/jquery';
import Toolbar, { MathFieldCommandType } from './toolbar';
import equals = require("deep-equal");
import { processMathInPage } from "~/lib/mathjax";
import Field from './field';

interface MathFieldProps {
  className?: string,
  formulaClassName: string,
  toolbarClassName: string,
  editorClassName: string,
  value: string,
  onChange: (value: string)=>any,
  i18n: {
    basicsAndSymbols: string,
    algebra: string,
    geometryAndVectors: string,
    logic: string,
    moreMath: string,
    mathOperations: string
  },
  toolbarAlwaysVisible?: boolean
}

interface MathFieldState {
  isFocused: boolean,
  expandMath: boolean
}

export default class MathField extends React.Component<MathFieldProps, MathFieldState> {
  //private cancelRemovalOfFocus: boolean;
  private value: string;
  constructor(props: MathFieldProps){
    super(props);
    
    this.state = {
      isFocused: false,
      expandMath: false
    }
    
    this.onFocusField = this.onFocusField.bind(this);
    this.onBlurField = this.onBlurField.bind(this);
    this.onCommand = this.onCommand.bind(this);
    this.cancelBlur = this.cancelBlur.bind(this);
    this.openMathExpanded = this.openMathExpanded.bind(this);
    this.closeMathExpanded = this.closeMathExpanded.bind(this);
    this.createNewLatex = this.createNewLatex.bind(this);
  }
  onFocusField(){
    //This is triggered when the field itself gains focus
    //makes the thing set the state to focused so as to show the toolbar
    //it triggers several times
    if (!this.state.isFocused){
      this.setState({
        isFocused: true
      });
    }
  }
  onCommand(command: MathFieldCommandType){
    (this.refs.input as Field).execute(command);
  }
  onBlurField(){
    //When the field blurs happens it can be real or fake
    //the unselect function allows me to unselect the selection of an equation in the field
    //I should trigger it if I am going to really remove the focus
    console.log("triggered blur here");
    this.setState({
      isFocused: false
    });
    
//    //I first check wheter it is focused and if I have no cancel of the removal, that is a normal blur event
//    //So I just unfocus to remove the toolbar
//    if (this.state.isFocused && !this.cancelRemovalOfFocus){
//      this.setState({
//        isFocused: false
//      });
//    } else if (this.cancelRemovalOfFocus){
//      //if I however I want to cancel the removal of the focus because I used the toolbar
//      //since this triggers on a blur event I want to force the focus back
//      console.log("recovering focus from blur");
//      (this.refs.input as Field).focus();
//    }
//    
//    //if I didn't cancel the removal of the focus
//    if (!this.cancelRemovalOfFocus){
//      //I want to make sure that any selected equations unselect
//      unselect();
//    }
//    
//    //And let's restore this variable if we happen to use it
//    this.cancelRemovalOfFocus = false;
  }
  cancelBlur(){
    //this gets triggered once we have a mousedown event (before the blur)
    //on the toolbar, so we want to cancel it
    console.log("cancelling the blur from the mousedown event");
    (this.refs.input as Field).focus();
  }
  openMathExpanded(){
    this.setState({
      expandMath: true
    });
  }
  closeMathExpanded(){
    this.setState({
      expandMath: false
    });
  }
  createNewLatex(){
    //this will trigger the onLatexModeOpen from the Field so the toolbar will react after all
    (this.refs.input as Field).createNewLatex();
  }
  render(){
    return <div>
     <Toolbar isOpen={this.props.toolbarAlwaysVisible || this.state.isFocused} onToolbarAction={this.cancelBlur}
      className={this.props.toolbarClassName} i18n={this.props.i18n} onCommand={this.onCommand}
      onRequestToOpenMathMode={this.createNewLatex} isMathExpanded={this.state.expandMath}/>
     <Field className={this.props.className} onFocus={this.onFocusField} onBlur={this.onBlurField}
       onChange={this.props.onChange} value={this.props.value} formulaClassName={this.props.formulaClassName}
       editorClassName={this.props.editorClassName} toolbarClassName={this.props.toolbarClassName}
       onLatexModeOpen={this.openMathExpanded} onLatexModeClose={this.closeMathExpanded}
       ref="input" latexPlaceholderText="LaTeX"/>
    </div>
  }
}