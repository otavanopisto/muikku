package fi.muikku.plugins.mail.jndi;

import java.util.Date;
import java.util.List;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.mail.Address;
import javax.mail.Message;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.naming.InitialContext;

import fi.muikku.mail.MailAttachment;
import fi.muikku.mail.MailBridge;
import fi.muikku.mail.MailType;

@RequestScoped
public class JndiMailBridge implements MailBridge {

  @Inject
  private Logger logger;
  
  @Override
  public void sendMail(MailType mimeType, String from, List<String> to, List<String> cc, List<String> bcc, String subject, String content, List<MailAttachment> attachments) {
    try {
      Properties props = new Properties();

      InitialContext ictx = new InitialContext(props);
      Session mailSession = (Session) ictx.lookup("java:/mail/muikku");

      MimeMessage m = new MimeMessage(mailSession);
      
      // Recipients
      
      if (!to.isEmpty()) {
        m.setRecipients(Message.RecipientType.TO, parseToAddressArray(to));
      }
      if (!cc.isEmpty()) {
        m.setRecipients(Message.RecipientType.CC, parseToAddressArray(cc));
      }
      if (!bcc.isEmpty()) {
        m.setRecipients(Message.RecipientType.BCC, parseToAddressArray(bcc));
      }
      
      // Sender
      
      if (from != null) {
        InternetAddress fromAddress = new InternetAddress(from);
        m.setFrom(fromAddress);
        m.setReplyTo(new InternetAddress[] { fromAddress });
      }
      
      // Content
      
      if (subject != null) {
        m.setSubject(subject);
      }
      if (content != null) {
        m.setContent(content, mimeType.toString());
      }
      m.setSentDate(new Date());
      
      // Sending

      Transport.send(m);
    } catch (Exception e) {
      // TODO Proper error handling
      logger.log(Level.SEVERE, "Error sending mail", e);
    }
  }

  private Address[] parseToAddressArray(List<String> list) throws AddressException {
    Address[] addresses = new Address[list.size()];
    for (int i = 0; i < list.size(); i++) {
      addresses[i] = new InternetAddress(list.get(i));
    }
    return addresses;
  }

}
