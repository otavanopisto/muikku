package fi.muikku.dao.users;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.CoreDAO;
import fi.muikku.dao.DAO;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.users.UserGroup;
import fi.muikku.model.users.UserGroupRoleEntity;
import fi.muikku.model.users.UserGroupUser;
import fi.muikku.model.users.UserGroupUser_;


@DAO
public class UserGroupUserDAO extends CoreDAO<UserGroupUser> {

  private static final long serialVersionUID = -2602347893195385174L;

  public UserGroupUser create(UserEntity user, UserGroup userGroup, UserGroupRoleEntity role) {
	  UserGroupUser userGroupUser = new UserGroupUser();

	  userGroupUser.setUser(user);
	  userGroupUser.setUserGroup(userGroup);
	  userGroupUser.setRole(role);
    
    getEntityManager().persist(userGroupUser);
    
    return userGroupUser;
  }

  public Long countByUserGroup(UserGroup userGroup) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Long> criteria = criteriaBuilder.createQuery(Long.class);
    Root<UserGroupUser> root = criteria.from(UserGroupUser.class);

    criteria.select(criteriaBuilder.count(root));
    
    criteria.where(
      criteriaBuilder.equal(root.get(UserGroupUser_.userGroup), userGroup)
    );
    
    return entityManager.createQuery(criteria).getSingleResult();
  }

  public List<UserGroupUser> listByUserGroup(UserGroup userGroup) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserGroupUser> criteria = criteriaBuilder.createQuery(UserGroupUser.class);
    Root<UserGroupUser> root = criteria.from(UserGroupUser.class);

    criteria.select(root);
    
    criteria.where(
      criteriaBuilder.equal(root.get(UserGroupUser_.userGroup), userGroup)
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public List<UserGroupUser> listByUserGroupAndRole(UserGroup userGroup, UserGroupRoleEntity role) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserGroupUser> criteria = criteriaBuilder.createQuery(UserGroupUser.class);
    Root<UserGroupUser> root = criteria.from(UserGroupUser.class);

    criteria.select(root);
    
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(UserGroupUser_.userGroup), userGroup),
            criteriaBuilder.equal(root.get(UserGroupUser_.role), role)
        )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public UserGroupUser findByGroupAndUser(UserGroup userGroup, UserEntity userEntity) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserGroupUser> criteria = criteriaBuilder.createQuery(UserGroupUser.class);
    Root<UserGroupUser> root = criteria.from(UserGroupUser.class);

    criteria.select(root);
    
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(UserGroupUser_.userGroup), userGroup),
            criteriaBuilder.equal(root.get(UserGroupUser_.user), userEntity)
        )
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }

}