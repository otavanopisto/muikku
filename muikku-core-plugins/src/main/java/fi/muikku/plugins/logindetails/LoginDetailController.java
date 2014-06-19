package fi.muikku.plugins.logindetails;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.faces.application.FacesMessage;
import javax.inject.Inject;

import fi.muikku.events.LoginEvent;
import fi.muikku.plugins.commonlog.LogProvider;
import fi.muikku.utils.FacesUtils;

@Dependent
@Stateless
public class LoginDetailController {

  public static final String COLLECTION_NAME = "loginDetails";
  public static final String LOG_PROVIDER = "mongo-provider";

  @Inject
  private Logger logger;

  @Any
  @Inject
  Instance<LogProvider> logProviders;

  public void log(LoginEvent loginEvent) {
    HashMap<String, Object> data = new HashMap<String, Object>();
    data.put("eventType", "login");
    data.put("userid", loginEvent.getUserEntityId());
    data.put("authSource", loginEvent.getUserAuthSource());
    data.put("address", loginEvent.getUserIPAddr());
    data.put("time", System.currentTimeMillis());
    LogProvider provider = getProvider(LOG_PROVIDER);
    if (provider != null) {
      try {
        provider.log(COLLECTION_NAME, data);
        String detailMsg = getLastLogin(loginEvent.getUserEntityId());
        if (detailMsg != null) {
          FacesUtils.addMessage(FacesMessage.SEVERITY_INFO, detailMsg);
        }
      } catch (Exception e) {
        logger.log(Level.WARNING, "Could not initialize connection to log provider because of an exception " + e.getMessage());
      }
    } else {
      logger.log(Level.WARNING, "Log provider plugin not found, cannot log event.");
    }
  }

  public ArrayList<HashMap<String, Object>> getLastLogins(Long userid, int count) { // TODO create pojos
    HashMap<String, Object> query = new HashMap<String, Object>();
    query.put("userid", userid);
    LogProvider provider = getProvider(LOG_PROVIDER);
    if (provider != null) {
      return provider.getLogEntries(COLLECTION_NAME, query, count);
    }
    return null;
  }

  public String getLastLogin(Long userid) {
    ArrayList<HashMap<String, Object>> logins = getLastLogins(userid, 2);
    if (logins.size() < 2) {
      return null;
    } else {
      HashMap<String, Object> login = logins.get(logins.size() - 1);
      String details = "Last login ";
      if (login.containsKey("time")) {
        Date date = new Date((long) login.get("time"));
        details += " " + new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(date);
      }
      if (login.containsKey("address")) {
        details += " from: " + login.get("address");
      }
      if (login.containsKey("authSource")) {
        details += " with authentication method: " + login.get("authSource");
      }
      return details;
    }
  }

  private LogProvider getProvider(String name) {
    Iterator<LogProvider> providers = logProviders.iterator();
    while (providers.hasNext()) {
      LogProvider provider = providers.next();
      if (provider.getName().equals(name)) {
        return provider;
      }
    }
    return null;
  }
}
