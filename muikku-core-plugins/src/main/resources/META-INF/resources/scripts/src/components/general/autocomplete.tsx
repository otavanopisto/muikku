import * as React from 'react';
import equals = require("deep-equal");

import '~/sass/elements/autocomplete.scss';

interface AutocompleteProps {
  onItemClick: (item: any, selected: boolean)=>any,
  opened: boolean,
  items: {
    node: React.ReactElement<any>,
    value: any,
    selected?: boolean
  }[],
  pixelsOffset?: number,
  modifier: string
}

interface AutocompleteState {
  
}

export default class Autocomplete extends React.Component<AutocompleteProps, AutocompleteState> {
  constructor(props:AutocompleteProps){
    super(props);
    
    this.onItemClick = this.onItemClick.bind(this);
  }
  onItemClick(value: any, selected: boolean, e: Event){
    e.stopPropagation();
    this.props.onItemClick(value, selected);
  }
  render(){
    let style:any = {};
    if (this.props.pixelsOffset){
      style.top = this.props.pixelsOffset;
    }
    return <div className={`autocomplete autocomplete--${this.props.modifier}`}>
      <div className="autocomplete__input" ref="input">{this.props.children}</div>
      {this.props.items.length && this.props.opened ? <div className="autocomplete__list" style={style}>{this.props.items.map((item, index)=>{
        return <div key={typeof item.value.id === "undefined" ? index : item.value.id}
          className={`autocomplete__list__item ${item.selected ? "selected" : ""}`}
          onClick={this.onItemClick.bind(this, item.value, item.selected)}>
          {item.node}
        </div>
      })}</div> : null}
    </div>
  }
}