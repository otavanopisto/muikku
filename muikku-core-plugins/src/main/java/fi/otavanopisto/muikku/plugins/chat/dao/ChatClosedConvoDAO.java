package fi.otavanopisto.muikku.plugins.chat.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.chat.model.ChatClosedConvo;
import fi.otavanopisto.muikku.plugins.chat.model.ChatClosedConvo_;

public class ChatClosedConvoDAO extends CorePluginsDAO<ChatClosedConvo> {

  private static final long serialVersionUID = 4822592043738879324L;

  public ChatClosedConvo create(Long sourceUserEntityid, Long targetUserEntityId) {
    ChatClosedConvo chatClosedConvo = new ChatClosedConvo();
    chatClosedConvo.setSourceUserEntityId(sourceUserEntityid);
    chatClosedConvo.setTargetUserEntityId(targetUserEntityId);
    return persist(chatClosedConvo);
  }
  
  public ChatClosedConvo findBySourceUserEntityIdAndTargetUserEntityId(Long sourceUserEntityId, Long targetUserEntityId) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<ChatClosedConvo> criteria = criteriaBuilder.createQuery(ChatClosedConvo.class);
    Root<ChatClosedConvo> root = criteria.from(ChatClosedConvo.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(ChatClosedConvo_.sourceUserEntityId), sourceUserEntityId),
        criteriaBuilder.equal(root.get(ChatClosedConvo_.targetUserEntityId), targetUserEntityId)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }

  @Override
  public void delete(ChatClosedConvo event) {
    super.delete(event);
  }

}
