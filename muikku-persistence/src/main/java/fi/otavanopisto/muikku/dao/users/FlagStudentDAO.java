package fi.otavanopisto.muikku.dao.users;

import java.util.Collections;
import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.model.users.Flag;
import fi.otavanopisto.muikku.model.users.FlagStudent;
import fi.otavanopisto.muikku.model.users.FlagStudent_;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;

public class FlagStudentDAO extends CoreDAO<FlagStudent> {

  private static final long serialVersionUID = 1350239315051902573L;

  public FlagStudent create(Flag flag, UserSchoolDataIdentifier studentIdentifier, Date created) {
    FlagStudent flagShare = new FlagStudent();
    flagShare.setFlag(flag);
    flagShare.setStudentIdentifier(studentIdentifier);
    flagShare.setCreated(created);
    
    return persist(flagShare);
  }

  public FlagStudent findByFlagAndStudentIdentifier(Flag flag, UserSchoolDataIdentifier studentIdentifier) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<FlagStudent> criteria = criteriaBuilder.createQuery(FlagStudent.class);
    Root<FlagStudent> root = criteria.from(FlagStudent.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(FlagStudent_.flag), flag),
      criteriaBuilder.equal(root.get(FlagStudent_.studentIdentifier), studentIdentifier)
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }

  public List<FlagStudent> listByStudentIdentifier(UserSchoolDataIdentifier studentIdentifier) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<FlagStudent> criteria = criteriaBuilder.createQuery(FlagStudent.class);
    Root<FlagStudent> root = criteria.from(FlagStudent.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(FlagStudent_.studentIdentifier), studentIdentifier)
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public List<FlagStudent> listByFlag(Flag flag) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<FlagStudent> criteria = criteriaBuilder.createQuery(FlagStudent.class);
    Root<FlagStudent> root = criteria.from(FlagStudent.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(FlagStudent_.flag), flag)
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public List<UserSchoolDataIdentifier> listStudentIdentifiersByFlags(List<Flag> flags) {
    if ((flags == null) || flags.isEmpty()) {
      return Collections.emptyList();
    }
    
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserSchoolDataIdentifier> criteria = criteriaBuilder.createQuery(UserSchoolDataIdentifier.class);
    Root<FlagStudent> root = criteria.from(FlagStudent.class);
    criteria.select(root.get(FlagStudent_.studentIdentifier));
    criteria.where(
      root.get(FlagStudent_.flag).in(flags)
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }

  @Override
  public void delete(FlagStudent e) {
    super.delete(e);
  }
  
}
