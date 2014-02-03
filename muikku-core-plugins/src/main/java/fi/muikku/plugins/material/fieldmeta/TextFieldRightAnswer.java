package fi.muikku.plugins.material.fieldmeta;

public class TextFieldRightAnswer {

  public TextFieldRightAnswer() {

  }

  public TextFieldRightAnswer(Double points, String text, boolean caseSensitive, boolean normalizeWhitespace) {
    this.points = points;
    this.text = text;
    this.caseSensitive = caseSensitive;
    this.normalizeWhitespace = normalizeWhitespace;
  }

  public Double getPoints() {
    return points;
  }

  public void setPoints(Double points) {
    this.points = points;
  }

  public String getText() {
    return text;
  }

  public void setText(String text) {
    this.text = text;
  }

  public Boolean isCaseSensitive() {
    return caseSensitive;
  }

  public void setCaseSensitive(Boolean caseSensitive) {
    this.caseSensitive = caseSensitive;
  }

  public Boolean isNormalizeWhitespace() {
    return normalizeWhitespace;
  }

  public void setNormalizeWhitespace(Boolean normalizeWhitespace) {
    this.normalizeWhitespace = normalizeWhitespace;
  }

  private Double points;
  private String text;
  private Boolean caseSensitive;
  private Boolean normalizeWhitespace;
}