package fi.otavanopisto.muikku.plugins.matriculation;

public class MatriculationCurrentExam {

  public MatriculationCurrentExam() {
  }
  
  public MatriculationCurrentExam(long id, long starts, long ends, boolean eligible, boolean enrolled) {
    this.id = id;
    this.starts = starts;
    this.ends = ends;
    this.eligible = eligible;
    this.enrolled = enrolled;
  }

  public long getStarts() {
    return starts;
  }
  
  public void setStarts(long starts) {
    this.starts = starts;
  }

  public long getEnds() {
    return ends;
  }

  public void setEnds(long ends) {
    this.ends = ends;
  }

  public boolean isEligible() {
    return eligible;
  }

  public void setEligible(boolean eligible) {
    this.eligible = eligible;
  }

  public long getId() {
    return id;
  }

  public void setId(long id) {
    this.id = id;
  }

  public boolean isEnrolled() {
    return enrolled;
  }

  public void setEnrolled(boolean enrolled) {
    this.enrolled = enrolled;
  }

  private long id;
  private long starts;
  private long ends;
  private boolean eligible;
  private boolean enrolled;
}
