package fi.otavanopisto.muikku.plugins.communicator.rest;

import java.util.ArrayList;

import java.util.List;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageIdLabel;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageRecipient;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorUserLabel;

public class CommunicatorRESTModels {

  public static List<CommunicatorUserLabelRESTModel> restUserLabel(List<CommunicatorUserLabel> userLabels) {
    List<CommunicatorUserLabelRESTModel> result = new ArrayList<CommunicatorUserLabelRESTModel>();
    for (CommunicatorUserLabel userLabel : userLabels)
      result.add(restUserLabel(userLabel));
    return result; 
  }
  
  public static CommunicatorUserLabelRESTModel restUserLabel(CommunicatorUserLabel userLabel) {
    return new CommunicatorUserLabelRESTModel(userLabel.getId(), userLabel.getName(), userLabel.getColor());    
  }

  public static List<CommunicatorMessageIdLabelRESTModel> restLabel(List<CommunicatorMessageIdLabel> messageIdLabels) {
    List<CommunicatorMessageIdLabelRESTModel> result = new ArrayList<CommunicatorMessageIdLabelRESTModel>();
    for (CommunicatorMessageIdLabel messageIdLabel : messageIdLabels)
      result.add(restLabel(messageIdLabel));
    return result;
  }
  
  public static CommunicatorMessageIdLabelRESTModel restLabel(CommunicatorMessageIdLabel messageIdLabel) {
    return new CommunicatorMessageIdLabelRESTModel(
        messageIdLabel.getId(), 
        messageIdLabel.getUserEntity(), 
        messageIdLabel.getCommunicatorMessageId() != null ? messageIdLabel.getCommunicatorMessageId().getId() : null,
        messageIdLabel.getLabel() != null ? messageIdLabel.getLabel().getId() : null,
        messageIdLabel.getLabel() != null ? messageIdLabel.getLabel().getName() : null,
        messageIdLabel.getLabel() != null ? messageIdLabel.getLabel().getColor() : null
    );    
  }

  public static List<CommunicatorMessageRecipientRESTModel> restRecipient(List<CommunicatorMessageRecipient> recipients) {
    List<CommunicatorMessageRecipientRESTModel> result = new ArrayList<CommunicatorMessageRecipientRESTModel>();
    for (CommunicatorMessageRecipient recipient : recipients)
      result.add(restRecipient(recipient));
    return result;
  }
  
  public static CommunicatorMessageRecipientRESTModel restRecipient(CommunicatorMessageRecipient recipient) {
    return new CommunicatorMessageRecipientRESTModel(recipient.getId(), recipient.getCommunicatorMessage().getId(), recipient.getRecipient());
  }
  
}
