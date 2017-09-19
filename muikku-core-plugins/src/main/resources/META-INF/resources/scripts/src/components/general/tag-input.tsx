import * as React from 'react';
import * as PropTypes from 'prop-types';

export default class TagInput extends React.Component {
  static propTypes = {
    classNameExtension: PropTypes.string.isRequired,
    classNameSuffix: PropTypes.string.isRequired,
    inputValue: PropTypes.string.isRequired,
    onInputDataChange: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    placeholder: PropTypes.string.isRequired,
    isFocused: PropTypes.bool,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    tags: PropTypes.arrayOf(PropTypes.shape({
      node: PropTypes.element.isRequired,
      value: PropTypes.any.isRequired
    })).isRequired
  }
  componentDidMount(){
    if (this.props.autofocus){
      this.refs.input.focus();
    }
  }
  constructor(props){
    super(props);
    
    this.onKeyDown = this.onKeyDown.bind(this);
    this.focus = this.focus.bind(this);
    this.onDeleteTag = this.onDeleteTag.bind(this);
  }
  onKeyDown(e){
    if (e.keyCode === 8 && this.props.inputValue === "" && this.props.tags.length > 0){
      this.props.onDelete(this.props.tags[this.props.tags.length -1].value);
    }
  }
  focus(){
    this.refs.input.focus();
  }
  blur(){
    this.refs.input.blur();
  }
  getHeight(){
    return this.refs.inputbody.offsetHeight;
  }
  componentDidUpdate(){
    if (this.props.isFocused){
      this.focus();
    } else {
      this.blur();
    }
  }
  onDeleteTag(tag){
    this.props.onDelete(tag.value);
  }
  render(){
    return <div className={`${this.props.classNameExtension} form-field-tag-input ${this.props.classNameExtension}-form-field-tag-input-${this.props.classNameSuffix} ${this.props.isFocused?  "focus" : ""}`}>
      <div className="form-field-tag-input-field" ref="inputbody" onClick={this.props.onFocus}>
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