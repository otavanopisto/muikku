package fi.muikku.plugins.googlecalendar;

import java.util.List;

import javax.inject.Inject;

import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets.Details;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.json.GoogleJsonResponseException;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson.JacksonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.CalendarListEntry;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventAttendee;
import com.google.api.services.calendar.model.EventDateTime;
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
import java.util.Locale;
import java.util.logging.Level;
import java.util.logging.Logger;

public class GoogleCalendarServiceProvider implements CalendarServiceProvider {

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
      Calendar client = getClient();

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

  @Override
  public boolean isReadOnly() {
    return false;
  }

  @Override
  public fi.muikku.calendar.Calendar createCalendar(String summary,
                                                    String description)
          throws CalendarServiceException {
    Calendar client = getClient();

    com.google.api.services.calendar.model.Calendar calendar = new com.google.api.services.calendar.model.Calendar();

    calendar.setSummary(summary);
    calendar.setDescription(description);
    try {
      calendar = client.calendars().insert(calendar).execute();
    } catch (IOException ex) {
      throw new CalendarServiceException(ex);
    }

    return new GoogleCalendar(summary, description, calendar.getId());
  }

  @Override
  public fi.muikku.calendar.Calendar findCalendar(String id) throws CalendarServiceException {
    try {
      com.google.api.services.calendar.model.Calendar result =
              getClient().calendars().get(id).execute();
      return new
        GoogleCalendar(result.getSummary(), result.getDescription(), id);
    } catch (GoogleJsonResponseException ex) {
      return null;
    } catch (IOException ex) {
      throw new CalendarServiceException(ex);
    }
  }

  @Override
  public CalendarEvent createEvent(String calendarId, String summary, String description, CalendarEventStatus status, List<CalendarEventAttendee> attendees, CalendarEventTemporalField start, CalendarEventTemporalField end, List<CalendarEventReminder> reminders, CalendarEventRecurrence recurrence) throws CalendarServiceException {
    ArrayList<EventAttendee> googleAttendees = new ArrayList<>();
    for (CalendarEventAttendee attendee : attendees) {
     googleAttendees.add(
             new EventAttendee()
             .setDisplayName(attendee.getDisplayName())
             .setComment(attendee.getDisplayName())
             .setEmail(attendee.getEmail())
             .setResponseStatus(attendee.getStatus().toString().toLowerCase(Locale.ROOT))
     );
    }

    try {
      getClient().events().insert(calendarId,
              new Event()
                      .setSummary(summary)
                      .setDescription(description)
                      .setStatus(status.toString().toLowerCase(Locale.ROOT))
                      .setAttendees(googleAttendees)
                      .setStart(new EventDateTime()
                              .setDate(new DateTime(start.getDateTime()))
                              .setTimeZone(start.getTimeZone().getDisplayName()))
                      .setEnd(new EventDateTime()
                              .setDate(new DateTime(end.getDateTime()))
                              .setTimeZone(end.getTimeZone().getDisplayName())))
      /* TODO: Reminders & Recurrence */
              .execute();
    } catch (IOException ex) {
      throw new CalendarServiceException(ex);
    }

    return null /* TODO: result */;
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

  private Calendar getClient() {
    return new Calendar.Builder(TRANSPORT,
            JSON_FACTORY,
            getCredential()).build();
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
