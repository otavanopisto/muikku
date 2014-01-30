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
import fi.muikku.model.users.UserGroupUser;
import fi.muikku.model.users.UserGroupUser_;


@DAO
public class UserGroupDAO extends CoreDAO<UserGroup> {

  private static final long serialVersionUID = -2602347893195385174L;

  public UserGroup create(String name) {
	  UserGroup userGroup = new UserGroup();

	  userGroup.setName(name);
    
    getEntityManager().persist(userGroup);
    
    return userGroup;
  }

  public List<UserGroup> listByUser(UserEntity userEntity) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserGroup> criteria = criteriaBuilder.createQuery(UserGroup.class);
    Root<UserGroupUser> root = criteria.from(UserGroupUser.class);

    criteria.select(root.get(UserGroupUser_.userGroup));
    
    criteria.where(
        criteriaBuilder.equal(root.get(UserGroupUser_.user), userEntity)
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }

}