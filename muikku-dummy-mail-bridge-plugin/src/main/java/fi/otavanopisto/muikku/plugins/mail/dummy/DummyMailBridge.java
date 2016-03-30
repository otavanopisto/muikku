package fi.otavanopisto.muikku.plugins.mail.dummy;

import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;

import fi.otavanopisto.muikku.mail.MailAttachment;
import fi.otavanopisto.muikku.mail.MailBridge;
import fi.otavanopisto.muikku.mail.MailType;

@RequestScoped
public class DummyMailBridge implements MailBridge {

  @Inject
  private Logger logger;
  
  @Override
  public void sendMail(MailType mimeType, String from, List<String> to, List<String> cc, List<String> bcc, String subject, String content, List<MailAttachment> attachments) {
    StringBuilder message = new StringBuilder();
    message.append("DUMMY MAIL: Type: ");
    message.append(mimeType.toString());
    message.append(" From: ");
    message.append(from);
    message.append(" To: ");
    for (String email : to) {
      message.append(email);
      message.append(" ");
    }
    message.append("CC: ");
    for (String email : cc) {
      message.append(email);
      message.append(" ");
    }
    message.append("BCC: ");
    for (String email : bcc) {
      message.append(email);
      message.append(" ");
    }
    message.append("Subject: ");
    message.append(subject);
    message.append("Content: ");
    message.append(content);
    message.append(" Attachments: ");
    for (MailAttachment attachment : attachments) {
      message.append(attachment.toString());
      message.append(" ");
    }
    
    logger.log(Level.INFO, message.toString());
  }
}
