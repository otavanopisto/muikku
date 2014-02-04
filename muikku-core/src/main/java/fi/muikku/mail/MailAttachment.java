package fi.muikku.mail;

import org.apache.commons.codec.binary.Hex;

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
  
  public String toString() {
    return "Type: " + mimeType + " Content: 0x" + Hex.encodeHexString(content);
  }

  private final String mimeType;
  private final byte[] content;
}
