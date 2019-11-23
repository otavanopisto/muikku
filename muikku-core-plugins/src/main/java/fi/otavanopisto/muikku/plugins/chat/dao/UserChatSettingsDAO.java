package fi.otavanopisto.muikku.plugins.chat.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.chat.model.UserChatSettings;
import fi.otavanopisto.muikku.plugins.chat.model.UserChatSettings_;
import fi.otavanopisto.muikku.plugins.chat.model.UserChatVisibility;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public class UserChatSettingsDAO extends CorePluginsDAO<UserChatSettings> {
	
  private static final long serialVersionUID = -7830619828801454118L;

  public UserChatSettings create(String userIdentifier, UserChatVisibility userChatVisibility, String nick) {
    UserChatSettings settings = new UserChatSettings(userIdentifier, userChatVisibility, nick);
    getEntityManager().persist(settings);
    return settings;
  }
  
  public List<UserChatSettings> listAll(String userIdentifier, UserChatVisibility userChatVisibility, String nick) {
	EntityManager entityManager = getEntityManager(); 
	    
	CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
	CriteriaQuery<UserChatSettings> criteria = criteriaBuilder.createQuery(UserChatSettings.class);
	Root<UserChatSettings> root = criteria.from(UserChatSettings.class);
	criteria.select(root);
	
	TypedQuery<UserChatSettings> query = entityManager.createQuery(criteria);
	
	return query.getResultList();
  }
  
  public UserChatSettings findByUser(SchoolDataIdentifier userIdentifier) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserChatSettings> criteria = criteriaBuilder.createQuery(UserChatSettings.class);
    Root<UserChatSettings> root = criteria.from(UserChatSettings.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.equal(root.get(UserChatSettings_.userIdentifier), userIdentifier.toId())
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }
  
  @Override
  public void delete(UserChatSettings userChatSettings) {
    super.delete(userChatSettings);
  }

  public UserChatSettings updateVisibility(UserChatSettings settings, UserChatVisibility visibility) {
    settings.setVisibility(visibility);
    
    getEntityManager().persist(settings);
    
    return settings;
  }
  
  public UserChatSettings updateNick(UserChatSettings settings, String nick) {
    settings.setNick(nick);
    
    getEntityManager().persist(settings);
    
    return settings;
  }
}
