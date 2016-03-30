package fi.otavanopisto.muikku.mail;

public enum MailType {
  PLAINTEXT("text/plain; charset=UTF-8"),
  HTML("text/html; charset=UTF-8");
  
  private MailType(final String text) {
    this.text = text;
  }

  @Override
  public String toString() {
      return text;
  }  
  
  private final String text;
}
