import * as React from "react";
import equals = require("deep-equal");
import { i18nType } from "~/reducers/base/i18n";

interface TextFieldProps {
  type: string,
  content: {
    autogrow: boolean,
    columns: string,
    hint: string,
    name: string,
    rightAnswers: Array<{
      caseSensitive: boolean,
      correct: boolean,
      normalizeWhitespace: boolean,
      text: string
    }>
  },
  onChange?: (context: React.Component<any, any>, name: string, newValue: any)=>any,
  readOnly?: boolean,
  initialValue?: string,
  i18n: i18nType,
      
  displayRightAnswers?: boolean,
  checkForRightness?: boolean,
  onRightnessChange?: (name: string, value: boolean)=>any
}

interface TextFieldState {
  value: string,
  
  //This state comes from the context handler in the base
  //We can use it but it's the parent managing function that modifies them
  //We only set them up in the initial state
  modified: boolean,
  synced: boolean,
  syncError: string,
  
  //The text field might have a rightness state of unknown pass or fail
  rightnessState: "UNKNOWN" | "PASS" | "FAIL"
}

export default class TextField extends React.Component<TextFieldProps, TextFieldState> {
  constructor(props: TextFieldProps){
    super(props);
    
    this.state = {
      //Set the initial value
      value: props.initialValue || '',
      //modified synced and syncerror are false, true and null by default
      modified: false,
      synced: true,
      syncError: null,
      
      //the intial rightness state is totally unknown, not UNKNOWN but literally unknown if it's even UNKNOWN
      rightnessState: null
    }
    
    this.onInputChange = this.onInputChange.bind(this);
  }
  shouldComponentUpdate(nextProps: TextFieldProps, nextState: TextFieldState){
    //So we only update if these props change and any of the state
    return !equals(nextProps.content, this.props.content) || this.props.readOnly !== nextProps.readOnly || !equals(nextState, this.state)
    || this.props.i18n !== nextProps.i18n || this.props.displayRightAnswers !== nextProps.displayRightAnswers || this.props.checkForRightness !== nextProps.checkForRightness;
  }
  //when the input change
  onInputChange(e: React.ChangeEvent<HTMLInputElement>){
    //we call the on change function with the context and the name
    this.props.onChange && this.props.onChange(this, this.props.content.name, e.target.value);
    this.setState({
      value: e.target.value
    }, this.checkForRightness);
  }
  checkForRightness(){
    //if the property is not there we cancel
    if (!this.props.checkForRightness){
      return;
    }
    
    //Check for all the right answers and filter which ones are set to be correct
    let actuallyCorrectAnswers = this.props.content.rightAnswers.filter(a=>a.correct);
    
    //If there's not a single one that has the flag of being the correct answer
    if (!actuallyCorrectAnswers.length){
      //the rightness state is UNKNOWN
      if (this.state.rightnessState !== "UNKNOWN"){
        this.setState({
          rightnessState: "UNKNOWN"
        });
        //The rightness is sent as unknown to the function
        this.props.onRightnessChange(this.props.content.name, null);
      }
      return;
    }
    
    //Otherwise we gotta check each
    let isRight:boolean;
    let answer;
    
    //We loop in the correct answers
    for (answer of actuallyCorrectAnswers){
      //And compare them according to the rules
      let comparerAnswer = answer.text
      let comparerValue = this.state.value;
      if (!answer.caseSensitive){
        comparerAnswer = comparerAnswer.toLocaleLowerCase();
        comparerValue = comparerValue.toLocaleLowerCase();
      }
      if (answer.normalizeWhitespace){
        comparerAnswer.trim().replace(/\s+/gi, " ");
        comparerValue.trim().replace(/\s+/gi, " ");
      }
      
      isRight = comparerValue === comparerAnswer;
      //if we get a match we break
      if (isRight){
        break;
      }
    }
    
    //Now we compare and call the rightness change function
    if (isRight && this.state.rightnessState !== "PASS"){
      this.setState({
        rightnessState: "PASS"
      });
      this.props.onRightnessChange(this.props.content.name, true);
    } else if (!isRight && this.state.rightnessState !== "FAIL"){
      this.setState({
        rightnessState: "FAIL"
      });
      this.props.onRightnessChange(this.props.content.name, false);
    }
  }
  //We check for rightness on mount and update
  componentDidMount(){
    this.checkForRightness();
  }
  componentDidUpdate(prevProps: TextFieldProps, prevState: TextFieldState){
    this.checkForRightness();
  }
  render(){
    //This is the component that provides the summary of the right answers
    let rightAnswerSummaryComponent = null;
    //a boolean representing whether the answer is correct and we are actually checking for it
    let checkForRightnessAndAnswerIsCorrect = this.props.checkForRightness && this.state.rightnessState === "PASS";
    //If we are told to display the right answers (we don't do that if the answer is checked and right because it's pointless)
    //UNKNOWN also gets there, so the correct answers will be shown even if the state is unknown
    if (this.props.displayRightAnswers && this.props.content.rightAnswers && !checkForRightnessAndAnswerIsCorrect){
      //find the actually correct answers
      let actuallyCorrectAnswers = this.props.content.rightAnswers.filter(a=>a.correct);
      //answers are example is for language, this happens if we have no correct answers
      let answersAreExample = false;
      //if we don't have answers
      if (!actuallyCorrectAnswers.length){
        //We just set them all as right and make it be an example, this happens for example when the rightness state is UNKNOWN
        answersAreExample = true;
        actuallyCorrectAnswers = this.props.content.rightAnswers;
      }
      //We create the component
      rightAnswerSummaryComponent = <span className="muikku-field-examples">
        <span className="muikku-field-examples-title">
          {this.props.i18n.text.get(answersAreExample ? 
              "plugin.workspace.assigment.checkAnswers.detailsSummary.title" :
              "plugin.workspace.assigment.checkAnswers.correctSummary.title")}
        </span>
        {actuallyCorrectAnswers.map((answer, index)=>
          <span key={index} className="muikku-field-example">{answer.text}</span>
        )}
      </span>
    }
    
    //The state of the whole field
    let classNameState = this.state.rightnessState && this.props.checkForRightness ? "state-" + this.state.rightnessState : "";
    
    if (this.props.readOnly){
      //Read only version
      return <div>
        <div className={`muikku-text-field muikku-field ${classNameState}`}>{this.state.value}</div>
        {rightAnswerSummaryComponent}
      </div>
    }
    
    //Standard modifiable version
    return <span className="material-page__textfield-wrapper">
      <input className={`material-page__textfield ${classNameState}`} type="text" value={this.state.value}
        size={this.props.content.columns && parseInt(this.props.content.columns)} placeholder={this.props.content.hint} onChange={this.onInputChange}/>
      {rightAnswerSummaryComponent}
    </span>
  }
}