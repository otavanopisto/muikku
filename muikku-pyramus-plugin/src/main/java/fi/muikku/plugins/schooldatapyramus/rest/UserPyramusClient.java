package fi.muikku.plugins.schooldatapyramus.rest;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.enterprise.context.ApplicationScoped;
import javax.ws.rs.client.Client;

import org.joda.time.DateTime;

@ApplicationScoped
public class UserPyramusClient extends AbstractPyramusClient implements Serializable {

  private static final long serialVersionUID = -2643693371146903250L;
  private static String AUTH_CODE = "0800fc577294c34e0b28ad2839435945";

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
