package fi.otavanopisto.muikku.schooldata;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import javax.enterprise.context.Dependent;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import org.apache.commons.collections.CollectionUtils;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Entities.EscapeMode;
import org.jsoup.safety.Cleaner;
import org.jsoup.safety.Safelist;

import fi.otavanopisto.muikku.controller.messaging.MessagingWidget;
import fi.otavanopisto.muikku.dao.workspace.WorkspaceSignupMessageDAO;
import fi.otavanopisto.muikku.mail.MailType;
import fi.otavanopisto.muikku.mail.Mailer;
import fi.otavanopisto.muikku.model.users.UserEmailEntity;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceSignupMessage;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.users.UserEmailEntityController;
import fi.otavanopisto.muikku.users.UserGroupEntityController;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;

@Dependent
public class WorkspaceSignupMessageController { 

  @Inject
  private Mailer mailer;

  @Inject
  private UserGroupEntityController userGroupEntityController;
  
  @Inject
  private UserEmailEntityController userEmailEntityController;
  
  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;
  
  @Inject
  private WorkspaceSignupMessageDAO workspaceEntityMessageDAO;

  @Inject
  @Any
  private Instance<MessagingWidget> messagingWidgets;

  public WorkspaceSignupMessage createWorkspaceSignupMessage(WorkspaceEntity workspaceEntity, 
      boolean defaultMessage, boolean enabled, String caption, String content, List<UserGroupEntity> signupGroups) {
    return workspaceEntityMessageDAO.create(workspaceEntity, defaultMessage, enabled, clean(caption), clean(content), signupGroups);
  }
  
  public void deleteWorkspaceSignupMessage(WorkspaceSignupMessage message) {
    workspaceEntityMessageDAO.delete(message);
  }
  
  /**
   * Returns an applicable signup message for user & workspace combo.
   * 
   * Applicable signup message is determined as follows:
   * - If user is a member of any user groups, try to find a signup message which is tied to the group and is enabled
   * - Otherwise if the workspace has a default (not bound to a group) signup message which is enabled, return that
   * - Otherwise return null - no applicable signup message was found
   * 
   * @param userIdentifier
   * @param workspaceEntity
   * @return
   */
  public WorkspaceSignupMessage getApplicableSignupMessage(SchoolDataIdentifier userIdentifier, WorkspaceEntity workspaceEntity) {
    WorkspaceSignupMessage applicableMessage = null;
    List<UserGroupEntity> userGroupEntities = userGroupEntityController.listUserGroupsByUserIdentifier(userIdentifier);
    List<Long> userGroupIds = userGroupEntities.stream().map(UserGroupEntity::getId).collect(Collectors.toList());
    if (CollectionUtils.isNotEmpty(userGroupEntities)) {
      List<WorkspaceSignupMessage> groupMessages = workspaceEntityMessageDAO.listEnabledGroupBoundSignupMessagesBy(workspaceEntity);
      for (WorkspaceSignupMessage groupMessage: groupMessages) {
        List<Long> messageGroupIds = groupMessage.getUserGroupEntities().stream().map(UserGroupEntity::getId).collect(Collectors.toList());
        if (!Collections.disjoint(userGroupIds, messageGroupIds)) {
          applicableMessage = groupMessage;
          break;
        }
      }
    }
    if (applicableMessage == null) {
      WorkspaceSignupMessage defaultSignupMessage = workspaceEntityMessageDAO.findDefaultSignupMessageBy(workspaceEntity);
      if (defaultSignupMessage != null && defaultSignupMessage.isEnabled()) {
        applicableMessage = defaultSignupMessage;
      }
    }
    return applicableMessage;
  }
  
  /**
   * Sends an applicable workspace signup message to given student signing up to given workspace.
   * 
   * @param studentUserSchoolDataIdentifier student's UserSchoolDataIdentifier
   * @param workspaceEntity Workspace
   * @return true if the signup message was sent, false otherwise
   */
  public boolean sendApplicableSignupMessage(UserSchoolDataIdentifier studentUserSchoolDataIdentifier, WorkspaceEntity workspaceEntity) {
    WorkspaceSignupMessage workspaceSignupMessage = getApplicableSignupMessage(studentUserSchoolDataIdentifier.schoolDataIdentifier(), workspaceEntity);

    if (workspaceSignupMessage != null && workspaceSignupMessage.isEnabled()) {
      String messageCategory = "message";

      /*
       * List the teachers of the workspace and use the first one as the message sender,
       * if there are no teachers, fallback to the user sending a message themselves.
       */
      List<WorkspaceUserEntity> workspaceTeachers = workspaceUserEntityController.listActiveWorkspaceStaffMembers(workspaceEntity);
      UserEntity messageSender = CollectionUtils.isNotEmpty(workspaceTeachers)
          ? workspaceTeachers.get(0).getUserSchoolDataIdentifier().getUserEntity()
          : studentUserSchoolDataIdentifier.getUserEntity();
      
      for (MessagingWidget messagingWidget : messagingWidgets) {
        messagingWidget.postMessage(
            messageSender,
            messageCategory, 
            workspaceSignupMessage.getCaption(),
            workspaceSignupMessage.getContent(),
            Arrays.asList(studentUserSchoolDataIdentifier.getUserEntity())
        );
      }
      
      // Send email
      
      List<String> studentAddresses = userEmailEntityController.getUserEmailAddresses(studentUserSchoolDataIdentifier).stream()
          .map(UserEmailEntity::getAddress)
          .collect(Collectors.toList());
      
      if (CollectionUtils.isNotEmpty(studentAddresses)) {
        mailer.sendMail(
            MailType.HTML, 
            studentAddresses, 
            workspaceSignupMessage.getCaption(), 
            workspaceSignupMessage.getContent()
        );
      }
      
      return true;
    }
    
    return false;
  }

  public WorkspaceSignupMessage findDefaultSignupMessage(WorkspaceEntity workspaceEntity) {
    return workspaceEntityMessageDAO.findDefaultSignupMessageBy(workspaceEntity);
  }
  
  public WorkspaceSignupMessage findSignupMessageById(Long id) {
    return workspaceEntityMessageDAO.findById(id);
  }
  
  public List<WorkspaceSignupMessage> listGroupBoundSignupMessages(WorkspaceEntity workspaceEntity) {
    return workspaceEntityMessageDAO.listGroupBoundSignupMessagesBy(workspaceEntity);
  }
  
  public WorkspaceSignupMessage updateWorkspaceSignupMessage(WorkspaceSignupMessage workspaceEntityMessage, 
      boolean enabled, String caption, String content, List<UserGroupEntity> signupGroups) {
    return workspaceEntityMessageDAO.update(workspaceEntityMessage, enabled, clean(caption), clean(content), signupGroups);
  }
  
  private String clean(String html) {
    Document doc = Jsoup.parseBodyFragment(html);
    doc = new Cleaner(
            Safelist.relaxed()
              .addTags("s")
              .addAttributes("a", "target")
              .addAttributes("img", "width", "height", "style")
              .addAttributes("i", "class")
              .addAttributes("span", "style")
    ).clean(doc);
    doc.outputSettings().escapeMode(EscapeMode.xhtml);
    return doc.body().html();
  }

}
