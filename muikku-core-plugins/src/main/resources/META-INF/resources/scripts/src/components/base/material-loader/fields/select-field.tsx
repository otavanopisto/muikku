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
  modified: boolean,
  synced: boolean,
  syncError: string,
  
  rightnessState: "UNKNOWN" | "PASS" | "FAIL"
}

export default class SelectField extends React.Component<SelectFieldProps, SelectFieldState> {
  constructor(props: SelectFieldProps){
    super(props);
    
    this.onSelectChange = this.onSelectChange.bind(this);
    
    this.state = {
      value: props.initialValue || '',
      modified: false,
      synced: true,
      syncError: null,
      
      rightnessState: null
    }
  }
  onSelectChange(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>){
    this.props.onChange && this.props.onChange(this, this.props.content.name, e.target.value);
    this.setState({value: e.target.value}, this.checkForRightness);
  }
  shouldComponentUpdate(nextProps: SelectFieldProps, nextState: SelectFieldState){
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
    
    let isRight:boolean;
    let answer;
    for (answer of actuallyCorrectAnswers){
      isRight = this.state.value === answer.name;
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
  componentDidUpdate(prevProps: SelectFieldProps, prevState: SelectFieldState){
    this.checkForRightness();
  }
  render(){
    let markRightAnswers = false;
    let rightAnswerSummaryComponent = null;
    let answerIsCheckedAndItIsRight = this.props.checkForRightness && this.state.rightnessState === "PASS"
    if (this.props.displayRightAnswers && !answerIsCheckedAndItIsRight){
      let rightAnswersFound = this.props.content.options.filter(a=>a.correct);
      if (rightAnswersFound.length){
        markRightAnswers = true;
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
    
    let classNameState = this.state.rightnessState && this.props.checkForRightness ? "state-" + this.state.rightnessState : "";
    
    if (this.props.content.listType === "dropdown" || this.props.content.listType === "list"){
      return <div>
        <select className={`muikku-select-field muikku-field ${classNameState}`} size={this.props.content.listType === "list" ? this.props.content.options.length : null}
          value={this.state.value} onChange={this.onSelectChange} disabled={this.props.readOnly}>
          {this.props.content.listType === "dropdown" ? <option value=""/> : null}
          {this.props.content.options.map(o=>{
            let className = null;
            if (markRightAnswers && o.correct){
              className = "muikku-select-field-right-answer"
            } else if (markRightAnswers){
              className = "muikku-select-field-wrong-answer"
            }
            return <option className={className} key={o.name} value={o.name}>{o.text}</option>
          })}
        </select>
        {rightAnswerSummaryComponent}
      </div>
    }
    
    return <span className={`muikku-select-field radiobutton-${this.props.content.listType === "radio-horizontal" ? "horizontal" : "vertical"} muikku-field ${classNameState}`}>
      {this.props.content.options.map(o=>{
        let className = null;
        if (markRightAnswers && o.correct){
          className = "muikku-select-field-right-answer"
        } else if (markRightAnswers){
          className = "muikku-select-field-wrong-answer"
        }
        return <span className={className} key={o.name}>
          <input type="radio" value={o.name} checked={this.state.value === o.name} onChange={this.onSelectChange} disabled={this.props.readOnly}/>
          <label>{o.text}</label>
        </span>
      })}
      {rightAnswerSummaryComponent}
    </span>
  }
}