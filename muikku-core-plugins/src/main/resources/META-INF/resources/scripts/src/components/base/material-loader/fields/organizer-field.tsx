import * as React from "react";
import { shuffle, arrayToObject } from "~/util/modifiers";
import Draggable, { Droppable } from "~/components/general/draggable";
import equals = require("deep-equal");
import { i18nType } from "~/reducers/base/i18n";

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
      
  displayRightAnswers?: boolean,
  checkForRightness?: boolean,
  onRightnessChange?: (name: string, value: boolean)=>any
}

type OrganizerFieldRightnessStateType = {[categoryId: string]: {[termId: string]: "PASS" | "FAIL"}};
type OrganizerFieldRightnessStateMissingTermsType = {[categoryId: string]: Array<string>};

interface OrganizerFieldState {
  terms: {
    [termId: string]: string
  },
  boxes: {
    [categoryId: string]: Array<string>
  },
  order: Array<string>,
  useList: Array<string>,
  
  modified: boolean,
  synced: boolean,
  syncError: string,
  
  rightnessStateOverall: "PASS" | "FAIL",
  rightnessState: OrganizerFieldRightnessStateType,
  rightnessStateMissingTerms: OrganizerFieldRightnessStateMissingTermsType
}

export default class OrganizerField extends React.Component<OrganizerFieldProps, OrganizerFieldState> {
  constructor(props: OrganizerFieldProps){
    super(props);
    
    this.getStateWithProps = this.getStateWithProps.bind(this);
    this.onDropDraggableItem = this.onDropDraggableItem.bind(this);
    this.deleteTermFromBox = this.deleteTermFromBox.bind(this);
    this.triggerChange = this.triggerChange.bind(this);
    this.checkForRightness = this.checkForRightness.bind(this);
    
    this.state = this.getStateWithProps(props, true, false);
  }
  shouldComponentUpdate(nextProps: OrganizerFieldProps, nextState: OrganizerFieldState){
    return !equals(nextProps.content, this.props.content) || this.props.readOnly !== nextProps.readOnly || !equals(nextState, this.state)
    || this.props.i18n !== nextProps.i18n || this.props.displayRightAnswers !== nextProps.displayRightAnswers || this.props.checkForRightness !== nextProps.checkForRightness;
  }
  checkForRightness(){
    if (!this.props.checkForRightness){
      return;
    }
    
    let newRightnessState:OrganizerFieldRightnessStateType = {};
    let newMissingTerms:OrganizerFieldRightnessStateMissingTermsType = {};
    let overallRightnessState:"PASS" | "FAIL" = "PASS";
    
    Object.keys(this.state.boxes).forEach((boxId)=>{
      let categoryTermCorrelation = this.props.content.categoryTerms.find(categoryTerm=>categoryTerm.category === boxId);
      let elementsLeft = new Set(categoryTermCorrelation.terms);
      newRightnessState[boxId] = {"*": "PASS"};
      this.state.boxes[boxId].forEach((termId)=>{
        let isCorrect = categoryTermCorrelation.terms.includes(termId);
        newRightnessState[boxId][termId] = isCorrect ? "PASS" : "FAIL";
        if (!isCorrect){
          overallRightnessState = "FAIL";
          newRightnessState[boxId]["*"] = "FAIL";
        }
        
        elementsLeft.delete(termId);
      });
      
      let elementsLeftArray = Array.from(elementsLeft);
      if (elementsLeftArray.length){
        overallRightnessState = "FAIL";
        newRightnessState[boxId]["*"] = "FAIL";
      }
      newMissingTerms[boxId] = elementsLeftArray;
    });
    
    if (overallRightnessState !== this.state.rightnessStateOverall || !equals(newRightnessState, this.state.rightnessState) || 
        !equals(newMissingTerms, this.state.rightnessStateMissingTerms)){
      this.setState({
        rightnessState: newRightnessState,
        rightnessStateMissingTerms: newMissingTerms,
        rightnessStateOverall: overallRightnessState
      });
    }
    
    let isRight = overallRightnessState === "PASS";
    let wasRight = this.state.rightnessStateOverall === "PASS";
    if (isRight && !wasRight){
      this.props.onRightnessChange(this.props.content.name, true);
    } else if (!isRight && wasRight){
      this.props.onRightnessChange(this.props.content.name, false);
    }
  }
  componentDidMount(){
    this.checkForRightness();
  }
  componentDidUpdate(prevProps: OrganizerFieldProps, prevState: OrganizerFieldState){
    this.checkForRightness();
  }
  getStateWithProps(props: OrganizerFieldProps = this.props, doshuffle: boolean, reuse: boolean): OrganizerFieldState{
    let value = props.initialValue ? JSON.parse(props.initialValue) : null;
    let useList:Array<string> = [];
    if (value){
      Object.keys(value).forEach((key)=>{
        useList = [...useList, ...value[key]];
      });
    }
    return {
      order: doshuffle ? shuffle(props.content.terms).map((term)=>term.id) : (reuse ? this.state.order : props.content.terms.map((term)=>term.id)),
      terms: arrayToObject(props.content.terms, "id", "name"),
      boxes: arrayToObject(props.content.categories, "id", (category)=>{
        if (value){
          return value[category.id] || null
        }
        return [] as Array<string>
      }),
      useList,
      modified: false,
      synced: true,
      syncError: null,
      rightnessStateOverall: null,
      rightnessState: null,
      rightnessStateMissingTerms: null
    };
  }
  onDropDraggableItem(termId: string, categoryId: string){
    if (this.state.boxes[categoryId].indexOf(termId) === -1){
      let nBox = {...this.state.boxes};
      nBox[categoryId] = [...nBox[categoryId], termId]
      this.setState({
        boxes: nBox,
        useList: [...this.state.useList, termId]
      }, this.triggerChange)
    }
  }
  deleteTermFromBox(categoryId: string, termId: string){
    let newUseList = [...this.state.useList];
    let index = newUseList.indexOf(termId);
    newUseList.splice(index, 1);
    
    let nBox = {...this.state.boxes};
    nBox[categoryId] = [...nBox[categoryId]];
    let index2 = nBox[categoryId].indexOf(termId);
    nBox[categoryId].splice(index2, 1);
    this.setState({
      boxes: nBox,
      useList: newUseList
    }, this.triggerChange)
  }
  triggerChange(){
    this.checkForRightness();
    
    if (!this.props.onChange){
      return;
    }
    this.props.onChange(this, this.props.content.name, JSON.stringify(this.state.boxes));
  }
  render(){
    let elementClassNameState = this.props.checkForRightness && this.state.rightnessStateOverall ?
        "state-" + this.state.rightnessStateOverall : "";
        
    return <div className={`muikku-organizer-field muikku-field ${elementClassNameState}`}>
      <div className="muikku-terms-container">
        <div className="muikku-terms-title">{this.props.content.termTitle}</div>
        <div className="muikku-terms-data">
          {this.state.order.map((id)=>{
            let className = `muikku-term ${this.state.useList.indexOf(id) !== -1 ? "term-in-use" : ""}`;
            if (this.props.readOnly){
              return <div className={className} key={id}>{this.state.terms[id]}</div>
            }
            return <Draggable parentContainerSelector=".muikku-organizer-field"
              className={className} interactionGroup={this.props.content.name}
              clone key={id} onDropInto={this.onDropDraggableItem.bind(this, id)}>{this.state.terms[id]}</Draggable>
          })}
        </div>
      </div>
      <div className="muikku-categories-container flex-row">
        {this.props.content.categories.map((category)=>{
          let categoryClassNameState = this.props.checkForRightness && this.state.rightnessState && this.state.rightnessState[category.id] ?
              "state-" + this.state.rightnessState[category.id]["*"] : "";
              
          let itemRightAnswerMissingTerms:any = null;
          if (this.props.displayRightAnswers && !(this.props.checkForRightness &&
            this.state.rightnessState && this.state.rightnessState[category.id] && this.state.rightnessState[category.id]["*"] === "PASS")){
            itemRightAnswerMissingTerms = this.state.rightnessStateMissingTerms && 
              this.state.rightnessStateMissingTerms[category.id] && this.state.rightnessStateMissingTerms[category.id].map((missingTermId)=>{
              return <div key={missingTermId} style={{opacity: 0.5}} className="muikku-term term-in-use">{this.state.terms[missingTermId]}</div>;
            });
          }
          
          return <Droppable interactionGroup={this.props.content.name} className={`muikku-category-container ${categoryClassNameState}`}
            key={category.id} interactionData={category.id}>
            <div className="muikku-category-title">{category.name}</div>
            <div className="muikku-category">{this.state.boxes[category.id].map((termId)=>{
              let termClassNameState = this.props.checkForRightness && this.state.rightnessState && this.state.rightnessState[category.id] ?
                  "state-" + this.state.rightnessState[category.id][termId] : "";
              return <div key={termId} className={`muikku-term term-in-use ${termClassNameState}`}>{this.state.terms[termId]}
                {!this.props.readOnly ? <span onClick={this.deleteTermFromBox.bind(this, category.id, termId)} className="icon-delete"></span> : null}
              </div>
            })}{itemRightAnswerMissingTerms}</div>
          </Droppable>
        })}
      </div>
    </div>
  }
}