package fi.otavanopisto.muikku.plugins.schooldatapyramus.entities;

import java.util.Date;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.GuardiansDependentWorkspace;

public class PyramusGuardiansDependentWorkspace implements GuardiansDependentWorkspace {

  public PyramusGuardiansDependentWorkspace(SchoolDataIdentifier workspaceIdentifier, SchoolDataIdentifier workspaceUserIdentifier,
      String workspaceName, String workspaceNameExtension, Date enrolledDate, Date latestAssessmentRequestDate) {
    this.workspaceIdentifier = workspaceIdentifier;
    this.workspaceUserIdentifier = workspaceUserIdentifier;
    this.workspaceName = workspaceName;
    this.workspaceNameExtension = workspaceNameExtension;
    this.enrolledDate = enrolledDate;
    this.latestAssessmentRequestDate = latestAssessmentRequestDate;
  }

  @Override
  public SchoolDataIdentifier getWorkspaceIdentifier() {
    return workspaceIdentifier;
  }

  @Override
  public SchoolDataIdentifier getWorkspaceUserIdentifier() {
    return workspaceUserIdentifier;
  }

  @Override
  public String getWorkspaceName() {
    return workspaceName;
  }

  @Override
  public String getWorkspaceNameExtension() {
    return workspaceNameExtension;
  }

  @Override
  public Date getEnrolledDate() {
    return enrolledDate;
  }

  @Override
  public Date getLatestAssessmentRequestDate() {
    return latestAssessmentRequestDate;
  }

  private final SchoolDataIdentifier workspaceIdentifier;
  private final SchoolDataIdentifier workspaceUserIdentifier;
  private final String workspaceName;
  private final String workspaceNameExtension;
  private final Date enrolledDate;
  private final Date latestAssessmentRequestDate;
}
