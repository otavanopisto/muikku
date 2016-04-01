package fi.otavanopisto.muikku.search;

public class IndexIdMissingException extends Exception {

  private static final long serialVersionUID = 1L;

  public IndexIdMissingException(String message) {
    super(message);
  }
}
