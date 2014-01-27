package fi.muikku.mail;

public class MailAttachment {
  
  public MailAttachment(String mimeType, byte[] content) {
    this.mimeType = mimeType;
    this.content = content;
  }
  
  public String getMimeType() {
    return mimeType;
  }
  
  public byte[] getContent() {
    return content;
  }

  private final String mimeType;
  private final byte[] content;
}
