package fi.muikku.dao.workspace;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.CoreDAO;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.model.workspace.WorkspaceEntity_;

public class WorkspaceEntityDAO extends CoreDAO<WorkspaceEntity> {
  
	private static final long serialVersionUID = -5129003092406973620L;

	public WorkspaceEntity create(SchoolDataSource dataSource, String identifier, String urlName, Boolean published, Boolean archived) {
    WorkspaceEntity workspaceEntity = new WorkspaceEntity();
    
    workspaceEntity.setDataSource(dataSource);
    workspaceEntity.setIdentifier(identifier);
    workspaceEntity.setUrlName(urlName);
    workspaceEntity.setArchived(archived);
    workspaceEntity.setPublished(published);
    
    return persist(workspaceEntity);
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
    return listByDataSource(dataSource, null, null);
  }

  public List<WorkspaceEntity> listByDataSource(SchoolDataSource dataSource, Integer firstResult, Integer maxResults) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceEntity> criteria = criteriaBuilder.createQuery(WorkspaceEntity.class);
    Root<WorkspaceEntity> root = criteria.from(WorkspaceEntity.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(WorkspaceEntity_.dataSource), dataSource)
    );
    
    TypedQuery<WorkspaceEntity> query = entityManager.createQuery(criteria);
   
    if (firstResult != null) {
      query.setFirstResult(firstResult);
    }
    
    if (maxResults != null) {
      query.setMaxResults(maxResults);
    }
    
    return query.getResultList();
  }


  public List<String> listIdentifiersByDataSource(SchoolDataSource dataSource) {
    return listIdentifiersByDataSource(dataSource, null, null);
  }
  
  public List<String> listIdentifiersByDataSource(SchoolDataSource dataSource, Integer firstResult, Integer maxResults) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<String> criteria = criteriaBuilder.createQuery(String.class);
    Root<WorkspaceEntity> root = criteria.from(WorkspaceEntity.class);
    criteria.select(root.get(WorkspaceEntity_.identifier));
    criteria.where(
      criteriaBuilder.equal(root.get(WorkspaceEntity_.dataSource), dataSource)
    );
   
    TypedQuery<String> query = entityManager.createQuery(criteria);
    
    if (firstResult != null) {
      query.setFirstResult(firstResult);
    }
    
    if (maxResults != null) {
      query.setMaxResults(maxResults);
    }
    
    return query.getResultList();
  }

  public List<String> listIdentifiersByDataSourceAndArchived(SchoolDataSource dataSource, Boolean archived) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<String> criteria = criteriaBuilder.createQuery(String.class);
    Root<WorkspaceEntity> root = criteria.from(WorkspaceEntity.class);
    criteria.select(root.get(WorkspaceEntity_.identifier));
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceEntity_.archived), archived),
        criteriaBuilder.equal(root.get(WorkspaceEntity_.dataSource), dataSource)
      )
    );
   
    return entityManager.createQuery(criteria).getResultList();
  }

  public List<Long> listPublishedWorkspaceEntityIds() {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Long> criteria = criteriaBuilder.createQuery(Long.class);
    Root<WorkspaceEntity> root = criteria.from(WorkspaceEntity.class);
    criteria.select(root.get(WorkspaceEntity_.id));
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceEntity_.archived), Boolean.FALSE),
        criteriaBuilder.equal(root.get(WorkspaceEntity_.published), Boolean.TRUE)
      )
    );
   
    return entityManager.createQuery(criteria).getResultList();
  }
  
  public WorkspaceEntity updatePublished(WorkspaceEntity workspaceEntity, Boolean published) {
    workspaceEntity.setPublished(published);
    return persist(workspaceEntity);
  }
  
  public WorkspaceEntity updateArchived(WorkspaceEntity workspaceEntity, Boolean archived) {
    workspaceEntity.setArchived(archived);
    return persist(workspaceEntity);
  }
 
  public void delete(WorkspaceEntity workspaceEntity) {
    super.delete(workspaceEntity);
  }

}
