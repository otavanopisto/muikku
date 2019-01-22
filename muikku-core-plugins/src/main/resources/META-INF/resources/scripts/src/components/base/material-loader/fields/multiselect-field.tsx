import * as React from "react";
import equals = require("deep-equal");
import { i18nType } from "~/reducers/base/i18n";
import Dropdown from "~/components/general/dropdown";

interface MultiSelectFieldProps {
  type: string,
  content: {
    name: string,
    explanation: string,
    listType: "checkbox-horizontal" | "checkbox-vertical",
    options: Array<{
      name: string,
      text: string,
      correct: boolean
    }>
  },
  readOnly?: boolean,
  initialValue?: string,
  onChange?: (context: React.Component<any, any>, name: string, newValue: any)=>any,
  i18n: i18nType,
      
  displayRightAnswers?: boolean,
  checkForRightness?: boolean,
  onRightnessChange?: (name: string, value: boolean)=>any
}

interface MultiSelectFieldState {
  values: Array<string>,
  modified: boolean,
  synced: boolean,
  syncError: string,
  
  rightnessState: "UNKNOWN" | Array<"PASS" | "FAIL">
}

export default class MultiSelectField extends React.Component<MultiSelectFieldProps, MultiSelectFieldState> {
  constructor(props: MultiSelectFieldProps){
    super(props);
    
    this.toggleValue = this.toggleValue.bind(this);
    this.checkForRightness = this.checkForRightness.bind(this);
    
    let values:Array<string> = ((props.initialValue && JSON.parse(props.initialValue)) || []) as Array<string>;
    this.state = {
      values: values.sort(),
      modified: false,
      synced: true,
      syncError: null,
      
      rightnessState: null
    }
  }
  shouldComponentUpdate(nextProps: MultiSelectFieldProps, nextState: MultiSelectFieldState){
    return !equals(nextProps.content, this.props.content) || this.props.readOnly !== nextProps.readOnly || !equals(nextState, this.state) 
    || this.props.i18n !== nextProps.i18n || this.props.displayRightAnswers !== nextProps.displayRightAnswers || this.props.checkForRightness !== nextProps.checkForRightness;
  }
  checkForRightness(){
    if (!this.props.checkForRightness){
      return;
    }
    let actuallyCorrectAnswers = this.props.content.options.filter(a=>a.correct);
    if (!actuallyCorrectAnswers.length){
      if (this.state.rightnessState !== "UNKNOWN"){
        this.setState({
          rightnessState: "UNKNOWN"
        });
        this.props.onRightnessChange(this.props.content.name, true);
      }
      return;
    }
    
    let newRightnessState:Array<"PASS" | "FAIL"> = this.props.content.options.map((option, index)=>{
      let isDefinedAsCorrect = this.state.values.includes(option.name);
      return option.correct === isDefinedAsCorrect ? "PASS" : "FAIL";
    });
    
    if (!equals(newRightnessState, this.state.rightnessState)){
      this.setState({
        rightnessState: newRightnessState
      });
    }
    
    let isRight = newRightnessState.includes("FAIL");
    let wasRight = this.state.rightnessState === "UNKNOWN" || !this.state.rightnessState.includes("FAIL");
    if (isRight && !wasRight){
      this.props.onRightnessChange(this.props.content.name, true);
    } else if (!isRight && wasRight){
      this.props.onRightnessChange(this.props.content.name, false);
    }
  }
  componentDidMount(){
    this.checkForRightness();
  }
  componentDidUpdate(prevProps: MultiSelectFieldProps, prevState: MultiSelectFieldState){
    this.checkForRightness();
  }
  toggleValue(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>){
    let nValues = this.state.values.slice(0);
    if (this.state.values.includes(e.target.value)){
      nValues.filter(v=>v!==e.target.value)
    } else {
      nValues.push(e.target.value);
      nValues.sort();
    }
    
    this.props.onChange && this.props.onChange(this, this.props.content.name, JSON.stringify(nValues));
    this.setState({
      values: nValues
    }, this.checkForRightness);
  }
  render(){
    let markRightAnswers = false;
    let rightAnswerSummaryComponent = null;
    if (this.props.displayRightAnswers && !(this.props.checkForRightness && this.state.rightnessState !== "UNKNOWN" && !this.state.rightnessState.includes("FAIL"))){
      let rightAnswersFound = this.props.content.options.filter(a=>a.correct);
      if (rightAnswersFound.length){
        markRightAnswers = true
        rightAnswerSummaryComponent = <span className="muikku-field-examples">
          <span className="muikku-field-examples-title">
            {this.props.i18n.text.get("plugin.workspace.assigment.checkAnswers.correctSummary.title")}
          </span>
          {rightAnswersFound.map((answer, index)=>
            <span key={index} className="muikku-field-example">{answer.text}</span>
          )}
          {this.props.content.explanation ? <span className="explanation-wrapper">
             <Dropdown openByHover modifier="word-definition" content={this.props.content.explanation}>
               <span className="explanation-button icon-explanation"/>
             </Dropdown>
           </span> : null}
        </span>;
      } else if (this.props.content.explanation) {
        rightAnswerSummaryComponent = <span className="muikku-field-examples">
          <span className="muikku-field-examples-title">
            {this.props.i18n.text.get("plugin.workspace.assigment.checkAnswers.detailsSummary.title")}
          </span>
          <span className="muikku-field-example">{this.props.content.explanation}</span>
        </span>;
      }
    }
    
    let elementClassNameState = this.props.checkForRightness && this.state.rightnessState ?
        "state-" + (this.state.rightnessState === "UNKNOWN" ? "UNKNOWN" : (this.state.rightnessState.includes("FAIL") ? "FAIL" : "PASS")) : "";
    
    return <span className={`muikku-checkbox-field checkbox-${this.props.content.listType === "checkbox-horizontal" ? "horizontal" : "vertical"} muikku-field ${elementClassNameState}`}>
      {this.props.content.options.map((o, index)=>{
        let className = null;
        if (markRightAnswers && o.correct){
          className = "muikku-select-field-right-answer"
        } else if (markRightAnswers){
          className = "muikku-select-field-wrong-answer"
        }
        return <span key={o.name} className={className}>
          <input type="checkbox" value={o.name} checked={this.state.values.includes(o.name)} onChange={this.toggleValue} disabled={this.props.readOnly}/>
          <label>{o.text}</label>
        </span>
      })}
    </span>
  }
}