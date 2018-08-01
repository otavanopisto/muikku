import * as React from "react";

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
  }
}

interface MultiSelectFieldState {
  values: {[key: string]: boolean}
}

export default class MultiSelectField extends React.Component<MultiSelectFieldProps, MultiSelectFieldState> {
  constructor(props: MultiSelectFieldProps){
    super(props);
    
    this.toggleValue = this.toggleValue.bind(this);
    
    this.state = {
      values: {}
    }
    
    props.content.options.forEach(option=>{
      this.state.values[option.name] = false;
    });
  }
  componentWillReceiveProps(nextProps: MultiSelectFieldProps){
    if (JSON.stringify(nextProps.content.options) !== JSON.stringify(this.props.content.options)){
      let nValues:{[key: string]: boolean} = {};
      nextProps.content.options.forEach(option=>{
        nValues[option.name] = this.state.values[option.name] || false;
      });
      
      this.setState({
        values: nValues
      });
    }
  }
  toggleValue(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>){
    this.state.values[e.target.value] = !this.state.values[e.target.value];
  }
  render(){
    return <span className={`muikku-checkbox-field checkbox-${this.props.content.listType === "checkbox-horizontal" ? "horizontal" : "vertical"} muikku-field`}>
      {this.props.content.options.map(o=>{return <span key={o.name}>
        <input type="checkbox" value={o.name} checked={this.state.values[o.name]} onChange={this.toggleValue}/>
        <label>{o.text}</label>
      </span>})}
    </span>
  }
}