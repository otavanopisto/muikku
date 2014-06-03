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
import fi.muikku.calendar.CalendarServiceException;

import fi.muikku.calendar.CalendarServiceProvider;
import fi.muikku.session.AccessToken;
import fi.muikku.session.SessionController;
import java.io.IOException;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;

public class GoogleCalendarServiceProvider implements CalendarServiceProvider {

  private static class GoogleCalendar implements fi.muikku.calendar.Calendar {

    private final String summary;
    private final String description;

    public GoogleCalendar(String summary, String description) {
      this.summary = summary;
      this.description = description;
    }

    @Override
    public String getSummary() {
      throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public String getDescription() {
      throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
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
  public List<fi.muikku.calendar.Calendar> listCalendars() throws CalendarServiceException {
      try {
          Calendar client = new Calendar.Builder(TRANSPORT,
                  JSON_FACTORY,
                  getCredential()).build();

          ArrayList<fi.muikku.calendar.Calendar> result = new ArrayList<>();
          for (CalendarListEntry entry
                  : client.calendarList().list().execute().getItems()) {
              result.add(
                      new GoogleCalendar(entry.getSummary(), entry.getDescription()));
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
