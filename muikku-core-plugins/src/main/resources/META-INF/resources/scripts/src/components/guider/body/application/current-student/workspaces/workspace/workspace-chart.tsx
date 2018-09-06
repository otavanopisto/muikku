import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { StudentUserStatistics, Activity, Record, GuiderActivityDataType } from '~/reducers/main-function/guider';
import { StateType } from '~/reducers';
import GraphFilter from '../../filters/graph-filter';
import '~/sass/elements/chart.scss';

var AmCharts = require("@amcharts/amcharts3-react");

interface CurrentStudentWorkspaceStatisticsProps {
  statistics: StudentUserStatistics,
  workspaceId: number
}

interface CurrentStudentWorkspaceStatisticsState {
  filteredGraphs: string[]
}

enum Graph {
  ASSIGNMENTS = "assignment",
  EXERCISES = "exercise"
}

var ignoreZoomed:boolean = true;
var zoomStartDate:Date = null;
var zoomEndDate:Date = null;

class CurrentStudentStatistics extends React.Component<CurrentStudentWorkspaceStatisticsProps, CurrentStudentWorkspaceStatisticsState> {
  constructor(props: CurrentStudentWorkspaceStatisticsProps){
    super(props);
    this.GraphFilterHandler = this.GraphFilterHandler.bind(this);
    this.zoomSaveHandler = this.zoomSaveHandler.bind(this);
    this.zoomApplyHandler = this.zoomApplyHandler.bind(this);
    this.state = {
      filteredGraphs: []
    };
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

  zoomSaveHandler (e:any){
    if (!ignoreZoomed) {
      zoomStartDate = e.startDate;
      zoomEndDate = e.endDate;
    }
    ignoreZoomed = false;
  }
  
  zoomApplyHandler(e:any){
    if(zoomStartDate != null && zoomEndDate != null)
      e.chart.zoomToDates(zoomStartDate, zoomEndDate);
  }
  
  render(){
    if(!this.props.statistics) {
      //TODO: change to animation?
      return (<p>LOADING</p>);
    }
    
    //NOTE: The unused data can be cut here. (Option 1)
    let chartDataMap = new Map<string, {assignments:number, exercises:number}>();
    if(this.props.statistics.activities[this.props.workspaceId] != null) {
      this.props.statistics.activities[this.props.workspaceId].records.map((record)=>{
        let date = record.date.slice(0, 10);
        let entry = chartDataMap.get(date);
        if(entry == null)
          entry = {"assignments": 0,"exercises": 0};
        if(record.type === "EVALUATED")
          entry.assignments++;
        else if(record.type === "EXERCISE")
          entry.exercises++;
        chartDataMap.set(date, entry);
      });
    } else {
      chartDataMap.set(new Date().toISOString().slice(0, 10), {"assignments": 0,"exercises": 0});
    }
    //NOTE: Data can be filtered here also (Option 2)
    let sortedKeys = Array.from(chartDataMap.keys()).sort((a,b)=>{return a > b ? 1 : -1;});
    let data = new Array;
    sortedKeys.forEach((key)=>{
      let value = chartDataMap.get(key);
      data.push({"date": key, "assignments": value.assignments, "exercises": value.exercises});
    });
    
    //TEST DATA Remove if found in production
    /*if(this.props.statistics.activities[this.props.workspaceId] != null) {
      let today:Date = new Date();
      for (let i = 0;i < 100; i++) {
        data.push({"date": new Date(today.getTime() + i*24*60*60*1000), "assignments": Math.floor(Math.random()*2), "exercises": Math.floor(Math.random()*3)});
      }
    }*/
    
    //NOTE: Here the graphs are filtered. May be not optimal, since it is the end part of the data processing (Option 3)
    let graphs = new Array;
    
    if(!this.state.filteredGraphs.includes(Graph.ASSIGNMENTS)) {
      graphs.push({
        "id":"assignments",
        "balloonText": "Assignments done <b>[[assignments]]</b>",
        "fillAlphas": 0.9,
        "lineAlpha": 0.2,
        "lineColor":"#ce01bd",
        "title": "assignments",
        "type": "column",
        "clustered":false,
        "columnWidth":0.4,
        "valueField": "assignments"
      });
    }
    
    if(!this.state.filteredGraphs.includes(Graph.EXERCISES)) {
      graphs.push({
        "id":"exercises",
        "balloonText": "Exercises done <b>[[exercises]]</b>",
        "fillAlphas": 0.9,
        "lineAlpha": 0.2,
        "lineColor":"#ff9900",
        "title": "exercises",
        "type": "column",
        "clustered":false,
        "columnWidth":0.4,
        "valueField": "exercises"
      });
    }
    
    let valueAxes = [{
    "stackType": (graphs.length>1)? "regular": "none",
    "unit": "",
    "position": "left",
    "title": "",
    "integersOnly": true,
    "minimum":0
  }];

    let config = {
      "theme": "none",
      "type": "serial",
      "minMarginLeft": 50,
      "startDuration": 0.4,
      "plotAreaFillAlphas": 0.1,
      "mouseWheelZoomEnabled": true,
      "minSelectedTime": 604800000,
      "maxSelectedTime": 7776000000,
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
    ignoreZoomed=true;
    console.log(config);
    
    //Maybe it is possible to use show/hide graph without re-render. requires accessing the graph and call for a method. Responsiveness not through react re-render only?
    let showGraphs:string[] = [Graph.ASSIGNMENTS, Graph.EXERCISES];
    return(
    <div className="react-required-container">
      <div className="chart-legend">
        <div className="chart-legend-filter chart-legend-filter--graph-filter">
          <GraphFilter graphs={showGraphs} filteredGraphs={this.state.filteredGraphs} handler={this.GraphFilterHandler}/>
        </div>
      </div>
      <AmCharts.React className="chart chart--workspace-chart" options={config} />
    </div>
    )
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