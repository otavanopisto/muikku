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
  
  public HopsStudentChoice create(Long userEntityId, String category, String subject, Integer courseNumber) {
    HopsStudentChoice hopsStudentChoice = new HopsStudentChoice();

    hopsStudentChoice.setUserEntityId(userEntityId);
    hopsStudentChoice.setCategory(category);
    hopsStudentChoice.setCourseNumber(courseNumber);
    hopsStudentChoice.setSubject(subject);
    
    return persist(hopsStudentChoice);
  }
  
  public HopsStudentChoice update(HopsStudentChoice hopsStudentChoice, String subject, Integer courseNumber) {
    
    hopsStudentChoice.setCourseNumber(courseNumber);
    hopsStudentChoice.setSubject(subject);
    
    return persist(hopsStudentChoice);
  }
  
  public List<HopsStudentChoice> listByUserEntityIdAndCategory(Long userEntityId, String category) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<HopsStudentChoice> criteria = criteriaBuilder.createQuery(HopsStudentChoice.class);
    Root<HopsStudentChoice> root = criteria.from(HopsStudentChoice.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(HopsStudentChoice_.userEntityId), userEntityId),
        criteriaBuilder.equal(root.get(HopsStudentChoice_.category), category)
      )
    );

    return entityManager.createQuery(criteria).getResultList();
  }
  
  public HopsStudentChoice findByUserEntityIdAndCategoryAndSubjectAndCourseNumber(Long userEntityId, String category, String subject, Integer courseNumber) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<HopsStudentChoice> criteria = criteriaBuilder.createQuery(HopsStudentChoice.class);
    Root<HopsStudentChoice> root = criteria.from(HopsStudentChoice.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(HopsStudentChoice_.userEntityId), userEntityId),
        criteriaBuilder.equal(root.get(HopsStudentChoice_.category), category),
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

  // TODO Remove after conversion
  public HopsStudentChoice updateOwner(HopsStudentChoice hopsStudentChoice, Long userEntityId, String category) {
    hopsStudentChoice.setUserEntityId(userEntityId);
    hopsStudentChoice.setCategory(category);
    return persist(hopsStudentChoice);
  }

}
