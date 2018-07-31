import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import {StudentUserStatistics} from '~/reducers/main-function/guider';
import {StateType} from '~/reducers';

var AmCharts = require("@amcharts/amcharts3-react");

//import '~/sass/elements/application-list.scss';

interface CurrentStudentStatisticsProps {
  statistics: StudentUserStatistics

}

interface CurrentStudentStatisticsState {
    filteredWorkspaces: number[]
  }

class CurrentStudentStatistics extends React.Component<CurrentStudentStatisticsProps, CurrentStudentStatisticsState> {
  constructor(props: CurrentStudentStatisticsProps){
    super(props);
    
    this.state = {
        filteredWorkspaces:[]
    }
  }
    render(){
      console.log (this.props.statistics);
      if(!this.props.statistics){
        return (<p>LOADING</p>);
      }
//      let data = [
//                  {
//                    "month": "January",
//                    "logins": 80,
//                    "assignmentsDone": 10,
//                    "exercisesDone": 15
//                }, {
//                    "month": "February",
//                    "logins": 90,
//                    "assignmentsDone": 15,
//                    "exercisesDone": 18
//                }, {
//                    "month": "March",
//                    "logins": 80,
//                    "assignmentsDone": 15,
//                    "exercisesDone": 15
//                }, {
//                    "month": "April",
//                    "logins": 60,
//                    "assignmentsDone": 10,
//                    "exercisesDone": 8
//                }, {
//                    "month": "May",
//                    "logins": 50,
//                    "assignmentsDone": 12,
//                    "exercisesDone": 5
//                }, {
//                    "month": "June",
//                    "logins": 5,
//                    "assignmentsDone": 0,
//                    "exercisesDone": 0
//                },{
//                    "month": "July",
//                    "logins": 3,
//                    "assignmentsDone": 0,
//                    "exercisesDone": 0
//                }, {
//                    "month": "August",
//                    "logins": 30,
//                    "assignmentsDone": 5,
//                    "exercisesDone": 4
//                }, {
//                    "month": "September",
//                    "logins": 120,
//                    "assignmentsDone": 10,
//                    "exercisesDone": 15
//                }, {
//                    "month": "October",
//                    "logins": 130,
//                    "assignmentsDone": 20,
//                    "exercisesDone": 15
//                }, {
//                    "month": "November",
//                    "logins": 120,
//                    "assignmentsDone": 30,
//                    "exercisesDone": 20
//                }, {
//                    "month": "December",
//                    "logins": 78,
//                    "assignmentsDone": 20,
//                    "exercisesDone": 10
//                }];
      //TO DO CHANGE TO LOCALE VARIABLE
      let months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
      let logins = Array(12).fill(0);
      let assignments = Array(12).fill(0);
      let excersises = Array(12).fill(1);
      this.props.statistics.login.map((login) =>{
          logins[login.getMonth()]++;
      });
      this.props.statistics.activities.map((activity) =>{
        if(!this.state.filteredWorkspaces.includes(activity.workspaceId)){
          activity.assignmentDone.map((assignment) => {
          assignments[assignment.getMonth()]++;
          })
        }
      });
      let data = new Array;
      for(let i=0; i<12;i++){
          data.push({
        "month": months[i],
        "logins": logins[i],
        "assignmentsDone": assignments[i],
        "exercisesDone": excersises[i]
          });
      }
          
      let config = {
              "theme": "none",
              "type": "serial",
              "startDuration": 1,
              "plotAreaFillAlphas": 0.1,
              "export": {
                  "enabled": true
               },
              "graphs": [{
                  "balloonText": "Logins in [[month]] <b>[[logins]]</b>",
                  "fillAlphas": 0.7,
                  "lineAlpha": 0.2,
                  "title": "logins",
                  "type": "column",
                  "stackable":false,
                  "clustered":false,
                "columnWidth":0.6,
                  "valueField": "logins"
              }, {
                  "balloonText": "Assignments done in [[month]] <b>[[assignmentsDone]]</b>",
                  "fillAlphas": 0.9,
                  "lineAlpha": 0.2,
                  "title": "assignments",
                  "type": "column",
                  "clustered":false,
                  "columnWidth":0.4,
                  "valueField": "assignmentsDone"
              }, {
                  "balloonText": "Exercises done in [[month]] <b>[[exercisesDone]]</b>",
                  "fillAlphas": 0.9,
                  "lineAlpha": 0.2,
                  "title": "exercises",
                  "type": "column",
                  "clustered":false,
                  "columnWidth":0.4,
                  "valueField": "exercisesDone"
              }],
              "categoryField": "month",
              "categoryAxis": {
                  "gridPosition": "start"
              },
              "dataProvider": data,
           "valueAxes": [{
               "stackType": "regular",
               "unit": "",
               "position": "left",
               "title": "",
           }]}
     return(
       <AmCharts.React   className="my-class"
        style={{
        width: "90%",
        height: "400px"
        }} options={config} />
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