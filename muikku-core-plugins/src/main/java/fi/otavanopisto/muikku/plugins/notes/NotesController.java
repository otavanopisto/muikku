package fi.otavanopisto.muikku.plugins.notes;

import java.util.Date;
import java.util.List;

import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.notes.dao.NoteDAO;
import fi.otavanopisto.muikku.users.UserEntityController;

public class NotesController {
  
  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private NoteDAO noteDAO;
  
  public List<Note> listBy(String owner) {
    return(noteDAO.listBy(owner)); 
  }
  
  public Note createNote(String title, String description, NoteType type, NotePriority priority, Boolean pinned, String owner, String creator, Date created, String lastModifier, Date lastModified, Boolean archived) {
    Note note = noteDAO.create(title, description, type, priority, pinned, owner, creator, created, lastModifier, lastModified, archived);
    
    return note;
  }
  
  public Note updateNote(Note note, String title, String description, NotePriority priority, Boolean pinned, String lastModifier, Date lastModified, Boolean archived) {
    Note updatedNote = noteDAO.update(note, title, description, priority, pinned, lastModifier, lastModified, archived);
    
    return updatedNote;
  }
  
  public Note findNoteById(Long id) {
    return noteDAO.findById(id);
  }
}
