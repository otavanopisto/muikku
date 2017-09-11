import React from 'react';
import PropTypes from 'prop-types';
import equals from 'deep-equal';

export default class Autocomplete extends React.Component {
  static propTypes = {
    onItemClick: PropTypes.func.isRequired,
    opened: PropTypes.bool.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
      node: PropTypes.element.isRequired,
      value: PropTypes.any.isRequired,
      selected: PropTypes.bool,
    })).isRequired,
    pixelsOffset: PropTypes.number,
    classNameExtension: PropTypes.string.isRequired,
    classNameSuffix: PropTypes.string.isRequired
  }
  constructor(props){
    super(props);
    
    this.onItemClick = this.onItemClick.bind(this);
  }
  onItemClick(value, selected, e){
    e.stopPropagation();
    this.props.onItemClick(value, selected);
  }
  render(){
    let style = {};
    if (this.props.pixelsOffset){
      style.top = this.props.pixelsOffset;
    }
    return <div className={`${this.props.classNameExtension} autocomplete ${this.props.classNameExtension}-autocomplete-${this.props.classNameSuffix}`}>
      <div className="autocomplete-input" ref="input">{this.props.children}</div>
      {this.props.items.length && this.props.opened ? <div className="autocomplete-list" style={style}>{this.props.items.map((item, index)=>{
        return <div key={typeof item.value.id === "undefined" ? index : item.value.id}
          className={`autocomplete-list-item ${item.selected ? "selected" : ""}`}
          onClick={this.onItemClick.bind(this, item.value, item.selected)}>
          {item.node}
        </div>
      })}</div> : null}
    </div>
  }
}