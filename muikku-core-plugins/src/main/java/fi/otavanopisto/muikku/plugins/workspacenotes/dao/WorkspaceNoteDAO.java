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

  public WorkspaceNote create(Long owner, String title, String note, Long workspaceEntityId, Integer orderNumber){
    WorkspaceNote workspaceNote = new WorkspaceNote();
    workspaceNote.setOwner(owner);
    workspaceNote.setTitle(title);
    workspaceNote.setNote(note);
    workspaceNote.setWorkspace(workspaceEntityId);
    workspaceNote.setOrderNumber(orderNumber);
    workspaceNote.setArchived(Boolean.FALSE);
    return persist(workspaceNote);
  }
  
  public WorkspaceNote update(WorkspaceNote workspaceNote, String title, String note){
    workspaceNote.setTitle(title);
    workspaceNote.setNote(note);
    return persist(workspaceNote);
  }
  
  public WorkspaceNote updateOrderNumber(WorkspaceNote workspaceNote, Integer orderNumber) {
    workspaceNote.setOrderNumber(orderNumber);
    return persist(workspaceNote);
  }
  
  public List<WorkspaceNote> listByOwnerAndArchived(Long owner, Boolean archived){
    
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceNote> criteria = criteriaBuilder.createQuery(WorkspaceNote.class);
    
    Root<WorkspaceNote> root = criteria.from(WorkspaceNote.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.and(
      criteriaBuilder.equal(root.get(WorkspaceNote_.owner), owner),
      criteriaBuilder.equal(root.get(WorkspaceNote_.archived), archived)
    ));
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
public List<WorkspaceNote> listByOwnerAndWorkspaceAndArchived(Long owner, Long workspaceEntityId, Boolean archived){
    
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceNote> criteria = criteriaBuilder.createQuery(WorkspaceNote.class);
    
    Root<WorkspaceNote> root = criteria.from(WorkspaceNote.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.and(
      criteriaBuilder.equal(root.get(WorkspaceNote_.owner), owner),
      criteriaBuilder.equal(root.get(WorkspaceNote_.workspace), workspaceEntityId),
      criteriaBuilder.equal(root.get(WorkspaceNote_.archived), archived)
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
  
  public List<WorkspaceNote> listByOrderNumberEqualOrGreater(WorkspaceNote note) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceNote> criteria = criteriaBuilder.createQuery(WorkspaceNote.class);
    Root<WorkspaceNote> root = criteria.from(WorkspaceNote.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceNote_.workspace), note.getWorkspace()),
        criteriaBuilder.equal(root.get(WorkspaceNote_.owner), note.getOwner()),
        criteriaBuilder.equal(root.get(WorkspaceNote_.archived), Boolean.FALSE),
        criteriaBuilder.greaterThanOrEqualTo(root.get(WorkspaceNote_.orderNumber), note.getOrderNumber())));

    return entityManager.createQuery(criteria).getResultList();
  }
  
  public Integer getMaximumOrderNumberByOwnerAndWorkspace(Long workspaceEntityId, Long userEntityId) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Integer> criteria = criteriaBuilder.createQuery(Integer.class);
    Root<WorkspaceNote> root = criteria.from(WorkspaceNote.class);
    criteria.select(criteriaBuilder.max(root.get(WorkspaceNote_.orderNumber)));
    criteria.where(criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceNote_.archived), Boolean.FALSE),
        criteriaBuilder.equal(root.get(WorkspaceNote_.workspace), workspaceEntityId),
        criteriaBuilder.equal(root.get(WorkspaceNote_.owner), userEntityId)));

    return entityManager.createQuery(criteria).getSingleResult();
  }
  
  public List<WorkspaceNote> listByOrderNumberGreater(WorkspaceNote note) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceNote> criteria = criteriaBuilder.createQuery(WorkspaceNote.class);
    Root<WorkspaceNote> root = criteria.from(WorkspaceNote.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceNote_.workspace), note.getWorkspace()),
        criteriaBuilder.equal(root.get(WorkspaceNote_.owner), note.getOwner()),
        criteriaBuilder.equal(root.get(WorkspaceNote_.archived), Boolean.FALSE),
        criteriaBuilder.greaterThan(root.get(WorkspaceNote_.orderNumber), note.getOrderNumber())
      )
    );

    criteria.orderBy(criteriaBuilder.asc(root.get(WorkspaceNote_.orderNumber)));

    return entityManager.createQuery(criteria).getResultList();
  }
}
