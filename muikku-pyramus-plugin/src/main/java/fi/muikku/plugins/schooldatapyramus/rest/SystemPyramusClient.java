package fi.muikku.plugins.schooldatapyramus.rest;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.enterprise.context.ApplicationScoped;
import javax.ws.rs.client.Client;

import org.joda.time.DateTime;

@ApplicationScoped
public class SystemPyramusClient extends AbstractPyramusClient {

  private static String AUTH_CODE = "ff81d5b8500c773e7a1776a7963801e3";
  
  @PostConstruct
  public void init() {
    accessToken = null;
    accessTokenExpires = null;
    pooledClients = new ArrayList<>();
  }

  @PreDestroy
  public void deinit() {
    for (Client pooledClient : pooledClients) {
      pooledClient.close();
    }
  }
  
  @Override
  protected synchronized String getAccessToken() {
    if (((accessToken == null) || (accessTokenExpires == null)) || (accessTokenExpires.isBefore(System.currentTimeMillis()))) {
      AccessToken createdAccessToken = createAccessToken(AUTH_CODE);
      accessToken = createdAccessToken.getAccessToken();
      accessTokenExpires = new DateTime().plusSeconds(createdAccessToken.getExpiresIn());
    }
    
    // TODO: Change to refresh token when such is available in Pyramus
    
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
  
  private List<Client> pooledClients;
  private String accessToken;
  private DateTime accessTokenExpires;
}
