package fi.muikku.mail;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.activation.MimeType;
import javax.activation.MimeTypeParseException;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;

@RequestScoped
public class Mailer {
  
  @Inject
  private Logger logger;
  
  @Inject
  private MailBridge bridge;
  
  public void sendMail(MimeType mimeType, String from, List<String> to, List<String> cc, List<String> bcc, String content, List<MailAttachment> attachments) {
    bridge.sendMail(mimeType, from, to, cc, bcc, content, attachments);
  }
  
  public void sendMailSimple(String from, String to, String content) {
    List<String> toList = new ArrayList<>();
    toList.add(to);
    try {
      MimeType mimeType = new MimeType("text", "plain");
      this.sendMail(mimeType, from, toList, new ArrayList<String>(), new ArrayList<String>(), content, new ArrayList<MailAttachment>());
    } catch (MimeTypeParseException ex) {
      logger.log(Level.SEVERE, "Could not parse text/plain mimetype");
    }
  }
  
  public void sendMailToGroup(String from, List<String> bcc, String content) {
    try {
      MimeType mimeType = new MimeType("text", "plain");
      this.sendMail(mimeType, from, new ArrayList<String>(), new ArrayList<String>(), bcc, content, new ArrayList<MailAttachment>());
    } catch (MimeTypeParseException ex) {
      logger.log(Level.SEVERE, "Could not parse text/plain mimetype");
    }
  }
  
  
}
