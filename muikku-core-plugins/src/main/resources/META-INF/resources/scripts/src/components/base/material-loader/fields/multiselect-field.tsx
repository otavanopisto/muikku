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
      
  displayCorrectAnswers?: boolean,
  checkAnswers?: boolean,
  onAnswerChange?: (name: string, value: boolean)=>any
}

interface MultiSelectFieldState {
  values: Array<string>,
  
  //This state comes from the context handler in the base
  //We can use it but it's the parent managing function that modifies them
  //We only set them up in the initial state
  modified: boolean,
  synced: boolean,
  syncError: string,
  
  //So a multiselect can have the whole value as unknown or have an array regarding whether each answer was correct or not
  answerState: "UNKNOWN" | Array<"PASS" | "FAIL">
}

export default class MultiSelectField extends React.Component<MultiSelectFieldProps, MultiSelectFieldState> {
  constructor(props: MultiSelectFieldProps){
    super(props);
    
    this.toggleValue = this.toggleValue.bind(this);
    this.checkAnswers = this.checkAnswers.bind(this);
    
    //We get the values and parse it from the initial value which is a string
    let values:Array<string> = ((props.initialValue && JSON.parse(props.initialValue)) || []) as Array<string>;
    this.state = {
      values: values.sort(),
      
      //modified synced and syncerror are false, true and null by default
      modified: false,
      synced: true,
      syncError: null,
      
      //Answer state is null
      answerState: null
    }
  }
  shouldComponentUpdate(nextProps: MultiSelectFieldProps, nextState: MultiSelectFieldState){
    return !equals(nextProps.content, this.props.content) || this.props.readOnly !== nextProps.readOnly || !equals(nextState, this.state) 
    || this.props.i18n !== nextProps.i18n || this.props.displayCorrectAnswers !== nextProps.displayCorrectAnswers || this.props.checkAnswers !== nextProps.checkAnswers;
  }
  checkAnswers(){
    //if we are not allowed we return
    if (!this.props.checkAnswers){
      return;
    }
    
    //let's find the actually correct answers from an array
    let actuallyCorrectAnswers = this.props.content.options.filter(a=>a.correct);
    
    //we might not really have any real correct answer
    if (!actuallyCorrectAnswers.length){
      //So we handle accordingly
      if (this.state.answerState !== "UNKNOWN"){
        this.setState({
          answerState: "UNKNOWN"
        });
        this.props.onAnswerChange(this.props.content.name, null);
      }
      return;
    }
    
    //So we calculate the answer state of each field to see what we got
    let newAnswerState:Array<"PASS" | "FAIL"> = this.props.content.options.map((option, index)=>{
      let isDefinedAsCorrect = this.state.values.includes(option.name);
      return option.correct === isDefinedAsCorrect ? "PASS" : "FAIL";
    });
    
    //if it's different from our previous we update accordingly
    if (!equals(newAnswerState, this.state.answerState)){
      this.setState({
        answerState: newAnswerState
      });
    }
    
    //Checking whether we got correct in general
    let isCorrect = newAnswerState.includes("FAIL");
    //if we had no previous answer state or it was unknown
    if (!this.state.answerState || this.state.answerState === "UNKNOWN"){
      //we just make it new
      this.props.onAnswerChange(this.props.content.name, isCorrect);
      return;
    }
    
    //check the previous state and compare to send an update only if necessary
    let wasCorrect = !this.state.answerState.includes("FAIL");
    if (isCorrect && !wasCorrect){
      this.props.onAnswerChange(this.props.content.name, true);
    } else if (!isCorrect && wasCorrect){
      this.props.onAnswerChange(this.props.content.name, false);
    }
  }
  componentDidMount(){
    this.checkAnswers();
  }
  componentDidUpdate(prevProps: MultiSelectFieldProps, prevState: MultiSelectFieldState){
    this.checkAnswers();
  }
  toggleValue(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>){
    //toggles the value of a select field
    
    //the new value will be a copy of the current values so we make a copy
    let nValues = this.state.values.slice(0);
    
    //we check if its there already if it is
    if (this.state.values.includes(e.target.value)){
      //we filter it out
      nValues = nValues.filter(v=>v!==e.target.value)
    //otherwise
    } else {
      //we add it in
      nValues.push(e.target.value);
      nValues.sort();
    }
    
    //we call the onchange function, stringifying it in
    this.props.onChange && this.props.onChange(this, this.props.content.name, JSON.stringify(nValues));
    
    //we set the new state and check for answer afterwards
    this.setState({
      values: nValues
    }, this.checkAnswers);
  }
  render(){
    //whether we mark the correct answers
    let markCorrectAnswers = false;
    //the summary component if necessary
    let correctAnswerSummaryComponent = null;
    //The answer is correct if it is not unknown and has no fails in it
    let answerIsBeingCheckedAndItIsCorrect = this.props.checkAnswers && this.state.answerState && 
      this.state.answerState !== "UNKNOWN" && !this.state.answerState.includes("FAIL");
    
    //if we are told to display the correct answers and the answer is not correct
    if (this.props.displayCorrectAnswers && !answerIsBeingCheckedAndItIsCorrect){
      //check for the correct answers we found
      let correctAnswersFound = this.props.content.options.filter(a=>a.correct);
      //if we got some in there
      if (correctAnswersFound.length){
        //we gotta mark those that are correct
        markCorrectAnswers = true
        //and we make the summary component
        correctAnswerSummaryComponent = <span className="material-page__field-answer-examples">
          <span className="material-page__field-answer-examples-title">
            {this.props.i18n.text.get("plugin.workspace.assigment.checkAnswers.correctSummary.title")}
          </span>
          {correctAnswersFound.map((answer, index)=>
            <span key={index} className="material-page__field-answer-example">{answer.text}</span>
          )}
          {this.props.content.explanation ? <span className="explanation-wrapper">
             <Dropdown openByHover modifier="word-definition" content={this.props.content.explanation}>
               <span className="explanation-button icon-explanation"/>
             </Dropdown>
           </span> : null}
        </span>;
      //otherwise we just show the explanation if we got one
      //this might happen if the state is unknown for example
      } else if (this.props.content.explanation) {
        correctAnswerSummaryComponent = <span className="material-page__field-answer-examples">
          <span className="material-page__field-answer-examples-title">
            {this.props.i18n.text.get("plugin.workspace.assigment.checkAnswers.detailsSummary.title")}
          </span>
          <span className="material-page__field-answer-example">{this.props.content.explanation}</span>
        </span>;
      }
    }
    
    //the classname we add to the element itself depending to the state, and only available if we check answers
    let elementClassNameState = this.props.checkAnswers && this.state.answerState ?
        "state-" + (this.state.answerState === "UNKNOWN" ? "UNKNOWN" : (this.state.answerState.includes("FAIL") ? "FAIL" : "PASS")) : "";
    
    //and we render
    return <span className={`material-page__checkbox-wrapper material-page__checkbox-wrapper--${this.props.content.listType === "checkbox-horizontal" ? "horizontal" : "vertical"} muikku-field ${elementClassNameState}`}>
      {this.props.content.options.map((o, index)=>{
        //if we are told to mark correct answers
        let className = null;
        if (markCorrectAnswers){
          let answerStateClassName = this.state.answerState && this.state.answerState !== "UNKNOWN" ? "state-" + this.state.answerState[index] : "";
          if (o.correct){
            className = "correct-answer " + answerStateClassName;
          } else {
            className = "incorrect-answer " + answerStateClassName;
          }
        }
        
        //please make sure to give nice styles to this because this mixes both the state
        //and whether the answer was correct or not per field
        //eg question is, what are cats?... felines, animals, cervines, equines
        //felines is set to true by the user
        //animals is set to false by the user
        //cervines is set to true by the user
        //equines is set to false by the user
        //felines would be correct answer and state-PASS because the user chose true
        //animals would be correct answer and state-FAIL because the user chose false
        //cervines would be wrong-answer and state-PASS because the user chose true
        //equines would be wrong-answer and state-PASS because the user chose false
        //you might just ignore the state, I think showing which answers would be correct and not
        //would be enough, you could as well ignore the correct/incorrect class names
        //none of this happens if there's no correct answer markCorrectAnswers variable would be false
        //so there's no state-UNKNOWN per checkbox but the whole thing could be state-UNKNOWN where
        //elementClassNameState is applied
        
        return <span key={o.name} className={`material-page__checkbox-wrapper ${className}`}>
          <input className="material-page__checkbox" type="checkbox" value={o.name} checked={this.state.values.includes(o.name)} onChange={this.toggleValue} disabled={this.props.readOnly}/>
          <label>{o.text}</label>
        </span>
      })}
      {correctAnswerSummaryComponent}
    </span>
  }
}