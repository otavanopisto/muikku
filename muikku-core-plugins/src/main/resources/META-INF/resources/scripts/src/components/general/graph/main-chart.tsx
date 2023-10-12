/**
 * This is the amcharts main chart file it uses am charts v3 and the reference
 * for those charts api can be found here
 * https://docs.amcharts.com/3/javascriptcharts
 */

import * as React from "react";
import { WorkspaceDataType } from "~/reducers/workspaces";
import WorkspaceFilter from "./filters/workspace-filter";
import GraphFilter from "./filters/graph-filter";
import { withTranslation, WithTranslation } from "react-i18next";
import "~/sass/elements/chart.scss";
import "~/sass/elements/filter.scss";
import { ActivityLogEntry } from "~/generated/client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let AmCharts: any = null;

/**
 * CurrentStudentStatisticsProps
 */
interface CurrentStudentStatisticsProps extends WithTranslation {
  activityLogs?: Array<ActivityLogEntry>;
  workspaces?: WorkspaceDataType[];
}

/**
 * CurrentStudentStatisticsState
 */
interface CurrentStudentStatisticsState {
  amChartsLoaded: boolean;
  filteredWorkspaces: number[];
  filteredCompletedWorkspaces: number[];
  filteredGraphs: string[];
}

/**
 * This information comes from the api endpoint and contains
 * those properties, any changes to this data will be related
 * to the endpoint
 */
interface MainChartData {
  EVALUATION_REQUESTED?: number;
  EVALUATION_GOTINCOMPLETED?: number;
  EVALUATION_GOTFAILED?: number;
  EVALUATION_GOTPASSED?: number;
  SESSION_LOGGEDIN?: number;
  WORKSPACE_VISIT?: number;
  MATERIAL_EXERCISEDONE?: number;
  MATERIAL_ASSIGNMENTDONE?: number;
  FORUM_NEWMESSAGE?: number;
  NOTIFICATION_ASSESMENTREQUEST?: number;
  NOTIFICATION_NOPASSEDCOURSES?: number;
  NOTIFICATION_SUPPLEMENTATIONREQUEST?: number;
  NOTIFICATION_STUDYTIME?: number;
}

/**
 * These are the graph points note how they are not in a 1->1 relationship
 * with the data, as they have been defined so
 */
enum Graph {
  SESSION_LOGGEDIN = "logins",
  MATERIAL_ASSIGNMENTDONE = "assignments",
  MATERIAL_EXERCISEDONE = "exercises",
  WORKSPACE_VISIT = "visits",
  FORUM_NEWMESSAGE = "discussionMessages",
  EVALUATION_REQUESTED = "evaluationRequest",
  EVALUATION_PASSED = "passed",
  EVALUATION_FAILED = "failed",
  EVALUATION_INCOMPLETED = "incomplete",
}

// some stored global variables for this chart
let ignoreZoomed = true;
let zoomStartDate: Date = null;
let zoomEndDate: Date = null;

/**
 * CurrentStudentStatistics
 */
class CurrentStudentStatistics extends React.Component<
  CurrentStudentStatisticsProps,
  CurrentStudentStatisticsState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: CurrentStudentStatisticsProps) {
    super(props);
    this.workspaceFilterHandler = this.workspaceFilterHandler.bind(this);
    this.completedWorkspaceFilterHandler =
      this.completedWorkspaceFilterHandler.bind(this);
    this.graphFilterHandler = this.graphFilterHandler.bind(this);
    this.zoomSaveHandler = this.zoomSaveHandler.bind(this);
    this.zoomApplyHandler = this.zoomApplyHandler.bind(this);
    this.state = {
      amChartsLoaded: (window as any).AmCharts != null,
      filteredWorkspaces: [],
      filteredCompletedWorkspaces: [],
      filteredGraphs: [], // Graph.FORUM_NEWMESSAGE
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
        const language = document.createElement("script");
        language.src = "https://www.amcharts.com/lib/3/lang/fi.js";
        language.async = true;
        // eslint-disable-next-line
        language.onload = () => {
          AmCharts = require("@amcharts/amcharts3-react");
          this.setState({ amChartsLoaded: true });
        };
        document.head.appendChild(language);
      };
      document.head.appendChild(serial);
    };
    document.head.appendChild(amcharts);
  }

  /**
   * workspaceFilterHandler
   * @param workspaceId workspaceId
   */
  workspaceFilterHandler(workspaceId?: number) {
    let filteredWorkspaces: number[] = [];
    if (workspaceId) {
      filteredWorkspaces = this.state.filteredWorkspaces.slice();
      const index = filteredWorkspaces.indexOf(workspaceId);
      if (index > -1) filteredWorkspaces.splice(index, 1);
      else filteredWorkspaces.push(workspaceId);
    } else {
      if (this.state.filteredWorkspaces.length == 0) {
        this.props.workspaces.map((workspace) =>
          filteredWorkspaces.push(workspace.id)
        );
      }
    }
    this.setState({ filteredWorkspaces: filteredWorkspaces });
  }

  /**
   * completedWorkspaceFilterHandler
   * @param workspaceId workspaceId
   */
  completedWorkspaceFilterHandler(workspaceId?: number) {
    let filteredCompletedWorkspaces: number[] = [];
    if (workspaceId) {
      filteredCompletedWorkspaces =
        this.state.filteredCompletedWorkspaces.slice();
      const index = filteredCompletedWorkspaces.indexOf(workspaceId);
      if (index > -1) filteredCompletedWorkspaces.splice(index, 1);
      else filteredCompletedWorkspaces.push(workspaceId);
    } else {
      //TODO: Activate when completedWorkspace data added
      /*if (this.state.filteredCompletedWorkspaces.length == 0){
        this.props.Completedworkspaces.map((workspace)=>
          filteredCompletedWorkspaces.push(workspace.id)
        )
      }*/
    }
    this.setState({ filteredCompletedWorkspaces: filteredCompletedWorkspaces });
  }

  /**
   * graphFilterHandler
   * @param graph graph
   */
  graphFilterHandler(graph: Graph) {
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
  zoomApplyHandler(e: any) {
    if (zoomStartDate != null && zoomEndDate != null) {
      e.chart.zoomToDates(zoomStartDate, zoomEndDate);
    } else {
      let prior: Date;
      const today: Date = new Date();
      if (today.getMonth() >= 3)
        prior = new Date(
          today.getFullYear(),
          today.getMonth() - 3,
          today.getDate()
        );
      else
        prior = new Date(
          today.getFullYear() - 1,
          today.getMonth() + 9,
          today.getDate()
        );
      e.chart.zoomToDates(prior, today);
    }
  }

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    if (!this.state.amChartsLoaded) {
      return null;
    }
    //NOTE: The unused data can be cut here. (Option 1)
    //NOTE: For the sake of keeping the same chart borders it might be wise to leave the data rows with 0 values, but keep date points.

    // here we are mapping the chart data to a map that will be used to render the chaart
    const chartDataMap = new Map<string, MainChartData>();
    chartDataMap.set(new Date().toISOString().slice(0, 10), {
      SESSION_LOGGEDIN: 0,
      WORKSPACE_VISIT: 0,
      MATERIAL_EXERCISEDONE: 0,
      MATERIAL_ASSIGNMENTDONE: 0,
      FORUM_NEWMESSAGE: 0,
    });
    if (this.props.activityLogs) {
      this.props.activityLogs.map((log) => {
        const date = log.timestamp.toISOString().slice(0, 10);
        const entry = chartDataMap.get(date) || {};
        switch (log.type) {
          case "SESSION_LOGGEDIN":
            entry.SESSION_LOGGEDIN = entry.SESSION_LOGGEDIN + 1 || 1;
            break;
          case "FORUM_NEWMESSAGE":
            // note how the following two map to the same event
            entry.FORUM_NEWMESSAGE = entry.FORUM_NEWMESSAGE + 1 || 1;
            break;
          case "FORUM_NEWTHREAD":
            entry.FORUM_NEWMESSAGE = entry.FORUM_NEWMESSAGE + 1 || 1;
            break;
          case "NOTIFICATION_ASSESMENTREQUEST":
            entry.NOTIFICATION_ASSESMENTREQUEST =
              entry.NOTIFICATION_ASSESMENTREQUEST + 1 || 1;
            break;
          case "NOTIFICATION_NOPASSEDCOURSES":
            entry.NOTIFICATION_NOPASSEDCOURSES =
              entry.NOTIFICATION_NOPASSEDCOURSES + 1 || 1;
            break;
          case "NOTIFICATION_SUPPLEMENTATIONREQUEST":
            entry.NOTIFICATION_SUPPLEMENTATIONREQUEST =
              entry.NOTIFICATION_SUPPLEMENTATIONREQUEST + 1 || 1;
            break;
          case "NOTIFICATION_STUDYTIME":
            entry.NOTIFICATION_STUDYTIME =
              entry.NOTIFICATION_STUDYTIME + 1 || 1;
            break;
          default:
            break;
        }
        chartDataMap.set(date, entry);
      });
    }

    // here we are grabbing the workspace chart specific data
    const workspaces: { id: number; name: string; isEmpty: boolean }[] = [];
    if (this.props.workspaces) {
      this.props.workspaces.map((workspace) => {
        workspaces.push({
          id: workspace.id,
          name: workspace.name,
          isEmpty: workspace.activityLogs.length == 0,
        });
        if (!this.state.filteredWorkspaces.includes(workspace.id)) {
          workspace.activityLogs.map((log) => {
            const date = log.timestamp.toISOString().slice(0, 10);
            const entry = chartDataMap.get(date) || {};
            switch (log.type) {
              case "EVALUATION_REQUESTED":
                entry.EVALUATION_REQUESTED =
                  entry.EVALUATION_REQUESTED + 1 || 1;
                break;
              case "EVALUATION_GOTINCOMPLETED":
                entry.EVALUATION_GOTINCOMPLETED =
                  entry.EVALUATION_GOTINCOMPLETED + 1 || 1;
                break;
              case "EVALUATION_GOTFAILED":
                entry.EVALUATION_GOTFAILED =
                  entry.EVALUATION_GOTFAILED + 1 || 1;
                break;
              case "EVALUATION_GOTPASSED":
                entry.EVALUATION_GOTPASSED =
                  entry.EVALUATION_GOTPASSED + 1 || 1;
                break;
              case "WORKSPACE_VISIT":
                entry.WORKSPACE_VISIT = entry.WORKSPACE_VISIT + 1 || 1;
                break;
              case "MATERIAL_EXERCISEDONE":
                entry.MATERIAL_EXERCISEDONE =
                  entry.MATERIAL_EXERCISEDONE + 1 || 1;
                break;
              case "MATERIAL_ASSIGNMENTDONE":
                entry.MATERIAL_ASSIGNMENTDONE =
                  entry.MATERIAL_ASSIGNMENTDONE + 1 || 1;
                break;
              default:
                break;
            }
            chartDataMap.set(date, entry);
          });
        }
      });
    }
    //TODO: load and parse completed workspaces
    const completedWorkspaces: {
      id: number;
      name: string;
      isEmpty: boolean;
    }[] = [];

    //NOTE: Data can be filtered here also (Option 2)
    const sortedKeys = Array.from(chartDataMap.keys()).sort((a, b) =>
      a > b ? 1 : -1
    );
    const data: any = [];
    sortedKeys.forEach((key) => {
      const value = chartDataMap.get(key);
      data.push({ date: key, ...value });
    });

    //NOTE: Here the graphs are filtered. May be not optimal, since it is the end part of the data processing (Option 3)
    const graphs = [];
    if (!this.state.filteredGraphs.includes(Graph.MATERIAL_ASSIGNMENTDONE)) {
      graphs.push({
        id: "MATERIAL_ASSIGNMENTDONE",
        balloonText:
          this.props.t("labels.graph", {
            ns: "guider",
            context: "assignments",
          }) + " <b>[[MATERIAL_ASSIGNMENTDONE]]</b>",
        fillAlphas: 1,
        lineAlpha: 0.2,
        lineColor: "#ce01bd",
        title: "MATERIAL_ASSIGNMENTDONE",
        type: "column",
        clustered: false,
        columnWidth: 0.7,
        valueField: "MATERIAL_ASSIGNMENTDONE",
      });
    }

    if (!this.state.filteredGraphs.includes(Graph.MATERIAL_EXERCISEDONE)) {
      graphs.push({
        id: "MATERIAL_EXERCISEDONE",
        balloonText:
          this.props.t("labels.graph", {
            ns: "guider",
            context: "exercises",
          }) + " <b>[[MATERIAL_EXERCISEDONE]]</b>",
        fillAlphas: 1,
        lineAlpha: 0.2,
        lineColor: "#ff9900",
        title: "MATERIAL_EXERCISEDONE",
        type: "column",
        clustered: false,
        columnWidth: 0.7,
        valueField: "MATERIAL_EXERCISEDONE",
      });
    }

    if (!this.state.filteredGraphs.includes(Graph.FORUM_NEWMESSAGE)) {
      graphs.push({
        id: "FORUM_NEWMESSAGE",
        balloonText:
          this.props.t("labels.graph", {
            ns: "guider",
            context: "discussions",
          }) + " <b>[[FORUM_NEWMESSAGE]]</b>",
        fillAlphas: 1,
        lineAlpha: 0.2,
        lineColor: "#62c3eb",
        title: "FORUM_NEWMESSAGE",
        type: "column",
        stackable: false,
        clustered: false,
        columnWidth: 0.4,
        valueField: "FORUM_NEWMESSAGE",
      });
    }

    if (!this.state.filteredGraphs.includes(Graph.SESSION_LOGGEDIN)) {
      graphs.push({
        id: "SESSION_LOGGEDIN",
        balloonText:
          this.props.t("labels.graph", {
            ns: "guider",
            context: "logins",
          }) + " <b>[[SESSION_LOGGEDIN]]</b>",
        bullet: "round",
        bulletSize: 12,
        fillAlphas: 0,
        lineAlpha: 0.5,
        lineThickness: 2,
        lineColor: "#2c2c2c",
        title: "SESSION_LOGGEDIN",
        type: "line",
        stackable: false,
        clustered: false,
        columnWidth: 0.7,
        valueField: "SESSION_LOGGEDIN",
      });
    }

    if (!this.state.filteredGraphs.includes(Graph.WORKSPACE_VISIT)) {
      graphs.push({
        id: "WORKSPACE_VISIT",
        balloonText:
          this.props.t("labels.graph", {
            ns: "guider",
            context: "visits",
          }) + " <b>[[WORKSPACE_VISIT]]</b>",
        bullet: "round",
        bulletSize: 8,
        fillAlphas: 0,
        lineAlpha: 0.5,
        lineThickness: 2,
        lineColor: "#43cd80",
        title: "WORKSPACE_VISIT",
        type: "line",
        stackable: false,
        clustered: false,
        columnWidth: 0.9,
        valueField: "WORKSPACE_VISIT",
      });
    }

    if (!this.state.filteredGraphs.includes(Graph.EVALUATION_REQUESTED)) {
      graphs.push({
        id: "EVALUATION_REQUESTED",
        balloonText:
          this.props.t("labels.graph", {
            ns: "guider",
            context: "evaluationRequest",
          }) + " <b>[[EVALUATION_REQUESTED]]</b>",
        bullet: "diamond",
        bulletSize: 12,
        fillAlphas: 0,
        lineAlpha: 0,
        lineThickness: 2,
        lineColor: "#009fe3",
        title: "EVALUATION_REQUESTED",
        type: "line",
        stackable: false,
        clustered: false,
        columnWidth: 0.9,
        valueField: "EVALUATION_REQUESTED",
      });
    }

    if (!this.state.filteredGraphs.includes(Graph.EVALUATION_INCOMPLETED)) {
      graphs.push({
        id: "EVALUATION_GOTINCOMPLETED",
        balloonText:
          this.props.t("labels.graph", {
            ns: "guider",
            context: "incomplete",
          }) + " <b>[[EVALUATION_GOTINCOMPLETED]]</b>",
        bullet: "square",
        bulletSize: 12,
        fillAlphas: 0,
        lineAlpha: 0,
        lineThickness: 2,
        lineColor: "#ea7503",
        title: "EVALUATION_GOTINCOMPLETED",
        type: "line",
        stackable: false,
        clustered: false,
        columnWidth: 0.9,
        valueField: "EVALUATION_GOTINCOMPLETED",
      });
    }

    if (!this.state.filteredGraphs.includes(Graph.EVALUATION_PASSED)) {
      graphs.push({
        id: "EVALUATION_GOTPASSED",
        balloonText:
          this.props.t("labels.graph", {
            ns: "guider",
            context: "passed",
          }) + " <b>[[EVALUATION_GOTPASSED]]</b>",
        bullet: "triangleUp",
        bulletSize: 12,
        fillAlphas: 0,
        lineAlpha: 0,
        lineThickness: 2,
        lineColor: "#24c118",
        title: "EVALUATION_GOTPASSED",
        type: "line",
        stackable: false,
        clustered: false,
        columnWidth: 0.9,
        valueField: "EVALUATION_GOTPASSED",
      });
    }

    if (!this.state.filteredGraphs.includes(Graph.EVALUATION_FAILED)) {
      // documentation can be found https://docs.amcharts.com/3/javascriptcharts/AmGraph
      graphs.push({
        id: "EVALUATION_GOTFAILED",
        balloonText:
          this.props.t("labels.graph", {
            ns: "guider",
            context: "failed",
          }) + " <b>[[EVALUATION_GOTFAILED]]</b>",
        bullet: "triangleDown",
        bulletSize: 12,
        fillAlphas: 0,
        lineAlpha: 0,
        lineThickness: 2,
        lineColor: "#de3211",
        title: "EVALUATION_GOTFAILED",
        type: "line",
        stackable: false,
        clustered: false,
        columnWidth: 0.9,
        valueField: "EVALUATION_GOTFAILED",
      });
    }

    //TODO: set to if certain graphs not filtered
    const stacked: boolean =
      !this.state.filteredGraphs.includes(Graph.MATERIAL_ASSIGNMENTDONE) ||
      !this.state.filteredGraphs.includes(Graph.MATERIAL_EXERCISEDONE);
    const valueAxes = [
      {
        stackType: stacked ? "regular" : "none",
        unit: "",
        position: "left",
        title: "",
        integersOnly: true,
        minimum: 0,
      },
    ];

    // general config about the chart
    const config = {
      theme: "none",
      type: "serial",
      language: "fi",
      minMarginLeft: 50,
      plotAreaFillAlphas: 0.1,
      mouseWheelZoomEnabled: true,
      fontFamily: "Inter",
      minSelectedTime: 604800000,
      maxSelectedTime: 31556952000,
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
        categoryBalloonDateFormat: "DD.MM.YYYY",
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
      Graph.SESSION_LOGGEDIN,
      Graph.MATERIAL_ASSIGNMENTDONE,
      Graph.MATERIAL_EXERCISEDONE,
      Graph.WORKSPACE_VISIT,
      Graph.FORUM_NEWMESSAGE,
      Graph.EVALUATION_REQUESTED,
      Graph.EVALUATION_PASSED,
      Graph.EVALUATION_FAILED,
      Graph.EVALUATION_INCOMPLETED,
    ];
    return (
      <div className="application-sub-panel__body">
        <div className="chart-legend">
          <GraphFilter
            graphs={showGraphs}
            filteredGraphs={this.state.filteredGraphs}
            handler={this.graphFilterHandler}
          />
          <WorkspaceFilter
            workspaces={workspaces}
            filteredWorkspaces={this.state.filteredWorkspaces}
            workspaceHandler={this.workspaceFilterHandler}
            completedWorkspaces={completedWorkspaces}
            filteredCompletedWorkspaces={this.state.filteredCompletedWorkspaces}
            completedWorkspaceHandler={this.completedWorkspaceFilterHandler}
          />
        </div>
        <AmCharts.React className="chart chart--main-chart" options={config} />
      </div>
    );
  }
}

export default withTranslation("common")(CurrentStudentStatistics);
