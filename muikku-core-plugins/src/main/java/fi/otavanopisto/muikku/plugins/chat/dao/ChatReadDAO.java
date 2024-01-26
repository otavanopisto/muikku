package fi.otavanopisto.muikku.plugins.chat.dao;

import java.util.Date;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.chat.model.ChatRead;
import fi.otavanopisto.muikku.plugins.chat.model.ChatRead_;

public class ChatReadDAO extends CorePluginsDAO<ChatRead> {

  private static final long serialVersionUID = -6705409883677398725L;
  
  public ChatRead create(Long sourceUserEntityId, Long targetUserEntityId) {
    ChatRead chatRead = new ChatRead();
    chatRead.setSourceUserEntityId(sourceUserEntityId);
    chatRead.setTargetUserEntityId(targetUserEntityId);
    chatRead.setLastRead(new Date());
    return persist(chatRead);
  }
  
  public ChatRead update(ChatRead chatRead) {
    chatRead.setLastRead(new Date());
    return persist(chatRead);
  }
  
  public ChatRead findByUserEntityIds(Long sourceUserEntityId, Long targetUserEntityId) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<ChatRead> criteria = criteriaBuilder.createQuery(ChatRead.class);
    Root<ChatRead> root = criteria.from(ChatRead.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(ChatRead_.sourceUserEntityId), sourceUserEntityId),
        criteriaBuilder.equal(root.get(ChatRead_.targetUserEntityId), targetUserEntityId)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }

}
