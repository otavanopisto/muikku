package fi.muikku.mail;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;


@RequestScoped
public class Mailer {

  @Inject
  private MailBridge bridge;

  public void sendMail(MailType mailType, String from, List<String> to, List<String> cc, List<String> bcc, String subject, String content, List<MailAttachment> attachments) {
    bridge.sendMail(mailType, from, to, cc, bcc, subject, content, attachments);
  }

  public void sendMail(String from, String to, String subject, String content) {
    List<String> toList = new ArrayList<>();
    toList.add(to);
    this.sendMail(MailType.PLAINTEXT, from, toList, new ArrayList<String>(), new ArrayList<String>(), subject, content, new ArrayList<MailAttachment>());
  }
  
  public void sendMailToGroup(String from, List<String> bcc, String subject, String content) {
    this.sendMail(MailType.PLAINTEXT, from, new ArrayList<String>(), new ArrayList<String>(), bcc, subject, content, new ArrayList<MailAttachment>());
  }

}
