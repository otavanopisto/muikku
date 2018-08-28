import * as React from "react";

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
  }
}

interface SelectFieldState {
  value: string
}

export default class SelectField extends React.Component<SelectFieldProps, SelectFieldState> {
  constructor(props: SelectFieldProps){
    super(props);
    
    this.onSelectChange = this.onSelectChange.bind(this);
    
    this.state = {
      value: ''
    }
  }
  onSelectChange(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>){
    this.setState({value: e.target.value});
  }
  render(){
    if (this.props.content.listType === "dropdown" || this.props.content.listType === "list"){
      return <select className="muikku-select-field muikku-field" size={this.props.content.listType === "list" ? this.props.content.options.length : null}
        value={this.state.value} onChange={this.onSelectChange}>
        {this.props.content.listType === "dropdown" ? <option value=""/> : null}
        {this.props.content.options.map(o=>{return <option key={o.name} value={o.name}>{o.text}</option>})}
      </select>
    }
    
    return <span className={`muikku-select-field radiobutton-${this.props.content.listType === "radio-horizontal" ? "horizontal" : "vertical"} muikku-field`}>
      {this.props.content.options.map(o=>{return <span key={o.name}>
        <input type="radio" value={o.name} checked={this.state.value === o.name} onChange={this.onSelectChange}/>
        <label>{o.text}</label>
      </span>})}
    </span>
  }
}