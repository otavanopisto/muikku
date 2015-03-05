package fi.muikku.plugins.communicator;

import java.util.List;
import java.util.Locale;

import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import org.hibernate.annotations.Synchronize;

import fi.muikku.i18n.LocaleController;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.entity.User;
import fi.muikku.schooldata.entity.Workspace;
import fi.muikku.session.SessionController;
import fi.muikku.session.local.LocalSession;
import fi.muikku.users.UserController;

@Dependent
public class CommunicatorAssessmentRequestController {
  
  @Inject
  private WorkspaceController workspaceController;

  @Inject
  private CommunicatorController communicatorController;
  
  @Inject
  private LocaleController localeController;
  
  @LocalSession
  @Inject
  private SessionController sessionController;
  
  @Inject
  private UserController userController;
  
  @Inject
  private SchoolDataBridgeSessionController schoolDataBridgeSessionController;
  
  private String getText(String key, Object... params) {
    Locale locale = sessionController.getLocale();
    return localeController.getText(locale, key, params);
  }

  private String assessmentRequestTitle(WorkspaceEntity workspaceEntity, UserEntity student) {
    User user = userController.findUserByUserEntityDefaults(student);
    String userName = user.getDisplayName();
    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
    String workspaceName = workspace.getName();
    
    return getText("plugin.communicator.assessmentrequest.title", userName, workspaceName);
  }
  
  private String assessmentRequestBody(WorkspaceEntity workspaceEntity, UserEntity student, String message) {
    User user = userController.findUserByUserEntityDefaults(student);
    String userName = user.getDisplayName();
    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
    String workspaceName = workspace.getName();
    
    return getText("plugin.communicator.assessmentrequest.body", userName, workspaceName, message);
  }

  
  public void sendAssessmentRequestMessage(WorkspaceEntity workspaceEntity, UserEntity student, String message) {
    schoolDataBridgeSessionController.startSystemSession();
    try {
        List<UserEntity> teachers = workspaceController.listUserEntitiesByWorkspaceEntityAndRoleArchetype(
            workspaceEntity,
            WorkspaceRoleArchetype.TEACHER);
        communicatorController.postMessage(student,
                                           getText("plugin.communicator.assessmentrequest.category"),
                                           assessmentRequestTitle(workspaceEntity, student),
                                           assessmentRequestBody(workspaceEntity, student, message),
                                           teachers);
    } finally {
        schoolDataBridgeSessionController.endSystemSession();
    }
  }
}
