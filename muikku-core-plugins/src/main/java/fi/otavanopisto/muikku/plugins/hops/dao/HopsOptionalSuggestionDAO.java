package fi.otavanopisto.muikku.plugins.hops.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.hops.model.HopsOptionalSuggestion;
import fi.otavanopisto.muikku.plugins.hops.model.HopsOptionalSuggestion_;

public class HopsOptionalSuggestionDAO extends CorePluginsDAO<HopsOptionalSuggestion> {

  private static final long serialVersionUID = -4000187140602068775L;

  public HopsOptionalSuggestion create(String studentIdentifier, String subject, Integer courseNumber) {
    HopsOptionalSuggestion hopsOptionalSuggestion = new HopsOptionalSuggestion();

    hopsOptionalSuggestion.setCourseNumber(courseNumber);
    hopsOptionalSuggestion.setStudentIdentifier(studentIdentifier);
    hopsOptionalSuggestion.setSubject(subject);
    
    return persist(hopsOptionalSuggestion);
  }
  
  public HopsOptionalSuggestion update(HopsOptionalSuggestion hopsOptionalSuggestion, String studentIdentifier, String subject, Integer courseNumber) {
    
    hopsOptionalSuggestion.setCourseNumber(courseNumber);
    hopsOptionalSuggestion.setStudentIdentifier(studentIdentifier);
    hopsOptionalSuggestion.setSubject(subject);
    
    return persist(hopsOptionalSuggestion);
  }
  
  public List<HopsOptionalSuggestion> listByStudentIdentifier(String studentIdentifier) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<HopsOptionalSuggestion> criteria = criteriaBuilder.createQuery(HopsOptionalSuggestion.class);
    Root<HopsOptionalSuggestion> root = criteria.from(HopsOptionalSuggestion.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(HopsOptionalSuggestion_.studentIdentifier), studentIdentifier)
    );

    return entityManager.createQuery(criteria).getResultList();
  }
  
  public HopsOptionalSuggestion findByStudentIdentifierAndSubjectAndCourseNumber(String studentIdentifier, String subject, Integer courseNumber) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<HopsOptionalSuggestion> criteria = criteriaBuilder.createQuery(HopsOptionalSuggestion.class);
    Root<HopsOptionalSuggestion> root = criteria.from(HopsOptionalSuggestion.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(HopsOptionalSuggestion_.studentIdentifier), studentIdentifier),
        criteriaBuilder.equal(root.get(HopsOptionalSuggestion_.subject), subject),
        criteriaBuilder.equal(root.get(HopsOptionalSuggestion_.courseNumber), courseNumber)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }

  @Override
  public void delete(HopsOptionalSuggestion hopsSuggestion) {
    super.delete(hopsSuggestion);
  }

}
