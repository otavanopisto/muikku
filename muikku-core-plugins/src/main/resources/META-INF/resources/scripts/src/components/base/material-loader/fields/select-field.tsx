import * as React from "react";
import equals = require("deep-equal");

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
  onChange?: (context: React.Component<any, any>, name: string, newValue: any)=>any
}

interface SelectFieldState {
  value: string,
  modified: boolean,
  synced: boolean,
  syncError: string
}

export default class SelectField extends React.Component<SelectFieldProps, SelectFieldState> {
  constructor(props: SelectFieldProps){
    super(props);
    
    this.onSelectChange = this.onSelectChange.bind(this);
    
    this.state = {
      value: props.initialValue || '',
      modified: false,
      synced: true,
      syncError: null
    }
  }
  onSelectChange(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>){
    this.props.onChange && this.props.onChange(this, this.props.content.name, e.target.value);
    this.setState({value: e.target.value});
  }
  shouldComponentUpdate(nextProps: SelectFieldProps, nextState: SelectFieldState){
    return !equals(nextProps.content, this.props.content) || this.props.readOnly !== nextProps.readOnly || !equals(nextState, this.state);
  }
  render(){
    if (this.props.content.listType === "dropdown" || this.props.content.listType === "list"){
      return <select className="muikku-select-field muikku-field" size={this.props.content.listType === "list" ? this.props.content.options.length : null}
        value={this.state.value} onChange={this.onSelectChange} disabled={this.props.readOnly}>
        {this.props.content.listType === "dropdown" ? <option value=""/> : null}
        {this.props.content.options.map(o=>{return <option key={o.name} value={o.name}>{o.text}</option>})}
      </select>
    }
    
    return <span className={`muikku-select-field radiobutton-${this.props.content.listType === "radio-horizontal" ? "horizontal" : "vertical"} muikku-field`}>
      {this.props.content.options.map(o=>{return <span key={o.name}>
        <input type="radio" value={o.name} checked={this.state.value === o.name} onChange={this.onSelectChange} disabled={this.props.readOnly}/>
        <label>{o.text}</label>
      </span>})}
    </span>
  }
}