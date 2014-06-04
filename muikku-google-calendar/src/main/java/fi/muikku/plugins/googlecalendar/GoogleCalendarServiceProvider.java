package fi.muikku.plugins.googlecalendar;

import java.util.List;

import javax.inject.Inject;

import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets.Details;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson.JacksonFactory;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.CalendarListEntry;
import fi.muikku.calendar.CalendarEvent;
import fi.muikku.calendar.CalendarEventAttendee;
import fi.muikku.calendar.CalendarEventRecurrence;
import fi.muikku.calendar.CalendarEventReminder;
import fi.muikku.calendar.CalendarEventStatus;
import fi.muikku.calendar.CalendarEventTemporalField;
import fi.muikku.calendar.CalendarServiceException;

import fi.muikku.calendar.CalendarServiceProvider;
import fi.muikku.session.AccessToken;
import fi.muikku.session.SessionController;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.logging.Logger;

public class GoogleCalendarServiceProvider implements CalendarServiceProvider {

  @Override
  public boolean isReadOnly() {
    throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
  }

  @Override
  public fi.muikku.calendar.Calendar createCalendar(String summary, String description) throws CalendarServiceException {
    throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
  }

  @Override
  public fi.muikku.calendar.Calendar findCalendar(String id) throws CalendarServiceException {
    throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
  }

  @Override
  public CalendarEvent createEvent(String calendarId, String summary, String description, CalendarEventStatus status, List<CalendarEventAttendee> attendees, CalendarEventTemporalField start, CalendarEventTemporalField end, List<CalendarEventReminder> reminders, CalendarEventRecurrence recurrence) throws CalendarServiceException {
    throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
  }

  @Override
  public CalendarEvent findEvent(String id) throws CalendarServiceException {
    throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
  }

  @Override
  public List<CalendarEvent> listEvents(String... calendarId) throws CalendarServiceException {
    throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
  }

  @Override
  public List<CalendarEvent> listEvents(Date minTime, Date maxTime, String... calendarId) throws CalendarServiceException {
    throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
  }

  private static class GoogleCalendar implements fi.muikku.calendar.Calendar {

    private final String summary;
    private final String description;
    private final String id;

    public GoogleCalendar(String summary,
                          String description,
                          String id) {
      this.summary = summary;
      this.description = description;
      this.id = id;
    }

    @Override
    public String getSummary() {
      return summary;
    }

    @Override
    public String getDescription() {
      return description;
    }

    @Override
    public String getId() {
      return id;
    }

    @Override
    public String getServiceProvider() {
      return "google";
    }
  }

  private static final HttpTransport TRANSPORT = new NetHttpTransport();
  private static final JsonFactory JSON_FACTORY = new JacksonFactory();

  @Inject
  private SessionController sessionController;

  @Inject
  private Logger logger;

  @Override
  public String getName() {
    return "google";
  }

  @Override
  public List<fi.muikku.calendar.Calendar> listPublicCalendars()
          throws CalendarServiceException {
    try {
      Calendar client = new Calendar.Builder(TRANSPORT,
              JSON_FACTORY,
              getCredential()).build();

      ArrayList<fi.muikku.calendar.Calendar> result = new ArrayList<>();
      for (CalendarListEntry entry
              : client.calendarList().list().execute().getItems()) {
        result.add(
                new GoogleCalendar(entry.getSummary(),
                                   entry.getDescription(),
                                   entry.getId()));
      }

      return result;
    } catch (IOException ex) {
      throw new CalendarServiceException(ex);
    }
  }

  private GoogleCredential getCredential() {
    AccessToken googleAccessToken = sessionController.getOAuthAccessToken("google");
    if (googleAccessToken != null) {
      Details details = new Details();
      details.setClientId("-");
      details.setClientSecret("-");

      GoogleClientSecrets secrets = new GoogleClientSecrets();
      secrets.setWeb(details);

      return new GoogleCredential.Builder()
              .setClientSecrets(secrets)
              .setTransport(TRANSPORT)
              .setJsonFactory(JSON_FACTORY)
              .build()
              .setAccessToken(googleAccessToken.getToken());
    }

    return null;
  }

}
