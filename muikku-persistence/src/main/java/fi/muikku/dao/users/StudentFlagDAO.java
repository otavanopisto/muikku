package fi.muikku.dao.users;

import java.util.Collections;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.CoreDAO;
import fi.muikku.model.users.StudentFlag;
import fi.muikku.model.users.StudentFlagType;
import fi.muikku.model.users.StudentFlag_;
import fi.muikku.model.users.UserSchoolDataIdentifier;

public class StudentFlagDAO extends CoreDAO<StudentFlag> {

	private static final long serialVersionUID = 7781839501190084061L;

  public StudentFlag create(UserSchoolDataIdentifier ownerIdentifier, UserSchoolDataIdentifier studentIdentifier) {
    StudentFlag studentFlag = new StudentFlag();
    studentFlag.setOwnerIdentifier(ownerIdentifier);
    studentFlag.setStudentIdentifier(studentIdentifier);
    return persist(studentFlag);
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

}
