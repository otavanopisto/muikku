import {i18nType} from "~/reducers/base/i18n";
import * as React from 'react';
import {Dispatch} from 'redux';
import {connect} from 'react-redux';
import {StateType} from '~/reducers';
import {WorkspaceListType, ActivityLogType} from '~/reducers/main-function/workspaces';
import '~/sass/elements/chart.scss';

let AmCharts: any = null;

interface StudentActivityProps {
  activityLogs: Map<string, ActivityLogType[]>,
  i18n: i18nType
}

interface StudentActivityState {
  amChartsLoaded: boolean
}

class CurrentStudentStatistics extends React.Component<StudentActivityProps, StudentActivityState> {
  constructor(props: StudentActivityProps){
    super(props);
    this.state = {
      amChartsLoaded: (window as any).AmCharts != null,
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
  
  render(){
    if (!this.state.amChartsLoaded){
      return null;
    }
    
    let chartDataMap = new Map<string, number>();
    let today = new Date();
    let monthAgo = today.getMonth() > 0 ? new Date(today.getFullYear(), today.getMonth()-1) : new Date(today.getFullYear()-1, 11);
    let days = Math.round((today.getTime() - monthAgo.getTime())/1000/60/60/24);
    for(let i=0; i < days; i++){
      chartDataMap.set(new Date(today.getFullYear(), today.getMonth(), today.getDate()-i).toISOString().slice(0, 10), 0);
    }
    
    this.props.activityLogs.forEach((entry)=>{
      entry.map((log)=>{
        let date = log.timestamp.slice(0, 10);
        let entry: number = chartDataMap.get(date) || 0;
        switch(log.type){
        case "SESSION_LOGGEDIN":
          entry += 3;
          break;
        case "FORUM_NEWMESSAGE":
          entry += 2;
          break;
        case "FORUM_NEWTHREAD":
          entry +=3;
          break;
        case "NOTIFICATION_ASSESMENTREQUEST":
          
          break;
        case "NOTIFICATION_NOPASSEDCOURSES":
          
          break;
        case "NOTIFICATION_SUPPLEMENTATIONREQUEST":
          
          break;
        case "NOTIFICATION_STUDYTIME":
          
          break;
        case "EVALUATION_REQUESTED":
          entry+=30;
          break;
        case "EVALUATION_GOTINCOMPLETED":
          
          break;
        case "EVALUATION_GOTFAILED":
          
          break;
        case "EVALUATION_GOTPASSED":
          
          break;
        case "WORKSPACE_VISIT":
          entry+=1;
          break;
        case "MATERIAL_EXERCISEDONE":
          entry+=10;
          break;
        case "MATERIAL_ASSIGNMENTDONE":
          entry+=15;
          break;
        default:
          break;
        }
        chartDataMap.set(date, entry);
      });
    });
    
    let sortedKeys = Array.from(chartDataMap.keys()).sort((a, b)=>{return a > b ? 1 : -1;});
    let monthActivity = 0;
    let data = new Array;
    sortedKeys.forEach((key)=>{
      let value = chartDataMap.get(key);
      monthActivity += value;
      if(value <= 100)
        data.push({"date": key, "activityPoints": value});
      else
        data.push ({"date": key, "activityPoints": 100, "bulletvalue": value, "bullet": "round"});
    });
    
    let color = "#23AB3C";
    if (monthActivity < 100)
      color = "#C91400";
    else if (monthActivity < 200)
      color = "#FFE001";
    
    let graphs = new Array;
    graphs.push({
      "valueField": "activityPoints",
      "bulletField": "bullet",
      "bulletSize": 6,
      "balloonText": "[[bulletvalue]]",
      "showBalloon": true,
      "lineColor": color,
      "lineThickness": 2,
    });
    
    let config = {
      "theme": "none",
      "type": "serial",
      "categoryField": "date",
      "autoMargins": false,
      "marginLeft": 0,
      "marginRight": 5,
      "marginTop": 0,
      "marginBottom": 0,
      "valueAxes": [ {
        "gridAlpha": 0,
        "axisAlpha": 0,
        "maximum":110,
        "minimum":-10,
        "guides": [ {
          "value": 0,
          "lineAlpha": 0.3,
      } ]
        } ],
      "categoryAxis": {
        "gridAlpha": 0,
        "axisAlpha": 0,
        "startOnAxis": true
      },
      "graphs": graphs,
      "balloon": {
        "borderThickness": 1,
        "fontSize": 8,
        "horizontalPadding": 2,
        "verticalPadding": 2,
        "drop": true,
        "pointerOrientation": "left"
      },
      "dataProvider": data,
      "export": {
        "enabled": true
      }
    };

    return <AmCharts.React className="chart chart--activity-chart" options={config}/>
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
  }
};

export default connect(
  mapStateToProps
)(CurrentStudentStatistics);