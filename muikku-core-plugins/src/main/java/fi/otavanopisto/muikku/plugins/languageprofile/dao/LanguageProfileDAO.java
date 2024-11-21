package fi.otavanopisto.muikku.plugins.languageprofile.dao;

import java.util.Date;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.languageprofile.model.LanguageProfile;
import fi.otavanopisto.muikku.plugins.languageprofile.model.LanguageProfile_;

public class LanguageProfileDAO  extends CorePluginsDAO<LanguageProfile> {

  private static final long serialVersionUID = 4744682599348213364L;
  
  public LanguageProfile create(Long userEntityId, String formData) {
    LanguageProfile languageProfile = new LanguageProfile();
    languageProfile.setUserEntityId(userEntityId);
    languageProfile.setFormData(formData);
    languageProfile.setLastModified(new Date());
    return persist(languageProfile);
  }

  public LanguageProfile update(LanguageProfile languageProfile, String formData) {
    languageProfile.setFormData(formData);
    languageProfile.setLastModified(new Date());
    return persist(languageProfile);
  }

  public LanguageProfile findByUserEntityId(Long userEntityId) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<LanguageProfile> criteria = criteriaBuilder.createQuery(LanguageProfile.class);
    Root<LanguageProfile> root = criteria.from(LanguageProfile.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(LanguageProfile_.userEntityId), userEntityId)
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }

}
