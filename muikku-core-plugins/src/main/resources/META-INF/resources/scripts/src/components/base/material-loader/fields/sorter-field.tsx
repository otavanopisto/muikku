import * as React from "react";
import { shuffle } from "~/util/modifiers";
import Draggable from "~/components/general/draggable";
import equals = require("deep-equal");
import { i18nType } from "~/reducers/base/i18n";

interface SorterFieldItemType {
  id: string,
  name: string
}

interface SorterFieldProps {
  type: string,
  content: {
    name: string,
    orientation: "vertical" | "horizontal",
    capitalize: boolean,
    items: Array<SorterFieldItemType>
  },
  
  readOnly?: boolean,
  initialValue?: string,
  onChange?: (context: React.Component<any, any>, name: string, newValue: any)=>any,
  i18n: i18nType,
      
  displayRightAnswers?: boolean,
  checkForRightness?: boolean,
  onRightnessChange?: (name: string, value: boolean)=>any
}

interface SorterFieldState {
  items: Array<SorterFieldItemType>,
  modified: boolean,
  synced: boolean,
  syncError: string,
  
  rightnessState: Array<"PASS" | "FAIL">
}

export default class SorterField extends React.Component<SorterFieldProps, SorterFieldState> {
  constructor(props: SorterFieldProps){
    super(props);
    
    let value = null;
    let items;
    if (props.initialValue){
      value = JSON.parse(props.initialValue);
      items = value.map((v:string)=>this.props.content.items.find(i=>i.id === v));
    } else {
      items = shuffle(props.content.items) || [];
    }
    
    this.state = {
      items,
      modified: false,
      synced: true,
      syncError: null,
      
      rightnessState: null
    }
    
    this.swap = this.swap.bind(this);
  }
  shouldComponentUpdate(nextProps: SorterFieldProps, nextState: SorterFieldState){
    return !equals(nextProps.content, this.props.content) || this.props.readOnly !== nextProps.readOnly || !equals(nextState, this.state)
    || this.props.i18n !== nextProps.i18n || this.props.displayRightAnswers !== nextProps.displayRightAnswers || this.props.checkForRightness !== nextProps.checkForRightness;
  }
  swap(itemA: SorterFieldItemType, itemB: SorterFieldItemType){
    if (itemA.id === itemB.id){
      return;
    }
    let items = this.state.items.map(item=>{
      if (item.id === itemA.id){
        return itemB
      } else if (item.id === itemB.id){
        return itemA;
      }
      return item;
    });
    
    this.props.onChange && this.props.onChange(this, this.props.content.name, JSON.stringify(items.map(item=>item.id)));
    this.setState({
      items
    }, this.checkForRightness);
  }
  checkForRightness(){
    if (!this.props.checkForRightness){
      return;
    }
    
    let newRightnessState:Array<"PASS" | "FAIL"> = [];
    this.state.items.forEach((item, index)=>{
      let answer = this.props.content.items[index];
      let isAnswerProper = answer.id === item.id;
      newRightnessState.push(isAnswerProper ? "PASS" : "FAIL");
    });
    
    if (!equals(newRightnessState, this.state.rightnessState)){
      this.setState({
        rightnessState: newRightnessState
      });
    }
    
    let isRight = newRightnessState.includes("FAIL");
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
  componentDidUpdate(prevProps: SorterFieldProps, prevState: SorterFieldState){
    this.checkForRightness();
  }
  render(){
    let rightAnswerSummaryComponent = null;
    if (this.props.displayRightAnswers && !(this.props.checkForRightness && !this.state.rightnessState.includes("FAIL"))){
      rightAnswerSummaryComponent = <span className="muikku-field-examples">
        <span className="muikku-field-examples-title">
          {this.props.i18n.text.get("plugin.workspace.assigment.checkAnswers.correctSummary.title")}
        </span>
        {this.props.content.items.map((answer, index)=>
          <span key={answer.id} className="muikku-field-example">{answer.name}</span>
        )}
      </span>
    }
    
    let elementClassNameState = this.props.checkForRightness && this.state.rightnessState ?
        "state-" + (this.state.rightnessState.includes("FAIL") ? "FAIL" : "PASS") : "";
    let Element = this.props.content.orientation === "vertical" ? 'div' : 'span';
    return <Element className={`muikku-field muikku-sorter-field ${elementClassNameState}`}>
      <Element className="muikku-sorter-items-container">
       {this.state.items.map((item, index)=>{
         let text = item.name;
         if (index === 0 && this.props.content.capitalize){
           text = text.charAt(0).toUpperCase() + text.slice(1);
         }
         let itemClassNameState = this.props.checkForRightness && this.state.rightnessState && this.state.rightnessState[index] ? 
             "state-" + this.state.rightnessState[index] : ""
         if (this.props.readOnly){
           return <Element className={`muikku-sorter-item ${itemClassNameState}`} key={item.id}>{text}</Element>
         }
         return <Draggable denyWidth={this.props.content.orientation === "horizontal"} as={Element} parentContainerSelector=".muikku-sorter-items-container"
           className={`muikku-sorter-item ${itemClassNameState}`} key={item.id} interactionGroup={this.props.content.name}
           interactionData={item} onInteractionWith={this.swap.bind(this, item)}>{text}</Draggable>
       })}
      </Element>
      {rightAnswerSummaryComponent}
    </Element>
  }
}