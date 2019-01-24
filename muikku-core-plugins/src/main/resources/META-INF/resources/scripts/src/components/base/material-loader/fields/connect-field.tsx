import * as React from "react";
import { shuffle } from "~/util/modifiers";
import Draggable from "~/components/general/draggable";
import equals = require("deep-equal");
import { i18nType } from "~/reducers/base/i18n";

interface FieldType {
  name: string,
  text: string
}

interface ConnectFieldProps {
  type: string,
  content: {
    name: string,
    fields: FieldType[],
    counterparts: FieldType[],
    connections: {
      field: string,
      counterpart: string
    }[]
  },
  
  readOnly?: boolean,
  initialValue?: string,
  onChange?: (context: React.Component<any, any>, name: string, newValue: any)=>any,
  i18n: i18nType,
      
  displayRightAnswers?: boolean,
  checkForRightness?: boolean,
  onRightnessChange?: (name: string, value: boolean)=>any
}

interface ConnectFieldState {
  fields: FieldType[],
  counterparts: FieldType[],
  selectedField: FieldType,
  selectedIsCounterpart: boolean,
  selectedIndex: number,
  editedIds: Set<string>,
  
  //This state comes from the context handler in the base
  //We can use it but it's the parent managing function that modifies them
  //We only set them up in the initial state
  modified: boolean,
  synced: boolean,
  syncError: string,
  
  rightnessState: Array<"PASS" | "FAIL">
}

export default class ConnectField extends React.Component<ConnectFieldProps, ConnectFieldState> {
  constructor(props: ConnectFieldProps){
    super(props);
    
    let fields:FieldType[];
    let counterparts:FieldType[];
    let editedIdsArray:Array<string> = [];
    if (props.initialValue){
      let value = JSON.parse(props.initialValue);
      fields = props.content.fields;
      counterparts = [];
      
      fields.forEach((field)=>{
        let counterpartId = value[field.name];
        counterparts.push(props.content.counterparts.find((c)=>c.name === counterpartId))
      });
    } else {
      counterparts = shuffle(props.content.counterparts);
    }
    
    this.setState({
      fields,
      counterparts,
      editedIds: new Set(editedIdsArray)
    });
    
    this.state = {
      fields,
      counterparts,
      selectedField: null,
      selectedIsCounterpart: false,
      selectedIndex: null,
      editedIds: new Set(editedIdsArray),
      
     //modified synced and syncerror are false, true and null by default
      modified: false,
      synced: true,
      syncError: null,
      rightnessState: null
    }
    
    this.swapField = this.swapField.bind(this);
    this.swapCounterpart = this.swapCounterpart.bind(this);
    this.pickField = this.pickField.bind(this);
    this.cancelPreviousPick = this.cancelPreviousPick.bind(this);
    this.triggerChange = this.triggerChange.bind(this);
  }
  shouldComponentUpdate(nextProps: ConnectFieldProps, nextState: ConnectFieldState){
    return !equals(nextProps.content, this.props.content) || this.props.readOnly !== nextProps.readOnly || !equals(nextState, this.state)
    || this.props.i18n !== nextProps.i18n || this.props.displayRightAnswers !== nextProps.displayRightAnswers || this.props.checkForRightness !== nextProps.checkForRightness;
  }
  triggerChange(){
    this.checkForRightness();
    
    if (!this.props.onChange){
      return;
    }
    
    let newValue:any = {};
    this.state.fields.forEach((field, index)=>{
      let counterpart = this.state.counterparts[index];
      newValue[field.name] = counterpart.name;
    });
    this.props.onChange(this, this.props.content.name, JSON.stringify(newValue));
  }
  checkForRightness(){
    if (!this.props.checkForRightness){
      return;
    }
    
    let newRightnessState:Array<"PASS" | "FAIL"> = this.state.fields.map((field, index)=>{
      let counterpart = this.state.counterparts[index];
      let connection = this.props.content.connections.find(connection=>connection.field === field.name);
      return connection && connection.counterpart === counterpart.name ? "PASS" : "FAIL";
    });
    
    if (!equals(newRightnessState, this.state.rightnessState)){
      this.setState({
        rightnessState: newRightnessState
      });
    }
    
    let isRight = newRightnessState.includes("FAIL");
    if (!this.state.rightnessState){
      this.props.onRightnessChange(this.props.content.name, isRight);
      return;
    }
    
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
  componentDidUpdate(prevProps: ConnectFieldProps, prevState: ConnectFieldState){
    this.checkForRightness();
  }
  swapField(fielda: FieldType, fieldb: FieldType){
    this.setState({
      fields: this.state.fields.map(f=>{
        if (f.name === fielda.name){
          return fieldb;
        } else if (f.name === fieldb.name){
          return fielda
        }
        return f;
      })
    }, this.triggerChange)
  }
  swapCounterpart(fielda: FieldType, fieldb: FieldType){
    if (fielda.name === fieldb.name){
      return;
    }
    this.setState({
      counterparts: this.state.counterparts.map(f=>{
        if (f.name === fielda.name){
          return fieldb;
        } else if (f.name === fieldb.name){
          return fielda
        }
        return f;
      })
    }, this.triggerChange)
  }
  pickField(field: FieldType, isCounterpart: boolean, index: number){
    if (!this.state.selectedField){
      this.setState({
        selectedField: field,
        selectedIsCounterpart: isCounterpart,
        selectedIndex: index
      });
      return;
    }
    
    let editedIds = new Set(this.state.editedIds);
    if (field.name !== this.state.selectedField.name){
      if (this.state.selectedIsCounterpart && isCounterpart){
        this.swapCounterpart(this.state.selectedField, field);
        
        let diametricOpposite = this.state.fields[this.state.selectedIndex];
        editedIds.delete(diametricOpposite.name);
        editedIds.delete(field.name);
        
        let opposite = this.state.fields[index];
        editedIds.add(opposite.name);
        editedIds.add(this.state.selectedField.name);
      } else if (!this.state.selectedIsCounterpart && !isCounterpart){
        this.swapField(this.state.selectedField, field);
        
        let diametricOpposite = this.state.counterparts[this.state.selectedIndex];
        editedIds.delete(diametricOpposite.name);
        editedIds.delete(field.name);
        
        let opposite = this.state.counterparts[index];
        editedIds.add(opposite.name);
        editedIds.add(this.state.selectedField.name);
      } else {
        let counterpart:FieldType = this.state.selectedIsCounterpart ? this.state.selectedField : field;
        let counterpartIndex:number = this.state.selectedIsCounterpart ? this.state.selectedIndex : index;
        let givenFieldIndex:number = !this.state.selectedIsCounterpart ? this.state.selectedIndex : index;
        let opposite = this.state.counterparts[givenFieldIndex];
        let diametricOpposite = this.state.fields[counterpartIndex];
        
        this.swapCounterpart(counterpart, opposite);
        
        editedIds.delete(opposite.name);
        editedIds.delete(diametricOpposite.name);
        
        editedIds.add(field.name);
        editedIds.add(this.state.selectedField.name);
      }
    }
    
    this.setState({
      selectedField: null,
      selectedIsCounterpart: false,
      selectedIndex: null,
      editedIds
    });
  }
  cancelPreviousPick(){
    this.setState({
      selectedField: null,
      selectedIsCounterpart: false,
      selectedIndex: null
    });
  }
  render(){
    let elementClassNameState = this.props.checkForRightness && this.state.rightnessState ?
        "state-" + (this.state.rightnessState.includes("FAIL") ? "FAIL" : "PASS") : "";
    return <div className={`muikku-connect-field muikku-field ${elementClassNameState}`}>
      <div className="muikku-connect-field-terms">
        {this.state.fields.map((field, index)=>{
          let itemClassNameState = this.props.checkForRightness && this.state.rightnessState && this.state.rightnessState[index] ? 
              "state-" + this.state.rightnessState[index] : ""
          return <div key={field.name} onClick={this.props.readOnly ? null : this.pickField.bind(this, field, false, index)}>
            <span className="muikku-connect-field-number">{index + 1}</span>
            <div className={`muikku-connect-field-term ${this.state.selectedField && this.state.selectedField.name === field.name ?
              "muikku-connect-field-term-selected" : ""} ${this.state.editedIds.has(field.name) ? "muikku-connect-field-edited" : ""}
              ${itemClassNameState}`}>{field.text}</div>
          </div>
         })}
      </div>
      <div className="muikku-connect-field-gap"></div>
      <div className="muikku-connect-field-counterparts">
       {this.state.counterparts.map((field, index)=>{
         let itemRightness = this.props.checkForRightness && this.state.rightnessState && this.state.rightnessState[index];
         let itemClassNameState = this.props.checkForRightness && this.state.rightnessState && this.state.rightnessState[index] ? 
             "state-" + this.state.rightnessState[index] : ""
         let className = `muikku-connect-field-term ${this.state.selectedField && this.state.selectedField.name === field.name ?
           "muikku-connect-field-term-selected" : ""} ${this.state.editedIds.has(field.name) ? "muikku-connect-field-edited" : ""} ${itemClassNameState}`;
         let style:React.CSSProperties = {
             justifyContent: "flex-start"  //TODO lankkinen Add this in classes sadly I had to use the original connect field term class because of missing functionality
         };
         if (this.props.readOnly){
           return <div className={className}
             key={field.name} style={style}>{field.text}</div>
         }
         
         let itemRightAnswerComponent = null;
         if (this.props.displayRightAnswers && !(this.props.checkForRightness && itemRightness === "PASS")){
           itemRightAnswerComponent = <span className="muikku-connect-field-number">
             {this.state.fields.findIndex(f=>f.name === (this.props.content.connections.find(c=>c.counterpart === field.name) || {field: null}).field) + 1}
           </span>
         }
         
         return <Draggable interactionData={{field, index, isCounterpart: true}} 
           interactionGroup={this.props.content.name + "-counterparts"}
           onDrag={()=>{this.cancelPreviousPick(); this.pickField(field, true, index);}}
           onClick={this.pickField.bind(this, field, true, index)} parentContainerSelector=".muikku-field"
           onDropInto={(data)=>this.pickField(data.field, data.isCounterpart, data.index)}
           className={className} key={field.name} style={style}>{itemRightAnswerComponent}{field.text}</Draggable>
       })}
      </div>
    </div>
  }
}