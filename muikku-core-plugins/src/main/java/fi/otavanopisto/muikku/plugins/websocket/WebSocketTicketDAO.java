package fi.otavanopisto.muikku.plugins.websocket;


import java.util.Date;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.websocket.WebSocketTicket_;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.websocket.WebSocketTicket;


public class WebSocketTicketDAO extends CorePluginsDAO<WebSocketTicket> {

  private static final long serialVersionUID = -508011193510467247L;

  public WebSocketTicket create(String ticket, Long user, String ip, Date timestamp) {
    WebSocketTicket webSocketTicket = new WebSocketTicket();
    
    webSocketTicket.setTicket(ticket);
    webSocketTicket.setUser(user);
    webSocketTicket.setIp(ip);
    webSocketTicket.setTimestamp(timestamp);
    
    getEntityManager().persist(webSocketTicket);
    
    return webSocketTicket;
  }

  public WebSocketTicket findByTicket(String ticket) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WebSocketTicket> criteria = criteriaBuilder.createQuery(WebSocketTicket.class);
    Root<WebSocketTicket> root = criteria.from(WebSocketTicket.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.equal(root.get(WebSocketTicket_.ticket), ticket)
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }
  
  @Override
  public void delete(WebSocketTicket ticket) {
    super.delete(ticket);
  }
}
