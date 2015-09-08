package fi.muikku.plugins.forum.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.model.security.ResourceRights;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.CorePluginsDAO;
import fi.muikku.plugins.forum.model.ForumAreaGroup;
import fi.muikku.plugins.forum.model.WorkspaceForumArea;
import fi.muikku.plugins.forum.model.WorkspaceForumArea_;

public class WorkspaceForumAreaDAO extends CorePluginsDAO<WorkspaceForumArea> {
  
	private static final long serialVersionUID = 8627800028194294719L;

	public WorkspaceForumArea create(WorkspaceEntity workspace, String name, ForumAreaGroup group,
	    Boolean archived, UserEntity owner, ResourceRights rights) {
    WorkspaceForumArea forumArea = new WorkspaceForumArea();
    
    forumArea.setWorkspace(workspace.getId());
    forumArea.setName(name);
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
	
  public List<WorkspaceForumArea> listByWorkspace(WorkspaceEntity workspace) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceForumArea> criteria = criteriaBuilder.createQuery(WorkspaceForumArea.class);
    Root<WorkspaceForumArea> root = criteria.from(WorkspaceForumArea.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(WorkspaceForumArea_.workspace), workspace.getId()),
            criteriaBuilder.equal(root.get(WorkspaceForumArea_.archived), Boolean.FALSE)
        )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
}
