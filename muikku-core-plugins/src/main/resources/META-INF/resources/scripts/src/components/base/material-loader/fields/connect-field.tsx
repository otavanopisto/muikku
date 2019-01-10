import * as React from "react";
import { shuffle } from "~/util/modifiers";
import Draggable from "~/components/general/draggable";

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
  value?: string,
  onChange?: (context: React.Component<any, any>, name: string, newValue: any)=>any
}

interface ConnectFieldState {
  fields: FieldType[],
  counterparts: FieldType[],
  selectedField: FieldType,
  selectedIsCounterpart: boolean,
  selectedIndex: number,
  editedIds: Set<string>,
  modified: boolean,
  synced: boolean,
  syncError: string
}

export default class ConnectField extends React.Component<ConnectFieldProps, ConnectFieldState> {
  constructor(props: ConnectFieldProps){
    super(props);
    
    let fields:FieldType[];
    let counterparts:FieldType[];
    let editedIdsArray:Array<string> = [];
    if (props.value){
      let value = JSON.parse(props.value);
      fields = [];
      counterparts = [];
      
      Object.keys(value).forEach((fieldId)=>{
        let counterpartId = value[fieldId];
        editedIdsArray.push(fieldId);
        editedIdsArray.push(counterpartId);
        
        fields.push(props.content.fields.find((f)=>f.name === fieldId));
        counterparts.push(props.content.counterparts.find((c)=>c.name === counterpartId))
      });
    } else {
      fields = shuffle(props.content.fields);
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
      modified: false,
      synced: true,
      syncError: null
    }
    
    this.swapField = this.swapField.bind(this);
    this.swapCounterpart = this.swapCounterpart.bind(this);
    this.pickField = this.pickField.bind(this);
    this.cancelPreviousPick = this.cancelPreviousPick.bind(this);
    this.triggerChange = this.triggerChange.bind(this);
  }
  componentWillReceiveProps(nextProps: ConnectFieldProps){
    if (JSON.stringify(nextProps.content) !== JSON.stringify(this.props.content)){
      this.setState({
        fields: shuffle(nextProps.content.fields),
        counterparts: shuffle(nextProps.content.counterparts)
      });
    }
    
    if (nextProps.value !== this.props.value && nextProps.value){
      let value = JSON.parse(nextProps.value);
      let fields:FieldType[] = [];
      let counterparts:FieldType[] = [];
      let editedIdsArray:Array<string> = [];
      
      Object.keys(value).forEach((fieldId)=>{
        let counterpartId = value[fieldId];
        editedIdsArray.push(fieldId);
        editedIdsArray.push(counterpartId);
        
        fields.push(nextProps.content.fields.find((f)=>f.name === fieldId));
        counterparts.push(nextProps.content.counterparts.find((c)=>c.name === counterpartId))
      });
      
      this.setState({
        fields,
        counterparts,
        editedIds: new Set(editedIdsArray)
      });
    }
    
    this.setState({
      modified: false,
      synced: true,
      syncError: null
    });
  }
  triggerChange(){
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
    console.log(arguments);
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
    return <div className="muikku-connect-field muikku-field">
      <div className="muikku-connect-field-terms">
        {this.state.fields.map((field, index)=><div key={field.name} onClick={this.props.readOnly ? null : this.pickField.bind(this, field, false, index)}>
          <span className="muikku-connect-field-number">{index + 1}</span>
          <div className={`muikku-connect-field-term ${this.state.selectedField && this.state.selectedField.name === field.name ?
            "muikku-connect-field-term-selected" : ""} ${this.state.editedIds.has(field.name) ? "muikku-connect-field-edited" : ""}`}>{field.text}</div>
        </div>)}
      </div>
      <div className="muikku-connect-field-gap"></div>
      <div className="muikku-connect-field-counterparts">
       {this.state.counterparts.map((field, index)=>{
         let className = `muikku-connect-field-term ${this.state.selectedField && this.state.selectedField.name === field.name ?
           "muikku-connect-field-term-selected" : ""} ${this.state.editedIds.has(field.name) ? "muikku-connect-field-edited" : ""}`;
         let style:React.CSSProperties = {
             justifyContent: "flex-start"  //TODO lankkinen Add this in classes sadly I had to use the original connect field term class because of missing functionality
         };
         if (this.props.readOnly){
           return <div className={className}
             key={field.name} style={style}>{field.text}</div>
         }
         
         return <Draggable interactionData={{field, index, isCounterpart: true}} 
           interactionGroup={this.props.content.name + "-counterparts"}
           onDrag={()=>{this.cancelPreviousPick(); this.pickField(field, true, index);}}
           onClick={this.pickField.bind(this, field, true, index)} parentContainerSelector=".muikku-field"
           onDropInto={(data)=>this.pickField(data.field, data.isCounterpart, data.index)}
           className={className} key={field.name} style={style}>{field.text}</Draggable>
       })}
      </div>
    </div>
  }
}