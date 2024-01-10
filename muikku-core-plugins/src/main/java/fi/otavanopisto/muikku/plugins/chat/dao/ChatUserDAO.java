package fi.otavanopisto.muikku.plugins.chat.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.chat.model.ChatUser;
import fi.otavanopisto.muikku.plugins.chat.model.ChatUser_;

public class ChatUserDAO extends CorePluginsDAO<ChatUser> {

  private static final long serialVersionUID = 7322863366748100310L;
  
  public ChatUser create(Boolean enabled, String nick, Long userEntityId) {
    ChatUser chatUser = new ChatUser();
    chatUser.setNick(nick);
    chatUser.setUserEntityId(userEntityId);
    chatUser.setArchived(!enabled);
    return persist(chatUser);
  }

  public ChatUser update(ChatUser chatUser, Boolean enabled, String nick) {
    chatUser.setNick(nick);
    chatUser.setArchived(!enabled);
    return persist(chatUser);
  }

  public ChatUser findByUserEntityId(Long userEntityId) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<ChatUser> criteria = criteriaBuilder.createQuery(ChatUser.class);
    Root<ChatUser> root = criteria.from(ChatUser.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(ChatUser_.userEntityId), userEntityId)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }

  public ChatUser findByNick(String nick) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<ChatUser> criteria = criteriaBuilder.createQuery(ChatUser.class);
    Root<ChatUser> root = criteria.from(ChatUser.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(ChatUser_.nick), nick)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }

  public ChatUser findByUserEntityIdAndArchived(Long userEntityId, boolean archived) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<ChatUser> criteria = criteriaBuilder.createQuery(ChatUser.class);
    Root<ChatUser> root = criteria.from(ChatUser.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(ChatUser_.userEntityId), userEntityId),
        criteriaBuilder.equal(root.get(ChatUser_.archived), archived)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }
  
  public List<ChatUser> listUnarchived() {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<ChatUser> criteria = criteriaBuilder.createQuery(ChatUser.class);
    Root<ChatUser> root = criteria.from(ChatUser.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(ChatUser_.archived), Boolean.FALSE)
    );

    return entityManager.createQuery(criteria).getResultList();
  }

}
