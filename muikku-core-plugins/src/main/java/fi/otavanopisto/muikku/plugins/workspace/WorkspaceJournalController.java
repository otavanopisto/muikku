package fi.otavanopisto.muikku.plugins.workspace;

import java.util.Collection;
import java.util.Date;
import java.util.List;

import javax.inject.Inject;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.workspace.dao.WorkspaceJournalEntryDAO;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceJournalEntry;

public class WorkspaceJournalController {

  @Inject
  private WorkspaceJournalEntryDAO workspaceJournalEntryDAO;

  public void createJournalEntry(WorkspaceEntity workspaceEntity, UserEntity userEntity, String html, String title) {
    workspaceJournalEntryDAO.create(workspaceEntity, userEntity, html, title, new Date(), Boolean.FALSE);
  }

  public List<WorkspaceJournalEntry> listEntriesForStudents(WorkspaceEntity workspaceEntity, Collection<UserEntity> userEntities, int firstResult, int maxResults) {
    return workspaceJournalEntryDAO.listByWorkspaceEntityAndUserEntities(workspaceEntity, userEntities, firstResult, maxResults);
  }
  
  public List<WorkspaceJournalEntry> listEntriesByWorkspaceEntityAndUserEntity(WorkspaceEntity workspaceEntity, UserEntity userEntity, int firstResult, int maxResults) {
    return workspaceJournalEntryDAO.listByWorkspaceEntityIdAndUserEntityId(workspaceEntity, userEntity, firstResult, maxResults);
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
