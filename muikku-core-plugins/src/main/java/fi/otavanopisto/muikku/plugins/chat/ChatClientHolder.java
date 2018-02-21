package fi.otavanopisto.muikku.plugins.chat;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.ejb.ConcurrencyManagement;
import javax.ejb.ConcurrencyManagementType;
import javax.ejb.Schedule;
import javax.ejb.Singleton;
import javax.inject.Inject;

import rocks.xmpp.core.session.XmppClient;

@Singleton
@ConcurrencyManagement(ConcurrencyManagementType.BEAN)
public class ChatClientHolder {
  private static final int CLIENT_LIFETIME_SECONDS = 2*60;
  
  @Inject
  private Logger logger;
  
  private static class DatedClient {
    XmppClient client;
    Instant created;

    public DatedClient(XmppClient client, Instant created) {
      super();
      this.client = client;
      this.created = created;
    }
  }

  private List<DatedClient> clients;
  
  @PostConstruct
  public void initialize() {
    clients = Collections.synchronizedList(new ArrayList<>());
  }
  
  public void addClient(XmppClient client) {
    DatedClient datedClient = new DatedClient(client, Instant.now());
    clients.add(datedClient);
  }

  @Schedule(second = "0", minute = "*/2", hour = "*", persistent = false)
  public void cleanUpClients() {
    synchronized (clients) {
      Iterator<DatedClient> iterator = clients.iterator();
      
      Instant threshold = Instant.now().minusSeconds(CLIENT_LIFETIME_SECONDS);
      while (iterator.hasNext()) {
        DatedClient client = iterator.next();
        if (client.created.isBefore(threshold)) {
          try {
            client.client.close();
            iterator.remove();
          } catch (Exception e) {
            logger.info("Error while closing XMPP connection: " + e.getMessage());
          }
        }
      }
    }
  }
}
