package fi.muikku.plugins.logindetails;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.muikku.events.LoginEvent;
import fi.muikku.plugins.commonlog.LogProvider;

@Dependent
@Stateless
public class LoginDetailController {

  public static final String COLLECTION_NAME = "loginDetails";

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
    LogProvider provider = getProvider("mongo-provider");
    if (provider != null) {
      provider.log(COLLECTION_NAME, data);
    }else{
      logger.log(Level.WARNING, "mongo-log plugin not found, cannot log event.");
    }
  }

  public List<Object> getLastLogins(int userid, int count) {
    HashMap<String, Object> query = new HashMap<String, Object>();
    query.put("userid", userid);
    LogProvider provider = getProvider("mongo-provider");
    if (provider != null) {
      return provider.getLogEntries(COLLECTION_NAME, query, count);
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
