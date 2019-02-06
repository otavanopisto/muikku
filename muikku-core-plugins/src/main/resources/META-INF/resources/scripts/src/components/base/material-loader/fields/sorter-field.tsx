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
  selectedItem: SorterFieldItemType,
  
  //This state comes from the context handler in the base
  //We can use it but it's the parent managing function that modifies them
  //We only set them up in the initial state
  modified: boolean,
  synced: boolean,
  syncError: string,
  
  //We have a rightness state for each element in the sorter field
  //so we know which ones are messed up
  rightnessState: Array<"PASS" | "FAIL">
}

export default class SorterField extends React.Component<SorterFieldProps, SorterFieldState> {
  constructor(props: SorterFieldProps){
    super(props);
    
    let value = null;
    let items;
    //We take the initial value and parse it because somehow it comes as a string
    //this comes from the composite reply as so
    if (props.initialValue){
      value = JSON.parse(props.initialValue);
      //We set it up properly
      items = value.map((v:string)=>this.props.content.items.find(i=>i.id === v));
    } else {
      //if we don't have a value, we 
      items = shuffle(props.content.items) || [];
    }
    
    this.state = {
      items,
      selectedItem: null,
      
      //modified synced and syncerror are false, true and null by default
      modified: false,
      synced: true,
      syncError: null,
      
      //initial rightness state is not known
      rightnessState: null
    }
    
    this.swap = this.swap.bind(this);
    this.selectItem = this.selectItem.bind(this);
  }
  shouldComponentUpdate(nextProps: SorterFieldProps, nextState: SorterFieldState){
    return !equals(nextProps.content, this.props.content) || this.props.readOnly !== nextProps.readOnly || !equals(nextState, this.state)
    || this.props.i18n !== nextProps.i18n || this.props.displayRightAnswers !== nextProps.displayRightAnswers || this.props.checkForRightness !== nextProps.checkForRightness;
  }
  //Swaps two items
  swap(itemA: SorterFieldItemType, itemB: SorterFieldItemType){
    if (itemA.id === itemB.id){
      return;
    }
    
    //this is a basic function for swapping
    let items = this.state.items.map(item=>{
      if (item.id === itemA.id){
        return itemB
      } else if (item.id === itemB.id){
        return itemA;
      }
      return item;
    });
    
    //if we got on change we call it and we remember to stringify the answer because it wants strings
    this.props.onChange && this.props.onChange(this, this.props.content.name, JSON.stringify(items.map(item=>item.id)));
    
    //items are update with the swapped version, and after that's done we check for rightness
    this.setState({
      items
    }, this.checkForRightness);
  }
  checkForRightness(){
    //if not set to actually do we cancel
    if (!this.props.checkForRightness){
      return;
    }
    
    //ok so now we loop per item
    let newRightnessState:Array<"PASS" | "FAIL"> = this.state.items.map((item, index)=>{
      //we check the answer from the property of the content, using the index we get what
      //element had to be in that specific index
      let answer = this.props.content.items[index];
      //if the ids are equal then the answer was correct
      let isAnswerProper = answer.id === item.id;
      return isAnswerProper ? "PASS" : "FAIL";
    });
    
    //We check if the new state is different before update
    if (!equals(newRightnessState, this.state.rightnessState)){
      this.setState({
        rightnessState: newRightnessState
      });
    }
    
    //In this case whether it overall right or not depends son whether
    //one of them failed, so we check
    let isRight = newRightnessState.includes("FAIL");
    //If we have no rightness state to compare with, we just send the result
    if (!this.state.rightnessState){
      this.props.onRightnessChange(this.props.content.name, isRight);
      return;
    }
    
    //Otherwise we compare and update accordingly only when necessary
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
  selectItem(item: SorterFieldItemType){
    if (this.state.selectedItem){
      this.swap(item, this.state.selectedItem);
      this.setState({
        selectedItem: null
      });
      return;
    }
    
    this.setState({
      selectedItem: item
    });
  }
  render(){
    //The summary for the right answers
    let rightAnswerSummaryComponent = null;
    let answerIsBeingCheckedAndItIsRight = this.props.checkForRightness && this.state.rightnessState && !this.state.rightnessState.includes("FAIL");
    //We only display the right answers if we got them wrong or they are not being checked at all
    if (this.props.displayRightAnswers && !answerIsBeingCheckedAndItIsRight){
      //We create the summary witih the right answers
      rightAnswerSummaryComponent = <span className="muikku-field-examples">
        <span className="muikku-field-examples-title">
          {this.props.i18n.text.get("plugin.workspace.assigment.checkAnswers.correctSummary.title")}
        </span>
        {this.props.content.items.map((answer, index)=>
          <span key={answer.id} className="muikku-field-example">{answer.name}</span>
        )}
      </span>
    }
    
    //Lets get the class name to match the state of the entire field if necessary
    let elementClassNameState = this.props.checkForRightness && this.state.rightnessState ?
        "state-" + (this.state.rightnessState.includes("FAIL") ? "FAIL" : "PASS") : "";
    
    //This element we are gunna use depends on the orientation, we use divs of spans
    let Element = this.props.content.orientation === "vertical" ? 'div' : 'span';
    
    //we use that element and the class to create the field
    return <Element className={`muikku-field muikku-sorter-field ${elementClassNameState}`}>
      <Element className="muikku-sorter-items-container">
       {this.state.items.map((item, index)=>{
         //We get the text
         let text = item.name;
         //if we are wanted to capitalize we do so
         if (index === 0 && this.props.content.capitalize){
           text = text.charAt(0).toUpperCase() + text.slice(1);
         }
         //Now we might be able if we are asked to to show the rightness of the very specific item
         //this only happens if the answer is wrong total because otherwise is right and it's unecessary
         //we set them up so that they show each if they are right or wrong
         let itemClassNameState = this.props.checkForRightness && !answerIsBeingCheckedAndItIsRight &&
           this.state.rightnessState && this.state.rightnessState[index] ? 
             "state-" + this.state.rightnessState[index] : ""
               
         if (this.props.readOnly){
           //readonly component
           return <Element className={`muikku-sorter-item ${itemClassNameState}`} key={item.id}>{text}</Element>
         }
         
         //The draggable version, note how on interaction we swap
         //the parent component is a class name always make sure to have the right class name not to overflow
         //the interaction data is the item itself so the argument would be that
         return <Draggable denyWidth={this.props.content.orientation === "horizontal"} as={Element} parentContainerSelector=".muikku-sorter-items-container"
           className={`muikku-sorter-item ${this.state.selectedItem && this.state.selectedItem.id === item.id ?
         "muikku-sorter-item-selected" : ""} ${itemClassNameState}`} key={item.id} interactionGroup={this.props.content.name}
           interactionData={item} onInteractionWith={this.swap.bind(this, item)}
           onClick={this.selectItem.bind(this, item)}>{text}</Draggable>
       })}
      </Element>
      {rightAnswerSummaryComponent}
    </Element>
  }
}