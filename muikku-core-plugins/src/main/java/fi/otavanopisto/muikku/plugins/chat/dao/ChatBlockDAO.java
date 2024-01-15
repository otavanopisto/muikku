package fi.otavanopisto.muikku.plugins.chat.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.chat.model.ChatBlock;
import fi.otavanopisto.muikku.plugins.chat.model.ChatBlockType;
import fi.otavanopisto.muikku.plugins.chat.model.ChatBlock_;

public class ChatBlockDAO extends CorePluginsDAO<ChatBlock> {

  private static final long serialVersionUID = -5106608786461811523L;

  public ChatBlock create(Long sourceUserEntityid, Long targetUserEntityId, ChatBlockType blockType) {
    ChatBlock chatBlock = new ChatBlock();
    chatBlock.setSourceUserEntityId(sourceUserEntityid);
    chatBlock.setTargetUserEntityId(targetUserEntityId);
    chatBlock.setBlockType(blockType);
    return persist(chatBlock);
  }
  
  public ChatBlock update(ChatBlock chatBlock, ChatBlockType blockType) {
    chatBlock.setBlockType(blockType);
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

  public List<ChatBlock> listBySourceUserEntityIdAndBlockType(Long sourceUserEntityId, ChatBlockType blockType) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<ChatBlock> criteria = criteriaBuilder.createQuery(ChatBlock.class);
    Root<ChatBlock> root = criteria.from(ChatBlock.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(ChatBlock_.sourceUserEntityId), sourceUserEntityId),
        criteriaBuilder.equal(root.get(ChatBlock_.blockType), blockType)
      )
    );

    return entityManager.createQuery(criteria).getResultList();
  }

  @Override
  public void delete(ChatBlock event) {
    super.delete(event);
  }

}
