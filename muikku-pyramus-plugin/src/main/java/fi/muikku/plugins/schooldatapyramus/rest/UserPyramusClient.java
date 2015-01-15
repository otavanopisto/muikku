package fi.muikku.plugins.schooldatapyramus.rest;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.ejb.Lock;
import javax.ejb.LockType;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.context.SessionScoped;
import javax.inject.Inject;
import javax.inject.Qualifier;
import javax.ws.rs.client.Client;

import org.joda.time.DateTime;

import fi.muikku.session.SessionController;
import fi.muikku.session.local.LocalSession;

@SessionScoped
public class UserPyramusClient extends AbstractPyramusClient implements Serializable {

  private static final long serialVersionUID = -2643693371146903250L;
  
  private static final int EXPIRE_SLACK = 3;
  
  @Inject
  @LocalSession
  private SessionController sessionController;
  
  @PostConstruct
  public void init() {
    pooledClients = new ArrayList<>();
  }

  @PreDestroy
  public void deinit() {
    for (Client pooledClient : pooledClients) {
      pooledClient.close();
    }
  }
  
  @Override
  protected String getAccessToken() {
    
    fi.muikku.session.AccessToken accessToken = sessionController.getOAuthAccessToken("pyramus");
    
    if(accessToken == null){
      return null;
    }
    Date expires = accessToken.getExpires();   
    if(expires.before(new Date())){
      AccessToken refreshedAccessToken = refreshAccessToken(accessToken.getRefreshToken());
      Calendar calendar = new GregorianCalendar();
      calendar.setTime(new Date());
      calendar.add(Calendar.SECOND, (refreshedAccessToken.getExpiresIn() - EXPIRE_SLACK));
      sessionController.addOAuthAccessToken("pyramus", calendar.getTime(), refreshedAccessToken.getAccessToken(), refreshedAccessToken.getRefreshToken());
      return refreshedAccessToken.getAccessToken();
    }
    
    return accessToken.getToken();
    
  }

  @Override
  protected Client obtainClient() {
    if (pooledClients.isEmpty()) {
      return buildClient();
    }
    
    return pooledClients.remove(pooledClients.size() - 1);
  }

  @Override
  protected void releaseClient(Client client) {
    pooledClients.add(client);
  }
  
  private List<Client> pooledClients;
  
}
