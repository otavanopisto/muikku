package fi.otavanopisto.muikku.plugins.notes;

import java.util.List;

import javax.inject.Inject;

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
  
  public List<Note> listByOwner(Long owner) {
    return(noteDAO.listByOwnerAndArchived(owner, Boolean.FALSE)); 
  }
  
  public Note createNote(String title, String description, NoteType type, NotePriority priority, Boolean pinned, Long owner) {
    Long lastModifier = sessionController.getLoggedUserEntity().getId();
    Long creator = sessionController.getLoggedUserEntity().getId();

    Note note = noteDAO.create(title, description, type, priority, pinned, owner, creator, lastModifier);
    
    return note;
  }
  
  public Note updateNote(Note note, String title, String description, NotePriority priority, Boolean pinned) {
    Long lastModifier = sessionController.getLoggedUserEntity().getId();
    Note updatedNote = noteDAO.update(note, title, description, priority, pinned, lastModifier);
    
    return updatedNote;
  }
  
  public void archiveNote(Note note) {
    noteDAO.updateArchived(note, true);
  }
  
  public Note findNoteById(Long id) {
    return noteDAO.findByIdAndArchived(id, Boolean.FALSE);
  }
}
