package fi.otavanopisto.muikku.schooldata.entity;

public interface MatriculationExam {
  long getId();
  Integer getYear();
  MatriculationExamTerm getTerm();
  long getStarts();
  long getEnds();
  boolean isCompulsoryEducationEligible();
  MatriculationExamStudentStatus getStudentStatus();
  MatriculationExamEnrollment getEnrollment();
}
