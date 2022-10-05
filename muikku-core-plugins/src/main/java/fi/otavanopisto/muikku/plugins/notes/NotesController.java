package fi.otavanopisto.muikku.plugins.notes;

import java.util.Date;
import java.util.List;

import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.notes.dao.NoteDAO;
import fi.otavanopisto.muikku.plugins.notes.model.Note;
import fi.otavanopisto.muikku.plugins.notes.model.NotePriority;
import fi.otavanopisto.muikku.plugins.notes.model.NoteStatus;
import fi.otavanopisto.muikku.plugins.notes.model.NoteType;
import fi.otavanopisto.muikku.session.SessionController;

public class NotesController {
  
  @Inject 
  private SessionController sessionController;
  
  @Inject
  private NoteDAO noteDAO;
  
  public List<Note> listByOwner(Long owner, Boolean listArchived) {
    return noteDAO.listByOwnerAndArchived(owner, listArchived);
  }
  
  public Note createNote(String title, String description, NoteType type, NotePriority priority, Boolean pinned, Long owner, Date startDate, Date dueDate) {
    return noteDAO.create(
        title,
        description,
        type,
        priority,
        pinned,
        owner,
        sessionController.getLoggedUserEntity().getId(),
        sessionController.getLoggedUserEntity().getId(),
        startDate,
        dueDate,
        NoteStatus.ONGOING,
        Boolean.FALSE);
  }
  
  public Note updateNote(Note note, String title, String description, NotePriority priority, Boolean pinned, Date startDate,  Date dueDate, NoteStatus status) {
    return noteDAO.update(note, title, description, priority, pinned, sessionController.getLoggedUserEntity().getId(), startDate, dueDate, status, note.getArchived());
  }
  
  public Note toggleArchived(Note note) {
    return noteDAO.setArchived(note, !note.getArchived());
  }
  
  public Note findNoteById(Long id) {
    return noteDAO.findById(id);
  }

}
