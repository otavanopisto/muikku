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
  selectedFormulaId: string,
  isFocused: boolean
}

export default class MathField extends React.Component<MathFieldProps, MathFieldState> {
  private cancelRemovalOfFocus: boolean;
  private value: string;
  constructor(props: MathFieldProps){
    super(props);
    
    this.state = {
      selectedFormulaId: null,
      isFocused: false
    }
    
    this.selectFormula = this.selectFormula.bind(this);
    this.onFocusField = this.onFocusField.bind(this);
    this.onBlurField = this.onBlurField.bind(this);
    this.onCommand = this.onCommand.bind(this);
    this.cancelBlur = this.cancelBlur.bind(this);
  }
  selectFormula(formulaId: string){
    //this.setState({
    //  selectedFormulaId: formulaId
    //});
  }
  onFocusField(){
    if (!this.state.isFocused){
      this.setState({
        isFocused: true
      });
    }
  }
  onCommand(command: MathFieldCommandType){
    if (!this.state.selectedFormulaId){
      document.execCommand("insertHTML", false, command.html);
    }
  }
  onBlurField(){
    if (this.state.isFocused && !this.cancelRemovalOfFocus){
      this.setState({
        isFocused: false
      });
    } else if (this.cancelRemovalOfFocus){
      (this.refs.input as HTMLDivElement).focus();
    }
    this.cancelRemovalOfFocus = false;
  }
  cancelBlur(){
    this.cancelRemovalOfFocus = true;
    (this.refs.input as Field).focus();
  }
  render(){
    return <div>
     <Toolbar isOpen={this.props.toolbarAlwaysVisible || this.state.isFocused} onToolbarAction={this.cancelBlur}
      className={this.props.toolbarClassName} i18n={this.props.i18n} onCommand={this.onCommand}/>
     <Field className={this.props.className} onFocus={this.onFocusField} onBlur={this.onBlurField}
       onChange={this.props.onChange} value={this.props.value} formulaClassName={this.props.formulaClassName}
       selectedFormulaId={this.state.selectedFormulaId} ref="input"/>
    </div>
  }
}