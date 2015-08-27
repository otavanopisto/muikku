package fi.muikku.plugins.communicator;

import java.util.List;
import java.util.Locale;

import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.i18n.LocaleController;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.muikku.model.workspace.WorkspaceUserEntity;
import fi.muikku.plugins.assessmentrequest.AssessmentRequestController;
import fi.muikku.plugins.communicator.model.CommunicatorMessage;
import fi.muikku.plugins.communicator.model.CommunicatorMessageId;
import fi.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.entity.User;
import fi.muikku.schooldata.entity.Workspace;
import fi.muikku.schooldata.entity.WorkspaceAssessmentRequest;
import fi.muikku.session.SessionController;
import fi.muikku.session.local.LocalSession;
import fi.muikku.users.UserController;
import fi.muikku.users.WorkspaceUserEntityController;

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
  
  @Inject
  private WorkspaceUserEntityController workspaceUserController;
  
  @Inject
  private AssessmentRequestController assessmentRequestController;
  
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
  
  private String assessmentCancelledTitle(WorkspaceEntity workspaceEntity, UserEntity student) {
    User user = userController.findUserByUserEntityDefaults(student);
    String userName = user.getDisplayName();
    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
    String workspaceName = workspace.getName();
    
    return getText("plugin.communicator.assessmentrequest.title.cancelled", userName, workspaceName);
  }
  
  private String assessmentRequestBody(WorkspaceEntity workspaceEntity, UserEntity student, String message) {
    User user = userController.findUserByUserEntityDefaults(student);
    String userName = user.getDisplayName();
    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
    String workspaceName = workspace.getName();
    
    return getText("plugin.communicator.assessmentrequest.body", userName, workspaceName, message);
  }
  
  private String assessmentCancelledBody(WorkspaceEntity workspaceEntity, UserEntity student) {
    User user = userController.findUserByUserEntityDefaults(student);
    String userName = user.getDisplayName();
    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
    String workspaceName = workspace.getName();
    
    return getText("plugin.communicator.assessmentrequest.body.cancelled", userName, workspaceName);
  }

  public CommunicatorMessage sendAssessmentRequestMessage(WorkspaceAssessmentRequest assessmentRequest) {
    WorkspaceUserEntity workspaceUserEntity = workspaceUserController.findWorkspaceUserEntityByIdentifier(assessmentRequest.getWorkspaceUserIdentifier());
    
    UserEntity student = workspaceUserEntity.getUserSchoolDataIdentifier().getUserEntity();
    WorkspaceEntity workspaceEntity = workspaceUserEntity.getWorkspaceEntity();
    
    CommunicatorMessageId communicatorMessageId = assessmentRequestController.findCommunicatorMessageId(workspaceUserEntity);
    
    schoolDataBridgeSessionController.startSystemSession();
    try {
      List<UserEntity> teachers = workspaceController.listUserEntitiesByWorkspaceEntityAndRoleArchetype(
          workspaceEntity, WorkspaceRoleArchetype.TEACHER);
      
      if (communicatorMessageId != null) {
        return communicatorController.replyToMessage(student,
            getText("plugin.communicator.assessmentrequest.category"),
            assessmentRequestTitle(workspaceEntity, student),
            assessmentRequestBody(workspaceEntity, student, assessmentRequest.getRequestText()), teachers,
            communicatorMessageId);
      } else {
        CommunicatorMessage postMessage = communicatorController.postMessage(student, getText("plugin.communicator.assessmentrequest.category"),
            assessmentRequestTitle(workspaceEntity, student),
            assessmentRequestBody(workspaceEntity, student, assessmentRequest.getRequestText()), teachers);
        
        assessmentRequestController.setCommunicatorMessageId(assessmentRequest, postMessage.getCommunicatorMessageId());

        return postMessage;
      }
    } finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
  }
  
  public void sendAssessmentRequestCancelledMessage(WorkspaceUserEntity workspaceUserEntity) {
    UserEntity student = workspaceUserEntity.getUserSchoolDataIdentifier().getUserEntity();
    WorkspaceEntity workspaceEntity = workspaceUserEntity.getWorkspaceEntity();
    CommunicatorMessageId communicatorMessageId = assessmentRequestController.findCommunicatorMessageId(workspaceUserEntity);
    
    if (communicatorMessageId == null)
      communicatorMessageId = communicatorController.createMessageId();

    schoolDataBridgeSessionController.startSystemSession();
    try {
        List<UserEntity> teachers = workspaceController.listUserEntitiesByWorkspaceEntityAndRoleArchetype(
            workspaceEntity,
            WorkspaceRoleArchetype.TEACHER);
        communicatorController.replyToMessage(student,
                                           getText("plugin.communicator.assessmentrequest.category"),
                                           assessmentCancelledTitle(workspaceEntity, student),
                                           assessmentCancelledBody(workspaceEntity, student),
                                           teachers,
                                           communicatorMessageId);
    } finally {
        schoolDataBridgeSessionController.endSystemSession();
    }
  }
  
}
