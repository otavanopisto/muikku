package fi.muikku.plugins.googlecalendar;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

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

import fi.muikku.calendar.CalendarEvent;
import fi.muikku.calendar.CalendarEventAttendee;
import fi.muikku.calendar.CalendarEventLocation;
import fi.muikku.calendar.CalendarEventReminder;
import fi.muikku.calendar.CalendarEventStatus;
import fi.muikku.calendar.CalendarEventTemporalField;
import fi.muikku.calendar.CalendarEventUser;
import fi.muikku.calendar.CalendarServiceException;
import fi.muikku.calendar.DefaultCalendarEvent;
import fi.muikku.calendar.DefaultCalendarEventLocation;
import fi.muikku.plugins.googlecalendar.model.GoogleCalendar;
import fi.muikku.plugins.googlecalendar.model.GoogleCalendarEventUser;
import fi.muikku.session.AccessToken;
import fi.muikku.session.SessionController;

@Dependent
@Stateless
public class GoogleCalendarClient {

  private static final HttpTransport TRANSPORT = new NetHttpTransport();
  private static final JsonFactory JSON_FACTORY = new JacksonFactory();

  @Inject
  private Logger logger;

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

  public CalendarEvent createEvent(
          String calendarId,
          String summary,
          String description,
          CalendarEventStatus status,
          List<CalendarEventAttendee> attendees,
          CalendarEventTemporalField start,
          CalendarEventTemporalField end,
          String recurrence,
          boolean allDay) throws CalendarServiceException {
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
      Event event = new Event()
        .setSummary(summary)
        .setDescription(description)
        .setStatus(status.toString().toLowerCase(Locale.ROOT))
        .setAttendees(googleAttendees)
        .setStart(Convert.toEventDateTime(allDay, start))
        .setEnd(Convert.toEventDateTime(allDay, end));
      
      if (StringUtils.isNotBlank(recurrence)) {
        event.setRecurrence(Arrays.asList(String.format("RRULE:%s", recurrence)));
      }

      return toMuikkuEvent(calendarId, getClient().events().insert(calendarId, event).execute());
    } catch (IOException | GeneralSecurityException ex) {
      throw new CalendarServiceException(ex);
    }
  }

  public CalendarEvent findEvent(fi.muikku.calendar.Calendar calendar, String eventId) throws CalendarServiceException {
    try {
      Event event = getClient().events().get(calendar.getId(), eventId).execute();
      return toMuikkuEvent(calendar.getId(), event);
    } catch (GeneralSecurityException | IOException ex) {
      throw new CalendarServiceException(ex);
    }
  }

  public List<CalendarEvent> listEvents(String... calendarId) throws CalendarServiceException {
    ArrayList<CalendarEvent> result = new ArrayList<>();

    for (String calId : calendarId) {
      try {
        for (Event event : getClient().events().list(calId).execute().getItems()) {
          result.add(toMuikkuEvent(calId, event));
        }
      } catch (GeneralSecurityException | IOException ex) {
        throw new CalendarServiceException(ex);
      }
    }

    return result;
  }

  public List<CalendarEvent> listEvents(org.joda.time.DateTime minTime, org.joda.time.DateTime maxTime, String... calendarId) throws CalendarServiceException {
    ArrayList<CalendarEvent> result = new ArrayList<>();

    for (String calId : calendarId) {
      try {
        for (Event event : getClient()
                .events()
                .list(calId)
                .setTimeMin(new DateTime(minTime.getMillis()))
                .setTimeMax(new DateTime(maxTime.getMillis()))
                .execute()
                .getItems()) {
          result.add(toMuikkuEvent(calId, event));
          logger.log(Level.INFO, event.toPrettyString());
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
      Event event = new Event()
        .setSummary(calendarEvent.getSummary())
        .setDescription(calendarEvent.getDescription())
        .setStatus(calendarEvent.getStatus().toString().toLowerCase(Locale.ROOT))
        .setAttendees(googleAttendees)
        .setStart(Convert.toEventDateTime(calendarEvent.isAllDay(), calendarEvent.getStart()))
        .setEnd(Convert.toEventDateTime(calendarEvent.isAllDay(), calendarEvent.getEnd()));
      
      if (StringUtils.isNotBlank(calendarEvent.getRecurrence())) {
        event.setRecurrence(Arrays.asList(String.format("RRULE:%s", calendarEvent.getRecurrence())));
      }
      
      return toMuikkuEvent(calendarEvent.getCalendarId(), getClient().events().patch(calendarEvent.getCalendarId(), calendarEvent.getId(), event).execute());
    } catch (IOException | GeneralSecurityException ex) {
      throw new CalendarServiceException(ex);
    }
  }
  
  private CalendarEvent toMuikkuEvent(String calendarId, Event event) {
    String url = event.getHangoutLink();
    CalendarEventLocation location = new DefaultCalendarEventLocation(event.getLocation(), null, null, null);
    CalendarEventStatus status = CalendarEventStatus.valueOf(event.getStatus().toUpperCase(Locale.ROOT));
    // TODO: attendees
    List<CalendarEventAttendee> attendees = null;
    CalendarEventUser organizer = new GoogleCalendarEventUser(event.getOrganizer().getDisplayName(), event.getOrganizer().getEmail());
    CalendarEventTemporalField start = Convert.toCalendarEventTemporalField(event.getStart());
    CalendarEventTemporalField end = Convert.toCalendarEventTemporalField(event.getEnd());
    boolean allDay = event.getStart().getDate() != null;
    Map<String, String> extendedProperties = Collections.emptyMap();
    // TODO: reminders
    List<CalendarEventReminder> reminders = null;
    String recurrence = null;
    
    if (event.getRecurrence() != null && !event.getRecurrence().isEmpty()) {
      List<String> rrules = new ArrayList<String>();
      for (String rule : event.getRecurrence()) {
        if (StringUtils.startsWith(rule, "RRULE:")) {
          rrules.add(rule);
        } else {
          logger.warning(String.format("Ignoring unsupported recurrence rule %s from Google", rule));
        }
      }
      
      if (rrules.isEmpty()) {
        logger.warning("Could not parse recurring event recurrene because all rules were in unsupported formats");
      } else {
        if (rrules.size() > 1) {
          logger.warning(String.format("More than one recurrence rule defined. Ignoring %d rules", rrules.size() - 1));
        }
        
        recurrence = StringUtils.substring(rrules.get(0), 6);
      }
    }

    return new DefaultCalendarEvent(event.getId(), 
        calendarId,
        "google", 
        event.getSummary(),
        event.getDescription(),
        url,
        location,
        status,
        attendees, 
        organizer, 
        start, 
        end, 
        allDay, 
        Convert.toDate(event.getCreated()),
        Convert.toDate(event.getUpdated()),
        extendedProperties, 
        reminders, 
        recurrence);
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


  private Calendar getClient() throws GeneralSecurityException, IOException {
    return new Calendar.Builder(TRANSPORT, JSON_FACTORY, getServiceAccountCredential())
                       .setApplicationName("Muikku")
                       .build();
  }

  private GoogleCredential getServiceAccountCredential() throws GeneralSecurityException, IOException {
    String accountEmail = System.getProperty("muikku.googleServiceAccount.accountEmail");
    if (StringUtils.isBlank(accountEmail)) {
      throw new GeneralSecurityException("muikku.googleServiceAccount.accountEmail environment property is missing");
    }
    
    String accountUser = System.getProperty("muikku.googleServiceAccount.accountUser");
    if (StringUtils.isBlank(accountUser)) {
      throw new GeneralSecurityException("muikku.googleServiceAccount.accountUser environment property is missing");
    }

    String keyFilePath = System.getProperty("muikku.googleServiceAccount.keyFile");
    if (StringUtils.isBlank(keyFilePath)) {
      throw new GeneralSecurityException("muikku.googleServiceAccount.keyFile environment property is missing");
    }

    java.io.File keyFile = new java.io.File(keyFilePath);
    if (!keyFile.exists()) {
      throw new GeneralSecurityException("muikku.googleServiceAccount.keyFile environment property is pointing into non-existing file");
    }
    
    return new GoogleCredential.Builder()
            .setTransport(new NetHttpTransport())
            .setJsonFactory(new JacksonFactory())
            .setServiceAccountId(accountEmail)
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
