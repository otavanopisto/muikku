package fi.otavanopisto.muikku.plugins.chat.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.chat.model.ChatRoom;
import fi.otavanopisto.muikku.plugins.chat.model.ChatRoomType;
import fi.otavanopisto.muikku.plugins.chat.model.ChatRoom_;

public class ChatRoomDAO extends CorePluginsDAO<ChatRoom> {

  private static final long serialVersionUID = 5042293236194308575L;
  
  public ChatRoom create(String name, String description, Long creatorId) {
    ChatRoom chatRoom = new ChatRoom();
    chatRoom.setName(name);
    chatRoom.setDescription(description);
    chatRoom.setType(ChatRoomType.PUBLIC);
    chatRoom.setCreatorId(creatorId);
    chatRoom.setArchived(Boolean.FALSE);
    return persist(chatRoom);
  }

  public ChatRoom create(String name, Long workspaceEntityId, Long creatorId) {
    ChatRoom chatRoom = new ChatRoom();
    chatRoom.setName(name);
    chatRoom.setType(ChatRoomType.WORKSPACE);
    chatRoom.setWorkspaceEntityId(workspaceEntityId);
    chatRoom.setCreatorId(creatorId);
    chatRoom.setArchived(Boolean.FALSE);
    return persist(chatRoom);
  }
  
  public ChatRoom update(ChatRoom chatRoom, String name, String description, Long userEntityId) {
    chatRoom.setName(name);
    chatRoom.setDescription(description);
    chatRoom.setLastModifierId(userEntityId);
    return persist(chatRoom);
  }
  
  public ChatRoom update(ChatRoom chatRoom, String name, Boolean archived, Long userEntityId) {
    chatRoom.setName(name);
    chatRoom.setLastModifierId(userEntityId);
    chatRoom.setArchived(archived);
    return persist(chatRoom);
  }
  
  public ChatRoom remove(ChatRoom chatRoom, Long userEntityId) {
    chatRoom.setArchived(Boolean.TRUE);
    chatRoom.setLastModifierId(userEntityId);
    return persist(chatRoom);
  }
  
  public ChatRoom findByIdAndArchived(Long id, Boolean archived) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<ChatRoom> criteria = criteriaBuilder.createQuery(ChatRoom.class);
    Root<ChatRoom> root = criteria.from(ChatRoom.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(ChatRoom_.id), id),
        criteriaBuilder.equal(root.get(ChatRoom_.archived), archived)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }
  
  public ChatRoom findByWorkspaceEntityId(Long workspaceEntityId) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<ChatRoom> criteria = criteriaBuilder.createQuery(ChatRoom.class);
    Root<ChatRoom> root = criteria.from(ChatRoom.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(ChatRoom_.workspaceEntityId), workspaceEntityId)
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }
  
  public ChatRoom findByWorkspaceEntityIdAndArchived(Long workspaceEntityId, Boolean archived) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<ChatRoom> criteria = criteriaBuilder.createQuery(ChatRoom.class);
    Root<ChatRoom> root = criteria.from(ChatRoom.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(ChatRoom_.workspaceEntityId), workspaceEntityId),
        criteriaBuilder.equal(root.get(ChatRoom_.archived), archived)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }
  
  public List<ChatRoom> listByArchived(Boolean archived) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<ChatRoom> criteria = criteriaBuilder.createQuery(ChatRoom.class);
    Root<ChatRoom> root = criteria.from(ChatRoom.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(ChatRoom_.archived), archived)
    );

    return entityManager.createQuery(criteria).getResultList();
  }

}
