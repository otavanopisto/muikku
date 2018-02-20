import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import { MaterialAssignmentEvaluationType, RecordsGradesType } from "~/reducers/main-function/records/records";

interface EvaluationProps {
  evaluation: MaterialAssignmentEvaluationType,
  i18n: i18nType,
  grades: RecordsGradesType
}

interface EvaluationState {
  opened: boolean
}

export default class Student extends React.Component<EvaluationProps, EvaluationState> {
  constructor(props: EvaluationProps){
    super(props);
    
    this.toggleOpened = this.toggleOpened.bind(this);
    
    this.state = {
      opened: false
    }
  }
  componentWillReceiveProps(nextProps: EvaluationProps){
    if (nextProps.evaluation.assignment.id !== this.props.evaluation.assignment.id){
      this.setState({
        opened: false
      })
    }
  }
  toggleOpened(){
    this.setState({opened: !this.state.opened})
  }
  render(){
    let evaluation = this.props.evaluation.evaluation;
    return <div className="application-list__item" onClick={this.toggleOpened}>
      <div className="application-list__item-content application-list__item-content--main">
        <div className="application-list__item-header">
          {evaluation ?
            <span title={this.props.grades[[
              evaluation.gradingScaleSchoolDataSource,
              evaluation.gradingScaleIdentifier,
              evaluation.gradeSchoolDataSource,
              evaluation.gradeIdentifier].join("-")].scale} className={`TODO tiny-block-with-score-class-name ${evaluation.grade ? "passed" : "failed"}`}>{evaluation.grade}</span>
            : <span className={`TODO tiny-block-when-no-score`}>N</span>}
          
          {this.props.evaluation.assignment.title}
        </div>
        {this.state.opened ? <div className="application-list__item-body">
          TODO SOME VERY COMPLEX SHIT
        </div> : null}
      </div>
    </div>
  }
}