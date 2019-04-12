package fi.otavanopisto.muikku.plugins.matriculation;

public class MatriculationCurrentExam {

  public MatriculationCurrentExam() {
  }
  
  public MatriculationCurrentExam(long starts, long ends, boolean eligible) {
    this.starts = starts;
    this.ends = ends;
    this.eligible = eligible;
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

  private long starts;
  private long ends;
  private boolean eligible;
}
