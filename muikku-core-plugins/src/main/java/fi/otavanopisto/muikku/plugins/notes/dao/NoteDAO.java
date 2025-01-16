package fi.otavanopisto.muikku.plugins.notes.dao;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.notes.model.Note;
import fi.otavanopisto.muikku.plugins.notes.model.NotePriority;
import fi.otavanopisto.muikku.plugins.notes.model.NoteReceiver;
import fi.otavanopisto.muikku.plugins.notes.model.NoteReceiver_;
import fi.otavanopisto.muikku.plugins.notes.model.NoteType;
import fi.otavanopisto.muikku.plugins.notes.model.Note_;

public class NoteDAO extends CorePluginsDAO<Note> {
  
  private static final long serialVersionUID = 1265008061182482207L;

  public Note create(String title, String description, NoteType type, NotePriority priority, Long creator, Long lastModifier,Date startDate, Date dueDate, Boolean archived, Boolean multiUserNote){
    Note note = new Note();
    note.setTitle(title);
    note.setDescription(description);
    note.setType(type);
    note.setPriority(priority);
    note.setCreator(creator);
    note.setCreated(new Date());
    note.setLastModifier(lastModifier);
    note.setLastModified(new Date());
    note.setArchived(archived);
    note.setStartDate(startDate);
    note.setDueDate(dueDate);
    note.setMultiUserNote(multiUserNote);
    return persist(note);
  }
  
  public Note update(Note note, String title, String description, NotePriority priority, Long lastModifier, Date startDate, Date dueDate, Boolean archived){
    note.setTitle(title);
    note.setDescription(description);
    note.setPriority(priority);
    note.setLastModifier(lastModifier);
    note.setLastModified(new Date());
    note.setStartDate(startDate);
    note.setDueDate(dueDate);
    note.setArchived(archived);
    return persist(note);
  }
  
  public Note setArchived(Note note, Boolean archived) {
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
  
  public List<Note> listByReceiver(UserEntity recipient, boolean archived){
    
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Note> criteria = criteriaBuilder.createQuery(Note.class);
    Root<NoteReceiver> root = criteria.from(NoteReceiver.class);
    Root<Note> root2 = criteria.from(Note.class);

    criteria.select(root.get(NoteReceiver_.note));
    criteria.where(
        criteriaBuilder.and(
          criteriaBuilder.equal(root.get(NoteReceiver_.recipient), recipient.getId()),
          criteriaBuilder.equal(root2.get(Note_.id), root.get(NoteReceiver_.note)),
          criteriaBuilder.equal(root2.get(Note_.archived), archived)
        )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public List<Note> listByCreator(UserEntity creator, boolean archived){
  
  EntityManager entityManager = getEntityManager(); 
  
  CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
  CriteriaQuery<Note> criteria = criteriaBuilder.createQuery(Note.class);
  Root<Note> root = criteria.from(Note.class);
  
  criteria.select(root);
  criteria.where(
      criteriaBuilder.and(
      criteriaBuilder.equal(root.get(Note_.creator), creator.getId()),
      criteriaBuilder.equal(root.get(Note_.archived), archived)
      )
  );
  
  return entityManager.createQuery(criteria).getResultList();
}
  
public List<Note> listByCreatorAndRecipientAndArchived(UserEntity creator, UserEntity recipient, boolean archived){
    
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Note> criteria = criteriaBuilder.createQuery(Note.class);
    Root<NoteReceiver> root = criteria.from(NoteReceiver.class);
    Root<Note> root2 = criteria.from(Note.class);

    criteria.select(root.get(NoteReceiver_.note));
    criteria.where(
        criteriaBuilder.and(
          criteriaBuilder.equal(root.get(NoteReceiver_.recipient), recipient.getId()),
          criteriaBuilder.equal(root2.get(Note_.id), root.get(NoteReceiver_.note)),
          criteriaBuilder.equal(root2.get(Note_.creator), creator),
          criteriaBuilder.equal(root2.get(Note_.archived), archived)
        )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
}
