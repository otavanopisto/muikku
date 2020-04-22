import {i18nType} from "~/reducers/base/i18n";
import * as React from 'react';
import {Dispatch} from 'redux';
import {connect} from 'react-redux';
import {StateType} from '~/reducers';
import {WorkspaceListType, ActivityLogType} from '~/reducers/workspaces';
import WorkspaceFilter from './filters/workspace-filter';
import GraphFilter from './filters/graph-filter';
import '~/sass/elements/chart.scss';

let AmCharts: any = null;

interface CurrentStudentStatisticsProps {
  activityLogs: Array<ActivityLogType>,
  i18n: i18nType,
  workspaces: WorkspaceListType
}

interface CurrentStudentStatisticsState {
  amChartsLoaded: boolean,
  filteredWorkspaces: number[],
  filteredCompletedWorkspaces: number[],
  filteredGraphs: string[]
}

interface MainChartData {
  EVALUATION_REQUESTED?: number,
  EVALUATION_GOTINCOMPLETED?: number,
  EVALUATION_GOTFAILED?: number,
  EVALUATION_GOTPASSED?: number,
  SESSION_LOGGEDIN?: number,
  WORKSPACE_VISIT?: number,
  MATERIAL_EXERCISEDONE?: number,
  MATERIAL_ASSIGNMENTDONE?: number,
  FORUM_NEWMESSAGE?: number,
  NOTIFICATION_ASSESMENTREQUEST?: number,
  NOTIFICATION_NOPASSEDCOURSES?: number,
  NOTIFICATION_SUPPLEMENTATIONREQUEST?: number,
  NOTIFICATION_STUDYTIME?: number
}

enum Graph {
  SESSION_LOGGEDIN = "logins",
  MATERIAL_ASSIGNMENTDONE = "assignments",
  MATERIAL_EXERCISEDONE = "exercises",
  WORKSPACE_VISIT = "visits",
  FORUM_NEWMESSAGE = "forum-messages",
}

let ignoreZoomed: boolean = true;
let zoomStartDate: Date = null;
let zoomEndDate: Date = null;

class CurrentStudentStatistics extends React.Component<CurrentStudentStatisticsProps, CurrentStudentStatisticsState> {
  constructor(props: CurrentStudentStatisticsProps){
    super(props);
    this.workspaceFilterHandler = this.workspaceFilterHandler.bind(this);
    this.completedWorkspaceFilterHandler = this.completedWorkspaceFilterHandler.bind(this);
    this.GraphFilterHandler = this.GraphFilterHandler.bind(this);
    this.zoomSaveHandler = this.zoomSaveHandler.bind(this);
    this.zoomApplyHandler = this.zoomApplyHandler.bind(this);
    this.state = {
      amChartsLoaded: AmCharts !== null,
      filteredWorkspaces: [],
      filteredCompletedWorkspaces: [],
      filteredGraphs: [Graph.FORUM_NEWMESSAGE]
    };
    
    if (!this.state.amChartsLoaded){
      this.loadAmCharts();
    } else {
      AmCharts = require("@amcharts/amcharts3-react");
    }
  }
  
  loadAmCharts(){
    let amcharts = document.createElement('script');
    amcharts.src = "https://www.amcharts.com/lib/3/amcharts.js";
    amcharts.async = true;
    amcharts.onload = ()=>{
      let serial = document.createElement('script');
      serial.src = "https://www.amcharts.com/lib/3/serial.js";
      serial.async = true;
      serial.onload = ()=>{
        AmCharts = require("@amcharts/amcharts3-react");
        this.setState({amChartsLoaded: true});
      };
      document.head.appendChild(serial);
    };
    document.head.appendChild(amcharts);
  }
  
  workspaceFilterHandler(workspaceId?: number){
    let filteredWorkspaces: number[] = [];
    if (workspaceId){
      filteredWorkspaces = this.state.filteredWorkspaces.slice();
      let index = filteredWorkspaces.indexOf(workspaceId);
      if (index > -1)
        filteredWorkspaces.splice(index, 1);
      else
        filteredWorkspaces.push(workspaceId);
    } else {
      if (this.state.filteredWorkspaces.length == 0){
        this.props.workspaces.map((workspace)=>
          filteredWorkspaces.push(workspace.id)
        )
      }
    }
    this.setState({filteredWorkspaces: filteredWorkspaces});
  }
  
  completedWorkspaceFilterHandler(workspaceId?: number){
    let filteredCompletedWorkspaces: number[] = [];
    if (workspaceId){
      filteredCompletedWorkspaces = this.state.filteredCompletedWorkspaces.slice();
      let index = filteredCompletedWorkspaces.indexOf(workspaceId);
      if (index > -1)
        filteredCompletedWorkspaces.splice(index, 1);
      else
        filteredCompletedWorkspaces.push(workspaceId);
    } else {
      //TODO: Activate when completedWorkspace data added
      /*if (this.state.filteredCompletedWorkspaces.length == 0){
        this.props.Completedworkspaces.map((workspace)=>
          filteredCompletedWorkspaces.push(workspace.id)
        )
      }*/
    }
    this.setState({filteredCompletedWorkspaces: filteredCompletedWorkspaces});
  }
  
  GraphFilterHandler(graph: Graph){
    const filteredGraphs = this.state.filteredGraphs.slice();
    let index = filteredGraphs.indexOf(graph);
    if(index > -1)
      filteredGraphs.splice(index, 1);
    else
      filteredGraphs.push(graph);
    this.setState({filteredGraphs: filteredGraphs});
  }

  zoomSaveHandler(e:any){
    if (!ignoreZoomed) {
      zoomStartDate = e.startDate;
      zoomEndDate = e.endDate;
    }
    ignoreZoomed = false;
  }
  
  zoomApplyHandler(e:any){
    if (zoomStartDate !== null && zoomEndDate !== null) {
      e.chart.zoomToDates(zoomStartDate, zoomEndDate);
    } else {
      let prior: Date;
      let today: Date = new Date();
      if (today.getMonth() >= 3)
        prior = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
      else
        prior = new Date(today.getFullYear() - 1, today.getMonth() + 9, today.getDate());
      e.chart.zoomToDates(prior, today);
    }
  }
  
  render(){
    if (!this.state.amChartsLoaded){
      return null;
    }
    //NOTE: The unused data can be cut here. (Option 1)
    //NOTE: For the sake of keeping the same chart borders it might be wise to leave the data rows with 0 values, but keep date points.
    let chartDataMap = new Map<string, MainChartData>();
    chartDataMap.set(new Date().toISOString().slice(0, 10), {SESSION_LOGGEDIN: 0, WORKSPACE_VISIT: 0, MATERIAL_EXERCISEDONE: 0, MATERIAL_ASSIGNMENTDONE: 0, FORUM_NEWMESSAGE: 0});
      this.props.activityLogs.map((log)=>{
        let date = log.timestamp.slice(0, 10);
        let entry = chartDataMap.get(date) || {};
        switch(log.type){
          case "FORUM_NEWMESSAGE":
          case "FORUM_NEWTHREAD":
            entry.FORUM_NEWMESSAGE = entry.FORUM_NEWMESSAGE + 1|| 1;
            break;
          case "SESSION_LOGGEDIN":
          case "NOTIFICATION_ASSESMENTREQUEST":
          case "NOTIFICATION_NOPASSEDCOURSES":
          case "NOTIFICATION_SUPPLEMENTATIONREQUEST":
          case "NOTIFICATION_STUDYTIME":
            entry[log.type] = (entry[log.type] + 1) || 1;
            break;
          default:
            break;
        }
        chartDataMap.set(date, entry);
      });

    let workspaces: {id: number, name: string, isEmpty: boolean}[] = [];
    this.props.workspaces.map((workspace)=>{
      workspaces.push({id: workspace.id, name: workspace.name, isEmpty: workspace.activityLogs.length == 0 });
      if (!this.state.filteredWorkspaces.includes(workspace.id)){
        workspace.activityLogs.map((log)=>{
          let date = log.timestamp.slice(0, 10);
          let entry = chartDataMap.get(date) || {};
          switch(log.type){
            case "EVALUATION_REQUESTED":
            case "EVALUATION_GOTINCOMPLETED":
            case "EVALUATION_GOTFAILED":
            case "EVALUATION_GOTPASSED":
            case "WORKSPACE_VISIT":
            case "MATERIAL_EXERCISEDONE":
            case "MATERIAL_ASSIGNMENTDONE":
              entry[log.type] = (entry[log.type] + 1) || 1;
              break;
            default:
              break;
          }
          chartDataMap.set(date, entry);
        })
      }
    });

    //TODO: load and parse completed workspaces
    let completedWorkspaces: {id: number, name: string, isEmpty: boolean}[] = [];

    //NOTE: Data can be filtered here also (Option 2)
    let sortedKeys = Array.from(chartDataMap.keys()).sort((a, b)=>{return a > b ? 1 : -1;});
    let data = new Array;
    sortedKeys.forEach((key)=>{
      let value = chartDataMap.get(key);
      data.push({"date": key, ...value});
    });

    //NOTE: Here the graphs are filtered. May be not optimal, since it is the end part of the data processing (Option 3)
    let graphs = new Array;
    if (!this.state.filteredGraphs.includes(Graph.MATERIAL_ASSIGNMENTDONE)){
      graphs.push({
        "id": "MATERIAL_ASSIGNMENTDONE",
        "balloonText": this.props.i18n.text.get("plugin.guider.assignmentsTitle") + " <b>[[MATERIAL_ASSIGNMENTDONE]]</b>",
        "fillAlphas": 1,
        "lineAlpha": 0.2,
        "lineColor": "#ce01bd",
        "title": "MATERIAL_ASSIGNMENTDONE",
        "type": "column",
        "clustered": false,
        "columnWidth": 0.7,
        "valueField": "MATERIAL_ASSIGNMENTDONE"
      });
    }

    if (!this.state.filteredGraphs.includes(Graph.MATERIAL_EXERCISEDONE)){
      graphs.push({
        "id": "MATERIAL_EXERCISEDONE",
        "balloonText": this.props.i18n.text.get("plugin.guider.exercisesTitle") + " <b>[[MATERIAL_EXERCISEDONE]]</b>",
        "fillAlphas": 1,
        "lineAlpha": 0.2,
        "lineColor": "#ff9900",
        "title": "MATERIAL_EXERCISEDONE",
        "type": "column",
        "clustered": false,
        "columnWidth": 0.7,
        "valueField": "MATERIAL_EXERCISEDONE"
      });
    }

    if (!this.state.filteredGraphs.includes(Graph.FORUM_NEWMESSAGE)){
      graphs.push({
        "id": "FORUM_NEWMESSAGE",
        "balloonText": this.props.i18n.text.get("plugin.guider.forumMessagesTitle") + " <b>[[FORUM_NEWMESSAGE]]</b>",
        "fillAlphas": 1,
        "lineAlpha": 0.2,
        "lineColor": "#62c3eb",
        "title": "FORUM_NEWMESSAGE",
        "type": "column",
        "stackable": false,
        "clustered": false,
        "columnWidth": 0.4,
        "valueField": "FORUM_NEWMESSAGE"
      });
    }

    if (!this.state.filteredGraphs.includes(Graph.SESSION_LOGGEDIN)){
      graphs.push({
        "id": "SESSION_LOGGEDIN",
        "balloonText": this.props.i18n.text.get("plugin.guider.loginsTitle") + " <b>[[SESSION_LOGGEDIN]]</b>",
        "bullet": "round",
        "bulletSize": 12,
        "fillAlphas": 0,
        "lineAlpha": 0.5,
        "lineThickness": 2,
        "lineColor": "#2c2c2c",
        "title": "SESSION_LOGGEDIN",
        "type": "line",
        "stackable": false,
        "clustered": false,
        "columnWidth": 0.7,
        "valueField": "SESSION_LOGGEDIN"
      });
    }

    if (!this.state.filteredGraphs.includes(Graph.WORKSPACE_VISIT)){
      graphs.push({
        "id": "WORKSPACE_VISIT",
        "balloonText": this.props.i18n.text.get("plugin.guider.visitsTitle") + " <b>[[WORKSPACE_VISIT]]</b>",
        "bullet": "round",
        "bulletSize": 8,
        "fillAlphas": 0,
        "lineAlpha": 0.5,
        "lineThickness": 2,
        "lineColor": "#43cd80",
        "title": "WORKSPACE_VISIT",
        "type": "line",
        "stackable": false,
        "clustered": false,
        "columnWidth": 0.9,
        "valueField": "WORKSPACE_VISIT"
      });
    }

    //TODO: set to if certain graphs not filtered
    let stacked: boolean = !this.state.filteredGraphs.includes(Graph.MATERIAL_ASSIGNMENTDONE) || !this.state.filteredGraphs.includes(Graph.MATERIAL_EXERCISEDONE)
    let valueAxes = [{
    "stackType": stacked? "regular" : "none",
    "unit": "",
    "position": "left",
    "title": "",
    "integersOnly": true,
    "minimum": 0
    }];

    let config = {
      "theme": "none",
      "type": "serial",
      "minMarginLeft": 50,
      "plotAreaFillAlphas": 0.1,
      "mouseWheelZoomEnabled": true,
      "fontFamily" : "Open Sans",
      "minSelectedTime": 604800000,
      "maxSelectedTime": 31556952000,
      "dataDateFormat": "YYYY-MM-DD",
      "categoryField": "date",
      "categoryAxis": {
        "parseDates": true,
        "dashLength": 1,
        "minorGridEnabled": true,
        "gridPosition": "start"
      },
      "categoryAxesSettings": {
        "minPeriod": "DD"
      },
       "chartScrollbar": {
        "oppositeAxis": false,
        "offset": 30,
        "scrollbarHeight": 60,
        "backgroundAlpha": 0,
        "selectedBackgroundAlpha": 0.1,
        "selectedBackgroundColor": "#888888",
        "graphFillAlpha": 0,
        "graphLineAlpha": 0.5,
        "selectedGraphFillAlpha": 0,
        "selectedGraphLineAlpha": 1,
        "autoGridCount": true,
        "color": "#AAAAAA"
      },
      "chartCursor": { 
        "categoryBalloonDateFormat": "YYYY-MM-DD",
        "categoryBalloonColor": "#009FE3",
        "cursorColor": "#000"
     },
     "listeners": [{
       "event": "zoomed",
       "method": this.zoomSaveHandler
       }, {
       "event": "dataUpdated",
       "method":  this.zoomApplyHandler
    }],
      "valueAxes": valueAxes,
      "graphs": graphs,
      "dataProvider": data,
      "export": {
        "enabled": true
      }
    };
    ignoreZoomed = true;
    //Maybe it is possible to use show/hide graph without re-render. requires accessing the graph and call for a method. Responsiveness not through react re-render only?
    let showGraphs: string[] = [Graph.SESSION_LOGGEDIN, Graph.MATERIAL_ASSIGNMENTDONE, Graph.MATERIAL_EXERCISEDONE, Graph.WORKSPACE_VISIT, Graph.FORUM_NEWMESSAGE];
    return <div className="application-sub-panel__body">
      <div className="chart-legend">
        <GraphFilter graphs={showGraphs} filteredGraphs={this.state.filteredGraphs} handler={this.GraphFilterHandler}/>
        <WorkspaceFilter workspaces={workspaces} filteredWorkspaces={this.state.filteredWorkspaces} workspaceHandler={this.workspaceFilterHandler}
        completedWorkspaces={completedWorkspaces} filteredCompletedWorkspaces={this.state.filteredCompletedWorkspaces} completedWorkspaceHandler={this.completedWorkspaceFilterHandler}/>
      </div>
      <AmCharts.React className="chart chart--main-chart" options={config}/>
    </div>
  }
}

function mapStateToProps(state: StateType){
  return {
    activityLogs: state.guider.currentStudent.activityLogs,
    i18n: state.i18n,
    workspaces: state.guider.currentStudent.workspaces
  }
};

export default connect(
  mapStateToProps
)(CurrentStudentStatistics);
