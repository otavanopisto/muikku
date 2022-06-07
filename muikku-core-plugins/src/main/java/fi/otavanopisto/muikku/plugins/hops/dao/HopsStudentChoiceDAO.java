package fi.otavanopisto.muikku.plugins.hops.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.hops.model.HopsStudentChoice;
import fi.otavanopisto.muikku.plugins.hops.model.HopsStudentChoice_;

public class HopsStudentChoiceDAO extends CorePluginsDAO<HopsStudentChoice> {

  private static final long serialVersionUID = 5746392088055973392L;
  
  public HopsStudentChoice create(String studentIdentifier, String subject, Integer courseNumber) {
    HopsStudentChoice hopsStudentChoice = new HopsStudentChoice();

    hopsStudentChoice.setCourseNumber(courseNumber);
    hopsStudentChoice.setStudentIdentifier(studentIdentifier);
    hopsStudentChoice.setSubject(subject);
    
    return persist(hopsStudentChoice);
  }
  
  public HopsStudentChoice update(HopsStudentChoice hopsStudentChoice, String studentIdentifier, String subject, Integer courseNumber) {
    
    hopsStudentChoice.setCourseNumber(courseNumber);
    hopsStudentChoice.setStudentIdentifier(studentIdentifier);
    hopsStudentChoice.setSubject(subject);
    
    return persist(hopsStudentChoice);
  }
  
  public List<HopsStudentChoice> listByStudentIdentifier(String studentIdentifier) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<HopsStudentChoice> criteria = criteriaBuilder.createQuery(HopsStudentChoice.class);
    Root<HopsStudentChoice> root = criteria.from(HopsStudentChoice.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(HopsStudentChoice_.studentIdentifier), studentIdentifier)
    );

    return entityManager.createQuery(criteria).getResultList();
  }
  
  public HopsStudentChoice findByStudentIdentifierAndSubjectAndCourseNumber(String studentIdentifier, String subject, Integer courseNumber) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<HopsStudentChoice> criteria = criteriaBuilder.createQuery(HopsStudentChoice.class);
    Root<HopsStudentChoice> root = criteria.from(HopsStudentChoice.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(HopsStudentChoice_.studentIdentifier), studentIdentifier),
        criteriaBuilder.equal(root.get(HopsStudentChoice_.subject), subject),
        criteriaBuilder.equal(root.get(HopsStudentChoice_.courseNumber), courseNumber)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }

  @Override
  public void delete(HopsStudentChoice hopsSuggestion) {
    super.delete(hopsSuggestion);
  }

}
