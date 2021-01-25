import * as React from 'react';
import '~/sass/elements/form-elements.scss';
import '~/sass/elements/tag-input.scss';

interface Tag {
  node: React.ReactElement<any>,
  value: any,
  disabled?: boolean,
}

interface TagInputProps {
  modifier: string,
  inputValue: string,
  onInputDataChange: (e: React.ChangeEvent<HTMLInputElement>) => any,
  onDelete: (v: any) => any,
  placeholder?: string,
  label?: string,
  isFocused?: boolean,
  onBlur?: (e: React.FocusEvent<any>) => any,
  onFocus?: (e: React.FocusEvent<any>) => any,
  tags: Tag[],
  autofocus?: boolean,
  deleteByBackKey?: boolean
}

interface TagInputState {
}

export default class TagInput extends React.Component<TagInputProps, TagInputState> {
  componentDidMount() {
    if (this.props.autofocus) {
      (this.refs["input"] as HTMLElement).focus();
    }
  }
  constructor(props: TagInputProps) {
    super(props);

    this.onKeyDown = this.onKeyDown.bind(this);
    this.focus = this.focus.bind(this);
    this.onDeleteTag = this.onDeleteTag.bind(this);
  }

  onKeyDown(e: React.KeyboardEvent<any>) {
    if (this.props.deleteByBackKey) {
      if (e.keyCode === 8 && this.props.inputValue === "" && this.props.tags.length > 0) {
        this.props.onDelete(this.props.tags[this.props.tags.length - 1].value);
      }
    }
  }

  focus() {
    (this.refs["input"] as HTMLElement).focus();
  }

  blur() {
    (this.refs["input"] as HTMLElement).blur();
  }

  getInputHeight() {
    return (this.refs["input"] as HTMLElement).offsetHeight;
  }

  getInputBodyHeight() {
    return (this.refs["inputbody"] as HTMLElement).offsetHeight;
  }

  getSelectedHeight() {
    return (this.refs["selected"] as HTMLElement).offsetHeight;
  }

  componentDidUpdate() {
    if (this.props.isFocused) {
      this.focus();
    } else {
      this.blur();
    }
  }

  onDeleteTag(tag: Tag) {
    if (!tag.disabled) {
      this.props.onDelete(tag.value);
    }
  }

  render() {
    return <div className={`container ${this.props.modifier ? "container--" + this.props.modifier : null} ${this.props.isFocused ? "focus" : ""}`}>
      <div className="tag-input" ref="inputbody" onClick={(e) => this.props.onFocus(e as any)}>
        {this.props.label ?
          <div className="tag-input__label">{this.props.label}</div>
          : null}
        <input className={`tag-input__input ${this.props.modifier ? "tag-input__input--" + this.props.modifier : null}`} placeholder={this.props.placeholder} value={this.props.inputValue} ref="input" onBlur={this.props.onBlur} onFocus={this.props.onFocus}
          onChange={this.props.onInputDataChange} onKeyDown={this.onKeyDown} />

        <div ref="selected" className="tag-input__selected-items">
          {this.props.tags.map((tag, index) => {
            return <span key={index} className={`tag-input__selected-item ${tag.disabled ? "state-DISABLED" : ""}`}>
              <span className="tag-input__selected-item-label">{tag.node}</span>
              <span className="tag-input__selected-item-action icon-cross" onClick={this.onDeleteTag.bind(this, tag)}></span>
            </span>
          })}
        </div>
      </div>
    </div>
  }
}
