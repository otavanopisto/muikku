package fi.muikku.plugins.communicator;

import java.util.List;

import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.muikku.schooldata.WorkspaceController;

@Dependent
public class CommunicatorAssessmentRequestController {
  
  @Inject
  private WorkspaceController workspaceController;

  @Inject
  private CommunicatorController communicatorController;
  
  public void sendAssessmentRequestMessage(WorkspaceEntity workspaceEntity, UserEntity student, String message) {
    List<UserEntity> teachers = workspaceController.listUserEntitiesByWorkspaceEntityAndRoleArchetype(
        workspaceEntity,
        WorkspaceRoleArchetype.TEACHER);
    communicatorController.postMessage(student,
                                       "LOCALIZE: Assessment Requests",
                                       "LOCALIZE: Assessment Request (TODO more info)",
                                       "LOCALIZE: Assessment Request (TODO more info)",
                                       teachers);
  }
}
