import * as React from "react";
import { shuffle, arrayToObject } from "~/util/modifiers";
import Draggable, { Droppable } from "~/components/general/draggable";

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
  value?: string
}

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
  synced: boolean
}

export default class OrganizerField extends React.Component<OrganizerFieldProps, OrganizerFieldState> {
  constructor(props: OrganizerFieldProps){
    super(props);
    
    this.getStateWithProps = this.getStateWithProps.bind(this);
    this.onDropDraggableItem = this.onDropDraggableItem.bind(this);
    this.deleteTermFromBox = this.deleteTermFromBox.bind(this);
    
    this.state = this.getStateWithProps(props, true, false);
  }
  componentWillReceiveProps(nextProps: OrganizerFieldProps){
    if (JSON.stringify(nextProps.content) !== JSON.stringify(this.props.content)){
      if (JSON.stringify(nextProps.content.terms) !== JSON.stringify(this.props.content.terms)){
        this.setState(this.getStateWithProps(nextProps, true, false));
      } else {
        this.setState(this.getStateWithProps(nextProps, false, true));
      }
    } else if (nextProps.value !== this.props.value){
      this.setState(this.getStateWithProps(nextProps, false, true));
    } else {
      this.setState({
        modified: false,
        synced: true
      });
    }
  }
  getStateWithProps(props: OrganizerFieldProps = this.props, doshuffle: boolean, reuse: boolean){
    let value = props.value ? JSON.parse(props.value) : null;
    let useList:Array<string> = [];
    if (value){
      Object.keys(value).forEach((key)=>{
        useList = [...useList, ...value[key]];
      });
    }
    let result = {
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
      synced: true
    };
    console.log(result);
    return result;
  }
  onDropDraggableItem(termId: string, categoryId: string){
    if (this.state.boxes[categoryId].indexOf(termId) === -1){
      let nBox = {...this.state.boxes};
      nBox[categoryId] = [...nBox[categoryId], termId]
      this.setState({
        boxes: nBox,
        useList: [...this.state.useList, termId]
      })
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
    })
  }
  render(){
    return <div className="muikku-organizer-field muikku-field">
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
          return <Droppable interactionGroup={this.props.content.name} className="muikku-category-container"
            key={category.id} interactionData={category.id}>
            <div className="muikku-category-title">{category.name}</div>
            <div className="muikku-category">{this.state.boxes[category.id].map((termId)=>{
              return <div key={termId} className="muikku-term term-in-use">{this.state.terms[termId]}
                {!this.props.readOnly ? <span onClick={this.deleteTermFromBox.bind(this, category.id, termId)} className="icon-delete"></span> : null}
              </div>
            })}</div>
          </Droppable>
        })}
      </div>
    </div>
  }
}