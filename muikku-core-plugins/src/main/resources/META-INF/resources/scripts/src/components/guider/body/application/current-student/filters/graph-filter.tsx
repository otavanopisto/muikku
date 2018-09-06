import { i18nType } from "~/reducers/base/i18n";
import * as React from 'react';
import { connect } from 'react-redux';
import { StateType } from '~/reducers';
import Dropdown from '~/components/general/dropdown';

interface GraphFilterProps {
  i18n: i18nType,
  graphs: string[],
  filteredGraphs:string[],
  handler: any
}

class GraphFilter extends React.Component<GraphFilterProps> {
  constructor(props:GraphFilterProps) {
    super(props);
  }

  render(){
    return (
      <div className="filter filter--graph-filter">
        <Dropdown modifier="graph-filter" persistant={true} items={this.props.graphs.map((graph)=>{
          let ifChecked = !this.props.filteredGraphs.includes(graph);
          return(<div className={"filter-item filter-item--"+graph} key={"w-"+graph}><input type='checkbox' onClick={() => {this.props.handler(graph)}} defaultChecked={ifChecked} /><span className="filter-item_label">{this.props.i18n.text.get("plugin.guider." + graph + "Title")}</span></div>);
          })}>
          <span className="icon-filter filter_activator filter_activator--graph-filter"></span>
        </Dropdown>
        <div className="filter-items filter-items--graph-filter">
          {this.props.graphs.map((graph)=>{
            let ifChecked = !this.props.filteredGraphs.includes(graph);
            return(<div className={"filter-item filter-item--"+graph} key={"l-"+graph}><input type='checkbox' onClick={() => {this.props.handler(graph)}} defaultChecked={ifChecked} /><span className="filter-item_label">{this.props.i18n.text.get("plugin.guider." + graph + "Title")}</span></div>);
          })}
        </div>
      </div>
    )
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n
  }
};
export default connect(
  mapStateToProps
)(GraphFilter);