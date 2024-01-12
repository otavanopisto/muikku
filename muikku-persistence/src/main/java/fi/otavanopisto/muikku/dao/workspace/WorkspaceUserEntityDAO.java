package fi.otavanopisto.muikku.dao.workspace;

import java.util.Collection;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleEntity_;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity_;

public class WorkspaceUserEntityDAO extends CoreDAO<WorkspaceUserEntity> {

	private static final long serialVersionUID = -850520598378547048L;

  public WorkspaceUserEntity create(UserSchoolDataIdentifier userSchoolDataIdentifier, WorkspaceEntity workspaceEntity, WorkspaceRoleEntity workspaceUserRole, String identifier, Boolean active, Boolean archived) {
    WorkspaceUserEntity workspaceUserEntity = new WorkspaceUserEntity();
    
    workspaceUserEntity.setUserSchoolDataIdentifier(userSchoolDataIdentifier);
    workspaceUserEntity.setWorkspaceEntity(workspaceEntity);
    workspaceUserEntity.setWorkspaceUserRole(workspaceUserRole);
    workspaceUserEntity.setIdentifier(identifier);
    workspaceUserEntity.setActive(active);
    workspaceUserEntity.setArchived(archived);
    
    return persist(workspaceUserEntity);
  }

  public WorkspaceUserEntity findByWorkspaceAndIdentifierAndArchived(WorkspaceEntity workspaceEntity, String identifier, Boolean archived) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceUserEntity> criteria = criteriaBuilder.createQuery(WorkspaceUserEntity.class);
    Root<WorkspaceUserEntity> root = criteria.from(WorkspaceUserEntity.class);
    
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceUserEntity_.workspaceEntity), workspaceEntity),
        criteriaBuilder.equal(root.get(WorkspaceUserEntity_.identifier), identifier),
        criteriaBuilder.equal(root.get(WorkspaceUserEntity_.archived), archived)
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
        criteriaBuilder.equal(root.get(WorkspaceUserEntity_.userSchoolDataIdentifier), userSchoolDataIdentifier),
        criteriaBuilder.equal(root.get(WorkspaceUserEntity_.workspaceEntity), workspaceEntity)
      ) 
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }

  public WorkspaceUserEntity findByWorkspaceEntityAndUserSchoolDataIdentifierAndArchived(WorkspaceEntity workspaceEntity, UserSchoolDataIdentifier userSchoolDataIdentifier, Boolean archived) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceUserEntity> criteria = criteriaBuilder.createQuery(WorkspaceUserEntity.class);
    Root<WorkspaceUserEntity> root = criteria.from(WorkspaceUserEntity.class);
    
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceUserEntity_.archived), archived),
        criteriaBuilder.equal(root.get(WorkspaceUserEntity_.userSchoolDataIdentifier), userSchoolDataIdentifier),
        criteriaBuilder.equal(root.get(WorkspaceUserEntity_.workspaceEntity), workspaceEntity)
      ) 
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }


  public WorkspaceUserEntity findByWorkspaceEntityAndUserSchoolDataIdentifierAndActiveAndArchived(WorkspaceEntity workspaceEntity, UserSchoolDataIdentifier userSchoolDataIdentifier, Boolean active, Boolean archived) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceUserEntity> criteria = criteriaBuilder.createQuery(WorkspaceUserEntity.class);
    Root<WorkspaceUserEntity> root = criteria.from(WorkspaceUserEntity.class);
    
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceUserEntity_.active), active),
        criteriaBuilder.equal(root.get(WorkspaceUserEntity_.archived), archived),
        criteriaBuilder.equal(root.get(WorkspaceUserEntity_.userSchoolDataIdentifier), userSchoolDataIdentifier),
        criteriaBuilder.equal(root.get(WorkspaceUserEntity_.workspaceEntity), workspaceEntity)
      ) 
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }

  public List<WorkspaceUserEntity> listByWorkspaceEntity(WorkspaceEntity workspaceEntity) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceUserEntity> criteria = criteriaBuilder.createQuery(WorkspaceUserEntity.class);
    Root<WorkspaceUserEntity> root = criteria.from(WorkspaceUserEntity.class);
    
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(WorkspaceUserEntity_.workspaceEntity), workspaceEntity)
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public List<WorkspaceUserEntity> listByWorkspaceEntityAndArchived(WorkspaceEntity workspaceEntity, Boolean archived) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceUserEntity> criteria = criteriaBuilder.createQuery(WorkspaceUserEntity.class);
    Root<WorkspaceUserEntity> root = criteria.from(WorkspaceUserEntity.class);
    
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(WorkspaceUserEntity_.archived), archived),
            criteriaBuilder.equal(root.get(WorkspaceUserEntity_.workspaceEntity), workspaceEntity)
        )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
  public List<WorkspaceUserEntity> listByWorkspaceEntityAndRoleAndArchived(WorkspaceEntity workspaceEntity, WorkspaceRoleEntity workspaceUserRole, Boolean archived) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceUserEntity> criteria = criteriaBuilder.createQuery(WorkspaceUserEntity.class);
    Root<WorkspaceUserEntity> root = criteria.from(WorkspaceUserEntity.class);
    
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(WorkspaceUserEntity_.archived), archived),
            criteriaBuilder.equal(root.get(WorkspaceUserEntity_.workspaceEntity), workspaceEntity),
            criteriaBuilder.equal(root.get(WorkspaceUserEntity_.workspaceUserRole), workspaceUserRole)
        )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
  public List<WorkspaceUserEntity> listByWorkspaceEntityAndRoleArchetypeAndArchived(WorkspaceEntity workspaceEntity, WorkspaceRoleArchetype archetype, Boolean archived) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceUserEntity> criteria = criteriaBuilder.createQuery(WorkspaceUserEntity.class);
    Root<WorkspaceUserEntity> root = criteria.from(WorkspaceUserEntity.class);
    Join<WorkspaceUserEntity, WorkspaceRoleEntity> join = root.join(WorkspaceUserEntity_.workspaceUserRole);
    
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(WorkspaceUserEntity_.archived), archived),
            criteriaBuilder.equal(root.get(WorkspaceUserEntity_.workspaceEntity), workspaceEntity),
            criteriaBuilder.equal(join.get(WorkspaceRoleEntity_.archetype), archetype)
        )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public List<WorkspaceUserEntity> listByWorkspaceEntityAndRoleArchetypeAndActiveAndArchived(WorkspaceEntity workspaceEntity, WorkspaceRoleArchetype archetype, Boolean active, Boolean archived) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceUserEntity> criteria = criteriaBuilder.createQuery(WorkspaceUserEntity.class);
    Root<WorkspaceUserEntity> root = criteria.from(WorkspaceUserEntity.class);
    Join<WorkspaceUserEntity, WorkspaceRoleEntity> join = root.join(WorkspaceUserEntity_.workspaceUserRole);
    
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(WorkspaceUserEntity_.active), active),
            criteriaBuilder.equal(root.get(WorkspaceUserEntity_.archived), archived),
            criteriaBuilder.equal(root.get(WorkspaceUserEntity_.workspaceEntity), workspaceEntity),
            criteriaBuilder.equal(join.get(WorkspaceRoleEntity_.archetype), archetype)
        )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
  public List<WorkspaceUserEntity> listByUserSchoolDataIdentifierAndActiveAndArchived(UserSchoolDataIdentifier userSchoolDataIdentifier, Boolean active, Boolean archived) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceUserEntity> criteria = criteriaBuilder.createQuery(WorkspaceUserEntity.class);
    Root<WorkspaceUserEntity> root = criteria.from(WorkspaceUserEntity.class);
    
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceUserEntity_.active), active),
        criteriaBuilder.equal(root.get(WorkspaceUserEntity_.archived), archived),
        criteriaBuilder.equal(root.get(WorkspaceUserEntity_.userSchoolDataIdentifier), userSchoolDataIdentifier)
      )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public List<WorkspaceUserEntity> listByUserSchoolDataIdentifiersAndActiveAndArchived(Collection<UserSchoolDataIdentifier> userSchoolDataIdentifiers, Boolean active, Boolean archived) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceUserEntity> criteria = criteriaBuilder.createQuery(WorkspaceUserEntity.class);
    Root<WorkspaceUserEntity> root = criteria.from(WorkspaceUserEntity.class);
    
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceUserEntity_.active), active),
        criteriaBuilder.equal(root.get(WorkspaceUserEntity_.archived), archived),
        root.get(WorkspaceUserEntity_.userSchoolDataIdentifier).in(userSchoolDataIdentifiers)
      )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public List<WorkspaceUserEntity> listByUserSchoolDataIdentifierAndArchived(UserSchoolDataIdentifier userSchoolDataIdentifier, Boolean archived) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceUserEntity> criteria = criteriaBuilder.createQuery(WorkspaceUserEntity.class);
    Root<WorkspaceUserEntity> root = criteria.from(WorkspaceUserEntity.class);
    
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceUserEntity_.archived), archived),
        criteriaBuilder.equal(root.get(WorkspaceUserEntity_.userSchoolDataIdentifier), userSchoolDataIdentifier)
      )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public Long countByWorkspaceEntityAndRolesAndArchived(WorkspaceEntity workspaceEntity, List<WorkspaceRoleEntity> workspaceUserRoles, Boolean archived) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Long> criteria = criteriaBuilder.createQuery(Long.class);
    Root<WorkspaceUserEntity> root = criteria.from(WorkspaceUserEntity.class);
    
    criteria.select(criteriaBuilder.count(root));
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceUserEntity_.archived), archived),
        criteriaBuilder.equal(root.get(WorkspaceUserEntity_.workspaceEntity), workspaceEntity),
        root.get(WorkspaceUserEntity_.workspaceUserRole).in(workspaceUserRoles)
      )
    );
    
    return entityManager.createQuery(criteria).getSingleResult();
  }
  
  public Long countByWorkspaceEntityAndRoleArchetypeAndArchived(WorkspaceEntity workspaceEntity, WorkspaceRoleArchetype archetype, Boolean archived) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Long> criteria = criteriaBuilder.createQuery(Long.class);
    Root<WorkspaceUserEntity> root = criteria.from(WorkspaceUserEntity.class);
    Join<WorkspaceUserEntity, WorkspaceRoleEntity> join = root.join(WorkspaceUserEntity_.workspaceUserRole);
    
    criteria.select(criteriaBuilder.count(root));
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(WorkspaceUserEntity_.archived), archived),
            criteriaBuilder.equal(root.get(WorkspaceUserEntity_.workspaceEntity), workspaceEntity),
            criteriaBuilder.equal(join.get(WorkspaceRoleEntity_.archetype), archetype)
        )
    );
    
    return entityManager.createQuery(criteria).getSingleResult();
  }

  public WorkspaceUserEntity updateIdentifier(WorkspaceUserEntity workspaceUserEntity, String identifier) {
    workspaceUserEntity.setIdentifier(identifier);
    return persist(workspaceUserEntity);
  }

  public WorkspaceUserEntity updateWorkspaceUserRole(WorkspaceUserEntity workspaceUserEntity, WorkspaceRoleEntity workspaceUserRole) {
    workspaceUserEntity.setWorkspaceUserRole(workspaceUserRole);
    return persist(workspaceUserEntity);
  }

  public WorkspaceUserEntity updateUserSchoolDataIdentifier(WorkspaceUserEntity workspaceUserEntity, UserSchoolDataIdentifier userSchoolDataIdentifier) {
    workspaceUserEntity.setUserSchoolDataIdentifier(userSchoolDataIdentifier);
    return persist(workspaceUserEntity);
  }

  public WorkspaceUserEntity updateActive(WorkspaceUserEntity workspaceUserEntity, Boolean active) {
    workspaceUserEntity.setActive(active);
    return persist(workspaceUserEntity);
  }

  public WorkspaceUserEntity updateArchived(WorkspaceUserEntity workspaceUserEntity, Boolean archived) {
    workspaceUserEntity.setArchived(archived);
    return persist(workspaceUserEntity);
  }
  
  public void delete(WorkspaceUserEntity workspaceUserEntity) {
    super.delete(workspaceUserEntity);
  }

  public List<WorkspaceUserEntity> findByIdentifier(String identifier) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceUserEntity> criteria = criteriaBuilder.createQuery(WorkspaceUserEntity.class);
    Root<WorkspaceUserEntity> root = criteria.from(WorkspaceUserEntity.class);
    
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(WorkspaceUserEntity_.identifier), identifier)
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public WorkspaceUserEntity findByIdentifierAndArchived(String identifier, Boolean archived) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceUserEntity> criteria = criteriaBuilder.createQuery(WorkspaceUserEntity.class);
    Root<WorkspaceUserEntity> root = criteria.from(WorkspaceUserEntity.class);
    
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceUserEntity_.identifier), identifier),
        criteriaBuilder.equal(root.get(WorkspaceUserEntity_.archived), archived)
      )
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }

}
