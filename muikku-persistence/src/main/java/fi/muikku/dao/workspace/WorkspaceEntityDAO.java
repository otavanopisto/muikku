package fi.muikku.dao.workspace;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.CoreDAO;
import fi.muikku.dao.DAO;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceEntity_;

@DAO
public class WorkspaceEntityDAO extends CoreDAO<WorkspaceEntity> {
  
	private static final long serialVersionUID = -5129003092406973620L;

	public WorkspaceEntity create(SchoolDataSource dataSource, String identifier, Boolean archived) {
    WorkspaceEntity workspaceEntity = new WorkspaceEntity();
    
    workspaceEntity.setDataSource(dataSource);
    workspaceEntity.setIdentifier(identifier);
    workspaceEntity.setArchived(archived);
    
    getEntityManager().persist(workspaceEntity);
    
    return workspaceEntity;
  }

	public WorkspaceEntity findByDataSourceAndIdentifier(SchoolDataSource schoolDataSource, String identifier) {
		EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceEntity> criteria = criteriaBuilder.createQuery(WorkspaceEntity.class);
    Root<WorkspaceEntity> root = criteria.from(WorkspaceEntity.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(          
          criteriaBuilder.equal(root.get(WorkspaceEntity_.dataSource), schoolDataSource),
          criteriaBuilder.equal(root.get(WorkspaceEntity_.identifier), identifier)
        )
    );
   
    return getSingleResult( entityManager.createQuery(criteria) );
	}
 
}
