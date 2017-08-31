package fi.otavanopisto.muikku.plugins.transcriptofrecords;

import java.util.Set;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public class VopsWorkspace {
  
  public VopsWorkspace(
      SchoolDataIdentifier workspaceIdentifier,
      SchoolDataIdentifier educationSubtypeIdentifier,
      Set<SchoolDataIdentifier> curriculumIdentifiers,
      String name,
      String description
  ) {
    this.workspaceIdentifier = workspaceIdentifier;
    this.educationSubtypeIdentifier = educationSubtypeIdentifier;
    this.curriculumIdentifiers = curriculumIdentifiers;
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
  
  public Set<SchoolDataIdentifier> getCurriculumIdentifiers() {
    return curriculumIdentifiers;
  }
  
  private final SchoolDataIdentifier workspaceIdentifier;
  private final SchoolDataIdentifier educationSubtypeIdentifier;
  private final Set<SchoolDataIdentifier> curriculumIdentifiers;
  private final String name;
  private final String description;
}
