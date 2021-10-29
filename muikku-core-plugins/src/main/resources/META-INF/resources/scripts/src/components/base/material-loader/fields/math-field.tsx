import * as React from "react";
import MathField from './better-math-field';
import { i18nType } from "~/reducers/base/i18n";
import '~/sass/elements/math-field.scss';
import equals = require("deep-equal");
import Synchronizer from "./base/synchronizer";
import { UsedAs, FieldStateStatus } from "~/@types/shared";

interface MathFieldProps {
  type: string,
  content: {
    name: string
  },
  i18n: i18nType,
  userId: number,
  usedAs: UsedAs;
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
  syncError: string,

  fieldSavedState: FieldStateStatus,
}

export default class TextField extends React.Component<MathFieldProps, MathFieldState> {
  constructor(props: MathFieldProps){
    super(props);

    this.state = {
      value: props.initialValue || '',

      //modified synced and syncerror are false, true and null by default
      modified: false,
      synced: true,
      syncError: null,

      fieldSavedState: null,
    }

    this.setValue = this.setValue.bind(this);
    this.onFieldSavedStateChange = this.onFieldSavedStateChange.bind(this);
  }
  onFieldSavedStateChange(savedState: FieldStateStatus){
    this.setState({
      fieldSavedState: savedState
    });
  }
  shouldComponentUpdate(nextProps: MathFieldProps, nextState: MathFieldState){
    return !equals(nextProps.content, this.props.content) || this.props.readOnly !== nextProps.readOnly || !equals(nextState, this.state)
    || this.state.modified !== nextState.modified || this.state.synced !== nextState.synced || this.state.syncError !== nextState.syncError;
  }
  setValue(newValue: string){
    this.setState({
      value: newValue
    });
    this.props.onChange && this.props.onChange(this, this.props.content.name, newValue);
  }
  render(){
    // NOTE you cannot change the formula class name unless you want to break backwards compatibility
    // backwards compability has been broken since you changed the class name from muikku-math-exercise-formula to material-page__mathfield-formula
    // this means old formulas will 100% fail to parse

    let fieldSavedStateClass = "";
    if (this.state.fieldSavedState === "ERROR") {
      fieldSavedStateClass = "state-ERROR";
    } else if (this.state.fieldSavedState === "SAVING") {
      fieldSavedStateClass = "state-SAVING";
    } else if (this.state.fieldSavedState === "SAVED") {
      fieldSavedStateClass = "state-SAVED";
    }

    return <div className={`material-page__mathfield-wrapper ${fieldSavedStateClass}`}>
      <Synchronizer
        synced={this.state.synced}
        syncError={this.state.syncError}
        i18n={this.props.i18n}
        onFieldSavedStateChange={this.onFieldSavedStateChange.bind(this)}
      />
      <MathField ref="base" className="material-page__mathfield"
        userId={this.props.userId}
        value={this.state.value} onChange={this.setValue}
        formulaClassName="material-page__mathfield-formula"
        editorClassName="material-page__mathfield-editor"
        imageClassName="material-page__mathfield-image"
        toolbarClassName="material-page__mathfield-toolbar" i18n={{
          symbols: this.props.i18n.text.get("plugin.workspace.mathField.symbols"),
          relations: this.props.i18n.text.get("plugin.workspace.mathField.relations"),
          geometryAndVectors: this.props.i18n.text.get("plugin.workspace.mathField.geometryAndVectors"),
          setTheoryNotation: this.props.i18n.text.get("plugin.workspace.mathField.setTheoryNotation"),
          mathFormulas: this.props.i18n.text.get("plugin.workspace.mathField.addMathFormula"),
          operators: this.props.i18n.text.get("plugin.workspace.mathField.operators"),
          image: this.props.i18n.text.get("plugin.workspace.mathField.addImage"),
        }} readOnly={this.props.readOnly} dontLoadACE={this.props.readOnly}
        dontLoadMQ={this.props.readOnly}/>
    </div>
  }
}
