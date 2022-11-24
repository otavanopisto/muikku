package fi.otavanopisto.muikku.plugins.workspacenotes.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceNote;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceNote_;

public class WorkspaceNoteDAO extends CorePluginsDAO<WorkspaceNote> {
  
  private static final long serialVersionUID = -2443284063711215599L;

  public WorkspaceNote create(Long owner, String title, String note, Long workspaceEntityId, Boolean archived){
    WorkspaceNote workspaceNote = new WorkspaceNote();
    workspaceNote.setOwner(owner);
    workspaceNote.setTitle(title);
    workspaceNote.setNote(note);
    workspaceNote.setWorkspace(workspaceEntityId);
    workspaceNote.setArchived(archived);
    return persist(workspaceNote);
  }
  
  public WorkspaceNote update(WorkspaceNote workspaceNote, String title, String note){
    workspaceNote.setTitle(title);
    workspaceNote.setNote(note);
    return persist(workspaceNote);
  }
  
  public List<WorkspaceNote> listByOwnerAndArchived(Long owner){
    
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceNote> criteria = criteriaBuilder.createQuery(WorkspaceNote.class);
    
    Root<WorkspaceNote> root = criteria.from(WorkspaceNote.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.and(
      criteriaBuilder.equal(root.get(WorkspaceNote_.owner), owner),
      criteriaBuilder.equal(root.get(WorkspaceNote_.archived), Boolean.FALSE)
    ));
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
public List<WorkspaceNote> listByOwnerAndWorkspaceAndArchived(Long owner, Long workspaceEntityId){
    
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceNote> criteria = criteriaBuilder.createQuery(WorkspaceNote.class);
    
    Root<WorkspaceNote> root = criteria.from(WorkspaceNote.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.and(
      criteriaBuilder.equal(root.get(WorkspaceNote_.owner), owner),
      criteriaBuilder.equal(root.get(WorkspaceNote_.workspace), workspaceEntityId),
      criteriaBuilder.equal(root.get(WorkspaceNote_.archived), Boolean.FALSE)
    ));
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
  
  public WorkspaceNote setArchived(WorkspaceNote workspaceNote, Boolean archived) {
    workspaceNote.setArchived(archived);
    getEntityManager().persist(workspaceNote);
    return workspaceNote;
  }

  public WorkspaceNote findByIdAndArchived(Long id, boolean archived) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceNote> criteria = criteriaBuilder.createQuery(WorkspaceNote.class);
    Root<WorkspaceNote> root = criteria.from(WorkspaceNote.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceNote_.id), id),
        criteriaBuilder.equal(root.get(WorkspaceNote_.archived), archived)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }
}
