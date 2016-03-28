package fi.otavanopisto.muikku.plugins.dnm.parser.content;

public class ConnectFieldOption {
  
  public ConnectFieldOption(String answer, String equivalent, String term, Double points) {
    this.answer = answer;
    this.equivalent = equivalent;
    this.term = term;
    this.points = points;
  }

  public String getAnswer() {
    return answer;
  }
  
  public void setEquivalent(String equivalent) {
    this.equivalent = equivalent;
  }

  public String getEquivalent() {
    return equivalent;
  }
  
  public void setTerm(String term) {
    this.term = term;
  }
  
  public String getTerm() {
    return term;
  }
  
  public Double getPoints() {
    return points;
  }
  
  private String answer;
  private String equivalent;
  private String term;
  private Double points;

}
