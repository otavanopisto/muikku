package fi.otavanopisto.muikku.plugins.communicator;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;

import javax.enterprise.event.Event;
import javax.inject.Inject;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Entities.EscapeMode;
import org.jsoup.safety.Cleaner;
import org.jsoup.safety.Whitelist;

import fi.otavanopisto.muikku.model.base.Tag;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.communicator.dao.CommunicatorMessageCategoryDAO;
import fi.otavanopisto.muikku.plugins.communicator.dao.CommunicatorMessageDAO;
import fi.otavanopisto.muikku.plugins.communicator.dao.CommunicatorMessageIdDAO;
import fi.otavanopisto.muikku.plugins.communicator.dao.CommunicatorMessageRecipientDAO;
import fi.otavanopisto.muikku.plugins.communicator.dao.CommunicatorMessageSignatureDAO;
import fi.otavanopisto.muikku.plugins.communicator.dao.CommunicatorMessageTemplateDAO;
import fi.otavanopisto.muikku.plugins.communicator.dao.CommunicatorUserLabelDAO;
import fi.otavanopisto.muikku.plugins.communicator.events.CommunicatorMessageSent;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessage;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageCategory;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageId;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageRecipient;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageSignature;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageTemplate;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorUserLabel;
import fi.otavanopisto.security.Permit;
import fi.otavanopisto.security.PermitContext;

public class CommunicatorController {
   
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
  private Event<CommunicatorMessageSent> communicatorMessageSentEvent;

  private String clean(String html) {
    Document doc = Jsoup.parseBodyFragment(html);
    doc = new Cleaner(
            Whitelist.relaxed()
              .addAttributes("a", "target")
              .addAttributes("img", "width", "height", "style")
          ).clean(doc);
    doc.outputSettings().escapeMode(EscapeMode.xhtml);
    return doc.body().html();
  }

  public List<CommunicatorMessage> listReceivedItems(UserEntity userEntity, Integer firstResult, Integer maxResults) {
    return communicatorMessageDAO.listFirstMessagesByRecipient(userEntity, firstResult, maxResults);
  }
  
  public List<CommunicatorMessage> listSentItems(UserEntity userEntity, Integer firstResult, Integer maxResults) {
    return communicatorMessageDAO.listFirstMessagesBySender(userEntity, firstResult, maxResults);
  }

  public List<CommunicatorMessageRecipient> listReceivedItemsByUserAndRead(UserEntity userEntity, boolean read) {
    return communicatorMessageRecipientDAO.listByUserAndRead(userEntity, read);
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
  
  public CommunicatorMessage createMessage(CommunicatorMessageId communicatorMessageId, UserEntity sender, List<UserEntity> recipients, 
      CommunicatorMessageCategory category, String caption, String content, Set<Tag> tags) {
    CommunicatorMessage message = communicatorMessageDAO.create(communicatorMessageId, sender.getId(), category, caption, clean(content), new Date(), tags);

    for (UserEntity recipient : recipients) {
      communicatorMessageRecipientDAO.create(message, recipient.getId());
      communicatorMessageSentEvent.fire(new CommunicatorMessageSent(message.getId(), recipient.getId()));
    }
    
    return message;
  }

  public CommunicatorMessageId findCommunicatorMessageId(Long communicatorMessageId) {
    return communicatorMessageIdDAO.findById(communicatorMessageId);
  }

  public List<CommunicatorMessage> listInboxMessagesByMessageId(UserEntity user, CommunicatorMessageId messageId) {
    return communicatorMessageDAO.listMessagesByRecipientAndMessageId(user, messageId);
  }

  public CommunicatorMessage findCommunicatorMessageById(Long communicatorMessageId) {
    return communicatorMessageDAO.findById(communicatorMessageId);
  }
  
  public CommunicatorMessageRecipient findCommunicatorMessageRecipient(Long id) {
    return communicatorMessageRecipientDAO.findById(id);
  }

  public List<CommunicatorMessageRecipient> listCommunicatorMessageRecipients(CommunicatorMessage communicatorMessage) {
    return communicatorMessageRecipientDAO.listByMessage(communicatorMessage);
  }

  public List<CommunicatorMessageRecipient> listCommunicatorMessageRecipientsByUserAndMessage(UserEntity user, CommunicatorMessageId messageId) {
    return communicatorMessageRecipientDAO.listByUserAndMessageId(user, messageId);
  }

  public Long countMessagesByRecipientAndMessageId(UserEntity recipient, CommunicatorMessageId communicatorMessageId) {
    return communicatorMessageDAO.countMessagesByRecipientAndMessageId(recipient, communicatorMessageId);
  }
  
  @Permit (CommunicatorPermissionCollection.COMMUNICATOR_MANAGE_SETTINGS)
  public List<CommunicatorMessageTemplate> listMessageTemplates(@PermitContext UserEntity user) {
    return communicatorMessageTemplateDAO.listByUser(user);
  }
  
  @Permit (CommunicatorPermissionCollection.COMMUNICATOR_MANAGE_SETTINGS)
  public List<CommunicatorMessageSignature> listMessageSignatures(@PermitContext UserEntity user) {
    return communicatorMessageSignatureDAO.listByUser(user);
  }

  @Permit (CommunicatorPermissionCollection.COMMUNICATOR_MANAGE_SETTINGS)
  public CommunicatorMessageTemplate getMessageTemplate(Long id) {
    return communicatorMessageTemplateDAO.findById(id);
  }
  
  @Permit (CommunicatorPermissionCollection.COMMUNICATOR_MANAGE_SETTINGS)
  public CommunicatorMessageSignature getMessageSignature(Long id) {
    return communicatorMessageSignatureDAO.findById(id);
  }

  @Permit (CommunicatorPermissionCollection.COMMUNICATOR_MANAGE_SETTINGS)
  public void deleteMessageTemplate(@PermitContext CommunicatorMessageTemplate messageTemplate) {
    communicatorMessageTemplateDAO.delete(messageTemplate);
  }

  @Permit (CommunicatorPermissionCollection.COMMUNICATOR_MANAGE_SETTINGS)
  public void deleteMessageSignature(@PermitContext CommunicatorMessageSignature messageSignature) {
    communicatorMessageSignatureDAO.delete(messageSignature);
  }

  @Permit (CommunicatorPermissionCollection.COMMUNICATOR_MANAGE_SETTINGS)
  public CommunicatorMessageTemplate editMessageTemplate(@PermitContext CommunicatorMessageTemplate messageTemplate, String name, String content) {
    return communicatorMessageTemplateDAO.update(messageTemplate, name, content);
  }

  @Permit (CommunicatorPermissionCollection.COMMUNICATOR_MANAGE_SETTINGS)
  public CommunicatorMessageSignature editMessageSignature(@PermitContext CommunicatorMessageSignature messageSignature, String name, String signature) {
    return communicatorMessageSignatureDAO.update(messageSignature, name, signature);
  }

  @Permit (CommunicatorPermissionCollection.COMMUNICATOR_MANAGE_SETTINGS)
  public CommunicatorMessageSignature createMessageSignature(String name, String content, @PermitContext UserEntity user) {
    return communicatorMessageSignatureDAO.create(name, content, user);
  }

  @Permit (CommunicatorPermissionCollection.COMMUNICATOR_MANAGE_SETTINGS)
  public CommunicatorMessageTemplate createMessageTemplate(String name, String content, @PermitContext UserEntity user) {
    return communicatorMessageTemplateDAO.create(name, content, user);
  }

  public void archiveReceivedMessages(UserEntity user, CommunicatorMessageId messageId) {
    List<CommunicatorMessageRecipient> received = communicatorMessageRecipientDAO.listByUserAndMessageId(user, messageId);
    
    for (CommunicatorMessageRecipient recipient : received) {
      communicatorMessageRecipientDAO.archiveRecipient(recipient);
    }
  }

  public void archiveSentMessages(UserEntity user, CommunicatorMessageId messageId) {
    List<CommunicatorMessage> sent = communicatorMessageDAO.listBySenderAndMessageId(user, messageId);

    for (CommunicatorMessage msg : sent) {
      communicatorMessageDAO.archiveSent(msg);
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
        }
        
        return o1.getId().compareTo(o2.getId());
      }
    });
    
    result.addAll(communicatorMessageDAO.listBySenderAndMessageId(user, messageId));
    result.addAll(communicatorMessageDAO.listByRecipientAndMessageId(user, messageId));
    
    return new ArrayList<>(result);
  }

  public CommunicatorMessageRecipient updateRead(CommunicatorMessageRecipient recipient, boolean value) {
    return communicatorMessageRecipientDAO.updateRecipientRead(recipient, value);
  }

  public CommunicatorMessage postMessage(UserEntity sender, String category, String subject, String content, List<UserEntity> recipients) {
    CommunicatorMessageId communicatorMessageId = createMessageId();
    
    // TODO Category not existing at this point would technically indicate an invalid state 
    CommunicatorMessageCategory categoryEntity = persistCategory(category);
    
    return createMessage(communicatorMessageId, sender, recipients, categoryEntity, subject, content, null);
  }

  public CommunicatorMessage replyToMessage(UserEntity sender, String category, String subject, String content, List<UserEntity> recipients, CommunicatorMessageId communicatorMessageId) {
    CommunicatorMessageCategory categoryEntity = persistCategory(category);
    
    return createMessage(communicatorMessageId, sender, recipients, categoryEntity, subject, content, null);
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
    communicatorUserLabelDAO.delete(communicatorUserLabel);
  }

}
