import * as React from "react";
import { shuffle, arrayToObject } from "~/util/modifiers";
import Draggable, { Droppable } from "~/components/general/draggable";
import equals = require("deep-equal");
import { i18nType } from "~/reducers/base/i18n";
import FieldBase from "./base";

interface FieldType {
  name: string,
  text: string
}

interface TermType {
  id: string,
  name: string
}

interface CategoryType {
  id: string,
  name: string
}

interface CategoryTerm {
  category: string,
  terms: Array<string>
}

interface OrganizerFieldProps {
  type: string,
  content: {
    name: string,
    termTitle: string,
    terms: Array<TermType>,
    categories: Array<CategoryType>,
    categoryTerms: Array<CategoryTerm>
  },
  
  readOnly?: boolean,
  initialValue?: string,
  onChange?: (context: React.Component<any, any>, name: string, newValue: any)=>any,
  i18n: i18nType,
      
  displayCorrectAnswers?: boolean,
  checkAnswers?: boolean,
  onAnswerChange?: (name: string, value: boolean)=>any
}

type OrganizerFieldanswerStateType = {[categoryId: string]: {[termId: string]: "PASS" | "FAIL"}};
type OrganizerFieldanswerStateMissingTermsType = {[categoryId: string]: Array<string>};

interface OrganizerFieldState {
  terms: {
    [termId: string]: string
  },
  boxes: {
    [categoryId: string]: Array<string>
  },
  order: Array<string>,
  useList: Array<string>,
  selectedItemId: string,
  
  //This state comes from the context handler in the base
  //We can use it but it's the parent managing function that modifies them
  //We only set them up in the initial state
  modified: boolean,
  synced: boolean,
  syncError: string,
  
  //Wheter it was right or wrong overall
  answerStateOverall: "PASS" | "FAIL",
  //contains and object which contains and object saying whether the terms currently in the object passed or failed
  answerState: OrganizerFieldanswerStateType,
  //contains an object with a list with the missing items in each box
  answerStateMissingTerms: OrganizerFieldanswerStateMissingTermsType
}

export default class OrganizerField extends FieldBase<OrganizerFieldProps, OrganizerFieldState> {
  constructor(props: OrganizerFieldProps){
    super(props);
    
    this.onDropDraggableItem = this.onDropDraggableItem.bind(this);
    this.deleteTermFromBox = this.deleteTermFromBox.bind(this);
    this.checkAnswers = this.checkAnswers.bind(this);
    
    //set up the initial value, parse it because it comes as string
    let value = props.initialValue ? JSON.parse(props.initialValue) : null;
    //The list of used items
    let useList:Array<string> = [];
    //if we got some values
    if (value){
      //the value is an object with key, the key is the boxId we put all of that we have used in
      //the use list, the value[key] is an array too
      Object.keys(value).forEach((categoryId)=>{
        useList = [...useList, ...value[categoryId]];
      });
    }
    this.state = {
      //we shuffle the order of the items on top
      order: shuffle(props.content.terms).map((term)=>term.id),
      //get all the terms id and name, where id becomes the key and name becomes the value
      terms: arrayToObject(props.content.terms, "id", "name"),
      //we do the same to boxes but the value comes from the value object we defined before that we parsed
      boxes: arrayToObject(props.content.categories, "id", (category)=>{
        //So that was on top before if we got it
        if (value){
          //we return that array that is in there or empty array as value of the attributr
          return value[category.id] || []
        }
        //Do the same here
        return [] as Array<string>
      }),
      useList,
      selectedItemId: null,
      
      //modified synced and syncerror are false, true and null by default
      modified: false,
      synced: true,
      syncError: null,
      
      //We don't know any of this
      answerStateOverall: null,
      answerState: null,
      answerStateMissingTerms: null
    };
    
    this.cancelSelectedItemId = this.cancelSelectedItemId.bind(this);
    this.selectItemId = this.selectItemId.bind(this);
    this.selectBox = this.selectBox.bind(this);
    this.preventPropagation = this.preventPropagation.bind(this);
  }
  shouldComponentUpdate(nextProps: OrganizerFieldProps, nextState: OrganizerFieldState){
    return !equals(nextProps.content, this.props.content) || this.props.readOnly !== nextProps.readOnly || !equals(nextState, this.state)
    || this.props.i18n !== nextProps.i18n || this.props.displayCorrectAnswers !== nextProps.displayCorrectAnswers || this.props.checkAnswers !== nextProps.checkAnswers;
  }
  checkAnswers(){
    //if we are allowed
    if (!this.props.checkAnswers){
      return;
    }
    
    //we set up the terms
    let newanswerState:OrganizerFieldanswerStateType = {};
    let newMissingTerms:OrganizerFieldanswerStateMissingTermsType = {};
    let overallanswerState:"PASS" | "FAIL" = "PASS";
    
    //We loop from the boxes, the boxId is the same as the categoryId
    Object.keys(this.state.boxes).forEach((boxId)=>{
      //We find the correlation from the results as they are given by the properties
      let categoryTermCorrelation = this.props.content.categoryTerms.find(categoryTerm=>categoryTerm.category === boxId);
      //We create an array with all the elements ids that are supposed to be in that cateogory
      let elementsLeft = new Set(categoryTermCorrelation.terms);
      //the box itself has a state of PASS by default
      newanswerState[boxId] = {"*": "PASS"};
      
      //so we loop in the terms within that box
      this.state.boxes[boxId].forEach((termId)=>{
        //we check whether it is correct, that is, if it in the category term correlation array
        let isCorrect = categoryTermCorrelation.terms.includes(termId);
        //we set the state in the answer state box per item
        newanswerState[boxId][termId] = isCorrect ? "PASS" : "FAIL";
        //if it's not correct the overall is fail, and the specific box is fail too
        if (!isCorrect){
          overallanswerState = "FAIL";
          newanswerState[boxId]["*"] = "FAIL";
        }
        //we delete the term we have used already from the elements left set
        elementsLeft.delete(termId);
      });
      
      //Now the elements left set represent the elements we didn't check against
      //which means they weren't in the box and they are missing, we create an array
      let elementsLeftArray = Array.from(elementsLeft);
      //if there are missing from there, the box and the task itself fails too
      if (elementsLeftArray.length){
        overallanswerState = "FAIL";
        newanswerState[boxId]["*"] = "FAIL";
      }
      //and we set it up as in the missing terms list
      newMissingTerms[boxId] = elementsLeftArray;
    });
    
    //We update the state based on whether any of these attributes changed
    if (overallanswerState !== this.state.answerStateOverall || !equals(newanswerState, this.state.answerState) || 
        !equals(newMissingTerms, this.state.answerStateMissingTerms)){
      this.setState({
        answerState: newanswerState,
        answerStateMissingTerms: newMissingTerms,
        answerStateOverall: overallanswerState
      });
    }
    
    //And we use the overall state to call the rightness change function
    let isCorrect = overallanswerState === "PASS";
    let wasCorrect = this.state.answerStateOverall === "PASS";
    if (isCorrect && !wasCorrect){
      this.props.onAnswerChange(this.props.content.name, true);
    } else if (!isCorrect && wasCorrect){
      this.props.onAnswerChange(this.props.content.name, false);
    }
  }
  componentDidMount(){
    super.componentDidMount();
    this.checkAnswers();
  }
  componentDidUpdate(prevProps: OrganizerFieldProps, prevState: OrganizerFieldState){
    super.componentDidUpdate(prevProps, prevState);
    this.checkAnswers();
  }
  onDropDraggableItem(termId: string, categoryId: string){
    //So when we drop a termId onto a category box
    //we first check that it's not there already in that box otherwise
    //it's pointless
    if (this.state.boxes[categoryId].indexOf(termId) === -1){
      //we create the new boxes object
      let nBox = {...this.state.boxes};
      //we change the box for the category id and concat the
      //new term id at the end
      nBox[categoryId] = [...nBox[categoryId], termId]
      
      //we update the state
      this.setState({
        boxes: nBox,
        //and the use list too, note how the use list might have duplicated term ids
        //this is fancy as if two boxes share the same termId in their array then it will be
        //in the use list twice
        useList: [...this.state.useList, termId]
      }, this.checkAnswers);
      
      //Call the onchange function stringifying as usual
      this.props.onChange && this.props.onChange(this, this.props.content.name, JSON.stringify(nBox));
    }
  }
  deleteTermFromBox(categoryId: string, termId: string){
    //And so when we delete from the item
    let newUseList = [...this.state.useList];
    //we just need to find the first index of the term id
    let index = newUseList.indexOf(termId);
    //and delete it, another termId equal might be still there, but, that
    //then should mean the term is being used several times and so
    //this is fine
    newUseList.splice(index, 1);
    
    //we get the new boxes
    let nBox = {...this.state.boxes};
    //make a clone for the category box
    nBox[categoryId] = [...nBox[categoryId]];
    //find the index for the termId within the box
    let index2 = nBox[categoryId].indexOf(termId);
    //and we delete it
    nBox[categoryId].splice(index2, 1);
    
    //update the state
    this.setState({
      boxes: nBox,
      useList: newUseList
    }, this.checkAnswers);
    
    //Call the onchange function stringifying as usual
    this.props.onChange && this.props.onChange(this, this.props.content.name, JSON.stringify(nBox));
  }
  selectItemId(id: string){
    this.setState({
      selectedItemId: id
    });
  }
  selectBox(box: CategoryType){
    if (this.state.selectedItemId){
      this.onDropDraggableItem(this.state.selectedItemId, box.id);
      this.setState({
        selectedItemId: null
      });
    }
  }
  cancelSelectedItemId(){
    this.setState({
      selectedItemId: null
    });
  }
  preventPropagation(e: React.MouseEvent<any>){
    e.stopPropagation();
    e.preventDefault();
    return false;
  }
  render(){
    //TODO lankkinen please ensure that when it's not loaded they take the same
    //space
    if (!this.loaded){
      return <div ref="base" className="muikku-organizer-field muikku-field">
        <div className="muikku-terms-container">
          <div className="muikku-terms-title">{this.props.content.termTitle}</div>
          <div className="muikku-terms-data">
            {this.state.order.map((id)=>{
              return <div className="muikku-term" key={id}>{this.state.terms[id]}</div>
            })}
          </div>
        </div>
        <div className="muikku-categories-container flex-row">
          {this.props.content.categories.map((category)=>{
          
            return <div className="muikku-category-container"
              key={category.id}>
              <div className="muikku-category-title">{category.name}</div>
              <div className="muikku-category"/>
            </div>
          })}
        </div>
      </div>
    }
    
    //The overall state if we got one and we check for rightness
    let elementClassNameState = this.props.checkAnswers && this.state.answerStateOverall ?
        "state-" + this.state.answerStateOverall : "";
    
    //the classic variable
    let answerIsCheckedAndItisCorrect = this.props.checkAnswers && this.state.answerStateOverall === "PASS"
        
    //we add that class name in our component
    return <div className={`muikku-organizer-field muikku-field ${elementClassNameState}`}>
      <div className="muikku-terms-container">
        <div className="muikku-terms-title">{this.props.content.termTitle}</div>
        <div className="muikku-terms-data">
          {this.state.order.map((id)=>{
            //add the term in use class if in the uselist
            let className = `muikku-term ${this.state.useList.indexOf(id) !== -1 ? "term-in-use" : ""} ${this.state.selectedItemId === id ? "term-selected" : ""}`;
            if (this.props.readOnly){
              //if readOnly we just return a non draggable thingy
              return <div className={className} key={id}>{this.state.terms[id]}</div>
            }
            //Otherwise we run a draggable, where the field itself is the parent container
            //the interaction group is only for this field, and it will clone the draggable instead of removing the entire thing
            //on move, it has no interaction data so draggables won't interact with each other, and when it's dropped it
            //calls the on drop into function using its own termId binding and the argument will be the data of the droppables
            return <Draggable parentContainerSelector=".muikku-organizer-field"
              className={className} interactionGroup={this.props.content.name}
              clone key={id} onDropInto={this.onDropDraggableItem.bind(this, id)}
              onDrag={this.cancelSelectedItemId} onClick={this.selectItemId.bind(this, id)}>{this.state.terms[id]}</Draggable>
          })}
        </div>
      </div>
      <div className="muikku-categories-container flex-row">
        {this.props.content.categories.map((category)=>{
          //we make a category class name for if the answer state is there, only worth it if the whole thing is not right
          //if the whole thing is right then every category is right
          let categoryClassNameState = this.props.checkAnswers && !answerIsCheckedAndItisCorrect &&
            this.state.answerState && this.state.answerState[category.id] ?
              "state-" + this.state.answerState[category.id]["*"] : "";
          
          //Showing the missing terms is only reasonable when display correct answers is there
          //we first check whether the category is right
          let wecheckAnswersAndCategoryisCorrect = this.props.checkAnswers &&
            this.state.answerState && this.state.answerState[category.id] && this.state.answerState[category.id]["*"] === "PASS";
          let itemCorrectAnswerMissingTerms:any = null;
          //if we are asked to display and the answers are not right then we add the missing items
          if (this.props.displayCorrectAnswers && !wecheckAnswersAndCategoryisCorrect){
            itemCorrectAnswerMissingTerms = this.state.answerStateMissingTerms && 
              this.state.answerStateMissingTerms[category.id] && this.state.answerStateMissingTerms[category.id].map((missingTermId)=>{
              return <div key={missingTermId} style={{opacity: 0.5}} className="muikku-term term-in-use">{this.state.terms[missingTermId]}</div>;
            });
          }
          
          return <Droppable interactionGroup={this.props.content.name} onClick={this.selectBox.bind(this, category)}
            className={`muikku-category-container ${categoryClassNameState}`}
            key={category.id} interactionData={category.id}>
            <div className="muikku-category-title">{category.name}</div>
            <div className="muikku-category">{this.state.boxes[category.id].map((termId)=>{
              //showhing whether terms are right or not is only worth it is whole answers are not right and the category itself is not right
              //otherwise it's reduntant, if the whole thing is right or the category is right then every term is right too
              let termClassNameState = this.props.checkAnswers && !answerIsCheckedAndItisCorrect && 
                this.state.answerState && this.state.answerState[category.id] && this.state.answerState[category.id]["*"] === "FAIL" ?
                  "state-" + this.state.answerState[category.id][termId] : "";
              return <div onClick={this.preventPropagation} key={termId} className={`muikku-term term-in-use ${termClassNameState}`}>{this.state.terms[termId]}
                {!this.props.readOnly ? <span onClick={this.deleteTermFromBox.bind(this, category.id, termId)} className="icon-delete"></span> : null}
              </div>
            })}{itemCorrectAnswerMissingTerms}</div>
          </Droppable>
        })}
      </div>
    </div>
  }
}