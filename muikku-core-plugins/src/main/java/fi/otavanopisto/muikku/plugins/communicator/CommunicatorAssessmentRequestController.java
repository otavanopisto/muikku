package fi.otavanopisto.muikku.plugins.communicator;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.logging.Logger;

import javax.inject.Inject;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.i18n.LocaleController;
import fi.otavanopisto.muikku.mail.MailType;
import fi.otavanopisto.muikku.mail.Mailer;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.plugins.assessmentrequest.AssessmentRequestController;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessage;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageId;
import fi.otavanopisto.muikku.schooldata.CourseMetaController;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.entity.Subject;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.Workspace;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessmentRequest;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessmentState;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceSubject;
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
  
  @Inject
  private CourseMetaController courseMetaController;
  
  private String getText(Locale locale, String key, Object... params) {
    return localeController.getText(locale, key, params);
  }

  private String assessmentRequestTitle(Locale locale, Workspace workspace, User user) {
    String userName = getUserDisplayName(user);
    String workspaceName = getWorkspaceDisplayName(workspace);
    
    return getText(locale, "plugin.communicator.assessmentrequest.title", userName, workspaceName);
  }
  
  private String assessmentCancelledTitle(Locale locale, Workspace workspace, User user) {
    String userName = getUserDisplayName(user);
    String workspaceName = getWorkspaceDisplayName(workspace);
    
    return getText(locale, "plugin.communicator.assessmentrequest.title.cancelled", userName, workspaceName);
  }
  
  private String assessmentRequestBody(Locale locale, Workspace workspace, User user, List<WorkspaceAssessmentState> assessmentStates, String message) {
    String userName = getUserDisplayName(user);
    String workspaceName = getWorkspaceDisplayName(workspace);
    String body = null;
    
    if (CollectionUtils.isNotEmpty(assessmentStates)) {
      String workspaceSubjectsBody = "";
      
      for (WorkspaceAssessmentState assessmentState : assessmentStates) {
        SchoolDataIdentifier assessmentStateWorkspaceSubjectIdentifier = SchoolDataIdentifier.fromId(assessmentState.getWorkspaceSubjectIdentifier());
        String subjectName = "";
        if (CollectionUtils.isNotEmpty(workspace.getSubjects())) {
          WorkspaceSubject workspaceSubject = workspace.getSubjects().stream()
            .filter(_workspaceSubject -> assessmentStateWorkspaceSubjectIdentifier.equals(_workspaceSubject.getIdentifier()))
            .findFirst()
            .orElse(null);
          if (workspaceSubject != null) {
            Subject subject = courseMetaController.findSubject(workspaceSubject.getSubjectIdentifier());
            
            if (subject != null) {
              subjectName = 
                  (StringUtils.isNotBlank(subject.getCode()) ? subject.getCode() : "") 
                  + (workspaceSubject.getCourseNumber() != null ? workspaceSubject.getCourseNumber() : "");
            }
          }
        }
        
        if (assessmentState.getGradeDate() != null && assessmentState.getGrade() != null) {
          workspaceSubjectsBody = workspaceSubjectsBody + getText(locale, "plugin.communicator.assessmentrequest.existingGrade.body",
              new SimpleDateFormat("d.M.yyyy").format(assessmentState.getGradeDate()),
              assessmentState.getGrade(),
              subjectName);
        }
      }
      
      
      if (StringUtils.isNotBlank(workspaceSubjectsBody)) {
        String header = getText(locale, "plugin.communicator.assessmentrequest.existingGrade.header",
            userName,
            workspaceName);
        String footer = getText(locale, "plugin.communicator.assessmentrequest.existingGrade.footer",
            message);
        
        body = header + workspaceSubjectsBody + footer;
      }
    }

    // If the previous block didn't resolve to a message, fallback to a generic message
    
    if (StringUtils.isBlank(body)) {
      body = getText(locale, "plugin.communicator.assessmentrequest.body", userName, workspaceName, message); 
    }
    
    return body; 
  }
  
  private String assessmentCancelledBody(Locale locale, Workspace workspace, User user) {
    String userName = getUserDisplayName(user);
    String workspaceName = getWorkspaceDisplayName(workspace);
    
    return getText(locale, "plugin.communicator.assessmentrequest.body.cancelled", userName, workspaceName);
  }

  private String getWorkspaceDisplayName(Workspace workspace) {
    return StringUtils.isBlank(workspace.getNameExtension()) ? 
      workspace.getName() : 
      String.format("%s (%s)", workspace.getName(), workspace.getNameExtension());
  }
  
  private String getUserDisplayName(User user) {
    return user.getNickName() == null ? user.getDisplayName() : String.format("%s \"%s\" %s (%s)", user.getFirstName(), user.getNickName(), user.getLastName(), user.getStudyProgrammeName());
  }

  public CommunicatorMessage sendAssessmentRequestMessage(Locale locale, WorkspaceAssessmentRequest assessmentRequest) {
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
      SchoolDataIdentifier studentIdentifier = userSchoolDataIdentifier.schoolDataIdentifier();
      
      List<UserEntity> teachers = new ArrayList<UserEntity>();
      List<WorkspaceUserEntity> workspaceTeachers = workspaceUserEntityController.listActiveWorkspaceStaffMembers(workspaceEntity);
      for (WorkspaceUserEntity workspaceTeacher : workspaceTeachers) {
        teachers.add(workspaceTeacher.getUserSchoolDataIdentifier().getUserEntity());
      }
      
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
      
      List<WorkspaceAssessmentState> assessmentStates = assessmentRequestController.getAllWorkspaceAssessmentStates(workspaceUserEntity);
      
      String messageCategory = getText(locale, "plugin.communicator.assessmentrequest.category");
      String messageTitle = assessmentRequestTitle(locale, workspace, student);
      String messageBody = assessmentRequestBody(locale, workspace, student, assessmentStates, StringUtils.replace(assessmentRequest.getRequestText(), "\n", "<br/>"));
      
      List<String> teacherEmails = new ArrayList<>(teachers.size());
      for (UserEntity teacher : teachers){
        String teacherEmail = userEmailEntityController.getUserDefaultEmailAddress(teacher, false);
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
  
  public void sendAssessmentRequestCancelledMessage(Locale locale, WorkspaceUserEntity workspaceUserEntity) {
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
      List<UserEntity> teachers = new ArrayList<UserEntity>();
      List<WorkspaceUserEntity> workspaceTeachers = workspaceUserEntityController.listActiveWorkspaceStaffMembers(workspaceEntity);
      for (WorkspaceUserEntity workspaceTeacher : workspaceTeachers) {
        teachers.add(workspaceTeacher.getUserSchoolDataIdentifier().getUserEntity());
      }

      SchoolDataIdentifier studentIdentifier = userSchoolDataIdentifier.schoolDataIdentifier();

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
      
      String messageCategory = getText(locale, "plugin.communicator.assessmentrequest.category");
      String messageTitle = assessmentCancelledTitle(locale, workspace, student);
      String messageBody = assessmentCancelledBody(locale, workspace, student);

      List<String> teacherEmails = new ArrayList<>(teachers.size());
      for (UserEntity teacher : teachers){
       String teacherEmail = userEmailEntityController.getUserDefaultEmailAddress(teacher, false);
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
