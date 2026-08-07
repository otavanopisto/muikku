package fi.otavanopisto.muikku.plugins.workspacenotes;

import java.util.List;

import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceNote;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceNoteType;
import fi.otavanopisto.muikku.plugins.workspacenotes.dao.WorkspaceNoteDAO;

public class WorkspaceNoteController {
  
  @Inject
  private WorkspaceNoteDAO workspaceNoteDAO;
  
  public List<WorkspaceNote> listByWorkspaceAndOwnerAndArchived(Long workspaceEntityId, Long owner, Boolean archived){
    return workspaceNoteDAO.listByOwnerAndWorkspaceAndArchived(owner, workspaceEntityId, archived);
  }
  
  public WorkspaceNote createWorkspaceNote(Long owner, String title, String text, Long workspaceId, Long workspaceMaterialId, String start, String end, Long index, WorkspaceNoteType type) {
    
    return workspaceNoteDAO.create(
        owner, 
        title,
        text, 
        workspaceId,
        workspaceMaterialId,
        start,
        end,
        index,
        type);
  }
  
  public WorkspaceNote updateWorkspaceNote(WorkspaceNote workspaceNote, String title, String note, WorkspaceNoteType type) {
    return workspaceNoteDAO.update(workspaceNote, title, note, type);
  }
  
  public WorkspaceNote archive(WorkspaceNote workspaceNote) {
    return workspaceNoteDAO.setArchived(workspaceNote, Boolean.TRUE);
  }
  
  public WorkspaceNote findWorkspaceNoteById(Long id) {
    return workspaceNoteDAO.findById(id);
  }
  
}
