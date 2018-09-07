import * as React from 'react';
import {Dispatch} from 'redux';
import {connect} from 'react-redux';
import {StudentUserStatistics, Activity, Record, GuiderActivityDataType} from '~/reducers/main-function/guider';
import {StateType} from '~/reducers';
import WorkspaceFilter from './filters/workspace-filter';
import GraphFilter from './filters/graph-filter';
import '~/sass/elements/chart.scss';

var AmCharts = require("@amcharts/amcharts3-react");

interface CurrentStudentStatisticsProps {
  statistics: StudentUserStatistics
}

interface CurrentStudentStatisticsState {
  filteredWorkspaces: number[],
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

//TEST DATA: remove if found in production
/*var testData:{"date":Date, "logins":number, "assignments":number,"exercises":number}[] = [];*/

class CurrentStudentStatistics extends React.Component<CurrentStudentStatisticsProps, CurrentStudentStatisticsState> {
  constructor(props: CurrentStudentStatisticsProps){
    super(props);
    this.workspaceFilterHandler = this.workspaceFilterHandler.bind(this);
    this.GraphFilterHandler = this.GraphFilterHandler.bind(this);
    this.zoomSaveHandler = this.zoomSaveHandler.bind(this);
    this.zoomApplyHandler = this.zoomApplyHandler.bind(this);
    this.state = {
      filteredWorkspaces: [],
      filteredGraphs: []
    };
    
    //TEST DATA: remove if found in production
    /* let today:Date = new Date();
    for (let i=0;i<1000; i++) {
      testData.push({"date": new Date(today.getTime() + i*24*60*60*1000), "logins": Math.floor(Math.random()*7+3), "assignments": Math.floor(Math.random()*3+1), "exercises": Math.floor(Math.random()*3+1)});
    }*/
  }
  
  workspaceFilterHandler(workspaceId: number){
    const filteredWorkspaces = this.state.filteredWorkspaces.slice();
    var index = filteredWorkspaces.indexOf(workspaceId);
    if(index > -1)
      filteredWorkspaces.splice(index, 1);
    else
      filteredWorkspaces.push(workspaceId);
    this.setState({filteredWorkspaces: filteredWorkspaces});
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
  }
  
  render(){
    if (!this.props.statistics){
      //TODO: change to animation?
      return (<p>LOADING</p>);
    }
    
    let workspaces: {id: number, name: string}[] = [];
    
    //TEST DATA. Remove if found in production.
    workspaces.push({id:1, name:"test1"});
    workspaces.push({id:76, name:"test2"});
    workspaces.push({id:23, name:"test3"});
    workspaces.push({id:32, name:"test4"});
    workspaces.push({id:28, name:"test5"});
    workspaces.push({id:102, name:"test6"});
    
    //NOTE: The unused data can be cut here. (Option 1)
    //NOTE: For the sake of keeping the same chart borders it might be wise to leave the data rows with 0 values, but keep date points.
    let chartDataMap = new Map<string, {logins: number, assignments: number, exercises: number}>();
      this.props.statistics.login.map((login)=>{
        let date = login.slice(0, 10);
        let entry = chartDataMap.get(date);
        if(entry == null)
          entry = {"logins": 0, "assignments": 0, "exercises": 0};
        entry.logins++;
        chartDataMap.set(date, entry);
      });
    
    Object.keys(this.props.statistics.activities).forEach(key=>{
      let workspaceId: number = parseInt(key);
      workspaces.push({id: workspaceId, name: this.props.statistics.activities[workspaceId].workspaceUrlName});
      if (!this.state.filteredWorkspaces.includes(workspaceId)){
        this.props.statistics.activities[workspaceId].records.map((record)=>{
          let date = record.date.slice(0, 10);
          let entry = chartDataMap.get(date);
          if (entry == null)
            entry = {"logins": 0, "assignments": 0, "exercises": 0};
          if (record.type === "EVALUATED")
            entry.assignments++;
          else if (record.type === "EXERCISE")
            entry.exercises++;
          chartDataMap.set(date, entry);
        })
      }
    });
    
    //NOTE: Data can be filtered here also (Option 2)
    let sortedKeys = Array.from(chartDataMap.keys()).sort((a, b)=>{return a > b ? 1 : -1;});
    let data = new Array;
    sortedKeys.forEach((key)=>{
      let value = chartDataMap.get(key);
      data.push({"date": key, "logins": value.logins, "assignments": value.assignments, "exercises": value.exercises});
    });
    
    /*data = data.concat(testData);*/
    //NOTE: Here the graphs are filtered. May be not optimal, since it is the end part of the data processing (Option 3)
    let graphs = new Array;
    if (!this.state.filteredGraphs.includes(Graph.LOGINS)){
      graphs.push({
        "id": "logins",
        "balloonText": "Logins number <b>[[logins]]</b>",
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
        "balloonText": "Assignments done <b>[[assignments]]</b>",
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
        "balloonText": "Exercises done <b>[[exercises]]</b>",
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
    console.log(config);
    
    //Maybe it is possible to use show/hide graph without re-render. requires accessing the graph and call for a method. Responsiveness not through react re-render only?
    let showGraphs: string[] = [Graph.LOGINS, Graph.ASSIGNMENTS, Graph.EXERCISES];
    return <div className="application-sub-panel__body">
      <div className="chart-legend">
        <GraphFilter graphs={showGraphs} filteredGraphs={this.state.filteredGraphs} handler={this.GraphFilterHandler}/>
        <WorkspaceFilter workspaces={workspaces} handler={this.workspaceFilterHandler} filteredWorkspaces={this.state.filteredWorkspaces}/>
      </div>
      <AmCharts.React className="chart chart--main-chart" options={config}/>
    </div>
  }
}

function mapStateToProps(state: StateType){
  return {
    statistics: state.guider.currentStudent.statistics
  }
};

export default connect(
  mapStateToProps
)(CurrentStudentStatistics);