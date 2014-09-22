package fi.muikku.dao.workspace;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.CoreDAO;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceEntity_;

public class WorkspaceEntityDAO extends CoreDAO<WorkspaceEntity> {
  
	private static final long serialVersionUID = -5129003092406973620L;

	public WorkspaceEntity create(SchoolDataSource dataSource, String identifier, String urlName, Boolean archived) {
    WorkspaceEntity workspaceEntity = new WorkspaceEntity();
    
    workspaceEntity.setDataSource(dataSource);
    workspaceEntity.setIdentifier(identifier);
    workspaceEntity.setUrlName(urlName);
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

	public WorkspaceEntity findByUrlName(String urlName) {
		EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceEntity> criteria = criteriaBuilder.createQuery(WorkspaceEntity.class);
    Root<WorkspaceEntity> root = criteria.from(WorkspaceEntity.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(WorkspaceEntity_.urlName), urlName)
    );
   
    return getSingleResult( entityManager.createQuery(criteria) );
	}

  public List<WorkspaceEntity> listByDataSource(SchoolDataSource dataSource) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceEntity> criteria = criteriaBuilder.createQuery(WorkspaceEntity.class);
    Root<WorkspaceEntity> root = criteria.from(WorkspaceEntity.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(WorkspaceEntity_.dataSource), dataSource)
    );
   
    return entityManager.createQuery(criteria).getResultList();
  }

  public List<String> listIdentifiersByDataSource(SchoolDataSource dataSource) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<String> criteria = criteriaBuilder.createQuery(String.class);
    Root<WorkspaceEntity> root = criteria.from(WorkspaceEntity.class);
    criteria.select(root.get(WorkspaceEntity_.identifier));
    criteria.where(
      criteriaBuilder.equal(root.get(WorkspaceEntity_.dataSource), dataSource)
    );
   
    return entityManager.createQuery(criteria).getResultList();
  }

  public WorkspaceEntity updateArchived(WorkspaceEntity workspaceEntity, Boolean archived) {
    workspaceEntity.setArchived(archived);
    return persist(workspaceEntity);
  }
 
  public void delete(WorkspaceEntity workspaceEntity) {
    super.delete(workspaceEntity);
  }
  
}
