import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import {StudentUserStatistics, Activity, Record, GuiderActivityDataType} from '~/reducers/main-function/guider';
import {StateType} from '~/reducers';
import WorkspaceFilter from './filters/workspace-filter';
import GraphDataFilter from './filters/graph-data-filter';
import '~/sass/elements/filter-chart.scss';

var AmCharts = require("@amcharts/amcharts3-react");

interface CurrentStudentStatisticsProps {
  statistics: StudentUserStatistics
}

interface CurrentStudentStatisticsState {
  filteredWorkspaces: number[],
  filteredGraphData: string[]
}

enum GraphData {
  LOGINS = "Logins",
  ASSIGNMENTS = "Assignments",
  EXERCISES = "Exercises"
}

class CurrentStudentStatistics extends React.Component<CurrentStudentStatisticsProps, CurrentStudentStatisticsState> {
  constructor(props: CurrentStudentStatisticsProps){
    super(props);
    this.workspaceFilterHandler = this.workspaceFilterHandler.bind(this);
    this.GraphDataFilterHandler = this.GraphDataFilterHandler.bind(this);
    this.state = {
      filteredWorkspaces: [],
      filteredGraphData: []
    };
  }
  
  workspaceFilterHandler(workspaceId: number) {
    const filteredWorkspaces = this.state.filteredWorkspaces.slice();
    var index = filteredWorkspaces.indexOf(workspaceId);
    if(index > -1)
      filteredWorkspaces.splice(index, 1);
    else 
      filteredWorkspaces.push(workspaceId);
    this.setState({filteredWorkspaces: filteredWorkspaces});
  }
  
  GraphDataFilterHandler(graphData: GraphData) {
    const filteredGraphData = this.state.filteredGraphData.slice();
    var index = filteredGraphData.indexOf(graphData);
    if(index > -1)
      filteredGraphData.splice(index, 1);
    else 
      filteredGraphData.push(graphData);
    this.setState({filteredGraphData: filteredGraphData});
  }

  render(){
    if(!this.props.statistics) {
      //TODO: change to animation?
      return (<p>LOADING</p>);
    }
      
    //TODO: CHANGE TO LOCALE VARIABLE
    let months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
    let logins = Array(12).fill(0);
    let assignments = Array(12).fill(0);
    let excersises = Array(12).fill(0);
    let workspaces: {id:number, name:string}[] = [];
    
    //TEST DATA. Remove if found in production.
    workspaces.push({id:1, name:"aaa"});
    workspaces.push({id:76, name:"bbb"});
    workspaces.push({id:23, name:"tr"});
    workspaces.push({id:32, name:"3432a"});
    workspaces.push({id:28, name:"gddd"});
    workspaces.push({id:102, name:"asddsa"});
    
    //NOTE: It is possible not to check data type and calculate everything. There is graph type check below. (Option 1)
    if(!this.state.filteredGraphData.includes(GraphData.LOGINS)) {
      this.props.statistics.login.map((login)=>{
        logins[login.getMonth()]++;
      });
    }
    
    if(!this.state.filteredGraphData.includes(GraphData.ASSIGNMENTS) || !this.state.filteredGraphData.includes(GraphData.EXERCISES)) {
      Object.keys(this.props.statistics.activities).forEach(key=>{
        let workspaceId:number = parseInt(key);
        workspaces.push({id:workspaceId, name:this.props.statistics.activities[workspaceId].workspaceUrlName});
        if(!this.state.filteredWorkspaces.includes(workspaceId)){
          this.props.statistics.activities[workspaceId].records.map((record)=>{
            if(record.type === "EVALUATED" && !this.state.filteredGraphData.includes(GraphData.ASSIGNMENTS))
              assignments[new Date(record.date).getMonth()]++;
            else if(record.type === "EXERCISE" &&!this.state.filteredGraphData.includes(GraphData.EXERCISES))
              excersises[new Date(record.date).getMonth()]++;
          })
        }
      });
    }
    
    //NOTE: Data can be filtered here also (Option 2)
    let data = new Array;
    for(let i = 0; i < 12; i++){
      let dataEntry:any = {};
      dataEntry.month = months[i];
      //if(!this.state.filteredGraphData.includes(GraphData.LOGINS))
        dataEntry.logins = logins[i];
      //if(!this.state.filteredGraphData.includes(GraphData.ASSIGNMENTS))
        dataEntry.assignmentsDone = assignments[i];
      //if(!this.state.filteredGraphData.includes(GraphData.EXERCISES))
        dataEntry.exercisesDone = excersises[i];
      data.push(dataEntry);
    }
    
    //NOTE: It is possible not to check graphs and leave them with no or 0 data entries. (if data is checked) (Option 3)
    let graphs = new Array;
    if(!this.state.filteredGraphData.includes(GraphData.LOGINS)) {
      graphs.push({
        "balloonText": "Logins in [[month]] <b>[[logins]]</b>",
        "fillAlphas": 0.7,
        "lineAlpha": 0.2,
        "lineColor":"#62c3eb",
        "title": "logins",
        "type": "column",
        "stackable":false,
        "clustered":false,
        "columnWidth":0.6,
        "valueField": "logins"
      });
    }
    
    if(!this.state.filteredGraphData.includes(GraphData.ASSIGNMENTS)) {
      graphs.push({
        "balloonText": "Assignments done in [[month]] <b>[[assignmentsDone]]</b>",
        "fillAlphas": 0.9,
        "lineAlpha": 0.2,
        "lineColor":"#ce01bd",
        "title": "assignments",
        "type": "column",
        "clustered":false,
        "columnWidth":0.4,
        "valueField": "assignmentsDone"
      });
    }
    
    if(!this.state.filteredGraphData.includes(GraphData.EXERCISES)) {
      graphs.push({
        "balloonText": "Exercises done in [[month]] <b>[[exercisesDone]]</b>",
        "fillAlphas": 0.9,
        "lineAlpha": 0.2,
        "lineColor":"#ff9900",
        "title": "exercises",
        "type": "column",
        "clustered":false,
        "columnWidth":0.4,
        "valueField": "exercisesDone"
      });
    }
    
    let valueAxes = [{
    "stackType": (graphs.length>1)?"regular":"none",
    "unit": "",
    "position": "left",
    "title": "",
  }];
    
    let config = {
      "theme": "none",
      "type": "serial",
      "startDuration": 1,
      "plotAreaFillAlphas": 0.1,
      "export": {
          "enabled": true
       },
      "graphs":graphs,
      "categoryField": "month",
      "categoryAxis": {
          "gridPosition": "start"
      },
      "dataProvider": data,
      "valueAxes": valueAxes
    };
    
    //Possible to use show/hide graph. requires accessing the graph and call for a method. Responsiveness not through react rerender only?
    let showGraphs:string[] = [GraphData.LOGINS, GraphData.ASSIGNMENTS, GraphData.EXERCISES];
    return(
    <div className="react-required-container">
      <div className="chart-legend">
        <div className="chart-filter chart-filter--legend-filter">
          <GraphDataFilter graphs={showGraphs} filteredGraphData={this.state.filteredGraphData} handler={this.GraphDataFilterHandler}/>
        </div>
        <div className="chart-filter chart-filter--workspace-filter">
          <WorkspaceFilter workspaces={workspaces} handler={this.workspaceFilterHandler} filteredWorkspaces={this.state.filteredWorkspaces}/>
        </div>
      </div>
      <AmCharts.React className="filterAmChart" options={config} />
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