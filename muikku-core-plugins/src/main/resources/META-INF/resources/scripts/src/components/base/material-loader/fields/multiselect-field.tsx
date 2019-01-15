import * as React from "react";
import equals = require("deep-equal");

interface MultiSelectFieldProps {
  type: string,
  content: {
    name: string,
    explanation: string,
    listType: "checkbox-horizontal" | "checkbox-vertical",
    options: Array<{
      name: string,
      text: string,
      correct: boolean
    }>
  },
  readOnly?: boolean,
  initialValue?: string,
  onChange?: (context: React.Component<any, any>, name: string, newValue: any)=>any
}

interface MultiSelectFieldState {
  values: Array<string>,
  modified: boolean,
  synced: boolean,
  syncError: string
}

export default class MultiSelectField extends React.Component<MultiSelectFieldProps, MultiSelectFieldState> {
  constructor(props: MultiSelectFieldProps){
    super(props);
    
    this.toggleValue = this.toggleValue.bind(this);
    
    let values:Array<string> = ((props.initialValue && JSON.parse(props.initialValue)) || []) as Array<string>;
    this.state = {
      values: values.sort(),
      modified: false,
      synced: true,
      syncError: null
    }
  }
  shouldComponentUpdate(nextProps: MultiSelectFieldProps, nextState: MultiSelectFieldState){
    return !equals(nextProps.content, this.props.content) || this.props.readOnly !== nextProps.readOnly || !equals(nextState, this.state);
  }
  toggleValue(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>){
    let nValues = this.state.values.slice(0);
    if (this.state.values.includes(e.target.value)){
      nValues.filter(v=>v!==e.target.value)
    } else {
      nValues.push(e.target.value);
      nValues.sort();
    }
    
    this.props.onChange && this.props.onChange(this, this.props.content.name, JSON.stringify(nValues));
    this.setState({
      values: nValues
    });
  }
  render(){
    return <span className={`muikku-checkbox-field checkbox-${this.props.content.listType === "checkbox-horizontal" ? "horizontal" : "vertical"} muikku-field`}>
      {this.props.content.options.map(o=>{return <span key={o.name}>
        <input type="checkbox" value={o.name} checked={this.state.values.includes(o.name)} onChange={this.toggleValue} disabled={this.props.readOnly}/>
        <label>{o.text}</label>
      </span>})}
    </span>
  }
}