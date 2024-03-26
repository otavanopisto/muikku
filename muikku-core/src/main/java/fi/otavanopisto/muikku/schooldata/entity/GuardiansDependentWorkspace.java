package fi.otavanopisto.muikku.schooldata.entity;

import java.util.Date;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public interface GuardiansDependentWorkspace {

  SchoolDataIdentifier getWorkspaceIdentifier();
  SchoolDataIdentifier getWorkspaceUserIdentifier();

  String getWorkspaceName();
  String getWorkspaceNameExtension();
  Date getEnrolledDate();
  Date getLatestAssessmentRequestDate();
  
}
