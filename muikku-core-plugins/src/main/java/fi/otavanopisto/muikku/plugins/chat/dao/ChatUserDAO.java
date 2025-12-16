package fi.otavanopisto.muikku.plugins.chat.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.chat.model.ChatUser;
import fi.otavanopisto.muikku.plugins.chat.model.ChatUserVisibility;
import fi.otavanopisto.muikku.plugins.chat.model.ChatUser_;

public class ChatUserDAO extends CorePluginsDAO<ChatUser> {

  private static final long serialVersionUID = 7322863366748100310L;
  
  public ChatUser create(Long userEntityId, ChatUserVisibility visibility, String nick) {
    ChatUser chatUser = new ChatUser();
    chatUser.setUserEntityId(userEntityId);
    chatUser.setVisibility(visibility);
    chatUser.setNick(nick);
    return persist(chatUser);
  }

  public ChatUser update(ChatUser chatUser, ChatUserVisibility visibility, String nick) {
    chatUser.setVisibility(visibility);
    chatUser.setNick(nick);
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
  
  public void delete(ChatUser chatUser) {
    super.delete(chatUser);
  }

}
