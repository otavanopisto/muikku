package fi.otavanopisto.muikku.plugins.chat.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.chat.model.ChatBlock;
import fi.otavanopisto.muikku.plugins.chat.model.ChatBlock_;

public class ChatBlockDAO extends CorePluginsDAO<ChatBlock> {

  private static final long serialVersionUID = -5106608786461811523L;

  public ChatBlock create(Long sourceUserEntityid, Long targetUserEntityId) {
    ChatBlock chatBlock = new ChatBlock();
    chatBlock.setSourceUserEntityId(sourceUserEntityid);
    chatBlock.setTargetUserEntityId(targetUserEntityId);
    return persist(chatBlock);
  }
  
  public ChatBlock findBySourceUserEntityIdAndTargetUserEntityId(Long sourceUserEntityId, Long targetUserEntityId) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<ChatBlock> criteria = criteriaBuilder.createQuery(ChatBlock.class);
    Root<ChatBlock> root = criteria.from(ChatBlock.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(ChatBlock_.sourceUserEntityId), sourceUserEntityId),
        criteriaBuilder.equal(root.get(ChatBlock_.targetUserEntityId), targetUserEntityId)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }

  public List<ChatBlock> listBySourceUserEntityId(Long sourceUserEntityId) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<ChatBlock> criteria = criteriaBuilder.createQuery(ChatBlock.class);
    Root<ChatBlock> root = criteria.from(ChatBlock.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(ChatBlock_.sourceUserEntityId), sourceUserEntityId)
    );

    return entityManager.createQuery(criteria).getResultList();
  }

  @Override
  public void delete(ChatBlock event) {
    super.delete(event);
  }

}
