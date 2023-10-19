package fi.otavanopisto.muikku.rest;

import java.time.Instant;
import java.time.format.DateTimeParseException;
import java.util.Date;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

/**
 * Class to use for example as a JAX-RS QueryParam which 
 * attempts  to parse the given string as UTC datetime.
 * 
 * If there are parsing errors, returns 400 Bad request
 * to the client. If the string is not present, the
 * variable is going to be null.
 * 
 * Expected datetime is f.ex. 2023-10-04T10:34:28.247Z
 * 
 * Get the parsed date by calling getInstant() or getDate().
 */
public class ISO8601UTCTimestamp {
   
  private Instant instant;

  public ISO8601UTCTimestamp(String timestamp) throws WebApplicationException {
    try {
      instant = Instant.parse(timestamp);
    } catch (DateTimeParseException ex) {
      throw new WebApplicationException(Response.status(Status.BAD_REQUEST).entity("Invalid UTC datetime format").build());
    }
  }

  public Instant getInstant() {
    return instant;
  }
  
  public Date getDate() {
    return Date.from(instant);
  }

  @Override
  public String toString() {
    if (instant != null) {
      return instant.toString();
    } else {
      return "";
    }
  }
}
