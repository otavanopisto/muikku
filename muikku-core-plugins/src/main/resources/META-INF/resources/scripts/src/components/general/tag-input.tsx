import * as React from 'react';

interface Tag {
  node: React.ReactElement<any>,
  value: any
}

interface TagInputProps {
  classNameExtension: string,
  classNameSuffix: string,
  inputValue: string,
  onInputDataChange: (e: React.ChangeEvent<HTMLInputElement>)=>any,
  onDelete: (v: any)=>any,
  placeholder: string,
  isFocused?: boolean,
  onBlur?: (e: React.FocusEvent<any>)=>any,
  onFocus?: (e: React.FocusEvent<any>)=>any,
  tags: Tag[],
  autofocus?: boolean
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
    if (e.keyCode === 8 && this.props.inputValue === "" && this.props.tags.length > 0){
      this.props.onDelete(this.props.tags[this.props.tags.length -1].value);
    }
  }
  focus(){
    (this.refs["input"] as HTMLElement).focus();
  }
  blur(){
    (this.refs["input"] as HTMLElement).blur();
  }
  getHeight(){
    return (this.refs["inputbody"] as HTMLElement).offsetHeight;
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
    return <div className={`${this.props.classNameExtension} form-field-tag-input ${this.props.classNameExtension}-form-field-tag-input-${this.props.classNameSuffix} ${this.props.isFocused?  "focus" : ""}`}>
      <div className="form-field-tag-input-field" ref="inputbody" onClick={(e)=>this.props.onFocus(e as any)}>
        {this.props.tags.map((tag, index)=>{
          return <span key={index} className="form-field-tag-input-tag">
            <span className="form-field-tag-input-tag-text">{tag.node}</span>
            <span className="form-field-tag-input-tag-delete icon icon-close" onClick={this.onDeleteTag.bind(this, tag)}></span>
          </span>
        })}
        <input className="form-field-tag-input-input" value={this.props.inputValue} ref="input" onBlur={this.props.onBlur} onFocus={this.props.onFocus}
         onChange={this.props.onInputDataChange} onKeyDown={this.onKeyDown} placeholder={this.props.placeholder}/>
      </div>
    </div>
  }
}