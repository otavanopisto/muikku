package fi.otavanopisto.muikku.plugins.evaluation.rest.model;

public class RESTGrade {

  public String getScaleIdentifier() {
    return scaleIdentifier;
  }

  public void setScaleIdentifier(String scaleIdentifier) {
    this.scaleIdentifier = scaleIdentifier;
  }

  public String getScaleName() {
    return scaleName;
  }

  public void setScaleName(String scaleName) {
    this.scaleName = scaleName;
  }

  public String getGradeName() {
    return gradeName;
  }

  public void setGradeName(String gradeName) {
    this.gradeName = gradeName;
  }

  public String getGradeIdentifier() {
    return gradeIdentifier;
  }

  public void setGradeIdentifier(String gradeIdentifier) {
    this.gradeIdentifier = gradeIdentifier;
  }

  public String getDataSource() {
    return dataSource;
  }

  public void setDataSource(String dataSource) {
    this.dataSource = dataSource;
  }

  private String dataSource;
  private String scaleIdentifier;
  private String scaleName;
  private String gradeIdentifier;
  private String gradeName;

}
