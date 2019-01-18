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
  modified: boolean,
  synced: boolean,
  syncError: string,
  
  rightnessState: "UNKNOWN" | "PASS" | "FAIL"
}

export default class TextField extends React.Component<TextFieldProps, TextFieldState> {
  constructor(props: TextFieldProps){
    super(props);
    
    this.state = {
      value: props.initialValue || '',
      modified: false,
      synced: true,
      syncError: null,
      
      rightnessState: null
    }
    
    this.onInputChange = this.onInputChange.bind(this);
  }
  shouldComponentUpdate(nextProps: TextFieldProps, nextState: TextFieldState){
    return !equals(nextProps.content, this.props.content) || this.props.readOnly !== nextProps.readOnly || !equals(nextState, this.state)
    || this.props.i18n !== nextProps.i18n || this.props.displayRightAnswers !== nextProps.displayRightAnswers || this.props.checkForRightness !== nextProps.checkForRightness;
  }
  onInputChange(e: React.ChangeEvent<HTMLInputElement>){
    this.props.onChange && this.props.onChange(this, this.props.content.name, e.target.value);
    this.setState({
      value: e.target.value
    }, this.checkForRightness);
  }
  checkForRightness(){
    if (!this.props.checkForRightness){
      return;
    }
    let actuallyCorrectAnswers = this.props.content.rightAnswers.filter(a=>a.correct);
    if (!actuallyCorrectAnswers.length){
      if (this.state.rightnessState !== "UNKNOWN"){
        this.setState({
          rightnessState: "UNKNOWN"
        });
        this.props.onRightnessChange(this.props.content.name, true);
      }
      return;
    }
    
    let isRight:boolean;
    let answer;
    for (answer of actuallyCorrectAnswers){
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
      if (isRight){
        break;
      }
    }
    
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
  componentDidMount(){
    this.checkForRightness();
  }
  componentDidUpdate(prevProps: TextFieldProps, prevState: TextFieldState){
    this.checkForRightness();
  }
  render(){
    let rightAnswerSummaryComponent = null;
    if (this.props.displayRightAnswers && this.props.content.rightAnswers && !(this.props.checkForRightness && this.state.rightnessState === "PASS")){
      let actuallyCorrectAnswers = this.props.content.rightAnswers.filter(a=>a.correct);
      let answersAreExample = false;
      if (!actuallyCorrectAnswers.length){
        answersAreExample = true;
        actuallyCorrectAnswers = this.props.content.rightAnswers;
      }
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
    
    let classNameState = this.state.rightnessState && this.props.checkForRightness ? "state-" + this.state.rightnessState : "";
    
    if (this.props.readOnly){
      return <div>
        <div className={`muikku-text-field muikku-field ${classNameState}`}>{this.state.value}</div>
        {rightAnswerSummaryComponent}
      </div>
    }
    return <div>
      <input className={`muikku-text-field muikku-field ${classNameState}`} type="text" value={this.state.value}
        size={this.props.content.columns && parseInt(this.props.content.columns)} placeholder={this.props.content.hint} onChange={this.onInputChange}/>
      {rightAnswerSummaryComponent}
    </div>
  }
}