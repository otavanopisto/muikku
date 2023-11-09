package fi.otavanopisto.muikku.plugins.chat.dao;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.chat.model.ChatMessage;
import fi.otavanopisto.muikku.plugins.chat.model.ChatMessage_;

public class ChatMessageDAO extends CorePluginsDAO<ChatMessage> {

  private static final long serialVersionUID = 4097537046772954002L;
  
  public ChatMessage create(Long sourceUserId, Long targetRoomId, Long targetUserId, String nick, String message) {
    ChatMessage chatMessage = new ChatMessage();
    chatMessage.setSourceUserEntityId(sourceUserId);
    chatMessage.setTargetRoomId(targetRoomId);
    chatMessage.setTargetUserEntityId(targetUserId);
    chatMessage.setNick(nick);
    chatMessage.setMessage(message);
    chatMessage.setSent(new Date());
    chatMessage.setArchived(Boolean.FALSE);
    return persist(chatMessage);
  }
  
  public ChatMessage update(ChatMessage chatMessage, String content, Long modifierId) {
    chatMessage.setMessage(content);
    chatMessage.setLastModifierId(modifierId);
    chatMessage.setEdited(new Date());
    return persist(chatMessage);
  }
  
  public ChatMessage archive(ChatMessage chatMessage, Long modifierId) {
    chatMessage.setArchived(Boolean.TRUE);
    chatMessage.setLastModifierId(modifierId);
    chatMessage.setEdited(new Date());
    return persist(chatMessage);
  }

  public ChatMessage findByIdAndArchived(Long id, Boolean archived) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<ChatMessage> criteria = criteriaBuilder.createQuery(ChatMessage.class);
    Root<ChatMessage> root = criteria.from(ChatMessage.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(ChatMessage_.id), id),
        criteriaBuilder.equal(root.get(ChatMessage_.archived), archived)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }
  
  public List<ChatMessage> listBySourceUserAndTargetUserAndDate(Long sourceUserId, Long targetUserId, Date earlierThan, Integer count) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<ChatMessage> criteria = criteriaBuilder.createQuery(ChatMessage.class);
    Root<ChatMessage> root = criteria.from(ChatMessage.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.or(
          criteriaBuilder.and(
            criteriaBuilder.equal(root.get(ChatMessage_.sourceUserEntityId), sourceUserId),
            criteriaBuilder.equal(root.get(ChatMessage_.targetUserEntityId), targetUserId)
          ),
          criteriaBuilder.and(
            criteriaBuilder.equal(root.get(ChatMessage_.sourceUserEntityId), targetUserId),
            criteriaBuilder.equal(root.get(ChatMessage_.targetUserEntityId), sourceUserId)
          )
        ),
        criteriaBuilder.lessThan(root.get(ChatMessage_.sent), earlierThan)
      )
    );
    criteria.orderBy(criteriaBuilder.desc(root.get(ChatMessage_.sent)));

    return entityManager.createQuery(criteria).setMaxResults(count).getResultList();
  }

  public List<ChatMessage> listByTargetRoomAndDate(Long targetRoomId, Date earlierThan, Integer count) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<ChatMessage> criteria = criteriaBuilder.createQuery(ChatMessage.class);
    Root<ChatMessage> root = criteria.from(ChatMessage.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(ChatMessage_.targetRoomId), targetRoomId),
        criteriaBuilder.lessThan(root.get(ChatMessage_.sent), earlierThan)
      )
    );
    criteria.orderBy(criteriaBuilder.desc(root.get(ChatMessage_.sent)));

    return entityManager.createQuery(criteria).setMaxResults(count).getResultList();
  }

}
