import * as React from "react";
import { WorkspaceDataType } from "~/reducers/workspaces";
import GraphFilter from "~/components/general/graph/filters/graph-filter";
import "~/sass/elements/chart.scss";
import "~/sass/elements/filter.scss";
import { withTranslation, WithTranslation } from "react-i18next";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let AmCharts: any = null;

/**
 * CurrentStudentWorkspaceStatisticsProps
 */
interface CurrentStudentWorkspaceStatisticsProps extends WithTranslation {
  workspace: WorkspaceDataType;
}

/**
 * CurrentStudentWorkspaceStatisticsState
 */
interface CurrentStudentWorkspaceStatisticsState {
  amChartsLoaded: boolean;
  filteredGraphs: string[];
}

/**
 * WorkspaceChartData
 */
interface WorkspaceChartData {
  EVALUATION_REQUESTED?: number;
  EVALUATION_GOTINCOMPLETED?: number;
  EVALUATION_GOTFAILED?: number;
  EVALUATION_GOTPASSED?: number;
  WORKSPACE_VISIT?: number;
  MATERIAL_EXERCISEDONE?: number;
  MATERIAL_ASSIGNMENTDONE?: number;
}

/**
 *  Graph
 */
enum Graph {
  WORKSPACE_VISIT = "visits",
  MATERIAL_ASSIGNMENTDONE = "assignments",
  MATERIAL_EXERCISEDONE = "exercises",
}

let ignoreZoomed = true;
let zoomStartDate: Date = null;
let zoomEndDate: Date = null;

/**
 * CurrentStudentStatistics
 */
class CurrentStudentStatistics extends React.Component<
  CurrentStudentWorkspaceStatisticsProps,
  CurrentStudentWorkspaceStatisticsState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: CurrentStudentWorkspaceStatisticsProps) {
    super(props);
    this.GraphFilterHandler = this.GraphFilterHandler.bind(this);
    this.zoomSaveHandler = this.zoomSaveHandler.bind(this);
    this.zoomApplyHandler = this.zoomApplyHandler.bind(this);
    this.state = {
      amChartsLoaded: AmCharts !== null,
      filteredGraphs: [],
    };
    if (!this.state.amChartsLoaded) {
      this.loadAmCharts();
    } else {
      AmCharts = require("@amcharts/amcharts3-react");
    }
  }

  /**
   * loadAmCharts
   */
  loadAmCharts() {
    const amcharts = document.createElement("script");
    amcharts.src = "https://www.amcharts.com/lib/3/amcharts.js";
    amcharts.async = true;
    // eslint-disable-next-line
    amcharts.onload = () => {
      const serial = document.createElement("script");
      serial.src = "https://www.amcharts.com/lib/3/serial.js";
      serial.async = true;
      // eslint-disable-next-line
      serial.onload = () => {
        AmCharts = require("@amcharts/amcharts3-react");
        this.setState({ amChartsLoaded: true });
      };
      document.head.appendChild(serial);
    };
    document.head.appendChild(amcharts);
  }

  /**
   * GraphFilterHandler
   * @param graph graph
   */
  GraphFilterHandler(graph: Graph) {
    const filteredGraphs = this.state.filteredGraphs.slice();
    const index = filteredGraphs.indexOf(graph);
    if (index > -1) {
      filteredGraphs.splice(index, 1);
    } else {
      filteredGraphs.push(graph);
    }
    this.setState({ filteredGraphs: filteredGraphs });
  }

  /**
   * zoomSaveHandler
   * @param e e
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  zoomSaveHandler(e: any) {
    if (!ignoreZoomed) {
      zoomStartDate = e.startDate;
      zoomEndDate = e.endDate;
    }
    ignoreZoomed = false;
  }

  /**
   * zoomApplyHandler
   * @param e e
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  zoomApplyHandler(e: any) {
    if (zoomStartDate !== null && zoomEndDate !== null) {
      e.chart.zoomToDates(zoomStartDate, zoomEndDate);
    }
  }

  /**
   * render
   */
  render() {
    if (!this.state.amChartsLoaded) {
      return null;
    }

    //NOTE: The filtered data can be cut here. (Option 1)
    const chartDataMap = new Map<string, WorkspaceChartData>();
    chartDataMap.set(new Date().toISOString().slice(0, 10), {
      MATERIAL_ASSIGNMENTDONE: 0,
      MATERIAL_EXERCISEDONE: 0,
      WORKSPACE_VISIT: 0,
    });
    this.props.workspace.activityLogs.map((log) => {
      const date = log.timestamp.toISOString().slice(0, 10);
      const entry = chartDataMap.get(date) || {};
      switch (log.type) {
        case "EVALUATION_REQUESTED":
        case "EVALUATION_GOTINCOMPLETED":
        case "EVALUATION_GOTFAILED":
        case "EVALUATION_GOTPASSED":
        case "WORKSPACE_VISIT":
        case "MATERIAL_EXERCISEDONE":
        case "MATERIAL_ASSIGNMENTDONE":
          entry[log.type] = entry[log.type] + 1 || 1;
          break;
        default:
          break;
      }
      chartDataMap.set(date, entry);
    });

    //NOTE: Data can be filtered here also (Option 2)
    const sortedKeys = Array.from(chartDataMap.keys()).sort((a, b) =>
      a > b ? 1 : -1
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = [];
    sortedKeys.forEach((key) => {
      const value = chartDataMap.get(key);
      data.push({ date: key, ...value });
    });

    //NOTE: Here the graphs are filtered. May be not optimal, since it is the end part of the data processing (Option 3)
    const graphs = [];

    if (!this.state.filteredGraphs.includes(Graph.WORKSPACE_VISIT)) {
      graphs.push({
        id: "WORKSPACE_VISIT",
        balloonText:
          this.props.i18n.t("labels.graph", {
            ns: "guider",
            context: "visits",
          }) + " <b>[[WORKSPACE_VISIT]]</b>",
        fillAlphas: 0.7,
        lineAlpha: 0.2,
        lineColor: "#43cd80",
        title: "WORKSPACE_VISIT",
        type: "column",
        stackable: false,
        clustered: false,
        columnWidth: 0.6,
        valueField: "WORKSPACE_VISIT",
      });
    }

    if (!this.state.filteredGraphs.includes(Graph.MATERIAL_ASSIGNMENTDONE)) {
      graphs.push({
        id: "MATERIAL_ASSIGNMENTDONE",
        balloonText:
          this.props.i18n.t("labels.evaluables", {
            count: 0,
            ns: "materials",
          }) + " <b>[[MATERIAL_ASSIGNMENTDONE]]</b>",
        fillAlphas: 0.9,
        lineAlpha: 0.2,
        lineColor: "#ce01bd",
        title: "MATERIAL_ASSIGNMENTDONE",
        type: "column",
        clustered: false,
        columnWidth: 0.4,
        valueField: "MATERIAL_ASSIGNMENTDONE",
      });
    }

    if (!this.state.filteredGraphs.includes(Graph.MATERIAL_EXERCISEDONE)) {
      graphs.push({
        id: "MATERIAL_EXERCISEDONE",
        balloonText:
          this.props.i18n.t("labels.exercises", { count: 0, ns: "materials" }) +
          " <b>[[MATERIAL_EXERCISEDONE]]</b>",
        fillAlphas: 0.9,
        lineAlpha: 0.2,
        lineColor: "#ff9900",
        title: "MATERIAL_EXERCISEDONE",
        type: "column",
        clustered: false,
        columnWidth: 0.4,
        valueField: "MATERIAL_EXERCISEDONE",
      });
    }
    const valueAxes = [
      {
        stackType: graphs.length > 1 ? "regular" : "none",
        unit: "",
        position: "left",
        title: "",
        integersOnly: true,
        minimum: 0,
      },
    ];

    const config = {
      theme: "none",
      type: "serial",
      minMarginLeft: 50,
      startDuration: 0.4,
      plotAreaFillAlphas: 0.1,
      mouseWheelZoomEnabled: true,
      minSelectedTime: 604800000,
      maxSelectedTime: 7776000000,
      dataDateFormat: "YYYY-MM-DD",
      categoryField: "date",
      categoryAxis: {
        parseDates: true,
        dashLength: 1,
        minorGridEnabled: true,
        gridPosition: "start",
      },
      categoryAxesSettings: {
        minPeriod: "DD",
      },
      chartScrollbar: {
        oppositeAxis: false,
        offset: 30,
        scrollbarHeight: 60,
        backgroundAlpha: 0,
        selectedBackgroundAlpha: 0.1,
        selectedBackgroundColor: "#888888",
        graphFillAlpha: 0,
        graphLineAlpha: 0.5,
        selectedGraphFillAlpha: 0,
        selectedGraphLineAlpha: 1,
        autoGridCount: true,
        color: "#AAAAAA",
      },
      chartCursor: {
        categoryBalloonDateFormat: "YYYY-MM-DD",
        categoryBalloonColor: "#009FE3",
        cursorColor: "#000",
      },
      listeners: [
        {
          event: "zoomed",
          method: this.zoomSaveHandler,
        },
        {
          event: "dataUpdated",
          method: this.zoomApplyHandler,
        },
      ],
      valueAxes: valueAxes,
      graphs: graphs,
      dataProvider: data,
      export: {
        enabled: true,
      },
    };
    ignoreZoomed = true;
    //Maybe it is possible to use show/hide graph without re-render. requires accessing the graph and call for a method. Responsiveness not through react re-render only?
    const showGraphs: string[] = [
      Graph.WORKSPACE_VISIT,
      Graph.MATERIAL_ASSIGNMENTDONE,
      Graph.MATERIAL_EXERCISEDONE,
    ];
    return (
      <>
        <div className="chart-legend">
          <div className="chart-legend-filter chart-legend-filter--graph-filter">
            <GraphFilter
              graphs={showGraphs}
              filteredGraphs={this.state.filteredGraphs}
              handler={this.GraphFilterHandler}
              modificator="-list-only"
            />
          </div>
        </div>
        <AmCharts.React
          className="chart chart--workspace-chart"
          options={config}
        />
      </>
    );
  }
}

export default withTranslation()(CurrentStudentStatistics);
