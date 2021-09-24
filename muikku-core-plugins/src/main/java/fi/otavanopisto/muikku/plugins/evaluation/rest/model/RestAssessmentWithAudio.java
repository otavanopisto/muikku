package fi.otavanopisto.muikku.plugins.evaluation.rest.model;

import java.util.Date;
import java.util.List;

public class RestAssessmentWithAudio extends RestAssessment {
  
  public RestAssessmentWithAudio() {
  }

  public RestAssessmentWithAudio(String identifier, String assessorIdentifier, String gradingScaleIdentifier, String gradeIdentifier, String verbalAssessment, Date assessmentDate, Boolean passing, List<AudioAssessment> audioAssessments) {
    super(identifier, assessorIdentifier, gradingScaleIdentifier, gradeIdentifier, verbalAssessment, assessmentDate, passing);
    this.audioAssessments = audioAssessments;
  }

  public List<AudioAssessment> getAudioAssessments() {
    return audioAssessments;
  }

  public void setAudioAssessments(List<AudioAssessment> audioAssessments) {
    this.audioAssessments = audioAssessments;
  }

  private List<AudioAssessment> audioAssessments;
  
  public static class AudioAssessment {

    public AudioAssessment() {
    }
    
    public AudioAssessment(String id, String name, String contentType) {
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
}
