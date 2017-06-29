package fi.otavanopisto.muikku.plugins.transcriptofrecords;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public class VopsWorkspace {
  
  public VopsWorkspace(
      SchoolDataIdentifier workspaceIdentifier,
      SchoolDataIdentifier educationSubtypeIdentifier,
      String name,
      String description
  ) {
    this.workspaceIdentifier = workspaceIdentifier;
    this.educationSubtypeIdentifier = educationSubtypeIdentifier;
    this.name = name;
    this.description = description;
  }
  
  public SchoolDataIdentifier getWorkspaceIdentifier() {
    return workspaceIdentifier;
  }

  public SchoolDataIdentifier getEducationSubtypeIdentifier() {
    return educationSubtypeIdentifier;
  }
  
  public String getName() {
    return name;
  }
  
  public String getDescription() {
    return description;
  }

  private final SchoolDataIdentifier workspaceIdentifier;
  private final SchoolDataIdentifier educationSubtypeIdentifier;
  private final String name;
  private final String description;
}
