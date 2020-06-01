import {i18nType} from "~/reducers/base/i18n";
import * as React from 'react';
import {connect} from 'react-redux';
import {StateType} from '~/reducers';
import Dropdown from '~/components/general/dropdown';

interface GraphFilterProps {
  i18n: i18nType,
  graphs: string[],
  filteredGraphs: string[],
  handler: any,
  modificator?: string
}

class GraphFilter extends React.Component<GraphFilterProps> {
  constructor(props:GraphFilterProps) {
    super(props);
  }
  
  dropdownFilter(){
    let modificator = this.props.modificator || "";
    if (modificator == "-dropdown-only" || modificator == ""){
      return <Dropdown persistent modifier={"graph-filter" + modificator} items={this.props.graphs.map((graph)=>{
        let ifChecked = !this.props.filteredGraphs.includes(graph);
        return <div className={"filter-item filter-item--"+graph} key={"w-"+graph}>
          <input type='checkbox' onClick={() => {this.props.handler(graph)}} defaultChecked={ifChecked}/>
          <span className="filter-item__label">{this.props.i18n.text.get("plugin.guider." + graph + "Title")}</span>
        </div>
        })}>
        <span className={"icon-filter filter__activator filter__activator--graph-filter" + modificator}></span>
      </Dropdown>
    }
  }
  
  listFilter(){
    let modificator = this.props.modificator || "";
    if (modificator == "-list-only" || modificator == ""){
      return <div className={"filter-items filter-items--graph-filter" + modificator}>
      {this.props.graphs.map((graph)=>{
        let ifChecked = !this.props.filteredGraphs.includes(graph);
        return <div className={"filter-item filter-item--"+graph} key={"l-"+graph}>
          <input type='checkbox' onClick={() => {this.props.handler(graph)}} defaultChecked={ifChecked}/>
          <span className="filter-item__label">{this.props.i18n.text.get("plugin.guider." + graph + "Title")}</span>
        </div>
      })}
    </div>
    }
  }
  
  render(){
    return <div className="filter filter--graph-filter">
      {this.dropdownFilter()}
      {this.listFilter()}
    </div>
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