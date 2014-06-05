package fi.muikku.plugins.googlecalendar;

import java.security.GeneralSecurityException;
import java.util.Arrays;
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
import com.google.api.services.calendar.CalendarScopes;
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
import fi.muikku.calendar.CalendarEventUser;
import fi.muikku.calendar.CalendarServiceException;
import fi.muikku.calendar.CalendarServiceProvider;
import fi.muikku.session.AccessToken;
import fi.muikku.session.SessionController;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
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

  private static class GoogleCalendarEventUser implements CalendarEventUser {

    private String displayName;
    private String email;

    public GoogleCalendarEventUser(String displayName, String email) {
      this.displayName = displayName;
      this.email = email;
    }

    @Override
    public String getDisplayName() {
      return displayName;
    }

    @Override
    public String getEmail() {
      return email;
    }


  }

  private static class GoogleCalendarEvent implements CalendarEvent {

    private String id;
    private String calendarId;
    private String summary;
    private String description;
    private CalendarEventStatus status;
    private List<CalendarEventAttendee> attendees;
    private CalendarEventUser organizer;
    private CalendarEventTemporalField start;
    private CalendarEventTemporalField end;
    private Date created;
    private Date updated;
    private Map<String, String> extendedProperties;
    private List<CalendarEventReminder> reminders;
    private CalendarEventRecurrence recurrence;

    public GoogleCalendarEvent(
        String id,
        String calendarId,
        String summary,
        String description,
        CalendarEventStatus status,
        List<CalendarEventAttendee> attendees,
        CalendarEventUser organizer,
        CalendarEventTemporalField start,
        CalendarEventTemporalField end,
        Date created,
        Date updated,
        Map<String, String> extendedProperties,
        List<CalendarEventReminder> reminders,
        CalendarEventRecurrence recurrence) {
      this.id = id;
      this.calendarId = calendarId;
      this.summary = summary;
      this.description = description;
      this.status = status;
      this.attendees = attendees;
      this.organizer = organizer;
      this.start = start;
      this.end = end;
      this.created = created;
      this.updated = updated;
      this.extendedProperties = extendedProperties;
      this.reminders = reminders;
      this.recurrence = recurrence;
    }


    @Override
    public String getId() {
      return id;
    }

    @Override
    public String getCalendarId() {
      return calendarId;
    }

    @Override
    public String getServiceProvider() {
      return "google";
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
    public CalendarEventStatus getStatus() {
      return status;
    }

    @Override
    public List<CalendarEventAttendee> getAttendees() {
      return attendees;
    }

    @Override
    public CalendarEventUser getOrganizer() {
      return organizer;
    }

    @Override
    public CalendarEventTemporalField getStart() {
      return start;
    }

    @Override
    public CalendarEventTemporalField getEnd() {
      return end;
    }

    @Override
    public Date getCreated() {
      return created;
    }

    @Override
    public Date getUpdated() {
      return updated;
    }

    @Override
    public Map<String, String> getExtendedProperties() {
      return extendedProperties;
    }

    @Override
    public List<CalendarEventReminder> getEventReminders() {
      return reminders;
    }

    @Override
    public CalendarEventRecurrence getRecurrence() {
      return recurrence;
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
    } catch (GeneralSecurityException e) {
      throw new CalendarServiceException(e);
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

    com.google.api.services.calendar.model.Calendar calendar = new com.google.api.services.calendar.model.Calendar();

    calendar.setSummary(summary);
    calendar.setDescription(description);
    try {
      calendar = getClient().calendars().insert(calendar).execute();
    } catch (IOException | GeneralSecurityException ex) {
      throw new CalendarServiceException(ex);
    }

    return new GoogleCalendar(summary, description, calendar.getId());
  }

  @Override
  public fi.muikku.calendar.Calendar findCalendar(String id) throws CalendarServiceException {
    try {
      com.google.api.services.calendar.model.Calendar result = getClient().calendars().get(id).execute();
      return new
        GoogleCalendar(result.getSummary(), result.getDescription(), id);
    } catch (GoogleJsonResponseException ex) {
      return null;
    } catch (IOException | GeneralSecurityException ex) {
      throw new CalendarServiceException(ex);
    }
  }

  @Override
  public CalendarEvent findEvent(fi.muikku.calendar.Calendar calendar, String eventId) throws CalendarServiceException {
    throw new UnsupportedOperationException("Not supported yet.");
  }

  @Override
  public fi.muikku.calendar.Calendar updateCalendar(fi.muikku.calendar.Calendar calendar) throws CalendarServiceException {
    throw new UnsupportedOperationException("Not supported yet.");
  }

  @Override
  public void deleteCalendar(fi.muikku.calendar.Calendar calendar) throws CalendarServiceException {
    throw new UnsupportedOperationException("Not supported yet.");
  }


  @Override
  public CalendarEvent createEvent(String calendarId,
          String summary,
          String description,
          CalendarEventStatus status,
          List<CalendarEventAttendee> attendees,
          CalendarEventTemporalField start,
          CalendarEventTemporalField end,
          List<CalendarEventReminder> reminders,
          CalendarEventRecurrence recurrence) throws CalendarServiceException {
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
      Event event = getClient().events().insert(calendarId,
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
      return new GoogleCalendarEvent(
              event.getId(),
              calendarId,
              summary,
              description,
              status,
              attendees,
              new GoogleCalendarEventUser(event.getOrganizer().getDisplayName(),
                                          event.getOrganizer().getEmail()),
              start,
              end,
              toDate(event.getCreated()),
              toDate(event.getUpdated()),
              new HashMap<String,String>(),
              reminders,
              recurrence);
    } catch (IOException | GeneralSecurityException ex) {
      throw new CalendarServiceException(ex);
    }
  }

  @Override
  public List<CalendarEvent> listEvents(String... calendarId) throws CalendarServiceException {
    throw new UnsupportedOperationException("Not supported yet.");
  }

  @Override
  public List<CalendarEvent> listEvents(Date minTime, Date maxTime, String... calendarId) throws CalendarServiceException {
    throw new UnsupportedOperationException("Not supported yet.");
  }

  @Override
  public CalendarEvent updateEvent(CalendarEvent calendarEvent) throws CalendarServiceException {
    ArrayList<EventAttendee> googleAttendees = new ArrayList<>();
    for (CalendarEventAttendee attendee : calendarEvent.getAttendees()) {
     googleAttendees.add(
             new EventAttendee()
             .setDisplayName(attendee.getDisplayName())
             .setComment(attendee.getDisplayName())
             .setEmail(attendee.getEmail())
             .setResponseStatus(attendee.getStatus().toString().toLowerCase(Locale.ROOT))
     );
    }

    try {
      Event event = getClient().events().patch(calendarEvent.getCalendarId(),
              calendarEvent.getId(),
              new Event()
                      .setSummary(calendarEvent.getSummary())
                      .setDescription(calendarEvent.getDescription())
                      .setStatus(calendarEvent.getStatus().toString().toLowerCase(Locale.ROOT))
                      .setAttendees(googleAttendees)
                      .setStart(new EventDateTime()
                              .setDate(new DateTime(calendarEvent.getStart().getDateTime()))
                              .setTimeZone(calendarEvent.getStart().getTimeZone().getDisplayName()))
                      .setEnd(new EventDateTime()
                              .setDate(new DateTime(calendarEvent.getEnd().getDateTime()))
                              .setTimeZone(calendarEvent.getEnd().getTimeZone().getDisplayName())))
      /* TODO: Reminders & Recurrence */
              .execute();
      return new GoogleCalendarEvent(
              event.getId(),
              calendarEvent.getCalendarId(),
              calendarEvent.getSummary(),
              calendarEvent.getDescription(),
              calendarEvent.getStatus(),
              calendarEvent.getAttendees(),
              new GoogleCalendarEventUser(event.getOrganizer().getDisplayName(),
                                          event.getOrganizer().getEmail()),
              calendarEvent.getStart(),
              calendarEvent.getEnd(),
              toDate(event.getCreated()),
              toDate(event.getUpdated()),
              new HashMap<String,String>(),
              calendarEvent.getEventReminders(),
              calendarEvent.getRecurrence());
    } catch (IOException | GeneralSecurityException ex) {
      throw new CalendarServiceException(ex);
    }
  }

  @Override
  public void deleteEvent(fi.muikku.calendar.Calendar calendar, String eventId) throws CalendarServiceException {
    throw new UnsupportedOperationException("Not supported yet.");
  }


  private Date toDate(DateTime dt) {
    return new Date(dt.getValue());
  }

  private Calendar getClient() throws GeneralSecurityException, IOException {
    return new Calendar.Builder(TRANSPORT, JSON_FACTORY, getServiceAccountCredential()).build();
  }

  private GoogleCredential getServiceAccountCredential() throws GeneralSecurityException, IOException {
    String accountId = System.getProperty("muikku.googleServiceAccount.accountId");
    String accountUser = System.getProperty("muikku.googleServiceAccount.accountUser");
    java.io.File keyFile = new java.io.File(System.getProperty("muikku.googleServiceAccount.keyFile"));

    return new GoogleCredential.Builder()
      .setTransport(new NetHttpTransport())
      .setJsonFactory(new JacksonFactory())
      .setServiceAccountId(accountId)
      .setServiceAccountScopes(Arrays.asList(CalendarScopes.CALENDAR))
      .setServiceAccountPrivateKeyFromP12File(keyFile)
      .setServiceAccountUser(accountUser)
      .build();
  }

  @SuppressWarnings("unused")
  private GoogleCredential getAccessTokenCredential() {
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
