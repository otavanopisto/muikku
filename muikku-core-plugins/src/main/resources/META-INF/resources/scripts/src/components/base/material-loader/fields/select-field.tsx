import * as React from "react";
import equals = require("deep-equal");
import { i18nType } from "~/reducers/base/i18n";
import Dropdown from "~/components/general/dropdown";

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
  onAnswerChange?: (name: string, value: boolean)=>any
}

interface SelectFieldState {
  value: string,
  
  //This state comes from the context handler in the base
  //We can use it but it's the parent managing function that modifies them
  //We only set them up in the initial state
  modified: boolean,
  synced: boolean,
  syncError: string,
  
  //The answer might be unknown pass or fail, sometimes there's just no correct answer
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
    //we update the state and check answer
    this.setState({value: e.target.value}, this.checkAnswers);
  }
  shouldComponentUpdate(nextProps: SelectFieldProps, nextState: SelectFieldState){
    return !equals(nextProps.content, this.props.content) || this.props.readOnly !== nextProps.readOnly || !equals(nextState, this.state) 
    || this.props.i18n !== nextProps.i18n || this.props.displayCorrectAnswers !== nextProps.displayCorrectAnswers || this.props.checkAnswers !== nextProps.checkAnswers;
  }
  checkAnswers(){
    //if we are allowed to check answer
    if (!this.props.checkAnswers){
      return;
    }
    
    //So just like text-field, there might be no correct answer
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
      //if we found that this check was correct
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
    //Select field is able to mark what were meant to be the correct answers in the field itself
    let markCorrectAnswers = false;
    //It also has a summary component of what the correct answers were meant to be
    let correctAnswerSummaryComponent = null;
    //the classic variable
    let answerIsCheckedAndItIsCorrect = this.props.checkAnswers && this.state.answerState === "PASS"
      
    //So we only care about this logic if we didn't get the answer correct and we are asking for show the correct thing
    //Note that a state of UNKNOWN also goes through here, but not a state of PASS
    if (this.props.displayCorrectAnswers && !answerIsCheckedAndItIsCorrect){
      //find the correct answers from the list
      let correctAnswersFound = this.props.content.options.filter(a=>a.correct);
      //if we have some correct answers
      if (correctAnswersFound.length){
        //We say we will mark those that are correct
        markCorrectAnswers = true;
        //we make the summary component, note we might have an explanation
        //For some reason it saves to no explanation
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
      } else if (this.props.content.explanation) {
        //Otherwise if there were no correct answer say with a state of UNKNOWN, then we show the explanation if avaliable
        correctAnswerSummaryComponent = <span className="material-page__field-answer-examples">
          <span className="material-page__field-answer-examples-title">
            {this.props.i18n.text.get("plugin.workspace.assigment.checkAnswers.detailsSummary.title")}
          </span>
          <span className="material-page__field-answer-example">{this.props.content.explanation}</span>
        </span>;
      }
    }
    
    //The classname that represents the state of the whole field
    let classNameState = this.state.answerState && this.props.checkAnswers ? "state-" + this.state.answerState : "";
    
    //So the dropdown and list type are handled differently
    if (this.props.content.listType === "dropdown" || this.props.content.listType === "list"){
      return <span className="material-page__select-wrapper">
        <select className={`material-page__select ${classNameState}`} size={this.props.content.listType === "list" ? this.props.content.options.length : null}
          value={this.state.value} onChange={this.onSelectChange} disabled={this.props.readOnly}>
          {this.props.content.listType === "dropdown" ? <option value=""/> : null}
          {this.props.content.options.map(o=>{
            let className = null;
            //if correct answers are to be marked regarding whether they are correct or not
            if (markCorrectAnswers && o.correct){
              className = "correct-answer"
            } else if (markCorrectAnswers){
              className = "incorrect-answer"
            }
            return <option className={className} key={o.name} value={o.name}>{o.text}</option>
          })}
        </select>
        {correctAnswerSummaryComponent}
      </span>
    }

    //this is for the standard
    return <span className={`material-page__radiobutton-wrapper material-page__page__radiobutton-wrapper--${this.props.content.listType === "radio-horizontal" ? "horizontal" : "vertical"} ${classNameState}`}>
      {this.props.content.options.map(o=>{
        let className = null;
        //if correct answers are to be market regarding whether they are correct or not
        if (markCorrectAnswers && o.correct){
          className = "correct-answer"
        } else if (markCorrectAnswers){
          className = "incorrect-answer"
        }
        return <span className={className} key={o.name}>
          <input className="material-page__radiobutton" type="radio" value={o.name} checked={this.state.value === o.name} onChange={this.onSelectChange} disabled={this.props.readOnly}/>
          <label>{o.text}</label>
        </span>
      })}
      {correctAnswerSummaryComponent}
    </span>
  }
}