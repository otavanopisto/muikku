/* eslint-disable react/no-string-refs */

/**
 * Depcrecated refs should be refactored
 */

import * as React from "react";
import "~/sass/elements/autocomplete.scss";

/**
 * AutocompleteProps
 */
interface AutocompleteProps {
  onItemClick: (item: any, selected: boolean) => any;
  opened: boolean;
  items: {
    node: React.ReactElement<any>;
    value: any;
    selected?: boolean;
  }[];
  pixelsOffset?: number;
  modifier: string;
  children?: React.ReactNode;
}

/**
 * AutocompleteState
 */
interface AutocompleteState {
  maxHeight: number;
}

/**
 * Autocomplete
 */
export default class Autocomplete extends React.Component<
  AutocompleteProps,
  AutocompleteState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: AutocompleteProps) {
    super(props);

    this.onItemClick = this.onItemClick.bind(this);

    this.state = {
      maxHeight: null,
    };
  }

  /**
   * UNSAFE_componentWillReceiveProps
   * @param nextProps nextProps
   */
  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps: AutocompleteProps) {
    if (nextProps.opened && !this.props.opened) {
      const autocomplete: HTMLDivElement = this.refs[
        "autocomplete"
      ] as HTMLDivElement;
      this.setState({
        maxHeight:
          window.innerHeight -
          (autocomplete.getBoundingClientRect().top +
            autocomplete.offsetHeight),
      });
    }
  }

  /**
   * onItemClick
   * @param value v
   * @param selected s
   * @param e e
   */
  onItemClick(value: any, selected: boolean, e: Event) {
    e.stopPropagation();
    this.props.onItemClick(value, selected);
  }

  /**
   * Component render method
   * @returns React.JSX.Element
   */
  render() {
    const style: any = {
      maxHeight: this.state.maxHeight,
    };
    if (this.props.pixelsOffset) {
      style.top = this.props.pixelsOffset;
    }

    return (
      <div
        className={`autocomplete autocomplete--${this.props.modifier}`}
        ref="autocomplete"
      >
        {this.props.items.length && this.props.opened ? (
          <div className="autocomplete__list" style={style}>
            {this.props.items.map((item, index) => (
              <div
                key={
                  typeof item.value.id === "undefined" ? index : item.value.id
                }
                className={`autocomplete__list-item ${
                  item.selected ? "selected" : ""
                }`}
                onClick={this.onItemClick.bind(this, item.value, item.selected)}
              >
                {item.node}
              </div>
            ))}
          </div>
        ) : null}
        <div className="autocomplete__input" ref="input">
          {this.props.children}
        </div>
      </div>
    );
  }
}
