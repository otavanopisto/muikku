package fi.otavanopisto.muikku.plugins.languageprofile.dao;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.languageprofile.model.LanguageProfile;
import fi.otavanopisto.muikku.plugins.languageprofile.model.LanguageProfileSample;
import fi.otavanopisto.muikku.plugins.languageprofile.model.LanguageProfileSampleType;
import fi.otavanopisto.muikku.plugins.languageprofile.model.LanguageProfileSample_;

public class LanguageProfileSampleDAO  extends CorePluginsDAO<LanguageProfileSample> {

  private static final long serialVersionUID = 1931059641710773523L;
  
  public LanguageProfileSample create(LanguageProfile languageProfile, String language, LanguageProfileSampleType type, String fileId, String fileName, String contentType) {
    LanguageProfileSample languageProfileSample = new LanguageProfileSample();
    languageProfileSample.setContentType(contentType);
    languageProfileSample.setFileId(fileId);
    languageProfileSample.setFileName(fileName);
    languageProfileSample.setLanguage(language);
    languageProfileSample.setLanguageProfile(languageProfile);
    languageProfileSample.setType(type);
    languageProfileSample.setLastModified(new Date());
    return persist(languageProfileSample);
  }

  public LanguageProfileSample create(LanguageProfile languageProfile, String language, LanguageProfileSampleType type, String value, String contentType) {
    LanguageProfileSample languageProfileSample = new LanguageProfileSample();
    languageProfileSample.setContentType(contentType);
    languageProfileSample.setLanguage(language);
    languageProfileSample.setLanguageProfile(languageProfile);
    languageProfileSample.setType(type);
    languageProfileSample.setLastModified(new Date());
    languageProfileSample.setValue(value);
    return persist(languageProfileSample);
  }
  
  public void delete(LanguageProfileSample languageProfileSample) {
    super.delete(languageProfileSample);
  }
  
  public List<LanguageProfileSample> listByLanguageProfile(LanguageProfile languageProfile) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<LanguageProfileSample> criteria = criteriaBuilder.createQuery(LanguageProfileSample.class);
    Root<LanguageProfileSample> root = criteria.from(LanguageProfileSample.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(LanguageProfileSample_.languageProfile), languageProfile)
    );

    return entityManager.createQuery(criteria).getResultList();
  }

  public List<LanguageProfileSample> listByLanguageProfileAndLanguage(LanguageProfile languageProfile, String language) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<LanguageProfileSample> criteria = criteriaBuilder.createQuery(LanguageProfileSample.class);
    Root<LanguageProfileSample> root = criteria.from(LanguageProfileSample.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(LanguageProfileSample_.languageProfile), languageProfile),
        criteriaBuilder.equal(root.get(LanguageProfileSample_.language), language)
      )
    );

    return entityManager.createQuery(criteria).getResultList();
  }

}
