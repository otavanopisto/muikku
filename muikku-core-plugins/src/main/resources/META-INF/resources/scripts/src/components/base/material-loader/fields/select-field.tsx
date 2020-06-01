import * as React from "react";
import equals = require("deep-equal");
import { i18nType } from "~/reducers/base/i18n";
import Dropdown from "~/components/general/dropdown";
import uuid from "uuid/v4";
import Synchronizer from "./base/synchronizer";

interface SelectFieldProps {
  type: string,
  content: {
    name: string,
    explanation: string,
    listType: "dropdown" | "list" | "radio-horizontal" | "radio-vertical",
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
  onAnswerChange?: (name: string, value: boolean)=>any,

  invisible?: boolean,
}

interface SelectFieldState {
  value: string,

  //This state comes from the context handler in the base
  //We can use it but it's the parent managing function that modifies them
  //We only set them up in the initial state
  modified: boolean,
  synced: boolean,
  syncError: string,

  //The answer might be unknown pass or fail, sometimes there's just no right answer
  answerState: "UNKNOWN" | "PASS" | "FAIL"
}

export default class SelectField extends React.Component<SelectFieldProps, SelectFieldState> {
  constructor(props: SelectFieldProps){
    super(props);

    this.onSelectChange = this.onSelectChange.bind(this);

    this.state = {
      value: props.initialValue || '',

      //modified synced and syncerror are false, true and null by default
      modified: false,
      synced: true,
      syncError: null,

      //We dunno what the answer state is
      answerState: null
    }
  }
  onSelectChange(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>){
    //When the select changes, we gotta call it up
    this.props.onChange && this.props.onChange(this, this.props.content.name, e.target.value);
    //we update the state and check answers
    this.setState({value: e.target.value}, this.checkAnswers);
  }
  shouldComponentUpdate(nextProps: SelectFieldProps, nextState: SelectFieldState){
    return !equals(nextProps.content, this.props.content) || this.props.readOnly !== nextProps.readOnly || !equals(nextState, this.state)
    || this.props.i18n !== nextProps.i18n || this.props.displayCorrectAnswers !== nextProps.displayCorrectAnswers || this.props.checkAnswers !== nextProps.checkAnswers
    || this.state.modified !== nextState.modified || this.state.synced !== nextState.synced || this.state.syncError !== nextState.syncError;
  }
  checkAnswers(){
    //if we are allowed to check answers
    if (!this.props.checkAnswers){
      return;
    }

    //So just like text-field, there might be no right answer
    let actuallyCorrectAnswers = this.props.content.options.filter(a=>a.correct);
    if (!actuallyCorrectAnswers.length){
      //And equally we just call the state UNKNOWN
      if (this.state.answerState !== "UNKNOWN"){
        this.setState({
          answerState: "UNKNOWN"
        });
        //And call a answer change for it to be unknown
        this.props.onAnswerChange(this.props.content.name, null);
      }
      return;
    }

    //we do the same and start looping
    let isCorrect:boolean;
    let answer;
    for (answer of actuallyCorrectAnswers){
      //somehow the value and the name mix up here but it works out
      isCorrect = this.state.value === answer.name;
      //if we found that this check was right
      if (isCorrect){
        //we break
        break;
      }
    }

    //We update accordingly only if the answer has changed
    if (isCorrect && this.state.answerState !== "PASS"){
      this.setState({
        answerState: "PASS"
      });
      //and call the function accordingly
      this.props.onAnswerChange(this.props.content.name, true);
    } else if (!isCorrect && this.state.answerState !== "FAIL"){
      this.setState({
        answerState: "FAIL"
      });
      this.props.onAnswerChange(this.props.content.name, false);
    }
  }
  componentDidMount(){
    this.checkAnswers();
  }
  componentDidUpdate(prevProps: SelectFieldProps, prevState: SelectFieldState){
    this.checkAnswers();
  }
  render(){
    if (this.props.invisible){
      if (this.props.content.listType === "dropdown" || this.props.content.listType === "list"){
        return <span className="material-page__selectfield-wrapper">
          <select className="material-page__selectfield" size={this.props.content.listType === "list" ? this.props.content.options.length : null}
            disabled/>
        </span>
      }

      return <span className="material-page__radiobutton-wrapper" ref="base">
        {this.props.content.options.map(o=>{
          return <span className={`material-page__radiobutton-items-wrapper material-page__radiobutton-items-wrapper--${this.props.content.listType === "radio-horizontal" ? "horizontal" : "vertical"}`} key={o.name}>
            <span className="material-page__radiobutton-item-container">
              <input className="material-page__radiobutton" type="radio" disabled/>
              <label className="material-page__checkable-label">{o.text}</label>
            </span>
          </span>
        })}
      </span>
    }

    //Select field is able to mark what were meant to be the correct answers in the field itself
    let markcorrectAnswers = false;
    //It also has a summary component of what the correct answers were meant to be
    let correctAnswersummaryComponent = null;
    //the classic variable
    let answerIsCheckedAndItisCorrect = this.props.checkAnswers && this.state.answerState === "PASS"

    //So we only care about this logic if we didn't get the answer right and we are asking for show the right thing
    //Note that a state of UNKNOWN also goes through here, but not a state of PASS
    if (this.props.displayCorrectAnswers && !answerIsCheckedAndItisCorrect){
      //find the correct answers from the list
      let correctAnswersFound = this.props.content.options.filter(a=>a.correct);
      //if we have some correct answers
      if (correctAnswersFound.length){
        //We say we will mark those that are correct
        markcorrectAnswers = true;
        //we make the summary component, note we might have an explanation
        //For some reason it saves to no explanation
        correctAnswersummaryComponent = <span className="material-page__field-answer-examples">
          <span className="material-page__field-answer-examples-title">
            {this.props.i18n.text.get("plugin.workspace.assigment.checkAnswers.correctSummary.title")}
          </span>
          {correctAnswersFound.map((answer, index)=>
            <span key={index} className="material-page__field-answer-example">{answer.text}</span>
          )}
          {this.props.content.explanation ? <span className="material-page__field-explanation-wrapper">
             <Dropdown modifier="material-page-field-explanation" content={this.props.content.explanation}>
               <span className="material-page__field-explanation-button icon-question"/>
             </Dropdown>
           </span> : null}
        </span>;
      } else if (this.props.content.explanation) {
        //Otherwise if there were no right answer say with a state of UNKNOWN, then we show the explanation if avaliable
        correctAnswersummaryComponent = <span className="material-page__field-answer-examples">
          <span className="material-page__field-answer-examples-title">
            {this.props.i18n.text.get("plugin.workspace.assigment.checkAnswers.detailsSummary.title")}
          </span>
          <span className="material-page__field-answer-example">{this.props.content.explanation}</span>
        </span>;
      }
    }

    //The classname that represents the state of the whole field
    let fieldStateAfterCheck = this.state.answerState !== "UNKNOWN" && this.props.displayCorrectAnswers &&
      this.props.checkAnswers ? (this.state.answerState === "FAIL" ? "incorrect-answer" : "correct-answer") : "";

    //So the dropdown and list type are handled differently
    if (this.props.content.listType === "dropdown" || this.props.content.listType === "list"){
      let selectFieldType = this.props.content.listType === "list" ? "list" : "dropdown";
      return <span className={`material-page__selectfield-wrapper material-page__selectfield-wrapper--${selectFieldType}`}>
        <Synchronizer synced={this.state.synced} syncError={this.state.syncError} i18n={this.props.i18n}/>
        <select className={`material-page__selectfield ${fieldStateAfterCheck}`} size={this.props.content.listType === "list" ? this.props.content.options.length : null}
          value={this.state.value} onChange={this.onSelectChange} disabled={this.props.readOnly}>
          {this.props.content.listType === "dropdown" ? <option value=""/> : null}
          {this.props.content.options.map(o=>{
            return <option className="material-page__selectfield-item-container" key={o.name} value={o.name}>{o.text}</option>
          })}
        </select>
        {correctAnswersummaryComponent}
      </span>
    }

    //this is for the standard
    return <span className="material-page__radiobutton-wrapper">
      <Synchronizer synced={this.state.synced} syncError={this.state.syncError} i18n={this.props.i18n}/>
      <span className={`material-page__radiobutton-items-wrapper material-page__radiobutton-items-wrapper--${this.props.content.listType === "radio-horizontal" ? "horizontal" : "vertical"} ${fieldStateAfterCheck}`}>
        {this.props.content.options.map(o=>{
          //lets generate unique id for labels and radio buttons
          const uuidv4 = require('uuid/v4');
          let uniqueElementID = "rb-" + uuidv4();
          let itemStateAfterCheck = "";
          return <span className="material-page__radiobutton-item-container" key={o.name}>
            <input id={uniqueElementID} className="material-page__radiobutton" type="radio" value={o.name} checked={this.state.value === o.name} onChange={this.onSelectChange} disabled={this.props.readOnly}/>
            <label htmlFor={uniqueElementID} className="material-page__checkable-label">{o.text}</label>
          </span>
        })}
      </span>
      {correctAnswersummaryComponent}
    </span>
  }
}
