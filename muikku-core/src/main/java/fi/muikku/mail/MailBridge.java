package fi.muikku.mail;

import java.util.List;

import javax.activation.MimeType;

public interface MailBridge {
  
  void sendMail(MimeType mimeType, String from, List<String> to, List<String> cc, List<String> bcc, String content, List<MailAttachment> attachments);

}
