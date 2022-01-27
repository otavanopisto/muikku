package fi.otavanopisto.muikku.plugins.transcriptofrecords.rest;

import java.util.Date;
import java.util.Set;

import fi.otavanopisto.muikku.model.workspace.WorkspaceAccess;
import fi.otavanopisto.muikku.plugins.guider.GuiderStudentWorkspaceActivityRestModel;
import fi.otavanopisto.muikku.plugins.workspace.rest.model.Workspace;

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
      Long numVisits,
      Date lastVisit,
      Set<String> curriculumIdentifiers,
      boolean hasCustomImage, 
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
        numVisits, 
        lastVisit, 
        curriculumIdentifiers,
        hasCustomImage);
    this.activity = activity;
  }

  public GuiderStudentWorkspaceActivityRestModel getActivity() {
    return activity;
  }

  public void setActivity(GuiderStudentWorkspaceActivityRestModel activity) {
    this.activity = activity;
  }

  private GuiderStudentWorkspaceActivityRestModel activity;
}
