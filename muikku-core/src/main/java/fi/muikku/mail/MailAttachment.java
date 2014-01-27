package fi.muikku.mail;

import javax.activation.MimeType;

public class MailAttachment {
  
  public MailAttachment(MimeType mimeType, byte[] content) {
    this.mimeType = mimeType;
    this.content = content;
  }
  
  public MimeType getMimeType() {
    return mimeType;
  }
  
  public byte[] getContent() {
    return content;
  }

  private final MimeType mimeType;
  private final byte[] content;
}
