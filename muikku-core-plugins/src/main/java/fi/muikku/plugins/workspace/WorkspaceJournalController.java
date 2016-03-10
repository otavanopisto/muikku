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
    workspaceJournalEntryDAO.create(workspaceEntity, userEntity, html, title, new Date(), Boolean.FALSE);
  }

  public List<WorkspaceJournalEntry> listEntries(WorkspaceEntity workspaceEntity) {
    return workspaceJournalEntryDAO.listByWorkspaceEntityId(workspaceEntity.getId());
  }
  
  public List<WorkspaceJournalEntry> listEntriesByWorkspaceEntityAndUserEntity(WorkspaceEntity workspaceEntity, UserEntity userEntity){
    return workspaceJournalEntryDAO.listByWorkspaceEntityIdAndUserEntityId(workspaceEntity.getId(), userEntity.getId());
  }

  public long countEntriesByWorkspaceEntityAndUserEntity(WorkspaceEntity workspaceEntity, UserEntity userEntity) {
    return workspaceJournalEntryDAO.countByWorkspaceEntityIdAndUserEntityId(workspaceEntity.getId(), userEntity.getId());
  }
  
  public WorkspaceJournalEntry findLatestsEntryByWorkspaceEntityAndUserEntity(WorkspaceEntity workspaceEntity, UserEntity userEntity) {
    return workspaceJournalEntryDAO.findLatestByWorkspaceEntityIdAndUserEntityId(workspaceEntity.getId(), userEntity.getId());
  }
  
  public WorkspaceJournalEntry findJournalEntry(Long workspaceJournalEntryId) {
    return workspaceJournalEntryDAO.findById(workspaceJournalEntryId);
  }

  public WorkspaceJournalEntry updateJournalEntry(Long workspaceJournalEntryId, String title, String html){
    WorkspaceJournalEntry workspaceJournalEntry = workspaceJournalEntryDAO.findById(workspaceJournalEntryId);
    return workspaceJournalEntryDAO.updateHtml(workspaceJournalEntryDAO.updateTitle(workspaceJournalEntry, title), html);
  }
  
  public void archiveJournalEntry(WorkspaceJournalEntry workspaceJournalEntry){
    workspaceJournalEntryDAO.updateArchived(workspaceJournalEntry, Boolean.TRUE);
  }
}
