package fi.otavanopisto.muikku.schooldata.entity;

public interface MatriculationExam {
  long getId();
  long getStarts();
  long getEnds();
  boolean isEligible();
  boolean isEnrolled();
  long getEnrollmentDate();
  boolean isCompulsoryEducationEligible();
}
