package fi.otavanopisto.muikku.plugins.communicator.rest;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.users.OrganizationEntityController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserEntityName;
import fi.otavanopisto.muikku.users.UserGroupEntityController;
import fi.otavanopisto.muikku.users.UserGroupEntityName;
import fi.otavanopisto.muikku.workspaces.WorkspaceEntityName;

public class CommunicatorRESTModels {

  @Inject
  private CommunicatorController communicatorController;
  
  @Inject
  private UserEntityController userEntityController;

  @Inject
  private TagController tagController;

  @Inject
  private UserGroupEntityController userGroupEntityController;

  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private OrganizationEntityController organizationEntityController;
  
  public CommunicatorUserBasicInfo getCommunicatorUserBasicInfo(Long userEntityId) {
    UserEntity userEntity = userEntityController.findUserEntityById(userEntityId);
    if (userEntity == null) {
      return null;
    }
    
    UserEntityName userEntityName = userEntityController.getName(userEntity, false);
    boolean studiesEnded = !userEntityController.isActiveUserEntity(userEntity);
    boolean archived = userEntity.getArchived();
    
    return new CommunicatorUserBasicInfo(
        userEntity.getId(), 
        userEntityName != null ? userEntityName.getFirstName() : null,
        userEntityName != null ? userEntityName.getLastName() : null,
        userEntityName != null ? userEntityName.getNickName() : null,
        userEntityName != null ? userEntityName.getStudyProgrammeName() : null,
        archived,
        studiesEnded
    );
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
    List<CommunicatorUserBasicInfo> result = new ArrayList<CommunicatorUserBasicInfo>();
    for (CommunicatorMessageRecipient recipient : recipients) {
      CommunicatorUserBasicInfo restRecipientModel = getCommunicatorUserBasicInfo(recipient.getRecipient());
      if (restRecipientModel != null) {
        result.add(restRecipientModel);
      }
    }
    return result;
  }

  public CommunicatorThreadViewRESTModel restThreadViewModel(List<CommunicatorMessage> messages, 
      CommunicatorMessageId olderThread, CommunicatorMessageId newerThread, List<CommunicatorMessageIdLabelRESTModel> labels) {
    Long olderThreadId = olderThread != null ? olderThread.getId() : null;
    Long newerThreadId = newerThread != null ? newerThread.getId() : null;
    List<CommunicatorMessageRESTModel> restMessages = restFullMessage(messages);
    return new CommunicatorThreadViewRESTModel(olderThreadId, newerThreadId, restMessages, labels);
  }

  public List<fi.otavanopisto.muikku.rest.model.UserGroup> restUserGroupRecipients(List<CommunicatorMessageRecipientUserGroup> recipients) {
    List<fi.otavanopisto.muikku.rest.model.UserGroup> result = new ArrayList<fi.otavanopisto.muikku.rest.model.UserGroup>();
    for (CommunicatorMessageRecipientUserGroup recipient : recipients) {
      fi.otavanopisto.muikku.rest.model.UserGroup restUserGroupRecipient = restUserGroupRecipient(recipient);
      if (restUserGroupRecipient != null)
        result.add(restUserGroupRecipient);
    }
    return result;
  }
  
  public fi.otavanopisto.muikku.rest.model.UserGroup restUserGroupRecipient(CommunicatorMessageRecipientUserGroup userGroup) {
    UserGroupEntity entity = userGroupEntityController.findUserGroupEntityById(userGroup.getUserGroupEntityId());
    if (entity != null) {
      Long userCount = userGroupEntityController.getGroupUserCount(entity);
      UserGroupEntityName userGroupEntityName = userGroupEntityController.getName(entity);
      if (userGroupEntityName != null) {
        OrganizationRESTModel organization = null;
        if (entity.getOrganization() != null) {
          OrganizationEntity organizationEntity = organizationEntityController.findBy(entity.getOrganization().schoolDataIdentifier());
          if (organizationEntity != null) {
            organization = new OrganizationRESTModel(organizationEntity.getId(), organizationEntity.getName());
          }
        }
        
        return new fi.otavanopisto.muikku.rest.model.UserGroup(
            entity.getId(),
            userGroupEntityName.getName(),
            userCount,
            organization,
            userGroupEntityName.getIsGuidanceGroup());
      }
    }
    return null;
  }
  
  public List<CommunicatorMessageRecipientWorkspaceGroupRESTModel> restWorkspaceGroupRecipients(List<CommunicatorMessageRecipientWorkspaceGroup> recipients) {
    List<CommunicatorMessageRecipientWorkspaceGroupRESTModel> result = new ArrayList<CommunicatorMessageRecipientWorkspaceGroupRESTModel>();
    for (CommunicatorMessageRecipientWorkspaceGroup recipient : recipients) {
      CommunicatorMessageRecipientWorkspaceGroupRESTModel restWorkspaceGroupRecipient = restWorkspaceGroupRecipient(recipient);
      if (restWorkspaceGroupRecipient != null) {
        result.add(restWorkspaceGroupRecipient);
      }
    }
    return result;
  }
  
  public CommunicatorMessageRecipientWorkspaceGroupRESTModel restWorkspaceGroupRecipient(CommunicatorMessageRecipientWorkspaceGroup workspaceGroup) {
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceGroup.getWorkspaceEntityId());
    if (workspaceEntity != null) {
      WorkspaceEntityName workspaceEntityName = workspaceEntityController.getName(workspaceEntity);
      
      if (workspaceEntityName != null) {
        return new CommunicatorMessageRecipientWorkspaceGroupRESTModel(workspaceGroup.getWorkspaceEntityId(), 
            workspaceGroup.getArchetype(), workspaceEntityName.getName(), workspaceEntityName.getNameExtension());
      }
    }
    
    return null;
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
