package fi.muikku.plugins.dnm.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Schedule;
import javax.ejb.Singleton;
import javax.inject.Inject;

import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.schooldata.WorkspaceEntityController;

@Singleton
public class DeusNextServiceUpdater {
  
  @Inject
  private Logger logger;

  @Inject
  private WorkspaceEntityController workspaceEntityController;
  
  @Inject
  private RestClient client;
  
  @Inject
  private DeusNexImportQueueController deusNexImportQueueController;

  @Schedule(hour = "*", minute = "*", second = "0", persistent = false)
  public void findDocuments() {
    Document[] documents = null;
    Date since = getSince();
    
    if (since == null) {
      documents = client.listDocuments();
    } else {
      documents = client.listDocuments(since);
    }
    
    List<Long> newImports = new ArrayList<>();
    for (Document document : documents) {
      String path = document.getPath();
      int slashIndex = path.indexOf('/');
      String workspaceName = slashIndex > -1 ? path.substring(0, slashIndex) : path;
      
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByUrlName(workspaceName);
      if (workspaceEntity != null) {
        newImports.add(document.getId());
      } else {
        logger.log(Level.WARNING, String.format("Ignoring import for document %s because maching workspace could not be found", document.getPath()));
      }
    }
    
    deusNexImportQueueController.addPendingDownloads(newImports);
    deusNexImportQueueController.setLastUpdate(System.currentTimeMillis());
  }
  
  private Date getSince() {
    Long lastUpdate = deusNexImportQueueController.getLastUpdate();
    if (lastUpdate != null) {
      return new Date(lastUpdate);
    }
    
    return null;
  }
  
}
