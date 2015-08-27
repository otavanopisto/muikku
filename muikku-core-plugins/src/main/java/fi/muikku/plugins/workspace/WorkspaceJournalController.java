package fi.muikku.plugins.workspace;

import java.util.Date;
import java.util.List;

import javax.inject.Inject;

import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.workspace.dao.WorkspaceJournalEntryDAO;
import fi.muikku.plugins.workspace.model.WorkspaceJournalEntry;

public class WorkspaceJournalController {

  @Inject
  private WorkspaceJournalEntryDAO workspaceJournalEntryDAO;

  public void createJournalEntry(WorkspaceEntity workspaceEntity, UserEntity userEntity, String html, String title) {
    workspaceJournalEntryDAO.create(workspaceEntity, userEntity, html, title, new Date());
  }

  public List<WorkspaceJournalEntry> listEntries(WorkspaceEntity workspaceEntity) {
    return workspaceJournalEntryDAO.listByWorkspaceEntityId(workspaceEntity.getId());
  }
  
  public List<WorkspaceJournalEntry> listEntriesByWorkspaceEntityAndUserEntity(WorkspaceEntity workspaceEntity, UserEntity userEntity){
    return workspaceJournalEntryDAO.listByWorkspaceEntityIdAndUserEntityId(workspaceEntity.getId(), userEntity.getId());
  }

  public WorkspaceJournalEntry updateJournalEntry(Long workspaceJournalEntryId, String title, String html){
    WorkspaceJournalEntry workspaceJournalEntry = workspaceJournalEntryDAO.findById(workspaceJournalEntryId);
    return workspaceJournalEntryDAO.updateHtml(workspaceJournalEntryDAO.updateTitle(workspaceJournalEntry, title), html);
  }
  
  public void deleteJournalEntry(Long workspaceJournalEntryId){
    workspaceJournalEntryDAO.delete(workspaceJournalEntryDAO.findById(workspaceJournalEntryId));
  }
}
