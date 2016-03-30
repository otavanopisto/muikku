package fi.otavanopisto.muikku.plugins.material.fieldmeta;

public class TextFieldRightAnswer {

  public TextFieldRightAnswer() {

  }

  public TextFieldRightAnswer(String text, boolean caseSensitive, boolean normalizeWhitespace, boolean correct) {
    this.text = text;
    this.caseSensitive = caseSensitive;
    this.normalizeWhitespace = normalizeWhitespace;
    this.setCorrect(correct);
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

  public Boolean getCorrect() {
    return correct;
  }

  public void setCorrect(Boolean correct) {
    this.correct = correct;
  }

  private String text;
  private Boolean caseSensitive;
  private Boolean normalizeWhitespace;
  private Boolean correct;
}