package fi.muikku.dao.workspace;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.Root;

import fi.muikku.dao.CoreDAO;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.users.UserSchoolDataIdentifier;
import fi.muikku.model.users.UserSchoolDataIdentifier_;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.muikku.model.workspace.WorkspaceRoleEntity;
import fi.muikku.model.workspace.WorkspaceRoleEntity_;
import fi.muikku.model.workspace.WorkspaceUserEntity;
import fi.muikku.model.workspace.WorkspaceUserEntity_;

public class WorkspaceUserEntityDAO extends CoreDAO<WorkspaceUserEntity> {

	private static final long serialVersionUID = -850520598378547048L;

  public WorkspaceUserEntity create(UserSchoolDataIdentifier userSchoolDataIdentifier, WorkspaceEntity workspaceEntity, WorkspaceRoleEntity workspaceUserRole, String identifier, Boolean archived) {
    WorkspaceUserEntity workspaceUserEntity = new WorkspaceUserEntity();
    
    workspaceUserEntity.setUserSchoolDataIdentifier(userSchoolDataIdentifier);
    workspaceUserEntity.setWorkspaceEntity(workspaceEntity);
    workspaceUserEntity.setWorkspaceUserRole(workspaceUserRole);
    workspaceUserEntity.setIdentifier(identifier);
    workspaceUserEntity.setArchived(archived);
    
    return persist(workspaceUserEntity);
  }

  public WorkspaceUserEntity findByWorkspaceAndIdentifier(WorkspaceEntity workspaceEntity, String identifier) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceUserEntity> criteria = criteriaBuilder.createQuery(WorkspaceUserEntity.class);
    Root<WorkspaceUserEntity> root = criteria.from(WorkspaceUserEntity.class);
    
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceUserEntity_.workspaceEntity), workspaceEntity),
        criteriaBuilder.equal(root.get(WorkspaceUserEntity_.identifier), identifier)
      ) 
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }

  public WorkspaceUserEntity findByWorkspaceEntityAndUserSchoolDataIdentifier(WorkspaceEntity workspaceEntity, UserSchoolDataIdentifier userSchoolDataIdentifier) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceUserEntity> criteria = criteriaBuilder.createQuery(WorkspaceUserEntity.class);
    Root<WorkspaceUserEntity> root = criteria.from(WorkspaceUserEntity.class);
    
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceUserEntity_.archived), Boolean.FALSE),
        criteriaBuilder.equal(root.get(WorkspaceUserEntity_.userSchoolDataIdentifier), userSchoolDataIdentifier),
        criteriaBuilder.equal(root.get(WorkspaceUserEntity_.workspaceEntity), workspaceEntity)
      ) 
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }

  public WorkspaceUserEntity findByWorkspaceEntityAndUserSchoolDataIdentifierIncludeArchived(WorkspaceEntity workspaceEntity, UserSchoolDataIdentifier userSchoolDataIdentifier) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceUserEntity> criteria = criteriaBuilder.createQuery(WorkspaceUserEntity.class);
    Root<WorkspaceUserEntity> root = criteria.from(WorkspaceUserEntity.class);
    
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceUserEntity_.userSchoolDataIdentifier), userSchoolDataIdentifier),
        criteriaBuilder.equal(root.get(WorkspaceUserEntity_.workspaceEntity), workspaceEntity)
      ) 
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }

  public List<WorkspaceUserEntity> listByUserEntityAndArchived(UserEntity userEntity, Boolean archived) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceUserEntity> criteria = criteriaBuilder.createQuery(WorkspaceUserEntity.class);
    Root<WorkspaceUserEntity> root = criteria.from(WorkspaceUserEntity.class);
    Join<WorkspaceUserEntity, UserSchoolDataIdentifier> userIdentifierJoin = root.join(WorkspaceUserEntity_.userSchoolDataIdentifier);
    
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceUserEntity_.archived), archived),
        criteriaBuilder.equal(userIdentifierJoin.get(UserSchoolDataIdentifier_.userEntity), userEntity)
      )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public List<WorkspaceUserEntity> listByWorkspace(WorkspaceEntity workspaceEntity) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceUserEntity> criteria = criteriaBuilder.createQuery(WorkspaceUserEntity.class);
    Root<WorkspaceUserEntity> root = criteria.from(WorkspaceUserEntity.class);
    
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(WorkspaceUserEntity_.archived), Boolean.FALSE),
            criteriaBuilder.equal(root.get(WorkspaceUserEntity_.workspaceEntity), workspaceEntity)
        )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
  public List<WorkspaceUserEntity> listByWorkspaceAndRole(WorkspaceEntity workspaceEntity, WorkspaceRoleEntity workspaceUserRole) {
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
  
  public List<WorkspaceUserEntity> listByWorkspaceAndRoleArchetype(WorkspaceEntity workspaceEntity, WorkspaceRoleArchetype archetype) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceUserEntity> criteria = criteriaBuilder.createQuery(WorkspaceUserEntity.class);
    Root<WorkspaceUserEntity> root = criteria.from(WorkspaceUserEntity.class);
    Join<WorkspaceUserEntity, WorkspaceRoleEntity> join = root.join(WorkspaceUserEntity_.workspaceUserRole);
    
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(WorkspaceUserEntity_.archived), Boolean.FALSE),
            criteriaBuilder.equal(root.get(WorkspaceUserEntity_.workspaceEntity), workspaceEntity),
            criteriaBuilder.equal(join.get(WorkspaceRoleEntity_.archetype), archetype)
        )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
  public List<WorkspaceUserEntity> listByWorkspaceAndRoles(WorkspaceEntity workspaceEntity, List<WorkspaceRoleEntity> workspaceUserRoles, Integer firstResult, Integer maxResults) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceUserEntity> criteria = criteriaBuilder.createQuery(WorkspaceUserEntity.class);
    Root<WorkspaceUserEntity> root = criteria.from(WorkspaceUserEntity.class);
    
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(WorkspaceUserEntity_.archived), Boolean.FALSE),
            criteriaBuilder.equal(root.get(WorkspaceUserEntity_.workspaceEntity), workspaceEntity),
            root.get(WorkspaceUserEntity_.workspaceUserRole).in(workspaceUserRoles)
        )
    );
    
    TypedQuery<WorkspaceUserEntity> query = entityManager.createQuery(criteria);
    if (firstResult != null) {
      query.setFirstResult(firstResult);
    }
    
    if (maxResults != null) {
      query.setMaxResults(maxResults);
    }
    
    return query.getResultList();
  }

  public List<WorkspaceUserEntity> listByWorkspaceEntityAndUserEntityAndArchived(WorkspaceEntity workspaceEntity, UserEntity userEntity, Boolean archived) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceUserEntity> criteria = criteriaBuilder.createQuery(WorkspaceUserEntity.class);
    Root<WorkspaceUserEntity> root = criteria.from(WorkspaceUserEntity.class);
    Join<WorkspaceUserEntity, UserSchoolDataIdentifier> userIdentifierJoin = root.join(WorkspaceUserEntity_.userSchoolDataIdentifier);
    
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceUserEntity_.archived), archived),
        criteriaBuilder.equal(root.get(WorkspaceUserEntity_.workspaceEntity), workspaceEntity),
        criteriaBuilder.equal(userIdentifierJoin.get(UserSchoolDataIdentifier_.userEntity), userEntity)
      )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
  public Long countByWorkspaceAndRoles(WorkspaceEntity workspaceEntity, List<WorkspaceRoleEntity> workspaceUserRoles) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Long> criteria = criteriaBuilder.createQuery(Long.class);
    Root<WorkspaceUserEntity> root = criteria.from(WorkspaceUserEntity.class);
    
    criteria.select(criteriaBuilder.count(root));
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceUserEntity_.archived), Boolean.FALSE),
        criteriaBuilder.equal(root.get(WorkspaceUserEntity_.workspaceEntity), workspaceEntity),
        root.get(WorkspaceUserEntity_.workspaceUserRole).in(workspaceUserRoles)
      )
    );
    
    return entityManager.createQuery(criteria).getSingleResult();
  }

  public WorkspaceUserEntity updateArchived(WorkspaceUserEntity workspaceUserEntity, Boolean archived) {
    workspaceUserEntity.setArchived(archived);
    return persist(workspaceUserEntity);
  }
  
  public void delete(WorkspaceUserEntity workspaceUserEntity) {
    super.delete(workspaceUserEntity);
  }

  public WorkspaceUserEntity findByIdentifier(String identifier) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceUserEntity> criteria = criteriaBuilder.createQuery(WorkspaceUserEntity.class);
    Root<WorkspaceUserEntity> root = criteria.from(WorkspaceUserEntity.class);
    
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(WorkspaceUserEntity_.identifier), identifier)
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }

}
