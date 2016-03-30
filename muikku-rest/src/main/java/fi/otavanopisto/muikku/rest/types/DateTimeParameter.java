package fi.otavanopisto.muikku.rest.types;

import java.io.Serializable;

import org.joda.time.DateTime;
import org.joda.time.format.ISODateTimeFormat;

public class DateTimeParameter implements Serializable {
  
  private static final long serialVersionUID = 1L;

  public DateTimeParameter(String dateString) {
    dateTime = ISODateTimeFormat.dateTimeParser().parseDateTime(dateString);
  }
  
  public DateTime getDateTime() {
    return dateTime;
  }
  
  private final DateTime dateTime;
}