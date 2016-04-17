package fi.otavanopisto.muikku.plugins.logindetails;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;

import fi.otavanopisto.muikku.events.LoginEvent;
import fi.otavanopisto.muikku.plugins.commonlog.LogProvider;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public class LoginDetailController {

  public static final String COLLECTION_NAME = "loginDetails";
  public static final String LOG_PROVIDER = "mongo-provider";

  @Inject
  private Logger logger;

  @Any
  @Inject
  private Instance<LogProvider> logProviders;

  public void log(LoginEvent loginEvent) {
    HashMap<String, Object> data = new HashMap<String, Object>();
    data.put("eventType", "login");
    data.put("userIdentifier", loginEvent.getUserIdentifier().toId());
    data.put("authenticationProvder", loginEvent.getAuthProvider().getName());
    data.put("address", loginEvent.getUserIPAddr());
    data.put("time", String.valueOf(System.currentTimeMillis()));
    LogProvider provider = getProvider(LOG_PROVIDER);
    if (provider != null) {
      try {
        provider.log(COLLECTION_NAME, data);
      } catch (Exception e) {
        logger.log(Level.WARNING, "Could not initialize connection to log provider because of an exception " + e.getMessage());
      }
    } else {
      logger.log(Level.WARNING, "Log provider plugin not found, cannot log event.");
    }
  }

  public List<LoginDetails> getLastLogins(SchoolDataIdentifier userIdentifier, int count) {
    List<LoginDetails> result = new ArrayList<>();
    
    HashMap<String, Object> query = new HashMap<String, Object>();
    query.put("userIdentifier", userIdentifier.toId());
    LogProvider provider = getProvider(LOG_PROVIDER);
    
    if (provider != null) {
      ArrayList<HashMap<String,Object>> logEntries = provider.getLogEntries(COLLECTION_NAME, query, count);
      if (logEntries != null) {
        for (HashMap<String,Object> logEntry : logEntries) {
          if (StringUtils.equals((String) logEntry.get("eventType"), "login")) {
            String userIdentifierId = (String) logEntry.get("userIdentifier");
            String authenticationProvder = (String) logEntry.get("authenticationProvder");
            String address = (String) logEntry.get("address");
            Long time = NumberUtils.createLong((String) logEntry.get("time"));
            
            if (!StringUtils.equals(userIdentifierId, userIdentifier.toId())) {
              logger.severe(String.format("Query returned login details for userIdentifer %s instead of requested %s", userIdentifierId, userIdentifier.toId()));
              continue;
            }
              
            result.add(new LoginDetails(userIdentifier, authenticationProvder, address, time != null ? new Date(time) : null));
          }
        }
      } else {
        logger.severe(String.format("Could not list user's last logins log provider returned null"));
      }
    } else {
      logger.severe(String.format("Could not list user's last logins because log provider %s could not be found", LOG_PROVIDER));
    }
    
    return result;
  }
  
  public LoginDetails getLastLogin(SchoolDataIdentifier userIdentifier) {
    List<LoginDetails> lastLogins = getLastLogins(userIdentifier, 1);
    if (lastLogins != null && !lastLogins.isEmpty()) {
      return lastLogins.get(0);
    }
    
    return null;
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
