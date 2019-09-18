package fi.otavanopisto.muikku.schooldata.entity;

public interface MatriculationExam {
  public long getId();
  public long getStarts();
  public long getEnds();
  public boolean isEligible();
  public boolean isEnrolled();
}
