package fi.otavanopisto.muikku.plugins.notes;

import java.util.List;

import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.notes.dao.NoteRecipientDAO;
import fi.otavanopisto.muikku.plugins.notes.model.Note;
import fi.otavanopisto.muikku.plugins.notes.model.NoteReceiver;
import fi.otavanopisto.muikku.plugins.notes.model.NoteStatus;

public class NoteReceiverController {

  @Inject
  private NoteRecipientDAO noteRecipientDAO;

  public List<NoteReceiver> listByNote(Note note) {
    return noteRecipientDAO.listByNote(note);
  }

  public List<NoteReceiver> listByReceiver(Long recipientId) {
    return noteRecipientDAO.listByReceiver(recipientId);
  }

  public NoteReceiver createNoteRecipient(Boolean pinned, Long recipient, Note note, Long userGroupId,
      Long workspaceId) {
    return noteRecipientDAO.create(pinned, recipient, NoteStatus.ONGOING, Boolean.FALSE, note, userGroupId,
        workspaceId);
  }

  public NoteReceiver updateNoteRecipient(NoteReceiver noteRecipient, Boolean pinned, NoteStatus status) {
    return noteRecipientDAO.update(noteRecipient, pinned, status);
  }

  public NoteReceiver updateNoteWorkspaceAndUserGroup(NoteReceiver noteRecipient, Long userGroupId,
      Long workspaceId) {
    return noteRecipientDAO.updateWorkspaceAndUserGroup(noteRecipient, userGroupId, workspaceId);
  }

  public List<NoteReceiver> listReceiversByNoteAndWorkspace(Note note, Long workspaceEntityId) {
    return noteRecipientDAO.listByNoteAndWorkspace(note, workspaceEntityId);
  }
  
  public List<NoteReceiver> listReceiversByNoteAndUserGroup(Note note, Long userGroupId) {
    return noteRecipientDAO.listByNoteAndRecipientGroup(note, userGroupId);
  }

  public NoteReceiver findByRecipientIdAndNote(Long id, Note note) {
    return noteRecipientDAO.findByRecipientIdAndNote(id, note);
  }

  public void deleteRecipient(NoteReceiver noteReceiver) {
    noteRecipientDAO.deleteReceiver(noteReceiver);
  }

  public boolean isMultiUserNote(Note note) {
    return noteRecipientDAO.listByNote(note).size() > 1;
  }
}
