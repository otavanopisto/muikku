import {i18nType} from "~/reducers/base/i18n";
import * as React from 'react';
import {Dispatch} from 'redux';
import {connect} from 'react-redux';
import {StateType} from '~/reducers';
import WorkspaceFilter from './filters/workspace-filter';
import {WorkspaceListType, WorkspaceType, WorkspaceActivityStatisticsType} from '~/reducers/main-function/workspaces';
import GraphFilter from './filters/graph-filter';
import '~/sass/elements/chart.scss';

let AmCharts: any = null;

interface CurrentStudentStatisticsProps {
  i18n: i18nType,
  workspaces: WorkspaceListType,
  logins: Array<string>
}

interface CurrentStudentStatisticsState {
  amChartsLoaded: boolean,
  filteredWorkspaces: number[],
  filteredCompletedWorkspaces: number[],
  filteredGraphs: string[]
}

enum Graph {
  LOGINS = "logins",
  ASSIGNMENTS = "assignments",
  EXERCISES = "exercises"
}

var ignoreZoomed: boolean = true;
var zoomStartDate: Date = null;
var zoomEndDate: Date = null;

class CurrentStudentStatistics extends React.Component<CurrentStudentStatisticsProps, CurrentStudentStatisticsState> {
  constructor(props: CurrentStudentStatisticsProps){
    super(props);
    this.workspaceFilterHandler = this.workspaceFilterHandler.bind(this);
    this.completedWorkspaceFilterHandler = this.completedWorkspaceFilterHandler.bind(this);
    this.GraphFilterHandler = this.GraphFilterHandler.bind(this);
    this.zoomSaveHandler = this.zoomSaveHandler.bind(this);
    this.zoomApplyHandler = this.zoomApplyHandler.bind(this);
    this.state = {
      amChartsLoaded: (window as any).AmCharts != null,
      filteredWorkspaces: [],
      filteredCompletedWorkspaces: [],
      filteredGraphs: []
    };
    
    if (!this.state.amChartsLoaded)
      this.loadAmCharts();
    else
      AmCharts = require("@amcharts/amcharts3-react");
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
      var index = filteredWorkspaces.indexOf(workspaceId);
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
      var index = filteredCompletedWorkspaces.indexOf(workspaceId);
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
    var index = filteredGraphs.indexOf(graph);
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
    if (zoomStartDate != null && zoomEndDate != null)
      e.chart.zoomToDates(zoomStartDate, zoomEndDate);
    else {
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
    let chartDataMap = new Map<string, {logins?: number, assignments?: number, exercises?: number}>();
    chartDataMap.set(new Date().toISOString().slice(0, 10), {"logins": 0, "assignments": 0, "exercises": 0});
      this.props.logins.map((login)=>{
        let date = login.slice(0, 10);
        let entry = chartDataMap.get(date);
        if (entry == null)
          entry = {"logins": 1};
        else
        entry.logins++;
        chartDataMap.set(date, entry);
      });
    
    let workspaces: {id: number, name: string, isEmpty: boolean}[] = [];
    this.props.workspaces.map((workspace)=>{
      workspaces.push({id: workspace.id, name: workspace.name, isEmpty: workspace.activityStatistics.records.length == 0 });
      if (!this.state.filteredWorkspaces.includes(workspace.id)){
        workspace.activityStatistics.records.map((record)=>{
          let date = record.date.slice(0, 10);
          let entry = chartDataMap.get(date);
          if (record.type === "EVALUATED"){
            if (entry == null)
              entry = {"assignments": 1};
            else if (entry.assignments == null)
              entry = {...entry, "assignments": 1};
            else
              entry.assignments++;
          }
          
          if (record.type === "EXERCISE"){
            if (entry == null)
              entry = {"exercises": 1};
            else if (entry.exercises == null)
              entry = {...entry, "exercises": 1};
            else
              entry.exercises++;
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
    if (!this.state.filteredGraphs.includes(Graph.LOGINS)){
      graphs.push({
        "id": "logins",
        "balloonText": this.props.i18n.text.get("plugin.guider.loginsTitle") + " <b>[[logins]]</b>",
        "fillAlphas": 0.7,
        "lineAlpha": 0.2,
        "lineColor": "#62c3eb",
        "title": "logins",
        "type": "column",
        "stackable": false,
        "clustered": false,
        "columnWidth": 0.6,
        "valueField": "logins"
      });
    }
    
    if (!this.state.filteredGraphs.includes(Graph.ASSIGNMENTS)){
      graphs.push({
        "id": "assignments",
        "balloonText": this.props.i18n.text.get("plugin.guider.assignmentsTitle") + " <b>[[assignments]]</b>",
        "fillAlphas": 0.9,
        "lineAlpha": 0.2,
        "lineColor": "#ce01bd",
        "title": "assignments",
        "type": "column",
        "clustered": false,
        "columnWidth": 0.4,
        "valueField": "assignments"
      });
    }
    
    if (!this.state.filteredGraphs.includes(Graph.EXERCISES)){
      graphs.push({
        "id": "exercises",
        "balloonText": this.props.i18n.text.get("plugin.guider.exercisesTitle") + " <b>[[exercises]]</b>",
        "fillAlphas": 0.9,
        "lineAlpha": 0.2,
        "lineColor": "#ff9900",
        "title": "exercises",
        "type": "column",
        "clustered": false,
        "columnWidth": 0.4,
        "valueField": "exercises"
      });
    }
    
    let valueAxes = [{
    "stackType": (graphs.length>1)? "regular": "none",
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
      "startDuration": 0.4,
      "plotAreaFillAlphas": 0.1,
      "mouseWheelZoomEnabled": true,
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
        "graph": "logins",
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
    let showGraphs: string[] = [Graph.LOGINS, Graph.ASSIGNMENTS, Graph.EXERCISES];
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
    i18n: state.i18n,
    workspaces: state.guider.currentStudent.workspaces,
    logins: state.guider.currentStudent.logins
  }
};

export default connect(
  mapStateToProps
)(CurrentStudentStatistics);