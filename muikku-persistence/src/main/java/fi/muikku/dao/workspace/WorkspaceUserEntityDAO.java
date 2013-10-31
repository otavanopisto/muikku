package fi.muikku.dao.workspace;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.Root;

import fi.muikku.dao.CoreDAO;
import fi.muikku.dao.DAO;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceRoleEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceEntity_;
import fi.muikku.model.workspace.WorkspaceUserEntity;
import fi.muikku.model.workspace.WorkspaceUserEntity_;

@DAO
public class WorkspaceUserEntityDAO extends CoreDAO<WorkspaceUserEntity> {

	private static final long serialVersionUID = -850520598378547048L;

	public WorkspaceUserEntity create(UserEntity user, WorkspaceEntity workspace, WorkspaceRoleEntity workspaceUserRole) {
    return create(user, workspace, workspaceUserRole, Boolean.FALSE);
  }
  
  public WorkspaceUserEntity create(UserEntity user, WorkspaceEntity workspaceEntity, WorkspaceRoleEntity workspaceUserRole, Boolean archived) {
    WorkspaceUserEntity workspaceUserEntity = new WorkspaceUserEntity();
    
    workspaceUserEntity.setUser(user);
    workspaceUserEntity.setWorkspaceEntity(workspaceEntity);
    workspaceUserEntity.setWorkspaceUserRole(workspaceUserRole);
    
    workspaceUserEntity.setArchived(archived);
    
    getEntityManager().persist(workspaceUserEntity);
    
    return workspaceUserEntity;
  }

  public WorkspaceUserEntity findByCourseAndUser(WorkspaceEntity workspace, UserEntity user) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceUserEntity> criteria = criteriaBuilder.createQuery(WorkspaceUserEntity.class);
    Root<WorkspaceUserEntity> root = criteria.from(WorkspaceUserEntity.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(WorkspaceUserEntity_.workspaceEntity), workspace),
            criteriaBuilder.equal(root.get(WorkspaceUserEntity_.user), user)
        )
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }

  public List<WorkspaceEntity> listCoursesByUser(UserEntity userEntity) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceEntity> criteria = criteriaBuilder.createQuery(WorkspaceEntity.class);
    Root<WorkspaceUserEntity> root = criteria.from(WorkspaceUserEntity.class);
    Join<WorkspaceUserEntity, WorkspaceEntity> join = root.join(WorkspaceUserEntity_.workspaceEntity);
    
    criteria.select(root.get(WorkspaceUserEntity_.workspaceEntity));
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(join.get(WorkspaceEntity_.archived), Boolean.FALSE),
            criteriaBuilder.equal(root.get(WorkspaceUserEntity_.archived), Boolean.FALSE),
            criteriaBuilder.equal(root.get(WorkspaceUserEntity_.user), userEntity)
        )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public List<WorkspaceUserEntity> listByCourseAndRole(WorkspaceEntity workspaceEntity, WorkspaceRoleEntity workspaceUserRole) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceUserEntity> criteria = criteriaBuilder.createQuery(WorkspaceUserEntity.class);
    Root<WorkspaceUserEntity> root = criteria.from(WorkspaceUserEntity.class);
    
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(WorkspaceUserEntity_.archived), Boolean.FALSE),
            criteriaBuilder.equal(root.get(WorkspaceUserEntity_.workspaceEntity), workspaceEntity),
            criteriaBuilder.equal(root.get(WorkspaceUserEntity_.workspaceUserRole), workspaceUserRole)
        )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public List<WorkspaceUserEntity> listByUser(UserEntity userEntity) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceUserEntity> criteria = criteriaBuilder.createQuery(WorkspaceUserEntity.class);
    Root<WorkspaceUserEntity> root = criteria.from(WorkspaceUserEntity.class);
    
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(WorkspaceUserEntity_.archived), Boolean.FALSE),
            criteriaBuilder.equal(root.get(WorkspaceUserEntity_.user), userEntity)
        )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
}
