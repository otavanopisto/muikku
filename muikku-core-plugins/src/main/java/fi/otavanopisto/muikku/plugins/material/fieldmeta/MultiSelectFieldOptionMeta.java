package fi.otavanopisto.muikku.plugins.material.fieldmeta;

public class MultiSelectFieldOptionMeta {

  public MultiSelectFieldOptionMeta() {

  }

  public MultiSelectFieldOptionMeta(String name, String text, Boolean correct) {
    this.name = name;
    this.text = text;
    this.correct = correct;
  }

  public String getName() {
    return name;
  }

  public String getText() {
    return text;
  }

  public Boolean getCorrect() {
    return correct;
  }

  public void setCorrect(Boolean correct) {
    this.correct = correct;
  }

  private String name;
  private String text;
  private Boolean correct;

}