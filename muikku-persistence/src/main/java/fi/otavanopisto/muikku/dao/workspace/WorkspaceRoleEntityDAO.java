package fi.otavanopisto.muikku.dao.workspace;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleEntity_;
import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleEntity;

public class WorkspaceRoleEntityDAO extends CoreDAO<WorkspaceRoleEntity> {

	private static final long serialVersionUID = 8213977150189134795L;

  public WorkspaceRoleEntity create(WorkspaceRoleArchetype archetype, String name) {
    WorkspaceRoleEntity workspaceRoleEntity = new WorkspaceRoleEntity();
    
    workspaceRoleEntity.setArchetype(archetype);
    workspaceRoleEntity.setName(name);
    
    return persist(workspaceRoleEntity);
  }

  public WorkspaceRoleEntity findByName(String roleName) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceRoleEntity> criteria = criteriaBuilder.createQuery(WorkspaceRoleEntity.class);
    Root<WorkspaceRoleEntity> root = criteria.from(WorkspaceRoleEntity.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(WorkspaceRoleEntity_.name), roleName)
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }

  public List<WorkspaceRoleEntity> listByArchetype(WorkspaceRoleArchetype archetype) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceRoleEntity> criteria = criteriaBuilder.createQuery(WorkspaceRoleEntity.class);
    Root<WorkspaceRoleEntity> root = criteria.from(WorkspaceRoleEntity.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(WorkspaceRoleEntity_.archetype), archetype)
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
}
