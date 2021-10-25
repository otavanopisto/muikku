import * as React from "react";
import equals = require("deep-equal");
import { i18nType } from "~/reducers/base/i18n";
import Dropdown from "~/components/general/dropdown";
import Synchronizer from "./base/synchronizer";
import * as uuid from "uuid";
import { StrMathJAX } from "../static/mathjax";
import { UsedAs } from "~/@types/shared";

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
  usedAs: UsedAs;
  readOnly?: boolean,
  initialValue?: string,
  onChange?: (context: React.Component<any, any>, name: string, newValue: any)=>any,
  i18n: i18nType,

  displayCorrectAnswers?: boolean,
  checkAnswers?: boolean,
  onAnswerChange?: (name: string, value: boolean)=>any,

  invisible?: boolean,
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

      //answer state is null
      answerState: null
    }
  }
  shouldComponentUpdate(nextProps: MultiSelectFieldProps, nextState: MultiSelectFieldState){
    return !equals(nextProps.content, this.props.content) || this.props.readOnly !== nextProps.readOnly || !equals(nextState, this.state)
    || this.props.i18n !== nextProps.i18n || this.props.displayCorrectAnswers !== nextProps.displayCorrectAnswers || this.props.checkAnswers !== nextProps.checkAnswers
    || this.state.modified !== nextState.modified || this.state.synced !== nextState.synced || this.state.syncError !== nextState.syncError
    || nextProps.invisible !== this.props.invisible;
  }
  checkAnswers(){
    //if we are not allowed we return
    if (!this.props.checkAnswers || !this.props.content){
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
    let newanswerState:Array<"PASS" | "FAIL"> = this.props.content.options.map((option, index)=>{
      let isDefinedAsCorrect = this.state.values.includes(option.name);
      return option.correct === isDefinedAsCorrect ? "PASS" : "FAIL";
    });

    //if it's different from our previous we update accordingly
    if (!equals(newanswerState, this.state.answerState)){
      this.setState({
        answerState: newanswerState
      });
    }

    //Checking whether we got right in general
    let isCorrect = !newanswerState.includes("FAIL");
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
    if (!this.props.content) {
      return;
    }
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
    }, this.checkAnswers);
  }
  render(){
    if (!this.props.content) {
      return null;
    }

    let markcorrectAnswers = false;
    //the summary component if necessary
    let correctAnswersummaryComponent = null;
    //The answer is right if it is not unknown and has no fails in it
    let answerIsBeingCheckedAndItisCorrect = this.props.checkAnswers && this.state.answerState &&
      this.state.answerState !== "UNKNOWN" && !this.state.answerState.includes("FAIL");

    //if we are told to display the correct answers and the answer is not right
    if (this.props.displayCorrectAnswers && !answerIsBeingCheckedAndItisCorrect){
      //check for the correct answers we found
      let correctAnswersFound = this.props.content.options.filter(a=>a.correct);
      //if we got some in there
      if (correctAnswersFound.length){
        //we gotta mark those that are correct
        markcorrectAnswers = true
        //and we make the summary component
        correctAnswersummaryComponent = <span className="material-page__field-answer-examples">
          <span className="material-page__field-answer-examples-title">
            {this.props.i18n.text.get("plugin.workspace.assigment.checkAnswers.correctSummary.title")}
          </span>
          {correctAnswersFound.map((answer, index)=>
            <span key={index} className="material-page__field-answer-example"><StrMathJAX>{answer.text}</StrMathJAX></span>
          )}
          {this.props.content.explanation ? <span className="material-page__field-explanation-wrapper">
            <Dropdown modifier="material-page-field-explanation" content={<StrMathJAX>{this.props.content.explanation}</StrMathJAX>}>
               <span className="material-page__field-explanation-button icon-question"/>
             </Dropdown>
           </span> : null}
        </span>;
      //otherwise we just show the explanation if we got one
      //this might happen if the state is unknown for example
      } else if (this.props.content.explanation) {
        correctAnswersummaryComponent = <span className="material-page__field-answer-examples">
          <span className="material-page__field-answer-examples-title">
            {this.props.i18n.text.get("plugin.workspace.assigment.checkAnswers.detailsSummary.title")}
          </span>
          <span className="material-page__field-answer-example"><StrMathJAX>{this.props.content.explanation}</StrMathJAX></span>
        </span>;
      }
    }

    if (this.props.invisible){
      return <span className="material-page__checkbox-wrapper">
        <span className={`material-page__checkbox-items-wrapper material-page__checkbox-items-wrapper--${this.props.content.listType === "checkbox-horizontal" ? "horizontal" : "vertical"}`}>
          {this.props.content.options.map((o, index)=>{
            return <span key={o.name} className="material-page__checkbox-item-container">
              <input className="material-page__checkbox" type="checkbox" disabled/>
              <label className="material-page__checkable-label">{o.text}</label>
            </span>
          })}
        </span>
        {correctAnswersummaryComponent}
      </span>
    }

    //the classname we add to the element itself depending to the state, and only available if we check answers
    let fieldStateAfterCheck = this.props.displayCorrectAnswers && this.props.checkAnswers && this.state.answerState && this.state.answerState !== "UNKNOWN"
       ? (this.state.answerState.includes("FAIL") ? "incorrect-answer" : "correct-answer") : "" ;

    //and we render
    return <span className="material-page__checkbox-wrapper">
      <Synchronizer synced={this.state.synced} syncError={this.state.syncError} i18n={this.props.i18n}/>
      <span className={`material-page__checkbox-items-wrapper material-page__checkbox-items-wrapper--${this.props.content.listType === "checkbox-horizontal" ? "horizontal" : "vertical"} ${fieldStateAfterCheck}`}>
        {this.props.content.options.map((o, index)=>{
          //if we are told to mark correct answers
          let itemStateAfterCheck = "";
          if (markcorrectAnswers){
            if (o.correct){
              itemStateAfterCheck = "correct-answer";
            } else {
              itemStateAfterCheck = "incorrect-answer";
            }
          }
          //lets generate unique id for labels and checkboxes
          let uniqueElementID = "cb-" + uuid.v4();
          return <span key={o.name} className="material-page__checkbox-item-container">
            <input id={uniqueElementID} className={`material-page__checkbox ${itemStateAfterCheck}`} type="checkbox" value={o.name} checked={this.state.values.includes(o.name)} onChange={this.toggleValue} disabled={this.props.readOnly}/>
            <label htmlFor={uniqueElementID} className="material-page__checkable-label"><StrMathJAX>{o.text}</StrMathJAX></label>
          </span>
        })}
        </span>
        {correctAnswersummaryComponent}
      </span>
  }
}
