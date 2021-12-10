package fi.otavanopisto.muikku.plugins.hops.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.hops.model.HopsAlternativeStudyOptions;
import fi.otavanopisto.muikku.plugins.hops.model.HopsAlternativeStudyOptions_;

public class HopsAlternativeStudyOptionsDAO extends CorePluginsDAO<HopsAlternativeStudyOptions> {

  private static final long serialVersionUID = 5126860643958960224L;

  public HopsAlternativeStudyOptions create(String studentIdentifier, Boolean finnishAsLanguage, Boolean religionAsEthics) {
    HopsAlternativeStudyOptions hopsAlternativeStudyOptions = new HopsAlternativeStudyOptions();
    hopsAlternativeStudyOptions.setStudentIdentifier(studentIdentifier);
    hopsAlternativeStudyOptions.setFinnishAsLanguage(finnishAsLanguage);
    hopsAlternativeStudyOptions.setReligionAsEthics(religionAsEthics);
    return persist(hopsAlternativeStudyOptions);
  }

  public HopsAlternativeStudyOptions updateHopsAlternativeStudyOptions(HopsAlternativeStudyOptions hopsAlternativeStudyOptions, Boolean finnishAsLanguage, Boolean religionAsEthics) {
    hopsAlternativeStudyOptions.setFinnishAsLanguage(finnishAsLanguage);
    hopsAlternativeStudyOptions.setReligionAsEthics(religionAsEthics);
    return persist(hopsAlternativeStudyOptions);
  }

  public HopsAlternativeStudyOptions findByStudentIdentifier(String studentIdentifier) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<HopsAlternativeStudyOptions> criteria = criteriaBuilder.createQuery(HopsAlternativeStudyOptions.class);
    Root<HopsAlternativeStudyOptions> root = criteria.from(HopsAlternativeStudyOptions.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(HopsAlternativeStudyOptions_.studentIdentifier), studentIdentifier)
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }

}
