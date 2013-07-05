package fi.muikku.dao.users;

import java.util.List;

import fi.muikku.dao.CoreDAO;
import fi.muikku.dao.DAO;
import fi.muikku.model.base.Environment;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.users.EnvironmentUser;
import fi.muikku.model.users.EnvironmentUserRole;
import fi.muikku.model.users.EnvironmentUser_;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;


@DAO
public class EnvironmentUserDAO extends CoreDAO<EnvironmentUser> {

	private static final long serialVersionUID = 8185071427513774677L;

	public EnvironmentUser create(UserEntity user, Environment environment, EnvironmentUserRole role) {
    EnvironmentUser environmentUser = new EnvironmentUser();
    
    environmentUser.setUser(user);
    environmentUser.setEnvironment(environment);
    environmentUser.setRole(role);
    
    getEntityManager().persist(environmentUser);
    
    return environmentUser;
  }

//  public EnvironmentUserEntity findByUser(UserEntity user) {
//    EntityManager entityManager = getEntityManager(); 
//    
//    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
//    CriteriaQuery<EnvironmentUser> criteria = criteriaBuilder.createQuery(EnvironmentUser.class);
//    Root<EnvironmentUser> root = criteria.from(EnvironmentUser.class);
//    criteria.select(root);
//    criteria.where(
//        criteriaBuilder.and(
//            criteriaBuilder.equal(root.get(EnvironmentUser_.user), user),
//            criteriaBuilder.equal(root.get(EnvironmentUser_.archived), Boolean.FALSE)
//        )
//    );
//    
//    return getSingleResult(entityManager.createQuery(criteria));
//  }

  public List<EnvironmentUser> listByEnvironment(Environment environment) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<EnvironmentUser> criteria = criteriaBuilder.createQuery(EnvironmentUser.class);
    Root<EnvironmentUser> root = criteria.from(EnvironmentUser.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(EnvironmentUser_.environment), environment),
            criteriaBuilder.equal(root.get(EnvironmentUser_.archived), Boolean.FALSE)
        )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public EnvironmentUser findByEnvironmentAndUser(Environment environment, UserEntity user) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<EnvironmentUser> criteria = criteriaBuilder.createQuery(EnvironmentUser.class);
    Root<EnvironmentUser> root = criteria.from(EnvironmentUser.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(EnvironmentUser_.environment), environment),
            criteriaBuilder.equal(root.get(EnvironmentUser_.user), user),
            criteriaBuilder.equal(root.get(EnvironmentUser_.archived), Boolean.FALSE)
        )
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }
  
}
