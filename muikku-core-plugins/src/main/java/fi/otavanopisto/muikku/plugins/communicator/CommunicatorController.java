package fi.otavanopisto.muikku.plugins.communicator;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.TreeSet;

import javax.inject.Inject;

import org.apache.commons.collections.CollectionUtils;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Entities.EscapeMode;
import org.jsoup.safety.Cleaner;
import org.jsoup.safety.Whitelist;

import fi.otavanopisto.muikku.model.base.Tag;
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
import fi.otavanopisto.muikku.users.UserGroupEntityController;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;

public class CommunicatorController {
   
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
  
  private String clean(String html) {
    Document doc = Jsoup.parseBodyFragment(html);
    doc = new Cleaner(
            Whitelist.relaxed()
              .addAttributes("a", "target")
              .addAttributes("img", "width", "height", "style")
              .addAttributes("i", "class")
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
  
  public CommunicatorMessage createMessage(CommunicatorMessageId communicatorMessageId, UserEntity sender, 
      List<UserEntity> userRecipients, List<UserGroupEntity> userGroupRecipients,
      List<WorkspaceEntity> workspaceStudentRecipients, List<WorkspaceEntity> workspaceTeacherRecipients,
      CommunicatorMessageCategory category, String caption, String content, Set<Tag> tags) {
    CommunicatorMessage message = communicatorMessageDAO.create(communicatorMessageId, sender.getId(), category, caption, clean(content), new Date(), tags);

    // Clean duplicates from recipient list
    cleanDuplicateRecipients(userRecipients);
    
    Set<Long> recipientIds = new HashSet<Long>();
    
    for (UserEntity recipient : userRecipients) {
      if (!recipientIds.contains(recipient.getId())) {
        recipientIds.add(recipient.getId());
        communicatorMessageRecipientDAO.create(message, recipient, null);
      }
    }
    
    if (!CollectionUtils.isEmpty(userGroupRecipients)) {
      for (UserGroupEntity userGroup : userGroupRecipients) {
        List<UserGroupUserEntity> groupUsers = userGroupEntityController.listUserGroupUserEntitiesByUserGroupEntity(userGroup);

        if (!CollectionUtils.isEmpty(groupUsers)) {
          CommunicatorMessageRecipientUserGroup groupRecipient = createUserGroupRecipient(userGroup);

          for (UserGroupUserEntity groupUser : groupUsers) {
            UserSchoolDataIdentifier userSchoolDataIdentifier = groupUser.getUserSchoolDataIdentifier();
            UserEntity recipient = userSchoolDataIdentifier.getUserEntity();
            if ((recipient != null) && !Objects.equals(sender.getId(), recipient.getId())) {
              if (!recipientIds.contains(recipient.getId())) {
                recipientIds.add(recipient.getId());
                communicatorMessageRecipientDAO.create(message, recipient, groupRecipient);
              }
            }
          }
        }
      }
    }

    // Workspace members

    if (!CollectionUtils.isEmpty(workspaceStudentRecipients)) {
      for (WorkspaceEntity workspaceEntity : workspaceStudentRecipients) {
        List<WorkspaceUserEntity> workspaceUsers = workspaceUserEntityController.listWorkspaceUserEntitiesByRoleArchetype(
            workspaceEntity, WorkspaceRoleArchetype.STUDENT);

        if (!CollectionUtils.isEmpty(workspaceUsers)) {
          CommunicatorMessageRecipientWorkspaceGroup groupRecipient = createWorkspaceGroupRecipient(workspaceEntity, WorkspaceRoleArchetype.STUDENT);
          
          for (WorkspaceUserEntity workspaceUserEntity : workspaceUsers) {
            UserEntity recipient = workspaceUserEntity.getUserSchoolDataIdentifier().getUserEntity();
            if ((recipient != null) && !Objects.equals(sender.getId(), recipient.getId())) {
              if (!recipientIds.contains(recipient.getId())) {
                recipientIds.add(recipient.getId());
                communicatorMessageRecipientDAO.create(message, recipient, groupRecipient);
              }
            }
          }
        }
      }
    }

    if (!CollectionUtils.isEmpty(workspaceTeacherRecipients)) {
      for (WorkspaceEntity workspaceEntity : workspaceTeacherRecipients) {
        List<WorkspaceUserEntity> workspaceUsers = workspaceUserEntityController.listWorkspaceUserEntitiesByRoleArchetype(
            workspaceEntity, WorkspaceRoleArchetype.TEACHER);
        
        if (!CollectionUtils.isEmpty(workspaceUsers)) {
          CommunicatorMessageRecipientWorkspaceGroup groupRecipient = createWorkspaceGroupRecipient(workspaceEntity, WorkspaceRoleArchetype.TEACHER);

          for (WorkspaceUserEntity wosu : workspaceUsers) {
            UserEntity recipient = wosu.getUserSchoolDataIdentifier().getUserEntity();
            if ((recipient != null) && !Objects.equals(sender.getId(), recipient.getId())) {
              if (!recipientIds.contains(recipient.getId())) {
                recipientIds.add(recipient.getId());
                communicatorMessageRecipientDAO.create(message, recipient, groupRecipient);
              }
            }
          }
        }
      }
    }
    
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
    return communicatorMessageRecipientDAO.listByMessage(communicatorMessage);
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
    return communicatorMessageRecipientUserGroupDAO.listByMessage(communicatorMessage);
  }

  public List<CommunicatorMessageRecipientWorkspaceGroup> listCommunicatorMessageWorkspaceGroupRecipients(CommunicatorMessage communicatorMessage) {
    return communicatorMessageRecipientWorkspaceGroupDAO.listByMessage(communicatorMessage);
  }

  public List<CommunicatorMessageRecipient> listCommunicatorMessageRecipientsByUserAndMessage(UserEntity user, CommunicatorMessageId messageId, boolean trashed) {
    return communicatorMessageRecipientDAO.listByUserAndMessageId(user, messageId, trashed, false);
  }

  public Long countMessagesByUserAndMessageId(UserEntity user, CommunicatorMessageId communicatorMessageId, boolean inTrash) {
    return communicatorMessageDAO.countMessagesByUserAndMessageId(user, communicatorMessageId, inTrash);
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
    }
    
    List<CommunicatorMessage> sent = communicatorMessageDAO.listMessagesInSentThread(user, threadId, true, false);
    for (CommunicatorMessage msg : sent) {
      communicatorMessageDAO.updateArchivedBySender(msg, true);
    }
  }

  /**
   * List all messages with id user has sent or received.
   * 
   * @param user
   * @param messageId
   * @return
   */
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
        }
        
        return o1.getId().compareTo(o2.getId());
      }
    });
    
    result.addAll(communicatorMessageDAO.listMessagesInSentThread(user, messageId, trashed, false));
    result.addAll(communicatorMessageDAO.listMessagesInThread(user, messageId, trashed, false));
    
    return new ArrayList<>(result);
  }

  public CommunicatorMessageRecipient updateRead(CommunicatorMessageRecipient recipient, boolean value) {
    return communicatorMessageRecipientDAO.updateRecipientRead(recipient, value);
  }

  public CommunicatorMessage postMessage(UserEntity sender, String category, String subject, String content, List<UserEntity> recipients) {
    CommunicatorMessageId communicatorMessageId = createMessageId();
    
    // TODO Category not existing at this point would technically indicate an invalid state 
    CommunicatorMessageCategory categoryEntity = persistCategory(category);
    
    return createMessage(communicatorMessageId, sender, recipients, null, null, null, categoryEntity, subject, content, null);
  }

  public CommunicatorMessage replyToMessage(UserEntity sender, String category, String subject, String content, List<UserEntity> recipients, CommunicatorMessageId communicatorMessageId) {
    CommunicatorMessageCategory categoryEntity = persistCategory(category);
    
    return createMessage(communicatorMessageId, sender, recipients, null, null, null, categoryEntity, subject, content, null);
  }

  public List<CommunicatorMessage> listAllMessages() {
    return communicatorMessageDAO.listAll();
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
    return communicatorUserLabelDAO.update(userLabel, name, color);
  }

  /* MessageIdLabel */
  
  public CommunicatorMessageIdLabel createMessageIdLabel(UserEntity userEntity, CommunicatorMessageId messageId, CommunicatorLabel label) {
    return communicatorMessageIdLabelDAO.create(userEntity, messageId, label);
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
  
}
