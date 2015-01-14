package fi.muikku.plugins.schooldatapyramus.rest;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.context.SessionScoped;
import javax.inject.Inject;
import javax.ws.rs.client.Client;

import org.joda.time.DateTime;

import fi.muikku.session.SessionController;

@SessionScoped
public class UserPyramusClient extends AbstractPyramusClient implements Serializable {

  private static final long serialVersionUID = -2643693371146903250L;
  
  @Inject
  private SessionController sessionController;
  
  @PostConstruct
  public void init() {
    pooledClients = new ArrayList<>();
    initToken();
  }

  @PreDestroy
  public void deinit() {
    for (Client pooledClient : pooledClients) {
      pooledClient.close();
    }
  }
  
  @Override
  protected synchronized String getAccessToken() {
    
    if(accessToken == null){
      initToken();
    }

    if(accessTokenExpires.before(new Date())){
      AccessToken refreshedAccessToken = refreshAccessToken(refreshToken);
      Calendar calendar = new GregorianCalendar();
      calendar.setTime(new Date());
      calendar.add(Calendar.SECOND, refreshedAccessToken.getExpiresIn());
      accessTokenExpires = calendar.getTime();
      accessToken = refreshedAccessToken.getAccessToken();
    }
    
    return accessToken;
    
  }

  @Override
  protected synchronized Client obtainClient() {
    if (pooledClients.isEmpty()) {
      return buildClient();
    }
    
    return pooledClients.remove(pooledClients.size() - 1);
  }

  @Override
  protected synchronized void releaseClient(Client client) {
    pooledClients.add(client);
  }

  private void initToken(){
    fi.muikku.session.AccessToken accessToken = sessionController.getOAuthAccessToken("pyramus");
    this.accessToken = accessToken.getToken();
    this.refreshToken = accessToken.getRefreshToken();
    this.accessTokenExpires = accessToken.getExpires();
  }
  
  private List<Client> pooledClients;
  private String accessToken;
  private String refreshToken;
  private Date accessTokenExpires;
  
}
