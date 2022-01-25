package fi.otavanopisto.muikku.plugins.notes.dao;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.notes.Note;
import fi.otavanopisto.muikku.plugins.notes.NotePriority;
import fi.otavanopisto.muikku.plugins.notes.NoteType;
import fi.otavanopisto.muikku.plugins.notes.Note_;

public class NoteDAO extends CorePluginsDAO<Note> {

  
  private static final long serialVersionUID = 1265008061182482207L;

  public Note create(String title, String description, NoteType type, NotePriority priority, Boolean pinned, String owner, String creator, Date created, String lastModifier, Date lastModified, Boolean archived){
    Note note = new Note();
    note.setTitle(title);
    note.setDescription(description);
    note.setType(type);
    note.setPriority(priority);
    note.setPinned(pinned);
    note.setOwner(owner);
    note.setCreator(creator);
    note.setCreated(created);
    note.setArchived(false);
    return persist(note);
  }
  
  public Note update(Note note, String title, String description, NotePriority priority, Boolean pinned, String lastModifier, Date lastModified, Boolean archived){
    note.setTitle(title);
    note.setDescription(description);
    note.setPriority(priority);
    note.setPinned(pinned);
    note.setLastModifier(lastModifier);
    note.setLastModified(lastModified);
    note.setArchived(archived);
    return persist(note);
  }
  
  public List<Note> listBy(String owner){
    
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Note> criteria = criteriaBuilder.createQuery(Note.class);
    
    Root<Note> root = criteria.from(Note.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.and(
      criteriaBuilder.equal(root.get(Note_.owner), owner)
    ));
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
  
  public Note updateArchived(Note note, boolean archived) {
    note.setArchived(archived);
    
    getEntityManager().persist(note);
    
    return note;
  }
  
  @Override
  public void delete(Note note) {
    super.delete(note);
  }

  
}
