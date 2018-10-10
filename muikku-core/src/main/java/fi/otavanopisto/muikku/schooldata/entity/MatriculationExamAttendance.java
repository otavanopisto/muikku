package fi.otavanopisto.muikku.schooldata.entity;

public interface MatriculationExamAttendance {
  public String getSubject();
  public void setSubject(String subject);
  public Boolean getMandatory();
  public void setMandatory(Boolean mandatory);
  public Boolean getRepeat();
  public void setRepeat(Boolean repeat);
  public Integer getYear();
  public void setYear(Integer year);
  public String getTerm();
  public void setTerm(String term);
  public String getStatus();
  public void setStatus(String status);
  public String getGrade();
  public void setGrade(String grade);
}
