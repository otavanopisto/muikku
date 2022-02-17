package fi.otavanopisto.muikku.plugins.notes;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.ArrayList;
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
  
  public List<Note> listByOwner(Long owner, Boolean listArchived) {
    List<Note> noteList = noteDAO.listByOwnerAndArchived(owner, listArchived);
    
    // Notes whose dueDate is gone should be archived automatically
    List<Note> filteredNoteList = new ArrayList<>();
    for (Note note : noteList) {
      
      // Check if dueDate is already gone but note isn't archived yet
      if (note.getDueDate() != null && note.getArchived().equals(Boolean.FALSE)) {
        OffsetDateTime dueDate = toOffsetDateTime(note.getDueDate());
        // Archive note if dueDate is earlier than yesterday
        if (dueDate.isBefore(OffsetDateTime.now().minusDays(1))) {
          archiveNote(note);
        } else {
          filteredNoteList.add(note);
        }
      } else {
        filteredNoteList.add(note);
      }
    }
    return filteredNoteList; 
  }
  
  public Note createNote(String title, String description, NoteType type, NotePriority priority, Boolean pinned, Long owner, Date dueDate) {

    Note note = noteDAO.create(title, description, type, priority, pinned, owner, sessionController.getLoggedUserEntity().getId(), sessionController.getLoggedUserEntity().getId(), dueDate);
    
    return note;
  }
  
  public Note updateNote(Note note, String title, String description, NotePriority priority, Boolean pinned, Date dueDate) {
    Long lastModifier = sessionController.getLoggedUserEntity().getId();
    Note updatedNote = noteDAO.update(note, title, description, priority, pinned, lastModifier, dueDate);
    
    return updatedNote;
  }
  
  public void archiveNote(Note note) {
    noteDAO.updateArchived(note, true);
  }
  
  public Note findNoteById(Long id) {
    return noteDAO.findById(id);
  }
  
  private OffsetDateTime toOffsetDateTime(Date date) {
    Instant instant = date.toInstant();
    ZoneId systemId = ZoneId.systemDefault();
    ZoneOffset offset = systemId.getRules().getOffset(instant);
    return date.toInstant().atOffset(offset);
  }
}
