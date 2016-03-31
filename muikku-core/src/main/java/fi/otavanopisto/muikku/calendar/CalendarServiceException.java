package fi.otavanopisto.muikku.calendar;

public class CalendarServiceException extends Exception {
  
  private static final long serialVersionUID = 1826843893157140788L;

  public CalendarServiceException(Throwable t) {
    super(t);
  }
  
  public CalendarServiceException(String message) {
    super(message);
  }
  
}
