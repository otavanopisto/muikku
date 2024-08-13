package fi.otavanopisto.muikku.schooldata.entity;

import java.time.OffsetDateTime;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public interface MatriculationExamEnrollmentChangeLogEntry {

  Long getId();
  Long getEnrollmentId();
  SchoolDataIdentifier getModifierIdentifier();
  OffsetDateTime getTimestamp();
  MatriculationExamEnrollmentChangeLogType getChangeType();
  MatriculationExamEnrollmentState getNewState();
}
