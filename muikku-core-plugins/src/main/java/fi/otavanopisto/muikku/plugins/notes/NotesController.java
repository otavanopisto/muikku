package fi.otavanopisto.muikku.plugins.notes;

import java.util.Date;
import java.util.List;

import javax.inject.Inject;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.notes.dao.NoteDAO;
import fi.otavanopisto.muikku.plugins.notes.model.Note;
import fi.otavanopisto.muikku.plugins.notes.model.NotePriority;
import fi.otavanopisto.muikku.plugins.notes.model.NoteType;
import fi.otavanopisto.muikku.session.SessionController;

public class NotesController {
  
  @Inject 
  private SessionController sessionController;
  
  @Inject
  private NoteDAO noteDAO;
  
  public Note createNote(String title, String description, NoteType type, NotePriority priority, Date startDate, Date dueDate) {
    return noteDAO.create(
        title,
        description,
        type,
        priority,
        sessionController.getLoggedUserEntity().getId(),
        sessionController.getLoggedUserEntity().getId(),
        startDate,
        dueDate,
        Boolean.FALSE);
  }
  
  public Note updateNote(Note note, String title, String description, NotePriority priority, Date startDate,  Date dueDate) {
    return noteDAO.update(note, title, description, priority, sessionController.getLoggedUserEntity().getId(), startDate, dueDate, note.getArchived());
  }
  
  public Note toggleArchived(Note note) {
    return noteDAO.setArchived(note, !note.getArchived());
  }
  
  public Note findNoteById(Long id) {
    return noteDAO.findById(id);
  }
  
  public Note findNoteByIdAndArchived(Long id, boolean archived) {
    return noteDAO.findByIdAndArchived(id, archived);
  }

  public List<Note> listByReceiver(UserEntity recipient, boolean listArchived) {
    return noteDAO.listByReceiver(recipient, listArchived);
  }
  
  public List<Note> listByCreator(UserEntity creator, boolean archived) {
    return noteDAO.listByCreator(creator, archived);
  }
}
