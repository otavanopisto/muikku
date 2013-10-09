package fi.muikku.plugins.forum.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.DAO;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.forum.model.WorkspaceForumArea;
import fi.muikku.plugins.forum.model.WorkspaceForumArea_;


@DAO
public class WorkspaceForumAreaDAO extends PluginDAO<WorkspaceForumArea> {
  
	private static final long serialVersionUID = 8627800028194294719L;

	public WorkspaceForumArea create(WorkspaceEntity workspace, String name, Boolean archived) {
    WorkspaceForumArea forumArea = new WorkspaceForumArea();
    
    forumArea.setWorkspace(workspace.getId());
    forumArea.setName(name);
    forumArea.setArchived(archived);
    
    getEntityManager().persist(forumArea);
    
    return forumArea;
  }
  
  public List<WorkspaceForumArea> listByWorkspace(WorkspaceEntity workspace) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceForumArea> criteria = criteriaBuilder.createQuery(WorkspaceForumArea.class);
    Root<WorkspaceForumArea> root = criteria.from(WorkspaceForumArea.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.equal(root.get(WorkspaceForumArea_.workspace), workspace.getId())
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
}
