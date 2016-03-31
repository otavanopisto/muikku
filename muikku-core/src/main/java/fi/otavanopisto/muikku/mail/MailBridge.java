package fi.otavanopisto.muikku.mail;

import java.util.List;

public interface MailBridge {
  
  void sendMail(MailType mimeType, String from, List<String> to, List<String> cc, List<String> bcc, String subject, String content, List<MailAttachment> attachments);

}
