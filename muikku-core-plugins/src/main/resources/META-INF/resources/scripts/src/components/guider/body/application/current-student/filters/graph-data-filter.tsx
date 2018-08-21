import * as React from 'react';
import {StateType} from '~/reducers';

interface GraphDataFilterProps {
  graphs: string[],
  filteredGraphData:string[],
  handler: any
}

class GraphDataFilter extends React.Component<GraphDataFilterProps> {
  constructor(props:GraphDataFilterProps) {
    super(props);
  }
  
  render(){
    return (
      <ul>
        {this.props.graphs.map((graph)=>{
          let ifChecked = !this.props.filteredGraphData.includes(graph);
          return(<li key={graph}><input className={graph} type='checkbox' onClick={() => {this.props.handler(graph)}} defaultChecked={ifChecked} /><span>{graph}</span></li>);
        })}
      </ul>
    )
  }
}

export default GraphDataFilter;