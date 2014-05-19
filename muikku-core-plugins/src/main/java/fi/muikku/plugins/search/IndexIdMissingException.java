package fi.muikku.plugins.search;

public class IndexIdMissingException extends Exception {

  private static final long serialVersionUID = 1L;

  public IndexIdMissingException(String message) {
    super(message);
  }
}
