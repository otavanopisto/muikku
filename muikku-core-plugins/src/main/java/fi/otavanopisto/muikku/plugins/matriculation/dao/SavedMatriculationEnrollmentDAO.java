package fi.otavanopisto.muikku.plugins.matriculation.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.matriculation.model.SavedMatriculationEnrollment;
import fi.otavanopisto.muikku.plugins.matriculation.model.SavedMatriculationEnrollment_;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public class SavedMatriculationEnrollmentDAO extends CorePluginsDAO<SavedMatriculationEnrollment> {

  private static final long serialVersionUID = 7506613764993681620L;

  public SavedMatriculationEnrollment create(
      Long examId,
      SchoolDataIdentifier userIdentifier,
      String savedEnrollmentJson
  ) {
    SavedMatriculationEnrollment savedEnrollment = new SavedMatriculationEnrollment();
    savedEnrollment.setExamId(examId);
    savedEnrollment.setUserIdentifier(userIdentifier);
    savedEnrollment.setSavedEnrollmentJson(savedEnrollmentJson);
    return persist(savedEnrollment);
  }

  public SavedMatriculationEnrollment updateSavedEnrollmentJson(
    SavedMatriculationEnrollment savedEnrollment,
    String savedEnrollmentJson
  ) {
    savedEnrollment.setSavedEnrollmentJson(savedEnrollmentJson);
    return persist(savedEnrollment);
  }
  
  public SavedMatriculationEnrollment findByUser(Long examId, SchoolDataIdentifier userIdentifier) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<SavedMatriculationEnrollment> criteria = criteriaBuilder.createQuery(SavedMatriculationEnrollment.class);
    Root<SavedMatriculationEnrollment> root = criteria.from(SavedMatriculationEnrollment.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(SavedMatriculationEnrollment_.examId), examId),
            criteriaBuilder.equal(root.get(SavedMatriculationEnrollment_.userIdentifier), userIdentifier.toId())
        )
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }
}
