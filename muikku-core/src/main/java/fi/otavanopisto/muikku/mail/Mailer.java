package fi.otavanopisto.muikku.mail;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import javax.inject.Inject;

import fi.otavanopisto.muikku.controller.SystemSettingsController;

public class Mailer {

  @Inject
  private MailBridge bridge;
  
  @Inject
  private SystemSettingsController systemSettingsController;

  public void sendMail(MailType mailType, String from, List<String> to, List<String> cc, List<String> bcc, String subject, String content, List<MailAttachment> attachments) {
    bridge.sendMail(mailType, from, to, cc, bcc, subject, content, attachments);
  }

  public void sendMail(MailType mailType, String to, String subject, String content) {
    sendMail(mailType, systemSettingsController.getSystemEmailSenderAddress(), Arrays.asList(to), subject, content);
  }

  public void sendMail(MailType mailType, List<String> to, String subject, String content) {
    sendMail(mailType, systemSettingsController.getSystemEmailSenderAddress(), to, Collections.emptyList(), Collections.emptyList(), subject, content, Collections.emptyList());
  }

  public void sendMail(MailType mailType, List<String> to, List<String> cc, List<String> bcc, String subject, String content) {
    sendMail(mailType, systemSettingsController.getSystemEmailSenderAddress(), to, cc, bcc, subject, content, Collections.emptyList());
  }

  public void sendMail(MailType mailType, String from, List<String> to, String subject, String content) {
    sendMail(mailType, from, to, Collections.emptyList(), Collections.emptyList(), subject, content, Collections.emptyList());
  }
  
  public void sendMail(String from, String to, String subject, String content) {
    sendMail(from, Arrays.asList(to), subject, content);
  }
  
  public void sendMail(String from, List<String> to, String subject, String content) {
    sendMail(MailType.PLAINTEXT, from, to, Collections.emptyList(), Collections.emptyList(), subject, content, Collections.emptyList());
  }

}
