package fi.otavanopisto.muikku.matriculation.persistence.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.matriculation.persistence.model.SentMatriculationEnrollment;
import fi.otavanopisto.muikku.matriculation.persistence.model.SentMatriculationEnrollment_;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public class SentMatriculationEnrollmentDAO extends MatriculationPluginDAO<SentMatriculationEnrollment> {

  private static final long serialVersionUID = 7506613764993681620L;

  public SentMatriculationEnrollment create(
    SchoolDataIdentifier userIdentifier
  ) {
    SentMatriculationEnrollment savedEnrollment = new SentMatriculationEnrollment();
    savedEnrollment.setUserIdentifier(userIdentifier);
    getEntityManager().persist(savedEnrollment);
    return savedEnrollment;
  }
  
  public SentMatriculationEnrollment findByUser(SchoolDataIdentifier userIdentifier) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<SentMatriculationEnrollment> criteria = criteriaBuilder.createQuery(SentMatriculationEnrollment.class);
    Root<SentMatriculationEnrollment> root = criteria.from(SentMatriculationEnrollment.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.equal(root.get(SentMatriculationEnrollment_.userIdentifier), userIdentifier.toId())
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }
}
