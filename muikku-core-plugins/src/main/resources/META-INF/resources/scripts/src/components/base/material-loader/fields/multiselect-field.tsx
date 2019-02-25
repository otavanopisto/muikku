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
  
  //This state comes from the context handler in the base
  //We can use it but it's the parent managing function that modifies them
  //We only set them up in the initial state
  modified: boolean,
  synced: boolean,
  syncError: string,
  
  //So a multiselect can have the whole value as unknown or have an array regarding whether each answer was right or not
  rightnessState: "UNKNOWN" | Array<"PASS" | "FAIL">
}

export default class MultiSelectField extends React.Component<MultiSelectFieldProps, MultiSelectFieldState> {
  constructor(props: MultiSelectFieldProps){
    super(props);
    
    this.toggleValue = this.toggleValue.bind(this);
    this.checkForRightness = this.checkForRightness.bind(this);
    
    //We get the values and parse it from the initial value which is a string
    let values:Array<string> = ((props.initialValue && JSON.parse(props.initialValue)) || []) as Array<string>;
    this.state = {
      values: values.sort(),
      
      //modified synced and syncerror are false, true and null by default
      modified: false,
      synced: true,
      syncError: null,
      
      //Rightness state is null
      rightnessState: null
    }
  }
  shouldComponentUpdate(nextProps: MultiSelectFieldProps, nextState: MultiSelectFieldState){
    return !equals(nextProps.content, this.props.content) || this.props.readOnly !== nextProps.readOnly || !equals(nextState, this.state) 
    || this.props.i18n !== nextProps.i18n || this.props.displayRightAnswers !== nextProps.displayRightAnswers || this.props.checkForRightness !== nextProps.checkForRightness;
  }
  checkForRightness(){
    //if we are not allowed we return
    if (!this.props.checkForRightness){
      return;
    }
    
    //let's find the actually correct answers from an array
    let actuallyCorrectAnswers = this.props.content.options.filter(a=>a.correct);
    
    //we might not really have any real correct answer
    if (!actuallyCorrectAnswers.length){
      //So we handle accordingly
      if (this.state.rightnessState !== "UNKNOWN"){
        this.setState({
          rightnessState: "UNKNOWN"
        });
        this.props.onRightnessChange(this.props.content.name, null);
      }
      return;
    }
    
    //So we calculate the rightness state of each field to see what we got
    let newRightnessState:Array<"PASS" | "FAIL"> = this.props.content.options.map((option, index)=>{
      let isDefinedAsCorrect = this.state.values.includes(option.name);
      return option.correct === isDefinedAsCorrect ? "PASS" : "FAIL";
    });
    
    //if it's different from our previous we update accordingly
    if (!equals(newRightnessState, this.state.rightnessState)){
      this.setState({
        rightnessState: newRightnessState
      });
    }
    
    //Checking whether we got right in general
    let isRight = newRightnessState.includes("FAIL");
    //if we had no previous rightness state or it was unknown
    if (!this.state.rightnessState || this.state.rightnessState === "UNKNOWN"){
      //we just make it new
      this.props.onRightnessChange(this.props.content.name, isRight);
      return;
    }
    
    //check the previous state and compare to send an update only if necessary
    let wasRight = !this.state.rightnessState.includes("FAIL");
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
    
    //we set the new state and check for rightness afterwards
    this.setState({
      values: nValues
    }, this.checkForRightness);
  }
  render(){
    //whether we mark the right answers
    let markRightAnswers = false;
    //the summary component if necessary
    let rightAnswerSummaryComponent = null;
    //The answer is right if it is not unknown and has no fails in it
    let answerIsBeingCheckedAndItIsRight = this.props.checkForRightness && this.state.rightnessState && 
      this.state.rightnessState !== "UNKNOWN" && !this.state.rightnessState.includes("FAIL");
    
    //if we are told to display the right answers and the answer is not right
    if (this.props.displayRightAnswers && !answerIsBeingCheckedAndItIsRight){
      //check for the right answers we found
      let rightAnswersFound = this.props.content.options.filter(a=>a.correct);
      //if we got some in there
      if (rightAnswersFound.length){
        //we gotta mark those that are correct
        markRightAnswers = true
        //and we make the summary component
        rightAnswerSummaryComponent = <span className="material-page__field-answer-examples">
          <span className="material-page__field-answer-examples-title">
            {this.props.i18n.text.get("plugin.workspace.assigment.checkAnswers.correctSummary.title")}
          </span>
          {rightAnswersFound.map((answer, index)=>
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
        rightAnswerSummaryComponent = <span className="material-page__field-answer-examples">
          <span className="material-page__field-answer-examples-title">
            {this.props.i18n.text.get("plugin.workspace.assigment.checkAnswers.detailsSummary.title")}
          </span>
          <span className="material-page__field-answer-example">{this.props.content.explanation}</span>
        </span>;
      }
    }
    
    //the classname we add to the element itself depending to the state, and only available if we check for rightness
    let elementClassNameState = this.props.checkForRightness && this.state.rightnessState ?
        "state-" + (this.state.rightnessState === "UNKNOWN" ? "UNKNOWN" : (this.state.rightnessState.includes("FAIL") ? "FAIL" : "PASS")) : "";
    
    //and we render
    return <span className={`material-page__checkbox-wrapper material-page__checkbox-wrapper--${this.props.content.listType === "checkbox-horizontal" ? "horizontal" : "vertical"} muikku-field ${elementClassNameState}`}>
      {this.props.content.options.map((o, index)=>{
        //if we are told to mark right answers
        let className = null;
        if (markRightAnswers){
          let rightnessStateClassName = this.state.rightnessState && this.state.rightnessState !== "UNKNOWN" ? "state-" + this.state.rightnessState[index] : "";
          if (o.correct){
            className = "correct-answer " + rightnessStateClassName;
          } else {
            className = "incorrect-answer " + rightnessStateClassName;
          }
        }
        
        //please make sure to give nice styles to this because this mixes both the state
        //and whether the answer was right or not per field
        //eg question is, what are cats?... felines, animals, cervines, equines
        //felines is set to true by the user
        //animals is set to false by the user
        //cervines is set to true by the user
        //equines is set to false by the user
        //felines would be right-answer and state-PASS because the user chose true
        //animals would be right-answer and state-FAIL because the user chose false
        //cervines would be wrong-answer and state-PASS because the user chose true
        //equines would be wrong-answer and state-PASS because the user chose false
        //you might just ignore the state, I think showing which answers would be correct and not
        //would be enough, you could as well ignore the right/wrong class names
        //none of this happens if there's no right answer markRightAnswers variable would be false
        //so there's no state-UNKNOWN per checkbox but the whole thing could be state-UNKNOWN where
        //elementClassNameState is applied
        
        return <span key={o.name} className={`material-page__checkbox-wrapper ${className}`}>
          <input className="material-page__checkbox" type="checkbox" value={o.name} checked={this.state.values.includes(o.name)} onChange={this.toggleValue} disabled={this.props.readOnly}/>
          <label>{o.text}</label>
        </span>
      })}
      {rightAnswerSummaryComponent}
    </span>
  }
}