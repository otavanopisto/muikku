package fi.otavanopisto.muikku.plugins.evaluation.rest.model;

import java.util.List;
import java.util.Date;

public class WorkspaceAssessments {
	private String assessmentState;
	private Date assessmentStateDate;
	private List<WorkspaceAssessment> assessments;

	public WorkspaceAssessments(){}
	
	public WorkspaceAssessments(String assessmentState, Date assessmentStateDate, List<WorkspaceAssessment> assessments) {
		this.setAssessmentState(assessmentState);
	 	this.setAssessmentStateDate(assessmentStateDate);
     	this.setAssessments(assessments);
	}

	public List<WorkspaceAssessment> getAssessments() {
		return assessments;
	}

	public void setAssessments(List<WorkspaceAssessment> assessments) {
		this.assessments = assessments;
	}

	public Date getAssessmentStateDate() {
		return assessmentStateDate;
	}

	public void setAssessmentStateDate(Date assessmentStateDate) {
		this.assessmentStateDate = assessmentStateDate;
	}

	public String getAssessmentState() {
		return assessmentState;
	}

	public void setAssessmentState(String assessmentState) {
		this.assessmentState = assessmentState;
	}
}