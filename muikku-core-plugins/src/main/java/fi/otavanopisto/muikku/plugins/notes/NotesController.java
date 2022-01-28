package fi.otavanopisto.muikku.plugins.notes;

import java.util.Date;
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
  
  public List<Note> listBy(String owner) {
    return(noteDAO.listBy(owner)); 
  }
  
  public Note createNote(String title, String description, NoteType type, NotePriority priority, Boolean pinned, String owner, String creator, Date created) {
    Note note = noteDAO.create(title, description, type, priority, pinned, owner, creator, created);
    
    return note;
  }
  
  public Note updateNote(Note note, String title, String description, NotePriority priority, Boolean pinned) {
    String lastModifier = sessionController.getLoggedUser().toString();
    Date lastModified = new Date();
    Note updatedNote = noteDAO.update(note, title, description, priority, pinned, lastModifier, lastModified);
    
    return updatedNote;
  }
  
  public void archiveNote(Note note) {
    noteDAO.updateArchived(note, true);
  }
  
  public void deleteNote(Note note) {
    noteDAO.delete(note);
  }
  
  public Note findNoteById(Long id) {
    return noteDAO.findById(id);
  }
}
