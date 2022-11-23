package fi.otavanopisto.muikku.plugins.workspacenotes;

import java.util.List;

import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceNote;
import fi.otavanopisto.muikku.plugins.workspacenotes.dao.WorkspaceNoteDAO;

public class WorkspaceNoteController {
  
  @Inject
  private WorkspaceNoteDAO WorkspaceNoteDAO;
  
  public List<WorkspaceNote> listByOwnerAndArchived(Long owner) {
    return WorkspaceNoteDAO.listByOwnerAndArchived(owner);
  }
  
  public List<WorkspaceNote> listByWorkspaceAndOwnerAndArchived(Long workspaceEntityId, Long owner){
    return WorkspaceNoteDAO.listByOwnerAndWorkspaceAndArchived(owner, workspaceEntityId);
  }
  
  public WorkspaceNote createWorkspaceNote(Long owner, String title, String note, Long workspaceId) {
    return WorkspaceNoteDAO.create(
        owner, 
        title,
        note, 
        workspaceId, 
        Boolean.FALSE);
  }
  
  public WorkspaceNote updateWorkspaceNote(WorkspaceNote workspaceNote, String title, String note) {
    return WorkspaceNoteDAO.update(workspaceNote, title, note);
  }
  
  public WorkspaceNote archive(WorkspaceNote workspaceNote) {
    return WorkspaceNoteDAO.setArchived(workspaceNote, Boolean.TRUE);
  }
  
  public WorkspaceNote findWorkspaceNoteById(Long id) {
    return WorkspaceNoteDAO.findById(id);
  }

}
