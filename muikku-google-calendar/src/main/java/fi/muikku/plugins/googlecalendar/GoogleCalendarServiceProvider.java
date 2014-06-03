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

import fi.muikku.calendar.CalendarServiceProvider;
import fi.muikku.session.AccessToken;
import fi.muikku.session.SessionController;

public class GoogleCalendarServiceProvider implements CalendarServiceProvider {

  private static final HttpTransport TRANSPORT = new NetHttpTransport();
  private static final JsonFactory JSON_FACTORY = new JacksonFactory();
  
  @Inject
  private SessionController sessionController;

  @Override
  public String getName() {
    return "google";
  }
 
  @Override
  public List<fi.muikku.calendar.Calendar> listCalendars() {
    return null;
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
