package fi.otavanopisto.muikku.plugins.schooldatapyramus.entities;

import java.time.OffsetDateTime;
import java.util.Date;
import java.util.List;
import java.util.Set;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.AbstractWorkspace;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceSubject;

public class PyramusWorkspace extends AbstractWorkspace {
  
  public PyramusWorkspace() {
    super();
  }

  public PyramusWorkspace(SchoolDataIdentifier identifier, String name, String nameExtension, String viewLink,
      SchoolDataIdentifier workspaceTypeId, String description, SchoolDataIdentifier educationTypeIdentifier, Date modified, 
      OffsetDateTime beginDate, OffsetDateTime endDate, OffsetDateTime signupStart, OffsetDateTime signupEnd, boolean archived, Set<SchoolDataIdentifier> curriculumIdentifiers, 
      SchoolDataIdentifier educationSubtypeIdentifier, SchoolDataIdentifier organizationIdentifier,
      boolean isTemplate, List<WorkspaceSubject> subjects) {
    super(identifier, name, nameExtension, viewLink, workspaceTypeId, description,
        educationTypeIdentifier, modified, beginDate, endDate, signupStart, signupEnd, archived,
        curriculumIdentifiers, educationSubtypeIdentifier, organizationIdentifier, isTemplate, subjects);
  }

}
