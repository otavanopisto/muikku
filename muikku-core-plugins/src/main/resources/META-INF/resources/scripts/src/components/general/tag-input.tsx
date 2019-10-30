import * as React from 'react';

import '~/sass/elements/form-elements.scss';

interface Tag {
  node: React.ReactElement<any>,
  value: any
}

interface TagInputProps {
  modifier: string,
  inputValue: string,
  onInputDataChange: (e: React.ChangeEvent<HTMLInputElement>)=>any,
  onDelete: (v: any)=>any,
  placeholder: string,
  isFocused?: boolean,
  onBlur?: (e: React.FocusEvent<any>)=>any,
  onFocus?: (e: React.FocusEvent<any>)=>any,
  tags: Tag[],
  autofocus?: boolean,
  deleteByBackKey?: boolean
}

interface TagInputState {
  
}

export default class TagInput extends React.Component<TagInputProps, TagInputState> {
  componentDidMount(){
    if (this.props.autofocus){
      (this.refs["input"] as HTMLElement).focus();
    }
  }
  constructor(props: TagInputProps){
    super(props);
    
    this.onKeyDown = this.onKeyDown.bind(this);
    this.focus = this.focus.bind(this);
    this.onDeleteTag = this.onDeleteTag.bind(this);
  }
  onKeyDown(e: React.KeyboardEvent<any>){
    if (this.props.deleteByBackKey){
      if (e.keyCode === 8 && this.props.inputValue === "" && this.props.tags.length > 0){
        this.props.onDelete(this.props.tags[this.props.tags.length -1].value);
      }
    }
  }
  focus(){
    (this.refs["input"] as HTMLElement).focus();
  }
  
  blur(){
    (this.refs["input"] as HTMLElement).blur();
  }
  getInputHeight(){
    return (this.refs["input"] as HTMLElement).offsetHeight;
  }
  getInputBodyHeight(){
    return (this.refs["inputbody"] as HTMLElement).offsetHeight;
  }
  getSelectedHeight(){
    return (this.refs["selected"] as HTMLElement).offsetHeight;
  }
  
  componentDidUpdate(){
    if (this.props.isFocused){
      this.focus();
    } else {
      this.blur();
    }
  }
  onDeleteTag(tag: Tag){
    this.props.onDelete(tag.value);
  }
  render(){
    return <div className={`container container--${this.props.modifier} ${this.props.isFocused?  "focus" : ""}`}>
      <div className="env-dialog__form-element-container" ref="inputbody" onClick={(e)=>this.props.onFocus(e as any)}>
        <div className="env-dialog__label">{this.props.placeholder}</div>
        <input className="env-dialog__input" value={this.props.inputValue} ref="input" onBlur={this.props.onBlur} onFocus={this.props.onFocus}
        onChange={this.props.onInputDataChange} onKeyDown={this.onKeyDown} /> 
        
        <div ref="selected" className="env-dialog__selected-items">
          {this.props.tags.map((tag, index)=>{
            return <span key={index} className="env-dialog__selected-item">
              <span className="env-dialog__selected-item-label">{tag.node}</span>
              <span className="env-dialog__selected-item-action icon-cross" onClick={this.onDeleteTag.bind(this, tag)}></span>
            </span>
          })}
        </div>
      </div>
    </div>
  }
}