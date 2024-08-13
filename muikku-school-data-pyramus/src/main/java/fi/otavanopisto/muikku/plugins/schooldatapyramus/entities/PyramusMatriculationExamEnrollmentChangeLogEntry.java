package fi.otavanopisto.muikku.plugins.schooldatapyramus.entities;

import java.time.OffsetDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationExamEnrollmentChangeLogEntry;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationExamEnrollmentChangeLogType;
import fi.otavanopisto.muikku.schooldata.entity.MatriculationExamEnrollmentState;

@JsonIgnoreProperties(ignoreUnknown=true)
public class PyramusMatriculationExamEnrollmentChangeLogEntry
    implements MatriculationExamEnrollmentChangeLogEntry {

  @Override
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }
  
  @Override
  public Long getEnrollmentId() {
    return enrollmentId;
  }

  public void setEnrollmentId(Long enrollmentId) {
    this.enrollmentId = enrollmentId;
  }

  @Override
  public OffsetDateTime getTimestamp() {
    return timestamp;
  }

  public void setTimestamp(OffsetDateTime timestamp) {
    this.timestamp = timestamp;
  }

  @Override
  public MatriculationExamEnrollmentChangeLogType getChangeType() {
    return changeType;
  }

  public void setChangeType(MatriculationExamEnrollmentChangeLogType changeType) {
    this.changeType = changeType;
  }

  @Override
  public MatriculationExamEnrollmentState getNewState() {
    return newState;
  }

  public void setNewState(MatriculationExamEnrollmentState newState) {
    this.newState = newState;
  }

  @Override
  public SchoolDataIdentifier getModifierIdentifier() {
    return modifierIdentifier;
  }

  public void setModifierIdentifier(SchoolDataIdentifier modifierIdentifier) {
    this.modifierIdentifier = modifierIdentifier;
  }

  private Long id;
  private Long enrollmentId;
  private SchoolDataIdentifier modifierIdentifier;
  private OffsetDateTime timestamp;
  private MatriculationExamEnrollmentChangeLogType changeType;
  private MatriculationExamEnrollmentState newState;
}
