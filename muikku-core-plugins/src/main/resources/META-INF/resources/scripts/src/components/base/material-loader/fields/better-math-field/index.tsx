import * as React from "react";
import { HTMLtoReactComponent, guidGenerator } from "~/util/modifiers";
import $ from '~/lib/jquery';
import Toolbar, { MathFieldCommandType } from './toolbar';
import equals = require("deep-equal");

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
    mathOperations: string
  },
  toolbarAlwaysVisible?: boolean
}

interface MathFieldState {
  value: string,
  selectedFormulaId: string,
  isFocused: boolean
}

export default class MathField extends React.Component<MathFieldProps, MathFieldState> {
  private cancelRemovalOfFocus: boolean;
  constructor(props: MathFieldProps){
    super(props);
    
    this.state = {
      value: props.value,
      selectedFormulaId: null,
      isFocused: false
    }
    
    this.selectFormula = this.selectFormula.bind(this);
    this.onFocusField = this.onFocusField.bind(this);
    this.onBlurField = this.onBlurField.bind(this);
    this.onCommand = this.onCommand.bind(this);
  }
  shouldComponentUpdate(nextProps: MathFieldProps, nextState: MathFieldState){
    let nextPropsNoValue:MathFieldProps = {...nextProps, ...{value: null}};
    let thisPropsNoValue:MathFieldProps = {...(this.props as any), ...{value: null}};
    if (!equals(nextPropsNoValue, thisPropsNoValue) || !equals(nextState, this.state)){
      return true;
    }
    return nextProps.value !== this.state.value;
  }
  selectFormula(formulaId: string){
    this.setState({
      selectedFormulaId: formulaId
    });
  }
  onFocusField(){
    if (!this.state.isFocused){
      this.setState({
        isFocused: true
      });
    }
  }
  onCommand(command: MathFieldCommandType){
    this.cancelRemovalOfFocus = true;
    if (!this.state.selectedFormulaId){
      (this.refs.input as HTMLDivElement).focus();
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
  render(){
    return <div>
     <Toolbar isOpen={this.props.toolbarAlwaysVisible || this.state.isFocused}
      className={this.props.toolbarClassName + (this.state.isFocused ? this.props.toolbarClassName + "--focused" : null)} i18n={this.props.i18n} onCommand={this.onCommand}/>
     <div className={this.props.className} contentEditable spellCheck={false} onFocus={this.onFocusField} ref="input" onBlur={this.onBlurField}>{
        HTMLtoReactComponent($("<container>" + this.state.value + "</container>")[0], (Tag: string, elementProps: any, children: Array<any>, element: HTMLElement)=>{
          if (Tag === "container"){
            return children;
          } else if (Tag === "span" && elementProps.className === this.props.formulaClassName && elementProps.key !== this.state.selectedFormulaId) {
            if (!elementProps.dataKey){
              elementProps.key = guidGenerator();
            }
           elementProps.onClick = this.selectFormula.bind(this, elementProps.key);
          }
        
          if (Tag === "span" && elementProps.className === this.props.formulaClassName && elementProps.key === this.state.selectedFormulaId){
            //TODO return editable math
          }
          return <Tag {...elementProps}>{children}</Tag>
        })
      }</div>
    </div>
  }
}