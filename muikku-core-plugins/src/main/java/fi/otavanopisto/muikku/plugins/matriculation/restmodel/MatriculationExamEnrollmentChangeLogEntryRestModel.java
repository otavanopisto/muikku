package fi.otavanopisto.muikku.plugins.matriculation.restmodel;

import java.time.OffsetDateTime;

import fi.otavanopisto.muikku.rest.model.UserBasicInfo;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationExamEnrollmentChangeLogType;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationExamEnrollmentState;

public class MatriculationExamEnrollmentChangeLogEntryRestModel {

  public OffsetDateTime getTimestamp() {
    return timestamp;
  }
  
  public void setTimestamp(OffsetDateTime timestamp) {
    this.timestamp = timestamp;
  }
  
  public MatriculationExamEnrollmentChangeLogType getChangeType() {
    return changeType;
  }
  
  public void setChangeType(MatriculationExamEnrollmentChangeLogType changeType) {
    this.changeType = changeType;
  }
  
  public MatriculationExamEnrollmentState getNewState() {
    return newState;
  }
  
  public void setNewState(MatriculationExamEnrollmentState newState) {
    this.newState = newState;
  }
  
  public UserBasicInfo getModifier() {
    return modifier;
  }

  public void setModifier(UserBasicInfo modifier) {
    this.modifier = modifier;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  private UserBasicInfo modifier;
  private OffsetDateTime timestamp;
  private MatriculationExamEnrollmentChangeLogType changeType;
  private MatriculationExamEnrollmentState newState;
  private String message;
}
