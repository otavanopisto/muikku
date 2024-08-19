package fi.otavanopisto.muikku.plugins.matriculation.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.matriculation.model.SentMatriculationEnrollment;
import fi.otavanopisto.muikku.plugins.matriculation.model.SentMatriculationEnrollment_;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

@Deprecated // TODO Remove
public class SentMatriculationEnrollmentDAO extends CorePluginsDAO<SentMatriculationEnrollment> {

  private static final long serialVersionUID = 7506613764993681620L;

  public SentMatriculationEnrollment create(
      Long examId,
      SchoolDataIdentifier userIdentifier
  ) {
    SentMatriculationEnrollment savedEnrollment = new SentMatriculationEnrollment();
    savedEnrollment.setExamId(examId);
    savedEnrollment.setUserIdentifier(userIdentifier);
    return persist(savedEnrollment);
  }
  
  public SentMatriculationEnrollment findByUser(Long examId, SchoolDataIdentifier userIdentifier) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<SentMatriculationEnrollment> criteria = criteriaBuilder.createQuery(SentMatriculationEnrollment.class);
    Root<SentMatriculationEnrollment> root = criteria.from(SentMatriculationEnrollment.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(SentMatriculationEnrollment_.examId), examId),
            criteriaBuilder.equal(root.get(SentMatriculationEnrollment_.userIdentifier), userIdentifier.toId())
        )
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }
}
