package fi.otavanopisto.muikku.rest.types;

import java.io.Serializable;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;

public class DateTimeParameter implements Serializable {
  
  private static final long serialVersionUID = 1L;

  public DateTimeParameter(String dateString) {
    dateTime = OffsetDateTime.parse(dateString);
  }
  
  public OffsetDateTime getDateTime() {
    return dateTime;
  }
  
  private final OffsetDateTime dateTime;
}