package fi.otavanopisto.muikku.plugins.chat.dao;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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
  
  public Set<Long> listPrivateDiscussionPartners(Long userEntityId) {
    Set<Long> userIds = new HashSet<>();
    EntityManager entityManager = getEntityManager();
    
    // Users who I have sent a private message to
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Long> criteria = criteriaBuilder.createQuery(Long.class);
    Root<ChatMessage> root = criteria.from(ChatMessage.class);
    criteria.select(root.get(ChatMessage_.targetUserEntityId)).distinct(true);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(ChatMessage_.sourceUserEntityId), userEntityId),
        criteriaBuilder.isNotNull(root.get(ChatMessage_.targetUserEntityId))
      )
    );
    userIds.addAll(entityManager.createQuery(criteria).getResultList());

    // Users who have sent a private message to me
    
    criteria = criteriaBuilder.createQuery(Long.class);
    root = criteria.from(ChatMessage.class);
    criteria.select(root.get(ChatMessage_.sourceUserEntityId)).distinct(true);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(ChatMessage_.targetUserEntityId), userEntityId),
        criteriaBuilder.isNotNull(root.get(ChatMessage_.sourceUserEntityId))
      )
    );
    userIds.addAll(entityManager.createQuery(criteria).getResultList());

    return userIds;
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
  
  public Date findLatestDateByTargetUser(Long sourceUserId, Long targetUserId) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Date> criteria = criteriaBuilder.createQuery(Date.class);
    Root<ChatMessage> root = criteria.from(ChatMessage.class);
    criteria.select(root.get(ChatMessage_.sent));
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
        )
      )
    );
    criteria.orderBy(criteriaBuilder.desc(root.get(ChatMessage_.sent)));

    return entityManager.createQuery(criteria).setMaxResults(1).getSingleResult();
  }
  
  public List<ChatMessage> listBySourceUserAndTargetUserAndEarlierThan(Long sourceUserId, Long targetUserId, Date earlierThan, Integer count) {
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

  public Long countBySourceUserAndTargetUserAndSince(Long sourceUserId, Long targetUserId, Date since) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Long> criteria = criteriaBuilder.createQuery(Long.class);
    Root<ChatMessage> root = criteria.from(ChatMessage.class);
    criteria.select(criteriaBuilder.count(root));
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(ChatMessage_.sourceUserEntityId), targetUserId),
        criteriaBuilder.equal(root.get(ChatMessage_.targetUserEntityId), sourceUserId),
        criteriaBuilder.greaterThan(root.get(ChatMessage_.sent), since)
      )
    );

    return entityManager.createQuery(criteria).getSingleResult();
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
