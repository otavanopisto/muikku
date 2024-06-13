package fi.otavanopisto.muikku.plugins.workspace.fieldio;

import javax.inject.Inject;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceJournalController;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceJournalEntry;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialField;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.users.UserEntityController;

public class WorkspaceJournalFieldIOHandler implements WorkspaceFieldIOHandler {

  @Inject
  private WorkspaceJournalController workspaceJournalController;
  
  @Inject
  private WorkspaceMaterialController workspaceMaterialController;
  
  @Inject
  private WorkspaceEntityController workspaceEntityController;
  @Inject
  private UserEntityController userEntityController;

  @Override
  public void store(WorkspaceMaterialField field, WorkspaceMaterialReply reply, String value) throws WorkspaceFieldIOException {
    String identifier = String.format("%d-%d", field.getId(), reply.getId()); 
    
    WorkspaceJournalEntry journalEntry = workspaceJournalController.findJournalEntryByMaterialFieldReplyIdentifier(identifier);

    if (journalEntry == null) {
      UserEntity userEntity = userEntityController.findUserEntityById(reply.getUserEntityId());
        
      Long workspaceEntityId = workspaceMaterialController.getWorkspaceEntityId(field.getWorkspaceMaterial());
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
          
      if (workspaceEntity != null) { 
        journalEntry = workspaceJournalController.createJournalEntry(workspaceEntity, userEntity, value, identifier, field.getWorkspaceMaterial().getTitle());
      }
    } else {
      journalEntry = workspaceJournalController.updateJournalEntry(journalEntry, journalEntry.getTitle(), value);
    }
  }

  @Override
  public String retrieve(WorkspaceMaterialField field, WorkspaceMaterialReply reply) throws WorkspaceFieldIOException {
    String identifier = String.format("%d-%d", field.getId(), reply.getId()); 
    
    WorkspaceJournalEntry journalEntry = workspaceJournalController.findJournalEntryByMaterialFieldReplyIdentifier(identifier);
    if (journalEntry != null) {
      return journalEntry.getHtml();
    }
    
    return null;
  }

  @Override
  public String getType() {
    return "application/vnd.muikku.field.journal";
  }

}
