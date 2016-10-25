package fi.otavanopisto.muikku.plugins.communicator.rest;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.inject.Inject;

import fi.otavanopisto.muikku.controller.TagController;
import fi.otavanopisto.muikku.model.base.Tag;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.communicator.CommunicatorController;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessage;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageIdLabel;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageRecipient;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorUserLabel;
import fi.otavanopisto.muikku.rest.model.UserBasicInfo;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserEntityController;

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
      fi.otavanopisto.muikku.schooldata.entity.User user = userController.findUserByUserEntityDefaults(userEntity);
      Boolean hasPicture = false; // TODO: userController.hasPicture(userEntity);
      
      fi.otavanopisto.muikku.rest.model.UserBasicInfo result = new fi.otavanopisto.muikku.rest.model.UserBasicInfo(
          userEntity.getId(), 
          user.getFirstName(), 
          user.getLastName(), 
          user.getStudyProgrammeName(),
          hasPicture,
          user.hasEvaluationFees(),
          user.getCurriculumIdentifier());

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

  public List<CommunicatorMessageRecipientRESTModel> restRecipient(List<CommunicatorMessageRecipient> recipients) {
    schoolDataBridgeSessionController.startSystemSession();
    try {
      List<CommunicatorMessageRecipientRESTModel> result = new ArrayList<CommunicatorMessageRecipientRESTModel>();
      for (CommunicatorMessageRecipient recipient : recipients)
        result.add(restRecipient(recipient));
      return result;
    } finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
  }
  
  public CommunicatorMessageRecipientRESTModel restRecipient(CommunicatorMessageRecipient recipient) {
    schoolDataBridgeSessionController.startSystemSession();
    try {
      UserEntity userEntity = userEntityController.findUserEntityById(recipient.getRecipient());
      fi.otavanopisto.muikku.schooldata.entity.User user = userController.findUserByUserEntityDefaults(userEntity);

      return new CommunicatorMessageRecipientRESTModel(recipient.getId(), recipient.getCommunicatorMessage().getId(), 
          recipient.getRecipient(), user.getFirstName(), user.getLastName());
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
    
    UserBasicInfo senderBasicInfo = getSenderBasicInfo(message);
    
    List<CommunicatorMessageRecipient> messageRecipients = communicatorController.listCommunicatorMessageRecipients(message);
    
    Long recipientCount = (long) messageRecipients.size();

    // Max 5 recipients
    int toIndex = (int) Math.min(recipientCount, 5);
    List<CommunicatorMessageRecipientRESTModel> restRecipients = recipientCount > 0 ? 
        restRecipient(messageRecipients.subList(0, toIndex)) : new ArrayList<CommunicatorMessageRecipientRESTModel>();
    
    return new CommunicatorMessageRESTModel(
        message.getId(), message.getCommunicatorMessageId().getId(), 
        message.getSender(), senderBasicInfo, 
        categoryName, message.getCaption(), message.getContent(), message.getCreated(), tagIdsToStr(message.getTags()), 
        restRecipients, recipientCount);
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
