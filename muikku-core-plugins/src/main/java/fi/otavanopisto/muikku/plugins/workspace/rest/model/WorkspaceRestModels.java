package fi.otavanopisto.muikku.plugins.workspace.rest.model;

import javax.inject.Inject;

import fi.otavanopisto.muikku.schooldata.CourseMetaController;
import fi.otavanopisto.muikku.schooldata.entity.CourseLengthUnit;
import fi.otavanopisto.muikku.schooldata.entity.Subject;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceSubject;

public class WorkspaceRestModels {

  @Inject
  private CourseMetaController courseMetaController;
  
  public WorkspaceSubjectRestModel toRestModel(WorkspaceSubject workspaceSubject) {
    Subject subjectObject = courseMetaController.findSubject(workspaceSubject.getSubjectIdentifier());
    SubjectRestModel subject = subjectObject != null ? new SubjectRestModel(subjectObject.getIdentifier(), subjectObject.getName(), subjectObject.getCode()) : null;

    WorkspaceLengthUnitRestModel workspaceLengthUnit = null;
    if ((workspaceSubject.getLength() != null) && (workspaceSubject.getLengthUnitIdentifier() != null)) {
      CourseLengthUnit lengthUnit = courseMetaController.findCourseLengthUnit(workspaceSubject.getLengthUnitIdentifier());
      workspaceLengthUnit = lengthUnit != null ? new WorkspaceLengthUnitRestModel(lengthUnit.getIdentifier(), lengthUnit.getSymbol(), lengthUnit.getName()) : null;
    }

    return new WorkspaceSubjectRestModel(workspaceSubject.getIdentifier(), subject, workspaceSubject.getLength(), workspaceLengthUnit);
  }
  
}
