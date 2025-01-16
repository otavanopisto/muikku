package fi.otavanopisto.muikku.plugins.notes.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.notes.model.Note;
import fi.otavanopisto.muikku.plugins.notes.model.NoteReceiver;
import fi.otavanopisto.muikku.plugins.notes.model.NoteReceiver_;
import fi.otavanopisto.muikku.plugins.notes.model.NoteStatus;

public class NoteRecipientDAO extends CorePluginsDAO<NoteReceiver> {
  
  private static final long serialVersionUID = 5332322875854879065L;

  public NoteReceiver create(Boolean pinned, Long recipient, NoteStatus status, Boolean archived, Note note, Long userGroupId, Long workspaceId){
    NoteReceiver noteRecipient = new NoteReceiver();
    noteRecipient.setPinned(pinned);
    noteRecipient.setRecipient(recipient);
    noteRecipient.setStatus(status);
    noteRecipient.setNote(note);
    noteRecipient.setRecipientGroup(userGroupId);
    noteRecipient.setWorkspace_id(workspaceId);
    return persist(noteRecipient);
  }
  
  public NoteReceiver update(NoteReceiver noteRecipient, Boolean pinned, NoteStatus status){

    noteRecipient.setPinned(pinned);
    noteRecipient.setStatus(status);
    return persist(noteRecipient);
  }
  
  public NoteReceiver updateWorkspaceAndUserGroup(NoteReceiver noteRecipient, Long userGroupId, Long workspaceId){

    noteRecipient.setRecipientGroup(userGroupId);
    noteRecipient.setWorkspace_id(workspaceId);
    return persist(noteRecipient);
  }
  
  public List<NoteReceiver> listByNote(Note note){
    
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<NoteReceiver> criteria = criteriaBuilder.createQuery(NoteReceiver.class);
    
    Root<NoteReceiver> root = criteria.from(NoteReceiver.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.and(
      criteriaBuilder.equal(root.get(NoteReceiver_.note), note)
    ));
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
public List<NoteReceiver> listByNoteAndRecipientGroup(Long note, Note recipientGroup){
    
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<NoteReceiver> criteria = criteriaBuilder.createQuery(NoteReceiver.class);
    
    Root<NoteReceiver> root = criteria.from(NoteReceiver.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.and(
      criteriaBuilder.equal(root.get(NoteReceiver_.note), note),
      criteriaBuilder.equal(root.get(NoteReceiver_.recipientGroup_id), recipientGroup)
    ));
    
    return entityManager.createQuery(criteria).getResultList();
  }


  public NoteReceiver findByRecipientIdAndNote(Long id, Note note) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<NoteReceiver> criteria = criteriaBuilder.createQuery(NoteReceiver.class);
    Root<NoteReceiver> root = criteria.from(NoteReceiver.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(NoteReceiver_.recipient), id),
        criteriaBuilder.equal(root.get(NoteReceiver_.note), note)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }
  
  public List<NoteReceiver> listByReceiver(Long recipient){
    
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<NoteReceiver> criteria = criteriaBuilder.createQuery(NoteReceiver.class);
    
    Root<NoteReceiver> root = criteria.from(NoteReceiver.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(NoteReceiver_.recipient), recipient
    ));
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
  public void deleteReceiver(NoteReceiver noteReceiver) {
    super.delete(noteReceiver);
  }
}
