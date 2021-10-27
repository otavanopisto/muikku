package fi.otavanopisto.muikku.plugins.evaluation.rest.model;

public class RestAssignmentEvaluationAudioClip {

  public RestAssignmentEvaluationAudioClip() {
  }
  
  public RestAssignmentEvaluationAudioClip(String id, String name, String contentType) {
    this.id = id;
    this.name = name;
    this.contentType = contentType;
  }
  
  public String getId() {
    return id;
  }
  
  public void setId(String id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getContentType() {
    return contentType;
  }

  public void setContentType(String contentType) {
    this.contentType = contentType;
  }

  private String id;
  private String name;
  private String contentType;
}
