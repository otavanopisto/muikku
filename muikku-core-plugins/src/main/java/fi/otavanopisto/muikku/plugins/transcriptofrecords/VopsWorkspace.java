package fi.otavanopisto.muikku.plugins.transcriptofrecords;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public class VopsWorkspace {
  
  public VopsWorkspace(SchoolDataIdentifier workspaceIdentifier, SchoolDataIdentifier educationSubtypeIdentifier) {
    this.workspaceIdentifier = workspaceIdentifier;
    this.educationSubtypeIdentifier = educationSubtypeIdentifier;
  }
  
  public SchoolDataIdentifier getWorkspaceIdentifier() {
    return workspaceIdentifier;
  }

  public SchoolDataIdentifier getEducationSubtypeIdentifier() {
    return educationSubtypeIdentifier;
  }

  private final SchoolDataIdentifier workspaceIdentifier;
  private final SchoolDataIdentifier educationSubtypeIdentifier;
}
