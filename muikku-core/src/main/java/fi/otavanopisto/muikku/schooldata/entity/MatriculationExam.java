package fi.otavanopisto.muikku.schooldata.entity;

import java.time.LocalDate;

public interface MatriculationExam {
  long getId();
  Integer getYear();
  MatriculationExamTerm getTerm();
  LocalDate getStarts();
  LocalDate getEnds();
  LocalDate getConfirmDate();
  boolean isCompulsoryEducationEligible();
  MatriculationExamStudentStatus getStudentStatus();
  MatriculationExamEnrollment getEnrollment();
}
