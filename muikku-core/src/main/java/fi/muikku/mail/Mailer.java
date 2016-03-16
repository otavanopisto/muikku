package fi.muikku.mail;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;

import fi.muikku.controller.EnvironmentSettingsController;


public class Mailer {

  @Inject
  private MailBridge bridge;
  
  @Inject
  private EnvironmentSettingsController environmentSettingsController;

  public void sendMail(MailType mailType, String from, List<String> to, List<String> cc, List<String> bcc, String subject, String content, List<MailAttachment> attachments) {
    bridge.sendMail(mailType, from, to, cc, bcc, subject, content, attachments);
  }

  public void sendMail(String to, String subject, String content) {
    sendMail(environmentSettingsController.getSystemEmailSenderAddress(), to, subject, content);
  }
  
  public void sendMail(List<String> to, String subject, String content) {
    sendMail(environmentSettingsController.getSystemEmailSenderAddress(), to, subject, content);
  }
  
  public void sendMail(MailType mailType, List<String> to, String subject, String content) {
    this.sendMail(mailType, environmentSettingsController.getSystemEmailSenderAddress(), to, new ArrayList<String>(), new ArrayList<String>(), subject, content, new ArrayList<MailAttachment>());
  }

  public void sendMail(MailType mailType, String from, List<String> to, String subject, String content) {
    this.sendMail(mailType, from, to, new ArrayList<String>(), new ArrayList<String>(), subject, content, new ArrayList<MailAttachment>());
  }
  
  public void sendMail(String from, String to, String subject, String content) {
    List<String> toList = new ArrayList<>();
    toList.add(to);
    sendMail(from, toList, subject, content);
  }
  
  public void sendMail(String from, List<String> to, String subject, String content) {
    this.sendMail(MailType.PLAINTEXT, from, to, new ArrayList<String>(), new ArrayList<String>(), subject, content, new ArrayList<MailAttachment>());
  }

  public void sendMailToGroup(String from, List<String> bcc, String subject, String content) {
    this.sendMail(MailType.PLAINTEXT, from, new ArrayList<String>(), new ArrayList<String>(), bcc, subject, content, new ArrayList<MailAttachment>());
  }

}
