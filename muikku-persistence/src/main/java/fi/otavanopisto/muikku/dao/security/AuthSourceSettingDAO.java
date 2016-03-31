package fi.otavanopisto.muikku.dao.security;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.model.security.AuthSourceSetting_;
import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.model.security.AuthSource;
import fi.otavanopisto.muikku.model.security.AuthSourceSetting;

public class AuthSourceSettingDAO extends CoreDAO<AuthSourceSetting> {
  
  private static final long serialVersionUID = 2828148489261014980L;

  public AuthSourceSetting create(AuthSource authSource, String key, String value) {
    AuthSourceSetting authSourceSetting = new AuthSourceSetting();
	  authSourceSetting.setAuthSource(authSource);
    authSourceSetting.setKey(key);
    authSourceSetting.setValue(value);

	  return persist(authSourceSetting);
	}

  public AuthSourceSetting findByAuthSourceAndKey(AuthSource authSource, String key) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<AuthSourceSetting> criteria = criteriaBuilder.createQuery(AuthSourceSetting.class);
    Root<AuthSourceSetting> root = criteria.from(AuthSourceSetting.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(AuthSourceSetting_.key), key),
        criteriaBuilder.equal(root.get(AuthSourceSetting_.authSource), authSource)
      )
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }
	
	public List<AuthSourceSetting> listByAuthSource(AuthSource authSource) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<AuthSourceSetting> criteria = criteriaBuilder.createQuery(AuthSourceSetting.class);
    Root<AuthSourceSetting> root = criteria.from(AuthSourceSetting.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(AuthSourceSetting_.authSource), authSource)
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
}
