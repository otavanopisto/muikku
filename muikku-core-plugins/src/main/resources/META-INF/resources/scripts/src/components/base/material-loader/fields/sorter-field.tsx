import * as React from "react";
import { shuffle } from "~/util/modifiers";
import Draggable from "~/components/general/draggable";

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
  value?: string
}

interface SorterFieldState {
  items: Array<SorterFieldItemType>,
  modified: boolean,
  synced: boolean
}

export default class SorterField extends React.Component<SorterFieldProps, SorterFieldState> {
  constructor(props: SorterFieldProps){
    super(props);
    
    let value = null;
    let items;
    if (props.value){
      value = JSON.parse(value);
      items = value.map((v:string)=>this.props.content.items.find(i=>i.id === v));
    } else {
      items = shuffle(props.content.items) || [];
    }
    
    this.state = {
      items,
      modified: false,
      synced: true
    }
    
    this.swap = this.swap.bind(this);
  }
  componentWillReceiveProps(nextProps: SorterFieldProps){
    if (JSON.stringify(nextProps.content) !== JSON.stringify(this.props.content)){
      this.setState({
        items: shuffle(nextProps.content.items) || []
      });
    }
    
    if (nextProps.value !== this.props.value){
      let value = JSON.parse(nextProps.value);
      let items = value.map((v:string)=>nextProps.content.items.find(i=>i.id === v));
      
      this.setState({items});
    }
    
    this.setState({
      modified: false,
      synced: true
    });
  }
  swap(itemA: SorterFieldItemType, itemB: SorterFieldItemType){
    if (itemA.id === itemB.id){
      return;
    }
    this.setState({
      items: this.state.items.map(item=>{
        if (item.id === itemA.id){
          return itemB
        } else if (item.id === itemB.id){
          return itemA;
        }
        return item;
      })
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