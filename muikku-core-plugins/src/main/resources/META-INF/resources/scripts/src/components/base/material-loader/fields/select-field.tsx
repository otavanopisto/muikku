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
  displayRightAnswers?: boolean,
  checkForRightness?: boolean,
  onRightnessChange?: (name: string, value: boolean)=>any
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
  rightnessState: "UNKNOWN" | "PASS" | "FAIL"
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
      
      //We dunno what the rightness state is
      rightnessState: null
    }
  }
  onSelectChange(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>){
    //When the select changes, we gotta call it up
    this.props.onChange && this.props.onChange(this, this.props.content.name, e.target.value);
    //we update the state and check for rightness
    this.setState({value: e.target.value}, this.checkForRightness);
  }
  shouldComponentUpdate(nextProps: SelectFieldProps, nextState: SelectFieldState){
    return !equals(nextProps.content, this.props.content) || this.props.readOnly !== nextProps.readOnly || !equals(nextState, this.state) 
    || this.props.i18n !== nextProps.i18n || this.props.displayRightAnswers !== nextProps.displayRightAnswers || this.props.checkForRightness !== nextProps.checkForRightness;
  }
  checkForRightness(){
    //if we are allowed to check for rightness
    if (!this.props.checkForRightness){
      return;
    }
    
    //So just like text-field, there might be no right answer
    let actuallyCorrectAnswers = this.props.content.options.filter(a=>a.correct);
    if (!actuallyCorrectAnswers.length){
      //And equally we just call the state UNKNOWN
      if (this.state.rightnessState !== "UNKNOWN"){
        this.setState({
          rightnessState: "UNKNOWN"
        });
        //And call a rightness change for it to be unknown
        this.props.onRightnessChange(this.props.content.name, null);
      }
      return;
    }
    
    //we do the same and start looping
    let isRight:boolean;
    let answer;
    for (answer of actuallyCorrectAnswers){
      //somehow the value and the name mix up here but it works out
      isRight = this.state.value === answer.name;
      //if we found that this check was right
      if (isRight){
        //we break
        break;
      }
    }
    
    //We update accordingly only if the rightness has changed
    if (isRight && this.state.rightnessState !== "PASS"){
      this.setState({
        rightnessState: "PASS"
      });
      //and call the function accordingly
      this.props.onRightnessChange(this.props.content.name, true);
    } else if (!isRight && this.state.rightnessState !== "FAIL"){
      this.setState({
        rightnessState: "FAIL"
      });
      this.props.onRightnessChange(this.props.content.name, false);
    }
  }
  componentDidMount(){
    this.checkForRightness();
  }
  componentDidUpdate(prevProps: SelectFieldProps, prevState: SelectFieldState){
    this.checkForRightness();
  }
  render(){
    //Select field is able to mark what were meant to be the right answers in the field itself
    let markRightAnswers = false;
    //It also has a summary component of what the right answers were meant to be
    let rightAnswerSummaryComponent = null;
    //the classic variable
    let answerIsCheckedAndItIsRight = this.props.checkForRightness && this.state.rightnessState === "PASS"
      
    //So we only care about this logic if we didn't get the answer right and we are asking for show the right thing
    //Note that a state of UNKNOWN also goes through here, but not a state of PASS
    if (this.props.displayRightAnswers && !answerIsCheckedAndItIsRight){
      //find the right answers from the list
      let rightAnswersFound = this.props.content.options.filter(a=>a.correct);
      //if we have some right answers
      if (rightAnswersFound.length){
        //We say we will mark those that are correct
        markRightAnswers = true;
        //we make the summary component, note we might have an explanation
        //For some reason it saves to no explanation
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
      } else if (this.props.content.explanation) {
        //Otherwise if there were no right answer say with a state of UNKNOWN, then we show the explanation if avaliable
        rightAnswerSummaryComponent = <span className="material-page__field-answer-examples">
          <span className="material-page__field-answer-examples-title">
            {this.props.i18n.text.get("plugin.workspace.assigment.checkAnswers.detailsSummary.title")}
          </span>
          <span className="material-page__field-answer-example">{this.props.content.explanation}</span>
        </span>;
      }
    }
    
    //The classname that represents the state of the whole field
    let classNameState = this.state.rightnessState && this.props.checkForRightness ? "state-" + this.state.rightnessState : "";
    
    //So the dropdown and list type are handled differently
    if (this.props.content.listType === "dropdown" || this.props.content.listType === "list"){
      return <span className="material-page__select-wrapper">
        <select className={classNameState} size={this.props.content.listType === "list" ? this.props.content.options.length : null}
          value={this.state.value} onChange={this.onSelectChange} disabled={this.props.readOnly}>
          {this.props.content.listType === "dropdown" ? <option value=""/> : null}
          {this.props.content.options.map(o=>{
            let className = null;
            //if right answers are to be market regarding whether they are correct or not
            if (markRightAnswers && o.correct){
              className = "correct-answer"
            } else if (markRightAnswers){
              className = "incorrect-answer"
            }
            return <option className={className} key={o.name} value={o.name}>{o.text}</option>
          })}
        </select>
        {rightAnswerSummaryComponent}
      </span>
    }

    //this is for the standard
    return <span className={`material-page__radiobutton-wrapper material-page__page__radiobutton-wrapper--${this.props.content.listType === "radio-horizontal" ? "horizontal" : "vertical"} ${classNameState}`}>
      {this.props.content.options.map(o=>{
        let className = null;
        //if right answers are to be market regarding whether they are correct or not
        if (markRightAnswers && o.correct){
          className = "correct-answer"
        } else if (markRightAnswers){
          className = "incorrect-answer"
        }
        return <span className={className} key={o.name}>
          <input className="material-page__radiobutton" type="radio" value={o.name} checked={this.state.value === o.name} onChange={this.onSelectChange} disabled={this.props.readOnly}/>
          <label>{o.text}</label>
        </span>
      })}
      {rightAnswerSummaryComponent}
    </span>
  }
}