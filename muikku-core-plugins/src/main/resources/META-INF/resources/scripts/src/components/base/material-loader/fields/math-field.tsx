import * as React from "react";
import MathField from './better-math-field';
import { i18nType } from "~/reducers/base/i18n";
import '~/sass/elements/fields/math-field.scss';
import equals = require("deep-equal");
import FieldBase from "./base";

interface MathFieldProps {
  type: string,
  content: {
    name: string
  },
  i18n: i18nType,
  
  readOnly?: boolean,
  initialValue?: string,
  onChange?: (context: React.Component<any, any>, name: string, newValue: any)=>any
}

interface MathFieldState {
  value: string,
  
  //This state comes from the context handler in the base
  //We can use it but it's the parent managing function that modifies them
  //We only set them up in the initial state
  modified: boolean,
  synced: boolean,
  syncError: string
}

export default class TextField extends FieldBase<MathFieldProps, MathFieldState> {
  constructor(props: MathFieldProps){
    super(props);
    
    this.state = {
      value: props.initialValue || '',
      
      //modified synced and syncerror are false, true and null by default
      modified: false,
      synced: true,
      syncError: null
    }
    
    this.setValue = this.setValue.bind(this);
  }
  shouldComponentUpdate(nextProps: MathFieldProps, nextState: MathFieldState){
    return !equals(nextProps.content, this.props.content) || this.props.readOnly !== nextProps.readOnly || !equals(nextState, this.state);
  }
  setValue(newValue: string){
    this.props.onChange && this.props.onChange(this, this.props.content.name, newValue);
    this.setState({
      value: newValue
    });
  }
  render(){
    //NOTE you cannot change the formula class name unless you want to break backwards compatibility
    return <MathField ref="base" className="material-page__mathfield"
      value={this.state.value} onChange={this.setValue}
      formulaClassName="material-page__mathfield-formula"
      editorClassName="material-page__mathfield-editor"
      toolbarClassName="material-page__mathfield-toolbar" i18n={{
        basicsAndSymbols: this.props.i18n.text.get("plugin.workspace.mathField.basicsAndSymbols"),
        algebra: this.props.i18n.text.get("plugin.workspace.mathField.algebra"),
        geometryAndVectors: this.props.i18n.text.get("plugin.workspace.mathField.geometryAndVectors"),
        logic: this.props.i18n.text.get("plugin.workspace.mathField.logic"),
        moreMath: this.props.i18n.text.get("plugin.workspace.mathField.moreMath"),
        mathOperations: this.props.i18n.text.get("plugin.workspace.mathField.mathOperations"),
      }} readOnly={this.props.readOnly || !this.loaded} dontLoadACE={this.props.readOnly || !this.loaded}
      dontLoadMQ={this.props.readOnly || !this.loaded}/>
  }
}