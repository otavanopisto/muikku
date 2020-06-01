import * as React from "react";
import { shuffle } from "~/util/modifiers";
import Draggable from "~/components/general/draggable";
import equals = require("deep-equal");
import { i18nType } from "~/reducers/base/i18n";
import Synchronizer from "./base/synchronizer";
import { StrMathJAX } from "../static/mathjax";

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

  displayCorrectAnswers?: boolean,
  checkAnswers?: boolean,
  onAnswerChange?: (name: string, value: boolean)=>any,

  invisible?: boolean,
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

  //We have a answer state for each element in the sorter field
  //so we know which ones are messed up
  answerState: Array<"PASS" | "FAIL">
}

export default class SorterField extends React.Component<SorterFieldProps, SorterFieldState> {
  constructor(props: SorterFieldProps){
    super(props);

    let value = null;
    let items: Array<SorterFieldItemType>;
    //We take the initial value and parse it because somehow it comes as a string
    //this comes from the composite reply as so
    if (props.initialValue){
      value = JSON.parse(props.initialValue);
      //We set it up properly
      items = value.map((v:string)=>this.props.content.items.find(i=>i.id === v));
      let itemsSuffled = shuffle(props.content.items) || [];
      itemsSuffled.forEach((i) => {
        if (!items.find((si) => si.id === i.id)) {
          items.push(i);
        }
      })
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

      //initial answer state is not known
      answerState: null
    }

    this.swap = this.swap.bind(this);
    this.selectItem = this.selectItem.bind(this);
    this.cancelSelectedItem = this.cancelSelectedItem.bind(this);
  }
  shouldComponentUpdate(nextProps: SorterFieldProps, nextState: SorterFieldState){
    return !equals(nextProps.content, this.props.content) || this.props.readOnly !== nextProps.readOnly || !equals(nextState, this.state)
    || this.props.i18n !== nextProps.i18n || this.props.displayCorrectAnswers !== nextProps.displayCorrectAnswers || this.props.checkAnswers !== nextProps.checkAnswers
    || this.state.modified !== nextState.modified || this.state.synced !== nextState.synced || this.state.syncError !== nextState.syncError;
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
      items,
    }, this.checkAnswers);
  }
  checkAnswers(){
    //if not set to actually do we cancel
    if (!this.props.checkAnswers){
      return;
    }

    //ok so now we loop per item
    let newanswerState:Array<"PASS" | "FAIL"> = this.state.items.map((item, index)=>{
      //we check the answer from the property of the content, using the index we get what
      //element had to be in that specific index
      let answer = this.props.content.items[index];
      //if the ids are equal then the answer was correct
      let isAnswerProper = answer.id === item.id || item.name.toLocaleLowerCase() === answer.name.toLocaleLowerCase();
      return isAnswerProper ? "PASS" : "FAIL";
    });

    //We check if the new state is different before update
    if (!equals(newanswerState, this.state.answerState)){
      this.setState({
        answerState: newanswerState
      });
    }

    //In this case whether it overall right or not depends son whether
    //one of them failed, so we check
    let isCorrect = !newanswerState.includes("FAIL");
    //If we have no answer state to compare with, we just send the result
    if (!this.state.answerState){
      this.props.onAnswerChange(this.props.content.name, isCorrect);
      return;
    }

    //Otherwise we compare and update accordingly only when necessary
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
  componentDidUpdate(prevProps: SorterFieldProps, prevState: SorterFieldState){
    this.checkAnswers();
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
  cancelSelectedItem(){
    this.setState({
      selectedItem: null
    });
  }
  render(){
    let elementClassName = this.props.content.orientation === "vertical" ? 'vertical' : 'horizontal';

    //The summary for the correct answers
    let correctAnswersummaryComponent = null;
    let answerIsBeingCheckedAndItisCorrect = this.props.checkAnswers && this.state.answerState && !this.state.answerState.includes("FAIL");
    //We only display the correct answers if we got them wrong or they are not being checked at all
    if (this.props.displayCorrectAnswers && !answerIsBeingCheckedAndItisCorrect){
      //We create the summary witih the correct answers
      correctAnswersummaryComponent = <span className="material-page__field-answer-examples material-page__field-answer-examples--sorterfield">
        <span className="material-page__field-answer-examples-title">
          {this.props.i18n.text.get("plugin.workspace.assigment.checkAnswers.correctSummary.title")}
        </span>
        {this.props.content.items.map((answer, index)=>
          <span key={answer.id} className="material-page__field-answer-example"><StrMathJAX>{answer.name}</StrMathJAX></span>
        )}
      </span>
    }

    if (this.props.invisible){
      let filler = this.state.items.map((i, index)=>{
        let text = i.name;
        if (index === 0 && this.props.content.capitalize){
          text = text.charAt(0).toUpperCase() + text.slice(1);
        }
        return <span className="material-page__sorterfield-item" key={i.id}>
          <span className="material-page__sorterfield-item-icon icon-move"></span>
          <span className="material-page__sorterfield-item-label"><StrMathJAX invisible={true}>{text}</StrMathJAX></span>
        </span>
      })
      return <span ref="base" className="material-page__sorterfield-wrapper">
        <span className={`material-page__sorterfield material-page__sorterfield--${elementClassName}`}>
          {filler}
        </span>
        {correctAnswersummaryComponent}
      </span>
    }

    //Lets get the class name to match the state of the entire field if necessary
    let fieldStateAfterCheck = this.props.displayCorrectAnswers && this.props.checkAnswers && this.state.answerState ?
        (this.state.answerState.includes("FAIL") ? "incorrect-answer" : "correct-answer") : "";

    //if elements is disabled
    let elementDisabledStateClassName = this.props.readOnly ? "material-page__taskfield-disabled" : "";

    //we use that element and the class to create the field
    return <span className="material-page__sorterfield-wrapper">
      <Synchronizer synced={this.state.synced} syncError={this.state.syncError} i18n={this.props.i18n}/>
      <span className={`material-page__sorterfield material-page__sorterfield--${elementClassName} ${fieldStateAfterCheck} ${elementDisabledStateClassName}`}>
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

         let itemStateAfterCheck = this.props.displayCorrectAnswers && this.props.checkAnswers && !answerIsBeingCheckedAndItisCorrect &&
           this.state.answerState && this.state.answerState[index] ? (this.state.answerState[index].includes("FAIL") ? "incorrect-answer" : "correct-answer") : "";

         if (this.props.readOnly){
           //readonly component
           return <span className={`material-page__sorterfield-item ${itemStateAfterCheck}`} key={item.id}>
             <span className="material-page__sorterfield-item-icon icon-move"></span>
             <span className="material-page__sorterfield-item-label"><StrMathJAX>{text}</StrMathJAX></span>
           </span>
         }

         //The draggable version, note how on interaction we swap
         //the parent component is a class name always make sure to have the right class name not to overflow
         //the interaction data is the item itself so the argument would be that
         return <Draggable denyWidth={this.props.content.orientation === "horizontal"} as="span" parentContainerSelector=".material-page__sorterfield"
           className={`material-page__sorterfield-item ${this.state.selectedItem && this.state.selectedItem.id === item.id ?
         "material-page__sorterfield-item--selected" : ""} ${itemStateAfterCheck}`} key={item.id} interactionGroup={this.props.content.name}
           interactionData={item} onInteractionWith={this.swap.bind(this, item)}
           onClick={this.selectItem.bind(this, item)} onDrag={this.selectItem.bind(this, item)}
           onDropInto={this.cancelSelectedItem}>
           <span className="material-page__sorterfield-item-icon icon-move"></span>
           <span className="material-page__sorterfield-item-label"><StrMathJAX>{text}</StrMathJAX></span>
         </Draggable>
       })}
      </span>
      {correctAnswersummaryComponent}
    </span>
  }
}
