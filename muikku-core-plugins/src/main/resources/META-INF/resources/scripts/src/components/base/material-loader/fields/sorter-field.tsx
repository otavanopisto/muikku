import * as React from "react";
import { shuffle } from "~/util/modifiers";
import Draggable from "~/components/general/draggable";
import equals = require("deep-equal");

interface SorterFieldItemType {
  id: string,
  name: string
}

interface SorterFieldProps {
  type: string,
  content: {
    name: string,
    orientation: "vertical" | "horizontal",
    capitalize: boolean,
    items: Array<SorterFieldItemType>
  },
  
  readOnly?: boolean,
  initialValue?: string,
  onChange?: (context: React.Component<any, any>, name: string, newValue: any)=>any
}

interface SorterFieldState {
  items: Array<SorterFieldItemType>,
  modified: boolean,
  synced: boolean,
  syncError: string
}

export default class SorterField extends React.Component<SorterFieldProps, SorterFieldState> {
  constructor(props: SorterFieldProps){
    super(props);
    
    let value = null;
    let items;
    if (props.initialValue){
      value = JSON.parse(props.initialValue);
      items = value.map((v:string)=>this.props.content.items.find(i=>i.id === v));
    } else {
      items = shuffle(props.content.items) || [];
    }
    
    this.state = {
      items,
      modified: false,
      synced: true,
      syncError: null
    }
    
    this.swap = this.swap.bind(this);
  }
  shouldComponentUpdate(nextProps: SorterFieldProps, nextState: SorterFieldState){
    return !equals(nextProps.content, this.props.content) || this.props.readOnly !== nextProps.readOnly || !equals(nextState, this.state);
  }
  swap(itemA: SorterFieldItemType, itemB: SorterFieldItemType){
    if (itemA.id === itemB.id){
      return;
    }
    let items = this.state.items.map(item=>{
      if (item.id === itemA.id){
        return itemB
      } else if (item.id === itemB.id){
        return itemA;
      }
      return item;
    });
    
    this.props.onChange && this.props.onChange(this, this.props.content.name, JSON.stringify(items.map(item=>item.id)));
    this.setState({
      items
    });
  }
  render(){
    let Element = this.props.content.orientation === "vertical" ? 'div' : 'span';
    return <Element className="muikku-field muikku-sorter-field">
      <Element className="muikku-sorter-items-container">
       {this.state.items.map((item, index)=>{
         let text = item.name;
         if (index === 0 && this.props.content.capitalize){
           text = text.charAt(0).toUpperCase() + text.slice(1);
         }
         if (this.props.readOnly){
           return <Element className="muikku-sorter-item" key={item.id}>{text}</Element>
         }
         return <Draggable denyWidth={this.props.content.orientation === "horizontal"} as={Element} parentContainerSelector=".muikku-sorter-items-container"
           className="muikku-sorter-item" key={item.id} interactionGroup={this.props.content.name}
           interactionData={item} onInteractionWith={this.swap.bind(this, item)}>{text}</Draggable>
       })}
      </Element>
    </Element>
  }
}