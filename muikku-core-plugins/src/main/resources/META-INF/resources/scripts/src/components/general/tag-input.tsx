/* eslint-disable react/no-string-refs */

/**
 * Depcrecated refs should be refactored
 */

import * as React from "react";
import "~/sass/elements/form-elements.scss";
import "~/sass/elements/tag-input.scss";

export interface Tag {
  node: React.ReactElement<any> | string;
  value: any;
  disabled?: boolean;
  icon?: string;
}

interface TagInputProps {
  modifier?: string;
  identifier: string;
  inputValue: string;
  onInputDataChange: (e: React.ChangeEvent<HTMLInputElement>) => any;
  onDelete: (v: any) => any;
  placeholder?: string;
  label?: string;
  isFocused?: boolean;
  onBlur?: (e: React.FocusEvent<any>) => any;
  onFocus?: (e: React.FocusEvent<any>) => any;
  tags: Tag[];
  autofocus?: boolean;
  deleteByBackKey?: boolean;
  wcagLabel?: string;
}

interface TagInputState {}

export default class TagInput extends React.Component<
  TagInputProps,
  TagInputState
> {
  componentDidMount() {
    if (this.props.autofocus) {
      (this.refs["input"] as HTMLElement).focus();
    }
  }

  constructor(props: TagInputProps) {
    super(props);

    this.onKeyDown = this.onKeyDown.bind(this);
    this.focus = this.focus.bind(this);
  }

  onKeyDown(e: React.KeyboardEvent<any>) {
    if (this.props.deleteByBackKey) {
      if (
        e.keyCode === 8 &&
        this.props.inputValue === "" &&
        this.props.tags.length > 0
      ) {
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

  render() {
    return (
      <div
        className={`container ${
          this.props.modifier ? "container--" + this.props.modifier : ""
        } ${this.props.isFocused ? "focus" : ""}`}
      >
        <div
          className="tag-input"
          ref="inputbody"
          onClick={(e) => this.props.onFocus(e as any)}
        >
          <label htmlFor={this.props.identifier} className="tag-input__label">
            {this.props.label}
          </label>
          <input
            id={this.props.identifier}
            className={`tag-input__input ${
              this.props.modifier
                ? "tag-input__input--" + this.props.modifier
                : null
            }`}
            placeholder={this.props.placeholder}
            value={this.props.inputValue}
            ref="input"
            onBlur={this.props.onBlur}
            onFocus={this.props.onFocus}
            onChange={this.props.onInputDataChange}
            onKeyDown={this.onKeyDown}
          />
          <TagItems
            ref="selected"
            identifier={this.props.identifier}
            onDelete={this.props.onDelete}
            tags={this.props.tags}
          />
        </div>
      </div>
    );
  }
}

interface TagItemsProps {
  modifier?: string;
  identifier: string;
  icon?: string;
  onDelete: (v: any) => any;
  tags: Tag[];
}

interface TagItemsState {}

export class TagItems extends React.Component<TagItemsProps, TagItemsState> {
  render() {
    return (
      <div
        className={`tag-input__selected-items ${
          this.props.modifier
            ? "tag-input__selected-items--" + this.props.modifier
            : ""
        }`}
      >
        {this.props.tags &&
          this.props.tags.map((tag, index) => (
            <TagItem
              key={this.props.identifier + index}
              icon={this.props.icon}
              tag={tag}
              onDelete={this.props.onDelete}
            />
          ))}
      </div>
    );
  }
}

interface TagItemProps {
  modifier?: string;
  disabled?: boolean;
  icon?: string;
  onDelete: (v: any) => any;
  tag: Tag;
}

interface TagItemState {}

export class TagItem extends React.Component<TagItemProps, TagItemState> {
  constructor(props: TagItemProps) {
    super(props);
    this.onDeleteTag = this.onDeleteTag.bind(this);
  }

  onDeleteTag(tag: Tag) {
    if (!tag.disabled) {
      this.props.onDelete(tag.value);
    }
  }

  render() {
    return (
      <span
        className={`tag-input__selected-item ${
          this.props.modifier
            ? "tag-input__selected-item--" + this.props.modifier
            : null
        } ${this.props.tag.disabled ? "state-DISABLED" : ""}`}
      >
        {this.props.tag.icon ? (
          <span
            className={`glyph ${
              this.props.modifier ? "glyph--" + this.props.modifier : null
            } ${"icon-" + this.props.tag.icon}`}
          ></span>
        ) : null}
        <span className="tag-input__selected-item-label">
          {this.props.tag.node}
        </span>
        <span
          className="tag-input__selected-item-action icon-cross"
          onClick={this.onDeleteTag.bind(this, this.props.tag)}
        ></span>
      </span>
    );
  }
}
