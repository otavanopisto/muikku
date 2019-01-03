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
  },
  readOnly?: boolean,
  value?: string
}

interface MultiSelectFieldState {
  values: Array<string>,
  modified: boolean,
  synced: boolean
}

export default class MultiSelectField extends React.Component<MultiSelectFieldProps, MultiSelectFieldState> {
  constructor(props: MultiSelectFieldProps){
    super(props);
    
    this.toggleValue = this.toggleValue.bind(this);
    
    let values:Array<string> = ((props.value && JSON.parse(props.value)) || []) as Array<string>;
    this.state = {
      values: values.sort(),
      modified: false,
      synced: true
    }
  }
  componentWillReceiveProps(nextProps: MultiSelectFieldProps){
    if (JSON.stringify(nextProps.content.options) !== JSON.stringify(this.props.content.options)){
      let nValues:Array<string> = [];
      nextProps.content.options.forEach(option=>{
        if (this.state.values.includes(option.name)){
          nValues.push(option.name);
        }
      });
      
      this.setState({
        values: nValues.sort()
      });
    }
    
    let values = nextProps.value && JSON.parse(nextProps.value);
    if (values && JSON.stringify(values.sort()) !== JSON.stringify(this.state.values)){
      this.setState({
        values: values.sort()
      });
    }
    
    this.setState({
      modified: false,
      synced: true
    });
  }
  toggleValue(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>){
    let nValues = this.state.values.slice(0);
    if (this.state.values.includes(e.target.value)){
      nValues.filter(v=>v!==e.target.value)
    } else {
      nValues.push(e.target.value);
      nValues.sort();
    }
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