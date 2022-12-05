package fi.otavanopisto.muikku.plugins.workspacenotes;

import java.util.Comparator;
import java.util.List;

import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceNote;
import fi.otavanopisto.muikku.plugins.workspacenotes.dao.WorkspaceNoteDAO;

public class WorkspaceNoteController {
  
  @Inject
  private WorkspaceNoteDAO workspaceNoteDAO;
  
  public List<WorkspaceNote> listByOwnerAndArchived(Long owner) {
    List<WorkspaceNote> workspaceNotes = workspaceNoteDAO.listByOwnerAndArchived(owner);
    workspaceNotes.sort(Comparator.comparing(WorkspaceNote::getOrderNumber));
    return workspaceNotes; 
  }
  
  public List<WorkspaceNote> listByWorkspaceAndOwnerAndArchived(Long workspaceEntityId, Long owner){
    List<WorkspaceNote> workspaceNotes = workspaceNoteDAO.listByOwnerAndWorkspaceAndArchived(owner, workspaceEntityId);
    workspaceNotes.sort(Comparator.comparing(WorkspaceNote::getOrderNumber));
    return workspaceNotes;
  }
  
  public WorkspaceNote createWorkspaceNote(Long owner, String title, String note, Long workspaceId) {
    
    Integer maximumOrderNumber = workspaceNoteDAO.getMaximumOrderNumberByOwnerAndWorkspace(workspaceId, owner);
    
    if (maximumOrderNumber == null) {
      maximumOrderNumber = 0;
    } else {
      ++maximumOrderNumber;
    }
    return workspaceNoteDAO.create(
        owner, 
        title,
        note, 
        workspaceId, 
        maximumOrderNumber,
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
    subsequentNodes.sort(Comparator.comparing(WorkspaceNote::getOrderNumber));

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
