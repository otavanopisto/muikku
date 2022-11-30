package fi.otavanopisto.muikku.plugins.workspacenotes;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceNote;
import fi.otavanopisto.muikku.plugins.workspacenotes.dao.WorkspaceNoteDAO;

public class WorkspaceNoteController {
  
  @Inject
  private WorkspaceNoteDAO workspaceNoteDAO;
  
  public List<WorkspaceNote> listByOwnerAndArchived(Long owner) {
    return workspaceNoteDAO.listByOwnerAndArchived(owner);
  }
  
  public List<WorkspaceNote> listByWorkspaceAndOwnerAndArchived(Long workspaceEntityId, Long owner){
    List<WorkspaceNote> notes = workspaceNoteDAO.listByOwnerAndWorkspaceAndArchived(owner, workspaceEntityId);
    sortWorkspaceNotes(notes);
    return notes;
  }
  
  public WorkspaceNote createWorkspaceNote(Long owner, String title, String note, Long workspaceId) {
    
    Integer maximumOrderNumber = workspaceNoteDAO.getMaximumOrderNumberByOwnerAndWorkspace(workspaceId, owner);
    return workspaceNoteDAO.create(
        owner, 
        title,
        note, 
        workspaceId, 
        maximumOrderNumber++,
        Boolean.FALSE);
  }
  
  public WorkspaceNote updateWorkspaceNote(WorkspaceNote workspaceNote, String title, String note) {
    return workspaceNoteDAO.update(workspaceNote, title, note);
  }
  
  public WorkspaceNote archive(WorkspaceNote workspaceNote) {
    return workspaceNoteDAO.setArchived(workspaceNote, Boolean.TRUE);
  }
  
  public WorkspaceNote findWorkspaceNoteById(Long id) {
    return workspaceNoteDAO.findById(id);
  }
  
  public WorkspaceNote updateOrderNumber(WorkspaceNote workspaceNote, Integer newOrderNumber) {

    return workspaceNoteDAO.updateOrderNumber(workspaceNote, newOrderNumber);
    
  }

  /**
   * Sorts the given list of workspace notes.
   * 
   * @param workspaceNotes
   *          The list of workspace notes to sort
   */
  public void sortWorkspaceNotes(List<WorkspaceNote> workspaceNotes) {
    Collections.sort(workspaceNotes, new Comparator<WorkspaceNote>() {
      @Override
      public int compare(WorkspaceNote o1, WorkspaceNote o2) {
        int o1OrderNumber = o1.getOrderNumber() == null ? 0 : o1.getOrderNumber();
        int o2OrderNumber = o2.getOrderNumber() == null ? 0 : o2.getOrderNumber();
        return o1OrderNumber - o2OrderNumber;
      }
    });
  }
  
  /**
   * Updates the order numbers of workspace notes so that
   * <code>workspaceNote</code> appears above <code>referenceNote</code>.
   * 
   * @param workspaceNote
   *          The workspace note to be moved
   * @param referenceNote
   *          The workspace note above which <code>workspaceNote</code> is moved
   * 
   * @return The updated workspace note
   */
  public WorkspaceNote moveAbove(WorkspaceNote workspaceNote, WorkspaceNote referenceNode) {
    // Order number of the reference note
    Integer referenceOrderNumber = referenceNode.getOrderNumber() == null ? 0 : referenceNode.getOrderNumber();
    // Workspace notes with order number >= reference order number
    List<WorkspaceNote> subsequentNodes = workspaceNoteDAO.listByOrderNumberEqualOrGreater(referenceNode);
    // Sort workspace notes according to order number
    sortWorkspaceNotes(subsequentNodes);
    // note order number = referenceOrderNumber, subsequent notes =
    // ++referenceOrderNumber
    workspaceNote = workspaceNoteDAO.updateOrderNumber(workspaceNote, referenceOrderNumber);
    for (WorkspaceNote subsequentNode : subsequentNodes) {
      if (!(subsequentNode.getId().equals(workspaceNote.getId()))) {
        workspaceNoteDAO.updateOrderNumber(subsequentNode, ++referenceOrderNumber);
      }
    }
    return workspaceNote;
  }
  
  public Integer getMaximumOrderNumberByOwnerAndWorkspace(Long workspaceEntityId, Long ownerEntityId) {
    return workspaceNoteDAO.getMaximumOrderNumberByOwnerAndWorkspace(workspaceEntityId, ownerEntityId);
  }
  
  public WorkspaceNote findWorkspaceNoteNextSibling(WorkspaceNote referenceNote) {
    List<WorkspaceNote> nextSiblings = workspaceNoteDAO.listByOrderNumberGreater(referenceNote);
    if (nextSiblings.isEmpty()) {
      return null;
    }

    return nextSiblings.get(0);
  }
}
