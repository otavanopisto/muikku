package fi.otavanopisto.muikku.plugins.mail.jndi;

import java.util.List;

import fi.otavanopisto.muikku.mail.MailAttachment;
import fi.otavanopisto.muikku.mail.MailType;

public class JndiMailEvent {

  public JndiMailEvent(MailType mimeType, String from, List<String> to, List<String> cc, List<String> bcc,
      String subject, String content, List<MailAttachment> attachments) {
    super();
    this.mimeType = mimeType;
    this.from = from;
    this.to = to;
    this.cc = cc;
    this.bcc = bcc;
    this.subject = subject;
    this.content = content;
    this.attachments = attachments;
  }

  public MailType getMimeType() {
    return mimeType;
  }

  public String getFrom() {
    return from;
  }

  public List<String> getTo() {
    return to;
  }

  public List<String> getCc() {
    return cc;
  }

  public List<String> getBcc() {
    return bcc;
  }

  public String getSubject() {
    return subject;
  }

  public String getContent() {
    return content;
  }

  public List<MailAttachment> getAttachments() {
    return attachments;
  }

  private MailType mimeType;
  private String from;
  private List<String> to;
  private List<String> cc;
  private List<String> bcc;
  private String subject;
  private String content;
  private List<MailAttachment> attachments;
}
