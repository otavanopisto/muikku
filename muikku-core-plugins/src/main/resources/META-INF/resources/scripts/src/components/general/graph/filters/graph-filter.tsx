import { i18nType } from "~/reducers/base/i18n";
import * as React from "react";
import { connect } from "react-redux";
import { StateType } from "~/reducers";
import Dropdown from "~/components/general/dropdown";

/**
 * GraphFilterProps
 */
interface GraphFilterProps {
  i18n: i18nType;
  graphs: string[];
  filteredGraphs: string[];
  handler: any;
  modificator?: string;
}

/**
 * GraphFilter
 */
class GraphFilter extends React.Component<GraphFilterProps> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: GraphFilterProps) {
    super(props);
  }

  /**
   * dropdownFilter
   * @returns JSX.Element
   */
  dropdownFilter() {
    const modificator = this.props.modificator || "";
    if (modificator === "-dropdown-only" || modificator === "") {
      return (
        <Dropdown
          persistent
          modifier={"graph-filter" + modificator}
          items={this.props.graphs.map((graph) => {
            const ifChecked = !this.props.filteredGraphs.includes(graph);
            return (
              <div
                className={"filter-item filter-item--" + graph}
                key={"w-" + graph}
              >
                <input
                  id={`filter-` + graph}
                  type="checkbox"
                  onClick={() => {
                    this.props.handler(graph);
                  }}
                  defaultChecked={ifChecked}
                />
                <label
                  htmlFor={`filter-` + graph}
                  className="filter-item__label"
                >
                  {this.props.i18n.text.get("plugin.guider." + graph + "Label")}
                </label>
              </div>
            );
          })}
        >
          <span
            className={
              "icon-filter filter__activator filter__activator--graph-filter" +
              modificator
            }
          ></span>
        </Dropdown>
      );
    }
  }

  /**
   * listFilter
   * @returns JSX.Elemenet
   */
  listFilter() {
    const modificator = this.props.modificator || "";
    if (modificator === "-list-only" || modificator === "") {
      return (
        <div
          className={"filter-items filter-items--graph-filter" + modificator}
        >
          {this.props.graphs.map((graph) => {
            const ifChecked = !this.props.filteredGraphs.includes(graph);
            return (
              <div
                className={"filter-item filter-item--" + graph}
                key={"l-" + graph}
              >
                <input
                  id={`filter-` + graph}
                  type="checkbox"
                  onClick={() => {
                    this.props.handler(graph);
                  }}
                  defaultChecked={ifChecked}
                />
                <label
                  htmlFor={`filter-` + graph}
                  className="filter-item__label"
                >
                  {this.props.i18n.text.get("plugin.guider." + graph + "Label")}
                </label>
              </div>
            );
          })}
        </div>
      );
    }
  }

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    return (
      <div className="filter filter--graph-filter">
        {this.dropdownFilter()}
        {this.listFilter()}
      </div>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 * @returns object
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
  };
}

export default connect(mapStateToProps)(GraphFilter);
