package fi.muikku.calendar;

import java.util.List;

public interface CalendarServiceProvider {

  public String getName();

  public List<Calendar> listCalendars() throws CalendarServiceException;

}
