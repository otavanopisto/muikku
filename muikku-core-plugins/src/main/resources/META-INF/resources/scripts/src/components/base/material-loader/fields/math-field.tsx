import * as React from "react";
import MathField from './better-math-field';
import { i18nType } from "~/reducers/base/i18n";
import '~/sass/elements/fields/math-field.scss';

interface MathFieldProps {
  type: string,
  content: {
    name: string
  },
  i18n: i18nType,
  
  readOnly?: boolean,
  value?: string
}

interface MathFieldState {
  value: string,
  modified: boolean,
  synced: boolean
}

export default class TextField extends React.Component<MathFieldProps, MathFieldState> {
  constructor(props: MathFieldProps){
    super(props);
    
    this.state = {
      value: props.value || '',
      modified: false,
      synced: true
    }
    
    this.setValue = this.setValue.bind(this);
  }
  componentWillReceiveProps(nextProps: MathFieldProps){
    if (this.props.value !== nextProps.value){
      this.setValue(nextProps.value);
    }
    
    this.setState({
      modified: false,
      synced: true
    });
  }
  setValue(newValue: string){
    //console.log(newValue);
    this.setState({
      value: newValue
    });
  }
  render(){
    //NOTE you cannot change the formula class name unless you want to break backwards compatibility
    return <MathField className="muikku-math-exercise-field-editor"
      value={this.state.value} onChange={this.setValue}
      formulaClassName="muikku-math-exercise-formula"
      editorClassName="muikku-math-exercise-editor"
      toolbarClassName="muikku-math-exercise-toolbar" i18n={{
        basicsAndSymbols: this.props.i18n.text.get("plugin.workspace.mathField.basicsAndSymbols"),
        algebra: this.props.i18n.text.get("plugin.workspace.mathField.algebra"),
        geometryAndVectors: this.props.i18n.text.get("plugin.workspace.mathField.geometryAndVectors"),
        logic: this.props.i18n.text.get("plugin.workspace.mathField.logic"),
        moreMath: this.props.i18n.text.get("plugin.workspace.mathField.moreMath"),
        mathOperations: this.props.i18n.text.get("plugin.workspace.mathField.mathOperations"),
      }} readOnly={this.props.readOnly} dontLoadACE={this.props.readOnly} dontLoadMQ={this.props.readOnly}/>
  }
}