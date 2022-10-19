package fi.otavanopisto.muikku.plugins.forum.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.forum.model.WorkspaceForumArea_;
import fi.otavanopisto.muikku.model.security.ResourceRights;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.forum.model.ForumAreaGroup;
import fi.otavanopisto.muikku.plugins.forum.model.WorkspaceForumArea;

public class WorkspaceForumAreaDAO extends CorePluginsDAO<WorkspaceForumArea> {
  
	private static final long serialVersionUID = 8627800028194294719L;

	public WorkspaceForumArea create(WorkspaceEntity workspace, String name, String description, ForumAreaGroup group,
	    Boolean archived, UserEntity owner, ResourceRights rights) {
    WorkspaceForumArea forumArea = new WorkspaceForumArea();
    
    forumArea.setWorkspace(workspace.getId());
    forumArea.setName(name);
    forumArea.setDescription(description);
    forumArea.setArchived(archived);
    forumArea.setGroup(group);
    forumArea.setOwner(owner.getId());
    forumArea.setRights(rights.getId());
    
    getEntityManager().persist(forumArea);
    
    return forumArea;
  }
  
  public List<WorkspaceForumArea> listAllNonArchived() {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceForumArea> criteria = criteriaBuilder.createQuery(WorkspaceForumArea.class);
    Root<WorkspaceForumArea> root = criteria.from(WorkspaceForumArea.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.equal(root.get(WorkspaceForumArea_.archived), Boolean.FALSE)
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }
	
  public List<WorkspaceForumArea> listByWorkspaceEntity(WorkspaceEntity workspaceEntity) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceForumArea> criteria = criteriaBuilder.createQuery(WorkspaceForumArea.class);
    Root<WorkspaceForumArea> root = criteria.from(WorkspaceForumArea.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(WorkspaceForumArea_.workspace), workspaceEntity.getId()),
            criteriaBuilder.equal(root.get(WorkspaceForumArea_.archived), Boolean.FALSE)
        )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
  public WorkspaceForumArea findByAreaId(Long areaId) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceForumArea> criteria = criteriaBuilder.createQuery(WorkspaceForumArea.class);
    Root<WorkspaceForumArea> root = criteria.from(WorkspaceForumArea.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(WorkspaceForumArea_.id), areaId),
            criteriaBuilder.equal(root.get(WorkspaceForumArea_.archived), Boolean.FALSE)
        )
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }
  
}
