package fi.otavanopisto.muikku.plugins.transcriptofrecords.rest;

public class MatriculationEligibilityRESTModel {
	
	public MatriculationExamEligibilityStatus getStatus() {
		return status;
	}
	public void setStatus(MatriculationExamEligibilityStatus status) {
		this.status = status;
	}
	public int getCoursesCompleted() {
		return coursesCompleted;
	}
	public void setCoursesCompleted(int coursesCompleted) {
		this.coursesCompleted = coursesCompleted;
	}
	public int getCoursesRequired() {
		return coursesRequired;
	}
	public void setCoursesRequired(int coursesRequired) {
		this.coursesRequired = coursesRequired;
	}
	public String getEnrollmentDate() {
		return enrollmentDate;
	}
	public void setEnrollmentDate(String enrollmentDate) {
		this.enrollmentDate = enrollmentDate;
	}
	public String getExamDate() {
		return examDate;
	}
	public void setExamDate(String examDate) {
		this.examDate = examDate;
	}
	private MatriculationExamEligibilityStatus status;
	private int coursesCompleted;
	private int coursesRequired;
	private String enrollmentDate;
	private String examDate;

}
