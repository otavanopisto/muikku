package fi.otavanopisto.muikku.dao.users;

import java.util.Collections;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.model.users.StudentFlag_;
import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.model.users.StudentFlag;
import fi.otavanopisto.muikku.model.users.StudentFlagType;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;

public class StudentFlagDAO extends CoreDAO<StudentFlag> {

	private static final long serialVersionUID = 7781839501190084061L;

  public StudentFlag create(UserSchoolDataIdentifier ownerIdentifier, UserSchoolDataIdentifier studentIdentifier, StudentFlagType type) {
    StudentFlag studentFlag = new StudentFlag();
    studentFlag.setOwnerIdentifier(ownerIdentifier);
    studentFlag.setStudentIdentifier(studentIdentifier);
    studentFlag.setType(type);
    return persist(studentFlag);
  }

  public List<StudentFlag> listByStudentIdentifierAndOwnerIdentifier(UserSchoolDataIdentifier studentIdentifier, UserSchoolDataIdentifier ownerIdentifier) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<StudentFlag> criteria = criteriaBuilder.createQuery(StudentFlag.class);
    Root<StudentFlag> root = criteria.from(StudentFlag.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(StudentFlag_.studentIdentifier), studentIdentifier),
        criteriaBuilder.equal(root.get(StudentFlag_.ownerIdentifier), ownerIdentifier)
      )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public List<StudentFlag> listByOwnerAndTypes(UserSchoolDataIdentifier ownerIdentifier, List<StudentFlagType> types) {
    if ((types == null) || (types.isEmpty())) {
      return Collections.emptyList();
    }
    
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<StudentFlag> criteria = criteriaBuilder.createQuery(StudentFlag.class);
    Root<StudentFlag> root = criteria.from(StudentFlag.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(StudentFlag_.ownerIdentifier), ownerIdentifier),
        root.get(StudentFlag_.type).in(types)
      )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public List<StudentFlagType> listTypesByOwner(UserSchoolDataIdentifier ownerSchoolDataIdentifier) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<StudentFlagType> criteria = criteriaBuilder.createQuery(StudentFlagType.class);
    Root<StudentFlag> root = criteria.from(StudentFlag.class);
    criteria.select(root.get(StudentFlag_.type)).distinct(true);
    criteria.where(
      criteriaBuilder.equal(root.get(StudentFlag_.ownerIdentifier), ownerSchoolDataIdentifier)
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public StudentFlag updateType(StudentFlag studentFlag, StudentFlagType type) {
    studentFlag.setType(type);
    return persist(studentFlag);
  }

  @Override
  public void delete(StudentFlag e) {
    super.delete(e);
  }
  
}
