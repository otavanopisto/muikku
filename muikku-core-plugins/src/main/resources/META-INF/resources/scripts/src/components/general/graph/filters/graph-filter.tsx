import * as React from "react";
import Dropdown from "~/components/general/dropdown";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * GraphFilterProps
 */
interface GraphFilterProps extends WithTranslation {
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
                  {this.props.t("labels.graph", {
                    ns: "guider",
                    context: graph,
                  })}
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
                  {this.props.t("labels.graph", {
                    ns: "guider",
                    context: graph,
                  })}
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

export default withTranslation("guider")(GraphFilter);
