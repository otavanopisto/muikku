package fi.muikku.plugins.googlecalendar;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.SimpleTimeZone;
import java.util.TimeZone;

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
import com.google.api.services.calendar.model.AclRule;
import com.google.api.services.calendar.model.AclRule.Scope;
import com.google.api.services.calendar.model.CalendarListEntry;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventAttendee;
import com.google.api.services.calendar.model.EventDateTime;

import fi.muikku.calendar.CalendarEvent;
import fi.muikku.calendar.CalendarEventAttendee;
import fi.muikku.calendar.CalendarEventLocation;
import fi.muikku.calendar.CalendarEventRecurrence;
import fi.muikku.calendar.CalendarEventReminder;
import fi.muikku.calendar.CalendarEventStatus;
import fi.muikku.calendar.CalendarEventTemporalField;
import fi.muikku.calendar.CalendarEventUser;
import fi.muikku.calendar.CalendarServiceException;
import fi.muikku.calendar.DefaultCalendarEventLocation;
import fi.muikku.session.AccessToken;
import fi.muikku.session.SessionController;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

@Dependent
@Stateless
public class GoogleCalendarClient {

  private static final HttpTransport TRANSPORT = new NetHttpTransport();
  private static final JsonFactory JSON_FACTORY = new JacksonFactory();

  @Inject
  private SessionController sessionController;

  public fi.muikku.calendar.Calendar createCalendar(String summary, String description) throws CalendarServiceException {
    com.google.api.services.calendar.model.Calendar calendar = new com.google.api.services.calendar.model.Calendar();

    calendar.setSummary(summary);
    calendar.setDescription(description);
    try {
      calendar = getClient().calendars().insert(calendar).execute();
    } catch (IOException | GeneralSecurityException ex) {
      throw new CalendarServiceException(ex);
    }

    return new GoogleCalendar(summary, description, calendar.getId(), true);
  }

  public fi.muikku.calendar.Calendar findCalendar(String id) throws CalendarServiceException {
    try {
      com.google.api.services.calendar.model.Calendar result = getClient().calendars().get(id).execute();
      return new GoogleCalendar(result.getSummary(),
              result.getDescription(),
              id,
              isWritable(result));
    } catch (GoogleJsonResponseException ex) {
      return null;
    } catch (IOException | GeneralSecurityException ex) {
      throw new CalendarServiceException(ex);
    }
  }

  public List<fi.muikku.calendar.Calendar> listPublicCalendars() throws CalendarServiceException {
    try {
      Calendar client = getClient();

      ArrayList<fi.muikku.calendar.Calendar> result = new ArrayList<>();
      for (CalendarListEntry entry
              : client.calendarList().list().execute().getItems()) {
        result.add(
                new GoogleCalendar(entry.getSummary(),
                        entry.getDescription(),
                        entry.getId(),
                        isWritable(entry)));
      }

      return result;
    } catch (IOException | GeneralSecurityException ex) {
      throw new CalendarServiceException(ex);
    }
  }

  public fi.muikku.calendar.Calendar updateCalendar(fi.muikku.calendar.Calendar calendar) throws CalendarServiceException {
    try {
      getClient().calendars().update(
                calendar.getId(),
                new com.google.api.services.calendar.model.Calendar()
                        .setDescription(calendar.getDescription())
                        .setSummary(calendar.getDescription()));
      return calendar;
    } catch (GeneralSecurityException | IOException ex) {
      throw new CalendarServiceException(ex);
    }
  }

  public void deleteCalendar(fi.muikku.calendar.Calendar calendar) throws CalendarServiceException {
    try {
      getClient().calendars().delete(calendar.getId());
    } catch (GeneralSecurityException | IOException ex) {
      throw new CalendarServiceException(ex);
    }
  }

  public AclRule insertCalendarAclRule(String calendarId, AclRule aclRule) throws CalendarServiceException {
    try {
      return getClient().acl().insert(calendarId, aclRule).execute();
    } catch (IOException | GeneralSecurityException ex) {
      throw new CalendarServiceException(ex);
    }
  }

  public AclRule insertCalendarUserAclRule(String calendarId, String email, String role) throws CalendarServiceException {
    Scope scope = new Scope();
    scope.setType("user");
    scope.setValue(email);

    AclRule aclRule = new AclRule();
    aclRule.setRole(role);
    aclRule.setScope(scope);

    return insertCalendarAclRule(calendarId, aclRule);
  }

  public CalendarEvent createEvent(String calendarId, String summary, String description, CalendarEventStatus status, List<CalendarEventAttendee> attendees,
      CalendarEventTemporalField start, CalendarEventTemporalField end) throws CalendarServiceException {
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
                      .setTimeZone(start.getTimeZone().getID()))
              .setEnd(new EventDateTime()
                      .setDate(new DateTime(end.getDateTime()))
                      .setTimeZone(end.getTimeZone().getID())))
              /* TODO: Reminders & Recurrence */
              .execute();
      return new GoogleCalendarEvent(event, calendarId);
    } catch (IOException | GeneralSecurityException ex) {
      throw new CalendarServiceException(ex);
    }
  }

  public CalendarEvent findEvent(fi.muikku.calendar.Calendar calendar, String eventId) throws CalendarServiceException {
    try {
      Event event = getClient().events().get(calendar.getId(), eventId).execute();
      return new GoogleCalendarEvent(event, calendar.getId());
    } catch (GeneralSecurityException | IOException ex) {
      throw new CalendarServiceException(ex);
    }
  }

  public List<CalendarEvent> listEvents(String... calendarId) throws CalendarServiceException {
    ArrayList<CalendarEvent> result = new ArrayList<>();

    for (String calId : calendarId) {
      try {
        for (Event event : getClient().events().list(calId).execute().getItems()) {
          result.add(new GoogleCalendarEvent(event, calId));
        }
      } catch (GeneralSecurityException | IOException ex) {
        throw new CalendarServiceException(ex);
      }
    }

    return result;
  }

  public List<CalendarEvent> listEvents(Date minTime, Date maxTime, String... calendarId) throws CalendarServiceException {
    ArrayList<CalendarEvent> result = new ArrayList<>();

    for (String calId : calendarId) {
      try {
        for (Event event : getClient()
                .events()
                .list(calId)
                .setTimeMin(new DateTime(minTime))
                .setTimeMax(new DateTime(maxTime))
                .execute()
                .getItems()) {
          result.add(
                  new GoogleCalendarEvent(event, calId));
        }
      } catch (GeneralSecurityException | IOException ex) {
        throw new CalendarServiceException(ex);
      }
    }

    return result;
  }

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
              new HashMap<String, String>(),
              calendarEvent.getEventReminders(),
              calendarEvent.getRecurrence(),
              calendarEvent.getUrl(),
              calendarEvent.getLocation(),
              calendarEvent.isAllDay());
    } catch (IOException | GeneralSecurityException ex) {
      throw new CalendarServiceException(ex);
    }
  }

  public void deleteEvent(fi.muikku.calendar.Calendar calendar, String eventId) throws CalendarServiceException {
    try {
      getClient().events().delete(calendar.getId(), eventId).execute();
    } catch (GeneralSecurityException | IOException ex) {
      throw new CalendarServiceException(ex);
    }
  }

  private boolean isWritable(CalendarListEntry entry) {
    if ("reader".equals(entry.getAccessRole())
            || "freeBusyReader".equals(entry.getAccessRole())) {
      return false;
    } else {
      return true;
    }
  }

  private boolean isWritable(com.google.api.services.calendar.model.Calendar cal) {
    return true; // TODO
  }

  private static Date toDate(DateTime dt) {
    return new Date(dt.getValue());
  }

  private Calendar getClient() throws GeneralSecurityException, IOException {
    return new Calendar.Builder(TRANSPORT, JSON_FACTORY, getServiceAccountCredential())
                       .setApplicationName("Muikku")
                       .build();
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


  private static class GoogleCalendar implements fi.muikku.calendar.Calendar {

    private final String summary;
    private final String description;
    private final String id;
    private final boolean writable;

    public GoogleCalendar(String summary,
            String description,
            String id,
            boolean writable) {
      this.summary = summary;
      this.description = description;
      this.id = id;
      this.writable = writable;
    }

    @SuppressWarnings("unused")
    public GoogleCalendar(com.google.api.services.calendar.model.Calendar cal) {
      this(
              cal.getSummary(),
              cal.getDescription(),
              cal.getId(),
              true // TODO: is it?
      );
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

    @Override
    public boolean isWritable() {
      return writable;
    }
  }

  private static class GoogleCalendarEventTemporalField implements CalendarEventTemporalField {

    private final Date dateTime;
    private final TimeZone timeZone;

    public GoogleCalendarEventTemporalField(Date dateTime, TimeZone timeZone) {
      this.dateTime = dateTime;
      this.timeZone = timeZone;
    }

    @Override
    public Date getDateTime() {
      return dateTime;
    }

    @Override
    public TimeZone getTimeZone() {
      return timeZone;
    }

  }

  private static class GoogleCalendarEventUser implements CalendarEventUser {

    private final String displayName;
    private final String email;

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

    private final String id;
    private final String calendarId;
    private final String summary;
    private final String description;
    private final CalendarEventStatus status;
    private final List<CalendarEventAttendee> attendees;
    private final CalendarEventUser organizer;
    private final CalendarEventTemporalField start;
    private final CalendarEventTemporalField end;
    private final Date created;
    private final Date updated;
    private final Map<String, String> extendedProperties;
    private final List<CalendarEventReminder> reminders;
    private final CalendarEventRecurrence recurrence;
    private final String url;
    private final CalendarEventLocation location;
    private final boolean allDay;

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
            CalendarEventRecurrence recurrence,
            String url,
            CalendarEventLocation location,
            boolean allDay) {
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
      this.url = url;
      this.location = location;
      this.allDay = allDay;
    }

    public GoogleCalendarEvent(Event event, String calendarId) {
      this(
              event.getId(),
              calendarId,
              event.getSummary(),
              event.getDescription(),
              CalendarEventStatus.valueOf(event.getStatus().toUpperCase(Locale.ROOT)),
              null, // TODO: Attendees
              new GoogleCalendarEventUser(
                      event.getOrganizer().getDisplayName(),
                      event.getOrganizer().getEmail()),
              new GoogleCalendarEventTemporalField(
                      new Date(event.getStart().getDateTime().getValue()),
                      getJavaTimeZone(event.getStart().getTimeZone())),
              new GoogleCalendarEventTemporalField(
                      new Date(event.getEnd().getDateTime().getValue()),
                      getJavaTimeZone(event.getEnd().getTimeZone())),
              new Date(event.getCreated().getValue()),
              new Date(event.getUpdated().getValue()),
              new HashMap<String, String>(),
              null, // TODO: Reminders
              null, // TODO: Recurrence
              event.getHtmlLink(),
              new DefaultCalendarEventLocation(
                      event.getLocation(),
                      event.getHangoutLink(),
                      null,
                      null),
              event.getStart().getDate() != null);
    }

    private static TimeZone getJavaTimeZone(String timeZone) {
      if (StringUtils.isNotBlank(timeZone)) {
        return SimpleTimeZone.getTimeZone(timeZone);
      }

      // TODO: this should fallback to calendar default timezone

      return null;
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

    @Override
    public String getUrl() {
      return url;
    }

    @Override
    public CalendarEventLocation getLocation() {
      return location;
    }

    @Override
    public boolean isAllDay() {
      return allDay;
    }

  }
}
