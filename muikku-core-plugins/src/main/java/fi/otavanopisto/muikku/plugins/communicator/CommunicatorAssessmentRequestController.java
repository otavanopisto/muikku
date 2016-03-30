package fi.otavanopisto.muikku.plugins.communicator;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.logging.Logger;

import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.i18n.LocaleController;
import fi.otavanopisto.muikku.mail.MailType;
import fi.otavanopisto.muikku.mail.Mailer;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.plugins.assessmentrequest.AssessmentRequestController;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessage;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageId;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.Workspace;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessmentRequest;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.session.local.LocalSession;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserEmailEntityController;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;

public class CommunicatorAssessmentRequestController {
  
  @Inject
  private Logger logger;

  @Inject
  private Mailer mailer;

  @Inject
  private UserEmailEntityController userEmailEntityController;
  
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
  private WorkspaceUserEntityController workspaceUserEntityController;
  
  @Inject
  private AssessmentRequestController assessmentRequestController;
  
  private String getText(String key, Object... params) {
    // TODO: Shouldn't we use recipient's locale - not the sender's locale?
    Locale locale = sessionController.getLocale();
    return localeController.getText(locale, key, params);
  }

  private String assessmentRequestTitle(Workspace workspace, User user) {
    String userName = user.getDisplayName();
    String workspaceName = getWorkspaceDisplayName(workspace);
    
    return getText("plugin.communicator.assessmentrequest.title", userName, workspaceName);
  }
  
  private String assessmentCancelledTitle(Workspace workspace, User user) {
    String userName = user.getDisplayName();
    String workspaceName = getWorkspaceDisplayName(workspace);
    
    return getText("plugin.communicator.assessmentrequest.title.cancelled", userName, workspaceName);
  }
  
  private String assessmentRequestBody(Workspace workspace, User user, String message) {
    String userName = user.getDisplayName();
    String workspaceName = getWorkspaceDisplayName(workspace);
    
    return getText("plugin.communicator.assessmentrequest.body", userName, workspaceName, message);
  }
  
  private String assessmentCancelledBody(Workspace workspace, User user) {
    String userName = user.getDisplayName();
    String workspaceName = getWorkspaceDisplayName(workspace);
    
    return getText("plugin.communicator.assessmentrequest.body.cancelled", userName, workspaceName);
  }

  private String getWorkspaceDisplayName(Workspace workspace) {
    return StringUtils.isBlank(workspace.getNameExtension()) ? 
      workspace.getName() : 
      String.format("%s (%s)", workspace.getName(), workspace.getNameExtension());
  }

  public CommunicatorMessage sendAssessmentRequestMessage(WorkspaceAssessmentRequest assessmentRequest) {
    SchoolDataIdentifier workspaceUserIdentifier = new SchoolDataIdentifier(
        assessmentRequest.getWorkspaceUserIdentifier(),
        assessmentRequest.getWorkspaceUserSchoolDataSource());
    
    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserEntityByWorkspaceUserIdentifier(workspaceUserIdentifier);
    if (workspaceUserEntity == null) {
      logger.severe(String.format("Could not find workspace user entity for identifier", workspaceUserIdentifier));
      return null;
    }
    
    UserSchoolDataIdentifier userSchoolDataIdentifier = workspaceUserEntity.getUserSchoolDataIdentifier();
    if (userSchoolDataIdentifier == null) {
      logger.severe(String.format("Could not find userSchoolDataIdentifier for workspace user entity %d", workspaceUserEntity.getId()));
      return null;
    }
    
    WorkspaceEntity workspaceEntity = workspaceUserEntity.getWorkspaceEntity();
    if (workspaceEntity == null) {
      logger.severe(String.format("Could not find workspaceEntity for workspace user entity %d", workspaceUserEntity.getId()));
      return null;
    }
    
    UserEntity studentEntity = userSchoolDataIdentifier.getUserEntity();
    if (studentEntity == null) {
      logger.severe(String.format("Could not find studentEntity for workspace user entity %d", workspaceUserEntity.getId()));
      return null;
    }
    
    CommunicatorMessageId communicatorMessageId = assessmentRequestController.findCommunicatorMessageId(workspaceUserEntity);
    
    schoolDataBridgeSessionController.startSystemSession();
    try {
      SchoolDataIdentifier studentIdentifier = new SchoolDataIdentifier(userSchoolDataIdentifier.getIdentifier(), 
          userSchoolDataIdentifier.getDataSource().getIdentifier());
      
      List<UserEntity> teachers = workspaceController.listUserEntitiesByWorkspaceEntityAndRoleArchetype(
          workspaceEntity, WorkspaceRoleArchetype.TEACHER);
      
      User student = userController.findUserByIdentifier(studentIdentifier);
      if (student == null) {
        logger.severe(String.format("Could not find student %s", studentIdentifier));
        return null;
      }
      
      Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
      if (workspace == null) {
        logger.severe(String.format("Could not find workspace for workspace entity %d", workspaceEntity.getId()));
        return null;
      }
      
      String messageCategory = getText("plugin.communicator.assessmentrequest.category");
      String messageTitle = assessmentRequestTitle(workspace, student);
      String messageBody = assessmentRequestBody(workspace, student, assessmentRequest.getRequestText());
      
      List<String> teacherEmails = new ArrayList<>(teachers.size());
      for (UserEntity teacher : teachers){
       String teacherEmail = userEmailEntityController.getUserEmailAddress(teacher, false);
       if (StringUtils.isNotBlank(teacherEmail)) {
         teacherEmails.add(teacherEmail);
       }
      }
      if (!teacherEmails.isEmpty()) {
        mailer.sendMail(MailType.HTML, teacherEmails, messageTitle, messageBody);
      }

      if (communicatorMessageId != null) {
        return communicatorController.replyToMessage(studentEntity,
            messageCategory,
            messageTitle, 
            messageBody, 
            teachers,
            communicatorMessageId);
      } else {
        CommunicatorMessage postMessage = communicatorController.postMessage(studentEntity, 
            messageCategory,
            messageTitle, 
            messageBody, 
            teachers);
        assessmentRequestController.setCommunicatorMessageId(assessmentRequest, postMessage.getCommunicatorMessageId());
        return postMessage;
      }
      
    } finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
  }
  
  public void sendAssessmentRequestCancelledMessage(WorkspaceUserEntity workspaceUserEntity) {
    CommunicatorMessageId communicatorMessageId = assessmentRequestController.findCommunicatorMessageId(workspaceUserEntity);
    
    if (communicatorMessageId == null) {
      communicatorMessageId = communicatorController.createMessageId();
    }
    
    UserSchoolDataIdentifier userSchoolDataIdentifier = workspaceUserEntity.getUserSchoolDataIdentifier();
    if (userSchoolDataIdentifier == null) {
      logger.severe(String.format("Could not find userSchoolDataIdentifier for workspace user entity %d", workspaceUserEntity.getId()));
      return;
    }
    
    WorkspaceEntity workspaceEntity = workspaceUserEntity.getWorkspaceEntity();
    if (workspaceEntity == null) {
      logger.severe(String.format("Could not find workspaceEntity for workspace user entity %d", workspaceUserEntity.getId()));
      return;
    }
    
    UserEntity studentEntity = userSchoolDataIdentifier.getUserEntity();
    if (studentEntity == null) {
      logger.severe(String.format("Could not find studentEntity for workspace user entity %d", workspaceUserEntity.getId()));
      return;
    }
    
    schoolDataBridgeSessionController.startSystemSession();
    try {
      List<UserEntity> teachers = workspaceController.listUserEntitiesByWorkspaceEntityAndRoleArchetype(workspaceEntity, WorkspaceRoleArchetype.TEACHER);

      SchoolDataIdentifier studentIdentifier = new SchoolDataIdentifier(userSchoolDataIdentifier.getIdentifier(), 
          userSchoolDataIdentifier.getDataSource().getIdentifier());

      User student = userController.findUserByIdentifier(studentIdentifier);
      if (student == null) {
        logger.severe(String.format("Could not find student %s", studentIdentifier));
        return;
      }
      
      Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
      if (workspace == null) {
        logger.severe(String.format("Could not find workspace for workspace entity %d", workspaceEntity.getId()));
        return;
      }
      
      String messageCategory = getText("plugin.communicator.assessmentrequest.category");
      String messageTitle = assessmentCancelledTitle(workspace, student);
      String messageBody = assessmentCancelledBody(workspace, student);

      List<String> teacherEmails = new ArrayList<>(teachers.size());
      for (UserEntity teacher : teachers){
       String teacherEmail = userEmailEntityController.getUserEmailAddress(teacher, false);
       if (StringUtils.isNotBlank(teacherEmail)) {
         teacherEmails.add(teacherEmail);
       }
      }
      if (!teacherEmails.isEmpty()) {
        mailer.sendMail(MailType.HTML, teacherEmails, messageTitle, messageBody);
      }
      
      communicatorController.replyToMessage(studentEntity,
          messageCategory,
          messageTitle,
          messageBody,
          teachers,
          communicatorMessageId);
      
    } finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
  }
  
}
