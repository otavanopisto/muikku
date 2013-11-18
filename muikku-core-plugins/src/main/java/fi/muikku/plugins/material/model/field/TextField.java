package fi.muikku.plugins.material.model.field;

 import java.util.List;

public class TextField {
  
  public static class RightAnswer {
    
    public RightAnswer(double points, String text, boolean caseSensitive, boolean normalizeWhitespace) {
      this.points = points;
      this.text = text;
      this.caseSensitive = caseSensitive;
      this.normalizeWhitespace = normalizeWhitespace;
    }

    public double getPoints() {
      return points;
    }
    public void setPoints(double points) {
      this.points = points;
    }
    
    public String getText() {
      return text;
    }
    public void setText(String text) {
      this.text = text;
    }
    
    public boolean isCaseSensitive() {
      return caseSensitive;
    }
    public void setCaseSensitive(boolean caseSensitive) {
      this.caseSensitive = caseSensitive;
    }
    
    public boolean isNormalizeWhitespace() {
      return normalizeWhitespace;
    }

    public void setNormalizeWhitespace(boolean normalizeWhitespace) {
      this.normalizeWhitespace = normalizeWhitespace;
    }

    private double points;
    private String text;
    private boolean caseSensitive;
    private boolean normalizeWhitespace;
  }

  public TextField(List<RightAnswer> rightAnswers) {
    this.setRightAnswers(rightAnswers);
  }
  
  public List<RightAnswer> getRightAnswers() {
    return rightAnswers;
  }

  public void setRightAnswers(List<RightAnswer> rightAnswers) {
    this.rightAnswers = rightAnswers;
  }

  private List<RightAnswer> rightAnswers;
  
}
