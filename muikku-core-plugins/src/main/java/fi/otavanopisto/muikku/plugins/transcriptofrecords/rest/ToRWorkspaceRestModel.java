package fi.otavanopisto.muikku.plugins.transcriptofrecords.rest;

import java.util.Date;
import java.util.List;
import java.util.Set;

import fi.otavanopisto.muikku.model.workspace.Mandatority;
import fi.otavanopisto.muikku.model.workspace.WorkspaceAccess;
import fi.otavanopisto.muikku.plugins.guider.GuiderStudentWorkspaceActivityRestModel;
import fi.otavanopisto.muikku.plugins.workspace.rest.model.Workspace;
import fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceSubjectRestModel;

public class ToRWorkspaceRestModel extends Workspace {

  public ToRWorkspaceRestModel() {
  }

  public ToRWorkspaceRestModel(
      Long id,
      Long organizationEntityId,
      String urlName,
      WorkspaceAccess access,
      Boolean archived,
      Boolean published,
      String name,
      String nameExtension,
      String description,
      String materialDefaultLicense,
      Mandatority mandatority,
      Long numVisits,
      Date lastVisit,
      Set<String> curriculumIdentifiers,
      boolean hasCustomImage, 
      List<WorkspaceSubjectRestModel> subjects, 
      GuiderStudentWorkspaceActivityRestModel activity) {
    super(
        id, 
        organizationEntityId, 
        urlName, 
        access, 
        archived, 
        published, 
        name, 
        nameExtension, 
        description, 
        materialDefaultLicense, 
        mandatority,
        numVisits, 
        lastVisit, 
        curriculumIdentifiers,
        hasCustomImage);
    this.setSubjects(subjects);
    this.activity = activity;
  }

  public GuiderStudentWorkspaceActivityRestModel getActivity() {
    return activity;
  }

  public void setActivity(GuiderStudentWorkspaceActivityRestModel activity) {
    this.activity = activity;
  }

  public List<WorkspaceSubjectRestModel> getSubjects() {
    return subjects;
  }

  public void setSubjects(List<WorkspaceSubjectRestModel> subjects) {
    this.subjects = subjects;
  }

  private List<WorkspaceSubjectRestModel> subjects;
  private GuiderStudentWorkspaceActivityRestModel activity;
}
