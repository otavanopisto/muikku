package fi.muikku.dao.workspace;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.CoreDAO;
import fi.muikku.dao.DAO;
import fi.muikku.model.workspace.WorkspaceRoleEntity;
import fi.muikku.model.workspace.WorkspaceRoleEntity_;

@DAO
public class WorkspaceRoleEntityDAO extends CoreDAO<WorkspaceRoleEntity> {

	private static final long serialVersionUID = 8213977150189134795L;

  public WorkspaceRoleEntity create(String name) {
    WorkspaceRoleEntity workspaceRoleEntity = new WorkspaceRoleEntity();
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
  
}
