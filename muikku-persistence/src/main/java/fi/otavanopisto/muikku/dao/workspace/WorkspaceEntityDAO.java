package fi.otavanopisto.muikku.dao.workspace;

import java.util.Collection;
import java.util.Collections;
import java.util.EnumSet;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity_;
import fi.otavanopisto.muikku.model.workspace.WorkspaceLanguage;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleEntity_;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity_;
import fi.otavanopisto.muikku.model.workspace.WorkspaceAccess;
import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.model.base.SchoolDataSource;
import fi.otavanopisto.muikku.model.users.OrganizationEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;

public class WorkspaceEntityDAO extends CoreDAO<WorkspaceEntity> {
  
	private static final long serialVersionUID = -5129003092406973620L;

	public WorkspaceEntity create(SchoolDataSource dataSource, String identifier, String urlName, OrganizationEntity organizationEntity, WorkspaceAccess access, Boolean published, Boolean archived, WorkspaceLanguage language) {
    WorkspaceEntity workspaceEntity = new WorkspaceEntity();
    
    workspaceEntity.setDataSource(dataSource);
    workspaceEntity.setIdentifier(identifier);
    workspaceEntity.setUrlName(urlName);
    workspaceEntity.setOrganizationEntity(organizationEntity);
    workspaceEntity.setAccess(access);
    workspaceEntity.setArchived(archived);
    workspaceEntity.setPublished(published);
    workspaceEntity.setLanguage(language);
    
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
   
    return getSingleResult(entityManager.createQuery(criteria));
  }

  public WorkspaceEntity findByUrlNameAndArchived(String urlName, Boolean archived) {
		EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceEntity> criteria = criteriaBuilder.createQuery(WorkspaceEntity.class);
    Root<WorkspaceEntity> root = criteria.from(WorkspaceEntity.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(          
        criteriaBuilder.equal(root.get(WorkspaceEntity_.urlName), urlName),
        criteriaBuilder.equal(root.get(WorkspaceEntity_.archived), archived)
      )
    );
   
    return getSingleResult(entityManager.createQuery(criteria));
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
  
  public List<WorkspaceEntity> listByPublished(Boolean published) {
    return listByPublishedAndArchived(published, Boolean.FALSE);
  }

  public List<WorkspaceEntity> listByPublishedAndArchived(Boolean published, Boolean archived) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceEntity> criteria = criteriaBuilder.createQuery(WorkspaceEntity.class);
    Root<WorkspaceEntity> root = criteria.from(WorkspaceEntity.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceEntity_.published), published),
        criteriaBuilder.equal(root.get(WorkspaceEntity_.archived), archived)
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

  public List<Long> listIdsByDataSourceAndIdentifiers(SchoolDataSource dataSource, Collection<String> groupIdentifiers) {
    if (groupIdentifiers == null || groupIdentifiers.isEmpty()) {
      return Collections.emptyList();
    }
    
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Long> criteria = criteriaBuilder.createQuery(Long.class);
    Root<WorkspaceEntity> root = criteria.from(WorkspaceEntity.class);
    criteria.select(root.get(WorkspaceEntity_.id));
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceEntity_.dataSource), dataSource),
        root.get(WorkspaceEntity_.identifier).in(groupIdentifiers)
      )
    );
   
    return entityManager.createQuery(criteria).getResultList();
  }

  public WorkspaceEntity updateAccess(WorkspaceEntity workspaceEntity, WorkspaceAccess access) {
    workspaceEntity.setAccess(access);
    return persist(workspaceEntity);
  }
  
  public WorkspaceEntity updateLanguage(WorkspaceEntity workspaceEntity, WorkspaceLanguage language) {
    workspaceEntity.setLanguage(language);
    return persist(workspaceEntity);
  }

  public WorkspaceEntity updateOrganizationEntity(WorkspaceEntity workspaceEntity, OrganizationEntity organizationEntity) {
    workspaceEntity.setOrganizationEntity(organizationEntity);
    return persist(workspaceEntity);
  }

  public WorkspaceEntity updateDefaultMaterialLicense(WorkspaceEntity workspaceEntity, String defaultMaterialLicense) {
    workspaceEntity.setDefaultMaterialLicense(defaultMaterialLicense);
    return persist(workspaceEntity);
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
  
  public List<WorkspaceEntity> listCommonWorkspaces(UserSchoolDataIdentifier teacher, UserSchoolDataIdentifier student) {
    // Looking for common workspaces for (active) student & teacher
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceEntity> criteria = criteriaBuilder.createQuery(WorkspaceEntity.class);
    Root<WorkspaceUserEntity> teacherRoot = criteria.from(WorkspaceUserEntity.class);
    Root<WorkspaceUserEntity> studentRoot = criteria.from(WorkspaceUserEntity.class);

    Join<WorkspaceUserEntity, WorkspaceRoleEntity> teacherRole = teacherRoot.join(WorkspaceUserEntity_.workspaceUserRole);
    Join<WorkspaceUserEntity, WorkspaceRoleEntity> studentRole = studentRoot.join(WorkspaceUserEntity_.workspaceUserRole);

    EnumSet<WorkspaceRoleArchetype> teacherRoles = EnumSet.of(WorkspaceRoleArchetype.TEACHER, WorkspaceRoleArchetype.TUTOR, WorkspaceRoleArchetype.ORGANIZER);
    
    criteria.select(teacherRoot.get(WorkspaceUserEntity_.workspaceEntity));
    criteria.where(
      criteriaBuilder.and(
        teacherRole.get(WorkspaceRoleEntity_.archetype).in(teacherRoles),
        criteriaBuilder.equal(studentRole.get(WorkspaceRoleEntity_.archetype), WorkspaceRoleArchetype.STUDENT),
        criteriaBuilder.equal(teacherRoot.get(WorkspaceUserEntity_.userSchoolDataIdentifier), teacher),
        criteriaBuilder.equal(studentRoot.get(WorkspaceUserEntity_.userSchoolDataIdentifier), student),
        criteriaBuilder.equal(studentRoot.get(WorkspaceUserEntity_.archived), Boolean.FALSE),
        criteriaBuilder.equal(teacherRoot.get(WorkspaceUserEntity_.archived), Boolean.FALSE),
        criteriaBuilder.equal(teacherRoot.get(WorkspaceUserEntity_.workspaceEntity), studentRoot.get(WorkspaceUserEntity_.workspaceEntity))
      ) 
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }

}
