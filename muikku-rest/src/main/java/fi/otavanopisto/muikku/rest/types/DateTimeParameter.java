package fi.otavanopisto.muikku.rest.types;

import java.io.Serializable;

import org.threeten.bp.ZonedDateTime;

public class DateTimeParameter implements Serializable {
  
  private static final long serialVersionUID = 1L;

  public DateTimeParameter(String dateString) {
    dateTime = ZonedDateTime.parse(dateString);
  }
  
  public ZonedDateTime getDateTime() {
    return dateTime;
  }
  
  private final ZonedDateTime dateTime;
}