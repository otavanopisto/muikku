package fi.otavanopisto.muikku.plugins.material.fieldmeta;

public class SelectFieldOptionMeta {
  
  public SelectFieldOptionMeta() {
    
  }
  
  public SelectFieldOptionMeta(String name, Boolean correct, String text) {
    this.name = name;
    this.correct = correct;
    this.text = text;
  }
  
  public void setName(String name) {
    this.name = name;
  }

  public String getName() {
    return name;
  }

  public Boolean getCorrect() {
    return correct;
  }
  
  public void setCorrect(Boolean correct) {
    this.correct = correct;
  }

  public String getText() {
    return text;
  }

  private String name;
  private Boolean correct;
  private String text;
}