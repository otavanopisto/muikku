package fi.otavanopisto.muikku.plugins.matriculation.restmodel;

public class MatriculationPlanSubjectRESTModel {

  public MatriculationPlanSubjectRESTModel() {
  }

  public String getSubject() {
    return subject;
  }
  public void setSubject(String subject) {
    this.subject = subject;
  }

  public String getTerm() {
    return term;
  }

  public void setTerm(String term) {
    this.term = term;
  }

  public Integer getYear() {
    return year;
  }

  public void setYear(Integer year) {
    this.year = year;
  }

  private String subject;
  private String term;
  private Integer year;
}
