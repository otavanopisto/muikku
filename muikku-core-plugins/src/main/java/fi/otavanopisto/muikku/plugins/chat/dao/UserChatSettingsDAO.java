package fi.otavanopisto.muikku.plugins.chat.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.chat.model.UserChatSettings;
import fi.otavanopisto.muikku.plugins.chat.model.UserChatSettings_;
import fi.otavanopisto.muikku.plugins.chat.model.UserChatVisibility;

public class UserChatSettingsDAO extends CorePluginsDAO<UserChatSettings> {
	
  private static final long serialVersionUID = -7830619828801454118L;

  public UserChatSettings create(Long userEntityId, UserChatVisibility userChatVisibility, String nick) {
    UserChatSettings settings = new UserChatSettings(userEntityId, userChatVisibility, nick);
    getEntityManager().persist(settings);
    return settings;
  }
  
  public UserChatSettings findByUserEntityId(Long userEntityId) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserChatSettings> criteria = criteriaBuilder.createQuery(UserChatSettings.class);
    Root<UserChatSettings> root = criteria.from(UserChatSettings.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.equal(root.get(UserChatSettings_.userEntityId), userEntityId)
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }

  public UserChatSettings findByNick(String nick) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserChatSettings> criteria = criteriaBuilder.createQuery(UserChatSettings.class);
    Root<UserChatSettings> root = criteria.from(UserChatSettings.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.equal(root.get(UserChatSettings_.nick), nick)
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }
  
  @Override
  public void delete(UserChatSettings userChatSettings) {
    super.delete(userChatSettings);
  }

  public UserChatSettings updateNickAndVisibility(UserChatSettings settings, String nick, UserChatVisibility visibility) {
    settings.setNick(nick);
    settings.setVisibility(visibility);
    return persist(settings);
  }
}
