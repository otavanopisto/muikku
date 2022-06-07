package fi.otavanopisto.muikku.plugins.notes.dao;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.notes.model.Note;
import fi.otavanopisto.muikku.plugins.notes.model.NotePriority;
import fi.otavanopisto.muikku.plugins.notes.model.NoteStatus;
import fi.otavanopisto.muikku.plugins.notes.model.NoteType;
import fi.otavanopisto.muikku.plugins.notes.model.Note_;

public class NoteDAO extends CorePluginsDAO<Note> {

  
  
  private static final long serialVersionUID = 1265008061182482207L;

  public Note create(String title, String description, NoteType type, NotePriority priority, Boolean pinned, Long owner, Long creator, Long lastModifier,Date startDate, Date dueDate, NoteStatus status, Boolean archived){
    Note note = new Note();
    note.setTitle(title);
    note.setDescription(description);
    note.setType(type);
    note.setPriority(priority);
    note.setPinned(pinned);
    note.setOwner(owner);
    note.setCreator(creator);
    note.setCreated(new Date());
    note.setLastModifier(lastModifier);
    note.setLastModified(new Date());
    note.setArchived(archived);
    note.setStartDate(startDate);
    note.setDueDate(dueDate);
    note.setStatus(status);
    return persist(note);
  }
  
  public Note update(Note note, String title, String description, NotePriority priority, Boolean pinned, Long lastModifier, Date startDate, Date dueDate, NoteStatus status, Boolean archived){
    note.setTitle(title);
    note.setDescription(description);
    note.setPriority(priority);
    note.setPinned(pinned);
    note.setLastModifier(lastModifier);
    note.setLastModified(new Date());
    note.setStartDate(startDate);
    note.setDueDate(dueDate);
    note.setStatus(status);
    note.setArchived(archived);
    return persist(note);
  }
  
  public List<Note> listByOwnerAndArchived(Long owner, boolean archived){
    
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Note> criteria = criteriaBuilder.createQuery(Note.class);
    
    Root<Note> root = criteria.from(Note.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.and(
      criteriaBuilder.equal(root.get(Note_.owner), owner),
      criteriaBuilder.equal(root.get(Note_.archived), archived)
    ));
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
  
  public Note updateArchived(Note note, boolean archived) {
    note.setArchived(archived);
    note.setLastModified(new Date());
    
    getEntityManager().persist(note);
    
    return note;
  }

  public Note findByIdAndArchived(Long id, boolean archived) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Note> criteria = criteriaBuilder.createQuery(Note.class);
    Root<Note> root = criteria.from(Note.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(Note_.id), id),
        criteriaBuilder.equal(root.get(Note_.archived), archived)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }
}
