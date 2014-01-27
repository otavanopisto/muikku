package fi.muikku.mail;

import java.util.List;

public interface MailBridge {
  
  void sendMail(MimeType mimeType, String from, List<String> to, List<String> cc, List<String> bcc, String content);

}
