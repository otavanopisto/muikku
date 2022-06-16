package fi.otavanopisto.muikku.plugins.communicator.rest;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.otavanopisto.muikku.controller.TagController;
import fi.otavanopisto.muikku.model.base.Tag;
import fi.otavanopisto.muikku.model.users.OrganizationEntity;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.communicator.CommunicatorController;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessage;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageId;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageIdLabel;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageRecipient;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageRecipientUserGroup;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageRecipientWorkspaceGroup;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorUserLabel;
import fi.otavanopisto.muikku.rest.model.OrganizationRESTModel;
import fi.otavanopisto.muikku.rest.model.UserBasicInfo;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.UserGroup;
import fi.otavanopisto.muikku.schooldata.entity.Workspace;
import fi.otavanopisto.muikku.search.SearchProvider;
import fi.otavanopisto.muikku.search.SearchResult;
import fi.otavanopisto.muikku.users.OrganizationEntityController;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserEntityFileController;
import fi.otavanopisto.muikku.users.UserGroupController;
import fi.otavanopisto.muikku.users.UserGroupEntityController;

public class CommunicatorRESTModels {

  @Inject
  private CommunicatorController communicatorController;
  
  @Inject
  private UserEntityController userEntityController;

  @Inject
  private UserController userController;

  @Inject
  private TagController tagController;
  
  @Inject
  private SchoolDataBridgeSessionController schoolDataBridgeSessionController;

  @Inject
  private UserGroupEntityController userGroupEntityController;

  @Inject
  private UserGroupController userGroupController;
  
  @Inject
  private UserEntityFileController userEntityFileController;

  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private OrganizationEntityController organizationEntityController;
  
  @Inject
  private WorkspaceController workspaceController;
  
  @Inject
  @Any
  private Instance<SearchProvider> searchProviders;
  
  /**
   * Returns message sender UserBasicInfo
   * 
   * @param communicatorMessage
   * @return
   */
  public UserBasicInfo getSenderBasicInfo(CommunicatorMessage communicatorMessage) {
    schoolDataBridgeSessionController.startSystemSession();
    try {
      UserEntity userEntity = userEntityController.findUserEntityById(communicatorMessage.getSender());
      User user = userController.findUserByUserEntityDefaults(userEntity);
      Boolean hasPicture = userEntityFileController.hasProfilePicture(userEntity);
      
      if (user == null)
        return null;
      
      UserBasicInfo result = new UserBasicInfo(
          userEntity.getId(), 
          userEntity.defaultSchoolDataIdentifier().toId(),
          user.getFirstName(), 
          user.getLastName(), 
          user.getNickName(),
          hasPicture
      );

      return result;
    } finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
  }
  private SearchProvider getProvider(String name) {
    for (SearchProvider searchProvider : searchProviders) {
      if (name.equals(searchProvider.getName())) {
        return searchProvider;
      }
    }
    return null;
  }
  
  public CommunicatorUserBasicInfo getCommunicatorUserBasicInfo(Long userEntityId) {
    UserEntity userEntity = userEntityController.findUserEntityById(userEntityId);
    if (userEntity == null) {
      return null;
    }
    
    schoolDataBridgeSessionController.startSystemSession();
    try {
      User user = userController.findUserByUserEntityDefaults(userEntity);
      boolean studiesEnded = false;
      boolean archived = userEntity.getArchived();
      
      if (user == null)
        return new CommunicatorUserBasicInfo(
            userEntity.getId(), 
            null, 
            null,
            null,
            null,
            archived,
            studiesEnded
        );
      
      if (!Boolean.TRUE.equals(archived)) {
        SearchProvider searchProvider = getProvider("elastic-search");
        if (searchProvider != null) {
          SearchResult result = searchProvider.findUser(userEntity.defaultSchoolDataIdentifier(), true);
          
          List<Map<String, Object>> results = result.getResults();
          if (results != null) {
            for (Map<String, Object> r : results) {
              Object studyEndDate = r.get("studyEndDate");
              
              if (studyEndDate != null) {
                studiesEnded = true;
              }
            }
          }
        }
      }

      CommunicatorUserBasicInfo result = new CommunicatorUserBasicInfo(
          userEntity.getId(), 
          user.getFirstName(), 
          user.getLastName(), 
          user.getNickName(),
          user.getStudyProgrammeName(),
          archived,
          studiesEnded
      );

      return result;
    } finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
  }

  
  public List<CommunicatorUserLabelRESTModel> restUserLabel(List<CommunicatorUserLabel> userLabels) {
    List<CommunicatorUserLabelRESTModel> result = new ArrayList<CommunicatorUserLabelRESTModel>();
    for (CommunicatorUserLabel userLabel : userLabels)
      result.add(restUserLabel(userLabel));
    return result; 
  }
  
  public CommunicatorUserLabelRESTModel restUserLabel(CommunicatorUserLabel userLabel) {
    return new CommunicatorUserLabelRESTModel(userLabel.getId(), userLabel.getName(), userLabel.getColor());    
  }

  public List<CommunicatorMessageIdLabelRESTModel> restLabel(List<CommunicatorMessageIdLabel> messageIdLabels) {
    List<CommunicatorMessageIdLabelRESTModel> result = new ArrayList<CommunicatorMessageIdLabelRESTModel>();
    for (CommunicatorMessageIdLabel messageIdLabel : messageIdLabels)
      result.add(restLabel(messageIdLabel));
    return result;
  }
  
  public CommunicatorMessageIdLabelRESTModel restLabel(CommunicatorMessageIdLabel messageIdLabel) {
    return new CommunicatorMessageIdLabelRESTModel(
        messageIdLabel.getId(), 
        messageIdLabel.getUserEntity(), 
        messageIdLabel.getCommunicatorMessageId() != null ? messageIdLabel.getCommunicatorMessageId().getId() : null,
        messageIdLabel.getLabel() != null ? messageIdLabel.getLabel().getId() : null,
        messageIdLabel.getLabel() != null ? messageIdLabel.getLabel().getName() : null,
        messageIdLabel.getLabel() != null ? messageIdLabel.getLabel().getColor() : null
    );    
  }
  
  public List<CommunicatorUserBasicInfo> restRecipient2(List<CommunicatorMessageRecipient> recipients) {
    schoolDataBridgeSessionController.startSystemSession();
    try {
      List<CommunicatorUserBasicInfo> result = new ArrayList<CommunicatorUserBasicInfo>();
      for (CommunicatorMessageRecipient recipient : recipients) {
        CommunicatorUserBasicInfo restRecipientModel = getCommunicatorUserBasicInfo(recipient.getRecipient());
        if (restRecipientModel != null)
          result.add(restRecipientModel);
      }
      return result;
    } finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
  }

  public CommunicatorThreadViewRESTModel restThreadViewModel(List<CommunicatorMessage> messages, 
      CommunicatorMessageId olderThread, CommunicatorMessageId newerThread, List<CommunicatorMessageIdLabelRESTModel> labels) {
    Long olderThreadId = olderThread != null ? olderThread.getId() : null;
    Long newerThreadId = newerThread != null ? newerThread.getId() : null;
    List<CommunicatorMessageRESTModel> restMessages = restFullMessage(messages);
    return new CommunicatorThreadViewRESTModel(olderThreadId, newerThreadId, restMessages, labels);
  }

  public List<fi.otavanopisto.muikku.rest.model.UserGroup> restUserGroupRecipients(List<CommunicatorMessageRecipientUserGroup> recipients) {
    schoolDataBridgeSessionController.startSystemSession();
    try {
      List<fi.otavanopisto.muikku.rest.model.UserGroup> result = new ArrayList<fi.otavanopisto.muikku.rest.model.UserGroup>();
      for (CommunicatorMessageRecipientUserGroup recipient : recipients) {
        fi.otavanopisto.muikku.rest.model.UserGroup restUserGroupRecipient = restUserGroupRecipient(recipient);
        if (restUserGroupRecipient != null)
          result.add(restUserGroupRecipient);
      }
      return result;
    } finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
  }
  
  public fi.otavanopisto.muikku.rest.model.UserGroup restUserGroupRecipient(CommunicatorMessageRecipientUserGroup userGroup) {
    schoolDataBridgeSessionController.startSystemSession();
    try {
      UserGroupEntity entity = userGroupEntityController.findUserGroupEntityById(userGroup.getUserGroupEntityId());
      if (entity != null) {
        Long userCount = userGroupEntityController.getGroupUserCount(entity);
        UserGroup group = userGroupController.findUserGroup(entity);
        if (group != null) {
          OrganizationRESTModel organization = null;
          if (group.getOrganizationIdentifier() != null) {
            OrganizationEntity organizationEntity = organizationEntityController.findBy(group.getOrganizationIdentifier());
            if (organizationEntity != null) {
              organization = new OrganizationRESTModel(organizationEntity.getId(), organizationEntity.getName());
            }
          }
          return new fi.otavanopisto.muikku.rest.model.UserGroup(
              entity.getId(),
              group.getName(),
              userCount,
              organization,
              group.getIsGuidanceGroup());
        }
      }
      return null;
    } finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
  }
  
  public List<CommunicatorMessageRecipientWorkspaceGroupRESTModel> restWorkspaceGroupRecipients(List<CommunicatorMessageRecipientWorkspaceGroup> recipients) {
    schoolDataBridgeSessionController.startSystemSession();
    try {
      List<CommunicatorMessageRecipientWorkspaceGroupRESTModel> result = new ArrayList<CommunicatorMessageRecipientWorkspaceGroupRESTModel>();
      for (CommunicatorMessageRecipientWorkspaceGroup recipient : recipients) {
        CommunicatorMessageRecipientWorkspaceGroupRESTModel restWorkspaceGroupRecipient = restWorkspaceGroupRecipient(recipient);
        if (restWorkspaceGroupRecipient != null)
          result.add(restWorkspaceGroupRecipient);
      }
      return result;
    } finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
  }
  
  public CommunicatorMessageRecipientWorkspaceGroupRESTModel restWorkspaceGroupRecipient(CommunicatorMessageRecipientWorkspaceGroup workspaceGroup) {
    schoolDataBridgeSessionController.startSystemSession();
    try {
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceGroup.getWorkspaceEntityId());
      if (workspaceEntity != null) {
        Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
      
        if (workspace != null) {
          return new CommunicatorMessageRecipientWorkspaceGroupRESTModel(workspaceGroup.getWorkspaceEntityId(), 
              workspaceGroup.getArchetype(), workspace.getName(), workspace.getNameExtension());
        }
      }
      
      return null;
    } finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
  }
  
  public List<CommunicatorMessageRESTModel> restFullMessage(List<CommunicatorMessage> messages) {
    List<CommunicatorMessageRESTModel> result = new ArrayList<>();
    for (CommunicatorMessage message : messages)
      result.add(restFullMessage(message));
    return result;
  }
  
  public CommunicatorMessageRESTModel restFullMessage(CommunicatorMessage message) {
    String categoryName = message.getCategory() != null ? message.getCategory().getName() : null;
    
    CommunicatorUserBasicInfo senderBasicInfo = getCommunicatorUserBasicInfo(message.getSender());
    
    List<CommunicatorMessageRecipient> messageRecipients = communicatorController.listCommunicatorMessageRecipients(message);
    List<CommunicatorMessageRecipientUserGroup> userGroupRecipients = communicatorController.listCommunicatorMessageUserGroupRecipients(message);
    List<CommunicatorMessageRecipientWorkspaceGroup> workspaceGroupRecipients = communicatorController.listCommunicatorMessageWorkspaceGroupRecipients(message);
    
    Long recipientCount = (long) messageRecipients.size();

    List<CommunicatorUserBasicInfo> restRecipients = restRecipient2(messageRecipients);
    List<fi.otavanopisto.muikku.rest.model.UserGroup> restUserGroupRecipients = restUserGroupRecipients(userGroupRecipients);
    List<CommunicatorMessageRecipientWorkspaceGroupRESTModel> restWorkspaceRecipients = restWorkspaceGroupRecipients(workspaceGroupRecipients);
    
    return new CommunicatorMessageRESTModel(
        message.getId(), message.getCommunicatorMessageId().getId(), 
        message.getSender(), senderBasicInfo, 
        categoryName, message.getCaption(), message.getContent(), message.getCreated(), tagIdsToStr(message.getTags()), 
        restRecipients, restUserGroupRecipients, restWorkspaceRecipients, recipientCount);
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
  
}
