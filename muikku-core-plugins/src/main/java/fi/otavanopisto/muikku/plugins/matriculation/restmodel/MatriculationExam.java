package fi.otavanopisto.muikku.plugins.matriculation.restmodel;

public class MatriculationExam {

  public Long getStarts() {
    return starts;
  }

  public void setStarts(Long starts) {
    this.starts = starts;
  }

  public Long getEnds() {
    return ends;
  }

  public void setEnds(Long ends) {
    this.ends = ends;
  }

  private Long starts;
  private Long ends;

}

