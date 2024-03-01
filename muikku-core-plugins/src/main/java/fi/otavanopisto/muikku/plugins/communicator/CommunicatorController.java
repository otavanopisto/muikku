package fi.otavanopisto.muikku.plugins.communicator;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.TreeSet;
import java.util.stream.Collectors;

import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import org.apache.commons.collections.CollectionUtils;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Entities.EscapeMode;
import org.jsoup.safety.Cleaner;
import org.jsoup.safety.Whitelist;

import fi.otavanopisto.muikku.controller.TagController;
import fi.otavanopisto.muikku.model.base.Tag;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.model.users.UserGroupUserEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.plugins.communicator.dao.CommunicatorMessageCategoryDAO;
import fi.otavanopisto.muikku.plugins.communicator.dao.CommunicatorMessageDAO;
import fi.otavanopisto.muikku.plugins.communicator.dao.CommunicatorMessageIdDAO;
import fi.otavanopisto.muikku.plugins.communicator.dao.CommunicatorMessageIdLabelDAO;
import fi.otavanopisto.muikku.plugins.communicator.dao.CommunicatorMessageRecipientDAO;
import fi.otavanopisto.muikku.plugins.communicator.dao.CommunicatorMessageRecipientUserGroupDAO;
import fi.otavanopisto.muikku.plugins.communicator.dao.CommunicatorMessageRecipientWorkspaceGroupDAO;
import fi.otavanopisto.muikku.plugins.communicator.dao.CommunicatorMessageSignatureDAO;
import fi.otavanopisto.muikku.plugins.communicator.dao.CommunicatorMessageTemplateDAO;
import fi.otavanopisto.muikku.plugins.communicator.dao.CommunicatorUserLabelDAO;
import fi.otavanopisto.muikku.plugins.communicator.dao.VacationNotificationsDAO;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorLabel;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessage;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageCategory;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageId;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageIdLabel;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageRecipient;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageRecipientUserGroup;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageRecipientWorkspaceGroup;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageSignature;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageTemplate;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorUserLabel;
import fi.otavanopisto.muikku.plugins.communicator.model.VacationNotifications;
import fi.otavanopisto.muikku.plugins.search.CommunicatorMessageIndexer;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.search.SearchProvider;
import fi.otavanopisto.muikku.search.SearchResult;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserGroupEntityController;
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;

public class CommunicatorController {
   
  @Inject
  private CommunicatorMessageIndexer communicatorMessageIndexer;
  
  @Inject
  private UserGroupEntityController userGroupEntityController;

  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;

  @Inject
  private CommunicatorMessageDAO communicatorMessageDAO;

  @Inject
  private CommunicatorMessageCategoryDAO communicatorMessageCategoryDAO;
  
  @Inject
  private CommunicatorMessageRecipientDAO communicatorMessageRecipientDAO;

  @Inject
  private CommunicatorMessageIdDAO communicatorMessageIdDAO;

  @Inject
  private CommunicatorMessageTemplateDAO communicatorMessageTemplateDAO;
  
  @Inject
  private CommunicatorMessageSignatureDAO communicatorMessageSignatureDAO;

  @Inject
  private CommunicatorUserLabelDAO communicatorUserLabelDAO;
  
  @Inject
  private CommunicatorMessageIdLabelDAO communicatorMessageIdLabelDAO; 

  @Inject
  private CommunicatorMessageRecipientUserGroupDAO communicatorMessageRecipientUserGroupDAO;
  
  @Inject
  private CommunicatorMessageRecipientWorkspaceGroupDAO communicatorMessageRecipientWorkspaceGroupDAO;

  @Inject
  private TagController tagController;
  
  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;
  
  @Inject 
  private UserEntityController userEntityController;
  
  @Inject
  private VacationNotificationsDAO vacationNotificationsDAO;

  @Inject
  private SessionController sessionController;
  
  @Inject
  private WorkspaceController workspaceController;
  
  @Inject
  @Any
  private Instance<SearchProvider> searchProviders;
  
  private String clean(String html) {
    Document doc = Jsoup.parseBodyFragment(html);
    doc = new Cleaner(
            Whitelist.relaxed()
              .addTags("s")
              .addAttributes("a", "target")
              .addAttributes("img", "width", "height", "style")
              .addAttributes("i", "class")
              .addAttributes("span", "style")
    ).clean(doc);
    doc.outputSettings().escapeMode(EscapeMode.xhtml);
    return doc.body().html();
  }

  public List<CommunicatorMessage> listReceivedItems(UserEntity userEntity, CommunicatorLabel label, boolean onlyUnread, Integer firstResult, Integer maxResults) {
    return communicatorMessageDAO.listThreadsInInbox(userEntity, label, onlyUnread, firstResult, maxResults);
  }

  public List<CommunicatorMessage> listReceivedItems(UserEntity userEntity, boolean onlyUnread, Integer firstResult, Integer maxResults) {
    return communicatorMessageDAO.listThreadsInInbox(userEntity, null, onlyUnread, firstResult, maxResults);
  }
  
  public List<CommunicatorMessage> listSentItems(UserEntity userEntity, Integer firstResult, Integer maxResults) {
    return communicatorMessageDAO.listThreadsInSent(userEntity, firstResult, maxResults);
  }

  public List<CommunicatorMessageRecipient> listReceivedItemsByUserAndRead(UserEntity userEntity, boolean read, boolean trashed) {
    return communicatorMessageRecipientDAO.listByUserAndRead(userEntity, read, trashed);
  }
  
  public List<CommunicatorMessage> listThreadsByLabel(UserEntity userEntity, CommunicatorLabel label, Integer firstResult, Integer maxResults) {
    return communicatorMessageDAO.listThreadsInLabelFolder(userEntity, label, firstResult, maxResults);
  }
  
  public List<CommunicatorMessage> listTrashItems(UserEntity userEntity, Integer firstResult, Integer maxResults) {
    return communicatorMessageDAO.listThreadsInTrash(userEntity, firstResult, maxResults);
  }
  
  public CommunicatorMessageCategory persistCategory(String category) {
    CommunicatorMessageCategory categoryEntity = communicatorMessageCategoryDAO.findByName(category);
    if (categoryEntity == null) {
      categoryEntity = communicatorMessageCategoryDAO.create(category);
    }
    return categoryEntity;
  }
  
  public CommunicatorMessageId createMessageId() {
    return communicatorMessageIdDAO.create();
  }
  
  /**
   * Prepares a communicator message recipient list.
   * 
   * Drops recipients that are considered duplicates, inactive users or 
   * the sender (as a group recipient - the sender can send messages to 
   * themselves if they're listed as individual recipients).
   * 
   * @param sender the user sending the message
   * @param userRecipients the individual user recipients
   * @param userGroupRecipients the user groups whose members should receive the message
   * @param workspaceStudentRecipients the workspaces whose students should receive the message
   * @param workspaceTeacherRecipients the workspaces whose teachers should receive the message
   * @return the recipient list
   */
  public CommunicatorMessageRecipientList prepareRecipientList(UserEntity sender, List<UserEntity> userRecipients, 
      List<UserGroupEntity> userGroupRecipients, List<WorkspaceEntity> workspaceStudentRecipients, 
      List<WorkspaceEntity> workspaceTeacherRecipients) {
    CommunicatorMessageRecipientList preparedRecipientList = new CommunicatorMessageRecipientList();
    
    // Clean duplicates from recipient list
    cleanDuplicateRecipients(userRecipients);
     
    for (UserEntity recipient : userRecipients) {
      // #3758: Only send messages to active users
      if (isActiveUser(recipient)) {
        preparedRecipientList.addRecipient(recipient);
      }
    }
    
    if (!CollectionUtils.isEmpty(userGroupRecipients)) {
      for (UserGroupEntity userGroup : userGroupRecipients) {
        List<UserGroupUserEntity> groupUsers = userGroupEntityController.listUserGroupUserEntitiesByUserGroupEntity(userGroup);

        if (!CollectionUtils.isEmpty(groupUsers)) {
          for (UserGroupUserEntity groupUser : groupUsers) {
            UserSchoolDataIdentifier userSchoolDataIdentifier = groupUser.getUserSchoolDataIdentifier();
            UserEntity recipient = userSchoolDataIdentifier.getUserEntity();
            // #3758: Only send messages to active students
            // #4920: Only message students' current study programmes
            if (!isActiveUser(userSchoolDataIdentifier)) {
              continue;
            }
            if ((recipient != null) && !Objects.equals(sender.getId(), recipient.getId())) {
              preparedRecipientList.addUserGroupRecipient(userGroup, recipient);
            }
          }
        }
      }
    }

    // Workspace members

    if (!CollectionUtils.isEmpty(workspaceStudentRecipients)) {
      for (WorkspaceEntity workspaceEntity : workspaceStudentRecipients) {
        List<WorkspaceUserEntity> workspaceUsers = workspaceUserEntityController.listActiveWorkspaceStudents(workspaceEntity);

        if (!CollectionUtils.isEmpty(workspaceUsers)) {
          for (WorkspaceUserEntity workspaceUserEntity : workspaceUsers) {
            UserSchoolDataIdentifier userSchoolDataIdentifier = workspaceUserEntity.getUserSchoolDataIdentifier();
            UserEntity recipient = userSchoolDataIdentifier.getUserEntity();
            // #3758: Only send messages to active students
            // #4920: Only message students' current study programmes
            if (!isActiveUser(userSchoolDataIdentifier)) {
              continue;
            }
            if ((recipient != null) && !Objects.equals(sender.getId(), recipient.getId())) {
              preparedRecipientList.addWorkspaceStudentRecipient(workspaceEntity, recipient);
            }
          }
        }
      }
    }

    if (!CollectionUtils.isEmpty(workspaceTeacherRecipients)) {
      for (WorkspaceEntity workspaceEntity : workspaceTeacherRecipients) {
        List<WorkspaceUserEntity> workspaceUsers = workspaceUserEntityController.listActiveWorkspaceStaffMembers(workspaceEntity);
        
        if (!CollectionUtils.isEmpty(workspaceUsers)) {
          for (WorkspaceUserEntity wosu : workspaceUsers) {
            UserEntity recipient = wosu.getUserSchoolDataIdentifier().getUserEntity();
            // #3758: Workspace teachers are considered active, no need to check
            if ((recipient != null) && !Objects.equals(sender.getId(), recipient.getId())) {
              preparedRecipientList.addWorkspaceTeacherRecipient(workspaceEntity, recipient);
            }
          }
        }
      }
    }

    return preparedRecipientList;
  }

  public CommunicatorMessage createMessage(CommunicatorMessageId communicatorMessageId, UserEntity sender, 
      CommunicatorMessageRecipientList recipients, CommunicatorMessageCategory category, 
      String caption, String content, Set<Tag> tags) {
    CommunicatorMessage message = communicatorMessageDAO.create(communicatorMessageId, sender.getId(), category, caption, clean(content), new Date(), tags);
    
    for (UserEntity recipient : recipients.getUserRecipients()) {
      communicatorMessageRecipientDAO.create(message, recipient, null);
    }
    
    for (UserGroupEntity userGroup : recipients.getUserGroups()) {
      List<UserEntity> groupUsers = recipients.getUserGroupRecipients(userGroup);

      if (!CollectionUtils.isEmpty(groupUsers)) {
        CommunicatorMessageRecipientUserGroup groupRecipient = createUserGroupRecipient(userGroup);

        for (UserEntity groupUser : groupUsers) {
          communicatorMessageRecipientDAO.create(message, groupUser, groupRecipient);
        }
      }
    }

    // Workspace members

    for (WorkspaceEntity workspaceEntity : recipients.getStudentWorkspaces()) {
      List<UserEntity> workspaceUsers = recipients.getWorkspaceStudentRecipients(workspaceEntity);

      if (!CollectionUtils.isEmpty(workspaceUsers)) {
        CommunicatorMessageRecipientWorkspaceGroup groupRecipient = createWorkspaceGroupRecipient(workspaceEntity, WorkspaceRoleArchetype.STUDENT);
        
        for (UserEntity workspaceUserEntity : workspaceUsers) {
          communicatorMessageRecipientDAO.create(message, workspaceUserEntity, groupRecipient);
        }
      }
    }

    for (WorkspaceEntity workspaceEntity : recipients.getTeacherWorkspaces()) {
      List<UserEntity> workspaceUsers = recipients.getWorkspaceTeacherRecipients(workspaceEntity);
      
      if (!CollectionUtils.isEmpty(workspaceUsers)) {
        CommunicatorMessageRecipientWorkspaceGroup groupRecipient = createWorkspaceGroupRecipient(workspaceEntity, WorkspaceRoleArchetype.TEACHER);

        for (UserEntity workspaceUserEntity : workspaceUsers) {
          communicatorMessageRecipientDAO.create(message, workspaceUserEntity, groupRecipient);
        }
      }
    }

    communicatorMessageIndexer.indexMessage(message);
    
    return message;
  }

  private CommunicatorMessageRecipientUserGroup createUserGroupRecipient(UserGroupEntity userGroup) {
    return communicatorMessageRecipientUserGroupDAO.create(userGroup);
  }

  private CommunicatorMessageRecipientWorkspaceGroup createWorkspaceGroupRecipient(WorkspaceEntity workspaceEntity,
      WorkspaceRoleArchetype archetype) {
    return communicatorMessageRecipientWorkspaceGroupDAO.create(workspaceEntity, archetype);
  }

  public CommunicatorMessageId findCommunicatorMessageId(Long communicatorMessageId) {
    return communicatorMessageIdDAO.findById(communicatorMessageId);
  }

  public CommunicatorMessage findCommunicatorMessageById(Long communicatorMessageId) {
    return communicatorMessageDAO.findById(communicatorMessageId);
  }
  
  public CommunicatorMessageRecipient findCommunicatorMessageRecipient(Long id) {
    return communicatorMessageRecipientDAO.findById(id);
  }

  public CommunicatorMessageRecipient findCommunicatorMessageRecipientByMessageAndRecipient(CommunicatorMessage communicatorMessage, UserEntity recipient) {
    return communicatorMessageRecipientDAO.findByMessageAndRecipient(communicatorMessage, recipient);
  }

  /**
   * Lists only the individual message recipients
   * 
   * @param communicatorMessage message of which to list the recipients for
   * @return a list of recipients
   */
  public List<CommunicatorMessageRecipient> listCommunicatorMessageRecipients(CommunicatorMessage communicatorMessage) {
    List<CommunicatorMessageRecipient> recipients = communicatorMessageRecipientDAO.listByMessage(communicatorMessage);
    
    if (sessionController.hasEnvironmentPermission(CommunicatorPermissionCollection.COMMUNICATOR_STUDENT_MESSAGING)) {
      return recipients;
    } else {
      Long loggedUserId = sessionController.getLoggedUserEntity().getId();
      return recipients
          .stream()
          .filter(recipient -> {
            if (recipient.getRecipient().equals(loggedUserId)) {
              return true;
            } else {
              UserEntity userEntity = userEntityController.findUserEntityById(recipient.getRecipient());
              UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierByUserEntity(userEntity);
              return userSchoolDataIdentifier != null && userSchoolDataIdentifier.isStaff();
            }
          })
          .collect(Collectors.toList());
    }
  }

  /**
   * Lists all CommunicatorMessageRecipients, no matter if they are added by group or as individuals
   * 
   * @param communicatorMessage message of which to list the recipients for
   * @return a list of recipients
   */
  public List<CommunicatorMessageRecipient> listAllCommunicatorMessageRecipients(CommunicatorMessage communicatorMessage) {
    return communicatorMessageRecipientDAO.listByMessageIncludeGroupRecipients(communicatorMessage);
  }
    
  public List<CommunicatorMessageRecipientUserGroup> listCommunicatorMessageUserGroupRecipients(CommunicatorMessage communicatorMessage) {
    UserEntity loggedUser = sessionController.getLoggedUserEntity();
    UserEntity sender = userEntityController.findUserEntityById(communicatorMessage.getSender());
    if (sessionController.hasEnvironmentPermission(CommunicatorPermissionCollection.COMMUNICATOR_READ_RECIPIENTS_LIST)) {
      return communicatorMessageRecipientUserGroupDAO.listByMessage(communicatorMessage);
    } else if (loggedUser.getDefaultIdentifier().equals(sender.getDefaultIdentifier())) {
      return communicatorMessageRecipientUserGroupDAO.listByMessage(communicatorMessage);
    } else {
      List<CommunicatorMessageRecipientUserGroup> userGroupRecipientsList = communicatorMessageRecipientUserGroupDAO.listByMessage(communicatorMessage);
      List<CommunicatorMessageRecipientUserGroup> userGroupRecipients = new ArrayList<>();
      SchoolDataIdentifier loggedUserIdentifier = sessionController.getLoggedUserEntity().defaultSchoolDataIdentifier();
  
      for (CommunicatorMessageRecipientUserGroup userGroup : userGroupRecipientsList) {
        UserGroupEntity userGroupEntity = userGroupEntityController.findUserGroupEntityById(userGroup.getUserGroupEntityId());
        Boolean isMember = userGroupEntityController.isMember(loggedUserIdentifier, userGroupEntity);
        
        if (isMember) {
          userGroupRecipients.add(userGroup);
        }
      }
      if (userGroupRecipients.isEmpty()) {
        return communicatorMessageRecipientUserGroupDAO.listByMessageAndUser(communicatorMessage, loggedUser);
      }
      return userGroupRecipients;
    }
  }

  public List<CommunicatorMessageRecipientWorkspaceGroup> listCommunicatorMessageWorkspaceGroupRecipients(CommunicatorMessage communicatorMessage) {
    UserEntity loggedUser = sessionController.getLoggedUserEntity();
    UserEntity sender = userEntityController.findUserEntityById(communicatorMessage.getSender());
    if (sessionController.hasEnvironmentPermission(CommunicatorPermissionCollection.COMMUNICATOR_READ_RECIPIENTS_LIST)) {
      return communicatorMessageRecipientWorkspaceGroupDAO.listByMessage(communicatorMessage);
    } else if (loggedUser.defaultSchoolDataIdentifier().equals(sender.defaultSchoolDataIdentifier())) {
      return communicatorMessageRecipientWorkspaceGroupDAO.listByMessage(communicatorMessage);
    } else {
      List<CommunicatorMessageRecipientWorkspaceGroup> workspaceGroupRecipientsList = communicatorMessageRecipientWorkspaceGroupDAO.listByMessage(communicatorMessage);
      List<CommunicatorMessageRecipientWorkspaceGroup> workspaceGroupRecipients = new ArrayList<>();

      for (CommunicatorMessageRecipientWorkspaceGroup workspaceGroup : workspaceGroupRecipientsList) {
        WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceGroup.getWorkspaceEntityId());
        WorkspaceUserEntity workspaceUser =  workspaceUserEntityController.findActiveWorkspaceUserByWorkspaceEntityAndUserIdentifier(workspaceEntity, loggedUser.defaultSchoolDataIdentifier());
        
        if (workspaceUser != null) {
          workspaceGroupRecipients.add(workspaceGroup);
        }
      }
      if (workspaceGroupRecipients.isEmpty()) {
        return communicatorMessageRecipientWorkspaceGroupDAO.listByMessageAndUser(communicatorMessage, loggedUser);
      }
      return workspaceGroupRecipients;

    }
  }

  public List<CommunicatorMessageRecipient> listCommunicatorMessageRecipientsByUserAndMessage(UserEntity user, CommunicatorMessageId messageId, boolean trashed) {
    return communicatorMessageRecipientDAO.listByUserAndMessageId(user, messageId, trashed, false);
  }

  public Long countMessagesByUserAndMessageId(UserEntity user, CommunicatorMessageId communicatorMessageId, boolean inTrash) {
    return communicatorMessageDAO.countMessagesByUserAndMessageId(user, communicatorMessageId, inTrash);
  }

  /**
   * Return the maximum id value of CommunicatorMessages
   * @return the maximum id value of CommunicatorMessages
   */
  public Long getMaximumCommunicatorMessageId() {
    return communicatorMessageDAO.getMaximumCommunicatorMessageId();
  }

  public Long countTotalMessages() {
    return communicatorMessageDAO.count();
  }
  
  public List<CommunicatorMessageTemplate> listMessageTemplates(UserEntity user) {
    return communicatorMessageTemplateDAO.listByUser(user);
  }
  
  public List<CommunicatorMessageSignature> listMessageSignatures(UserEntity user) {
    return communicatorMessageSignatureDAO.listByUser(user);
  }

  public CommunicatorMessageTemplate getMessageTemplate(Long id) {
    return communicatorMessageTemplateDAO.findById(id);
  }
  
  public CommunicatorMessageSignature getMessageSignature(Long id) {
    return communicatorMessageSignatureDAO.findById(id);
  }

  public void deleteMessageTemplate(CommunicatorMessageTemplate messageTemplate) {
    communicatorMessageTemplateDAO.delete(messageTemplate);
  }

  public void deleteMessageSignature(CommunicatorMessageSignature messageSignature) {
    communicatorMessageSignatureDAO.delete(messageSignature);
  }

  public CommunicatorMessageTemplate editMessageTemplate(CommunicatorMessageTemplate messageTemplate, String name, String content) {
    return communicatorMessageTemplateDAO.update(messageTemplate, name, content);
  }

  public CommunicatorMessageSignature editMessageSignature(CommunicatorMessageSignature messageSignature, String name, String signature) {
    return communicatorMessageSignatureDAO.update(messageSignature, name, signature);
  }

  public CommunicatorMessageSignature createMessageSignature(String name, String content, UserEntity user) {
    return communicatorMessageSignatureDAO.create(name, content, user);
  }

  public CommunicatorMessageTemplate createMessageTemplate(String name, String content, UserEntity user) {
    return communicatorMessageTemplateDAO.create(name, content, user);
  }

  public void trashSentMessages(UserEntity user, CommunicatorMessageId messageId) {
    List<CommunicatorMessage> sentMessages = communicatorMessageDAO.listMessagesInSentThread(user, messageId, false, false);
    for (CommunicatorMessage message : sentMessages) {
      communicatorMessageDAO.updateTrashedBySender(message, true);
    }
  }

  public void trashAllThreadMessages(UserEntity user, CommunicatorMessageId messageId) {
    List<CommunicatorMessageRecipient> received = communicatorMessageRecipientDAO.listByUserAndMessageId(user, messageId, false, false);
    for (CommunicatorMessageRecipient recipient : received) {
      communicatorMessageRecipientDAO.updateTrashedByReceiver(recipient, true);
    }
    
    List<CommunicatorMessage> sentMessages = communicatorMessageDAO.listMessagesInSentThread(user, messageId, false, false);
    for (CommunicatorMessage message : sentMessages) {
      communicatorMessageDAO.updateTrashedBySender(message, true);
    }
  }

  public void unTrashAllThreadMessages(UserEntity user, CommunicatorMessageId messageId) {
    List<CommunicatorMessageRecipient> received = communicatorMessageRecipientDAO.listByUserAndMessageId(user, messageId, true, false);
    for (CommunicatorMessageRecipient recipient : received) {
      communicatorMessageRecipientDAO.updateTrashedByReceiver(recipient, false);
    }
    
    List<CommunicatorMessage> sentMessages = communicatorMessageDAO.listMessagesInSentThread(user, messageId, true, false);
    for (CommunicatorMessage message : sentMessages) {
      communicatorMessageDAO.updateTrashedBySender(message, false);
    }
  }

  public void archiveTrashedMessages(UserEntity user, CommunicatorMessageId threadId) {
    List<CommunicatorMessageRecipient> received = communicatorMessageRecipientDAO.listByUserAndMessageId(user, threadId, true, false);
    for (CommunicatorMessageRecipient recipient : received) {
      communicatorMessageRecipientDAO.updateArchivedByReceiver(recipient, true);
      CommunicatorMessage message = recipient.getCommunicatorMessage();
      communicatorMessageIndexer.indexMessage(message);
    }
    
    List<CommunicatorMessage> sent = communicatorMessageDAO.listMessagesInSentThread(user, threadId, true, false);
    for (CommunicatorMessage msg : sent) {
      communicatorMessageDAO.updateArchivedBySender(msg, true);
      communicatorMessageIndexer.indexMessage(msg);
    }
  }

  /**
   * List all messages with id user has sent or received.
   * 
   * @param user
   * @param messageId
   * @return
   */
  public List<CommunicatorMessage> listMessagesByMessageId(UserEntity user, CommunicatorMessageId messageId) {
    Set<CommunicatorMessage> result = new TreeSet<>(new Comparator<CommunicatorMessage>() {
      @Override
      public int compare(CommunicatorMessage o1, CommunicatorMessage o2) {
        if (o1 == null || o1.getId() == null) {
          if (o2 == null || o2.getId() == null) {
            return 0;
          } else {
            return -1;
          }
        } else {
          return o2 != null ? o1.getId().compareTo(o2.getId()) : 1;
        }
      }
    });
    
    result.addAll(communicatorMessageDAO.listMessagesInSentThread(user, messageId));
    result.addAll(communicatorMessageDAO.listMessagesInThread(user, messageId));
    
    return new ArrayList<>(result);
  }

  public List<CommunicatorMessage> listMessagesByMessageId(UserEntity user, CommunicatorMessageId messageId, Boolean trashed) {
    Set<CommunicatorMessage> result = new TreeSet<>(new Comparator<CommunicatorMessage>() {
      @Override
      public int compare(CommunicatorMessage o1, CommunicatorMessage o2) {
        if (o1 == null || o1.getId() == null) {
          if (o2 == null || o2.getId() == null) {
            return 0;
          } else {
            return -1;
          }
        } else {
          return o2 != null ? o1.getId().compareTo(o2.getId()) : 1;
        }
      }
    });
    
    result.addAll(communicatorMessageDAO.listMessagesInSentThread(user, messageId, trashed, false));
    result.addAll(communicatorMessageDAO.listMessagesInThread(user, messageId, trashed, false));
    
    return new ArrayList<>(result);
  }
  
  public CommunicatorMessageRecipient updateReadByReceiver(CommunicatorMessageRecipient recipient, boolean value) {
    CommunicatorMessageRecipient communicatorMessageRecipient = communicatorMessageRecipientDAO.updateReadByReceiver(recipient, value);
    communicatorMessageIndexer.updateIndexMessageReadByReceiver(communicatorMessageRecipient);
    return communicatorMessageRecipient;
  }

  public CommunicatorMessage postMessage(UserEntity sender, String category, String subject, String content, List<UserEntity> recipients) {
    CommunicatorMessageId communicatorMessageId = createMessageId();
    
    // TODO Category not existing at this point would technically indicate an invalid state 
    CommunicatorMessageCategory categoryEntity = persistCategory(category);
    
    CommunicatorMessageRecipientList recipientsList = new CommunicatorMessageRecipientList();
    recipients.forEach(recipient -> recipientsList.addRecipient(recipient));
    
    return createMessage(communicatorMessageId, sender, recipientsList, categoryEntity, subject, content, null);
  }

  public CommunicatorMessage replyToMessage(UserEntity sender, String category, String subject, String content, List<UserEntity> recipients, CommunicatorMessageId communicatorMessageId) {
    CommunicatorMessageCategory categoryEntity = persistCategory(category);
    
    CommunicatorMessageRecipientList recipientsList = new CommunicatorMessageRecipientList();
    recipients.forEach(recipient -> recipientsList.addRecipient(recipient));
    
    return createMessage(communicatorMessageId, sender, recipientsList, categoryEntity, subject, content, null);
  }

  public List<CommunicatorMessage> listAllMessages() {
    return communicatorMessageDAO.listAll();
  }
  
  public List<CommunicatorMessage> listAllMessages(int firstResult, int maxResults) {
    return communicatorMessageDAO.listAll(firstResult, maxResults);
  }

  /**
   * Lists all messages in reverse order starting from given index 
   * (i.e. having smaller or equal id than supplied).
   * 
   * @param highestId highest id returned
   * @param maxResults how many results at most
   * @return at most maxResults messages that have smaller than or equal id to highestId
   */
  public List<CommunicatorMessage> listAllMessagesInReverseFromId(Long highestId, int maxResults) {
    return communicatorMessageDAO.listAllMessagesInReverseFromId(highestId, maxResults);
  }

  public List<CommunicatorMessageRecipient> listAllRecipients() {
    return communicatorMessageRecipientDAO.listAll();
  }

  public List<CommunicatorMessageId> listAllMessageIds() {
    return communicatorMessageIdDAO.listAll();
  }

  /* User Label */
  
  public CommunicatorUserLabel createUserLabel(String name, Long color, UserEntity userEntity) {
    return communicatorUserLabelDAO.create(name, color, userEntity);
  }

  public CommunicatorUserLabel findUserLabelById(Long id) {
    return communicatorUserLabelDAO.findById(id);
  }
  
  public List<CommunicatorUserLabel> listUserLabelsByUserEntity(UserEntity userEntity) {
    return communicatorUserLabelDAO.listByUser(userEntity);
  }
  
  public CommunicatorUserLabel updateUserLabel(CommunicatorUserLabel userLabel, String name, Long color) {
    try {
      return communicatorUserLabelDAO.update(userLabel, name, color);
    } finally {
      List<CommunicatorMessageIdLabel> messageIdLabels = communicatorMessageIdLabelDAO.listByLabel(userLabel);
      UserEntity userEntity = userEntityController.findUserEntityById(userLabel.getUserEntity());

      for (CommunicatorMessageIdLabel messageIdLabel : messageIdLabels) {
        messageIdLabel.getCommunicatorMessageId();
        List<CommunicatorMessage> communicatorMessages = listMessagesByMessageId(userEntity, messageIdLabel.getCommunicatorMessageId());
        for(CommunicatorMessage message : communicatorMessages) {
          communicatorMessageIndexer.indexMessage(message);
        }
      }
    }
  }

  /* MessageIdLabel */
  
  public CommunicatorMessageIdLabel createMessageIdLabel(UserEntity userEntity, CommunicatorMessageId messageId, CommunicatorLabel label) {
    try {
      return communicatorMessageIdLabelDAO.create(userEntity, messageId, label);
    } finally {
      List<CommunicatorMessage> communicatorMessages = listMessagesByMessageId(userEntity, messageId);
      for(CommunicatorMessage message : communicatorMessages) {
        communicatorMessageIndexer.indexMessage(message);
      }
    }
  }

  public CommunicatorMessageIdLabel findMessageIdLabelById(Long id) {
    return communicatorMessageIdLabelDAO.findById(id);
  }
  
  public CommunicatorMessageIdLabel findMessageIdLabel(UserEntity userEntity, CommunicatorMessageId messageId,
      CommunicatorLabel label) {
    return communicatorMessageIdLabelDAO.findBy(userEntity, messageId, label);
  }

  public List<CommunicatorMessageIdLabel> listMessageIdLabelsByUserEntity(UserEntity userEntity, CommunicatorMessageId messageId) {
    return communicatorMessageIdLabelDAO.listByUserAndMessageId(userEntity, messageId);
  }
  
  public void delete(CommunicatorMessageIdLabel messageIdLabel) {
    Long userEntityId = messageIdLabel.getUserEntity();
    UserEntity user = userEntityController.findUserEntityById(userEntityId);
    CommunicatorMessageId messageId = this.findCommunicatorMessageId(messageIdLabel.getCommunicatorMessageId().getId());
    List<CommunicatorMessage> communicatorMessages = listMessagesByMessageId(user, messageId);
    for (CommunicatorMessage message : communicatorMessages) {
      communicatorMessageIndexer.indexMessage(message);
    }
    communicatorMessageIdLabelDAO.delete(messageIdLabel);
  }
  
  /* DELETE */
  
  public void delete(CommunicatorMessage icm) {
    communicatorMessageDAO.delete(icm);
  }

  public void delete(CommunicatorMessageRecipient cmr) {
    communicatorMessageRecipientDAO.delete(cmr);
  }

  public void delete(CommunicatorMessageId id) {
    communicatorMessageIdDAO.delete(id);
  }
  
  public void delete(CommunicatorUserLabel communicatorUserLabel) {
    List<CommunicatorMessageIdLabel> labels = communicatorMessageIdLabelDAO.listByLabel(communicatorUserLabel);
    for (CommunicatorMessageIdLabel label : labels) {
      delete(label);
    }
    
    communicatorUserLabelDAO.delete(communicatorUserLabel);
  }

  /**
   * Cleans list of UserEntities so that there are no duplicates present. Returns the original list.
   * 
   * @param userEntities
   * @return
   */
  public void cleanDuplicateRecipients(List<UserEntity> userEntities) {
    Set<Long> userIds = new HashSet<Long>(userEntities.size());
    
    for (int i = userEntities.size() - 1; i >= 0; i--) {
      if (userEntities.get(i) != null) {
        Long userId = userEntities.get(i).getId();
        
        if (!userIds.contains(userId))
          userIds.add(userId);
        else
          userEntities.remove(i);
      } else
        userEntities.remove(i);
    }
  }
  
  public void removeRecipient(List<UserEntity> userEntities, UserEntity userEntity) {
    for (int i = userEntities.size() - 1; i >= 0; i--) {
      if (userEntities.get(i) != null) {
        Long userId = userEntities.get(i).getId();
        
        if (userId.equals(userEntity.getId()))
          userEntities.remove(i);
      }
    }
  }

  public CommunicatorMessageId findOlderThreadId(UserEntity userEntity, CommunicatorMessageId threadId, CommunicatorFolderType type, CommunicatorLabel label) {
    return communicatorMessageDAO.findOlderThreadId(userEntity, threadId, type, label);
  }
  
  public CommunicatorMessageId findNewerThreadId(UserEntity userEntity, CommunicatorMessageId threadId, CommunicatorFolderType type, CommunicatorLabel label) {
    return communicatorMessageDAO.findNewerThreadId(userEntity, threadId, type, label);
  }

  private SearchProvider getProvider(String name) {
    for (SearchProvider searchProvider : searchProviders) {
      if (name.equals(searchProvider.getName())) {
        return searchProvider;
      }
    }
    return null;
  }
  
  public boolean isActiveUser(UserEntity userEntity) {
    return isActiveUser(userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(userEntity.defaultSchoolDataIdentifier()));
  }
  
  private boolean isActiveUser(UserSchoolDataIdentifier userSchoolDataIdentifier) {
    EnvironmentRoleArchetype[] staffRoles = {
        EnvironmentRoleArchetype.ADMINISTRATOR, 
        EnvironmentRoleArchetype.MANAGER, 
        EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER,
        EnvironmentRoleArchetype.STUDY_GUIDER,
        EnvironmentRoleArchetype.TEACHER
    };
    
    if (!userSchoolDataIdentifier.hasAnyRole(staffRoles)) {
      SearchProvider searchProvider = getProvider("elastic-search");
      if (searchProvider != null) {
        SearchResult searchResult = searchProvider.findUser(userSchoolDataIdentifier.schoolDataIdentifier(), false);
        return searchResult.getTotalHitCount() > 0;
      }
    }
    return true;
  }
 
  public Set<String> tagIdsToStr(Set<Long> tagIds) {
    Set<String> tagsStr = new HashSet<String>();
    for (Long tagId : tagIds) {
      Tag tag = tagController.findTagById(tagId);
      if (tag != null)
        tagsStr.add(tag.getText());
    }
    return tagsStr;
  }
  
  // Vacation notifications for auto reply

  public VacationNotifications createVacationNotification(UserEntity sender, UserEntity receiver, Date notificationDate) {
    return vacationNotificationsDAO.create(sender, receiver, notificationDate);
  }
  
  public VacationNotifications updateVacationNotificationDate(VacationNotifications vacationNotification,Date notificationDate) {
    return vacationNotificationsDAO.updateNotificationDate(vacationNotification, notificationDate);
  }
  
  public VacationNotifications findVacationNotification(UserEntity sender, UserEntity receiver) {
    return vacationNotificationsDAO.findNotification(sender, receiver);
  }

}