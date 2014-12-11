package fi.muikku.plugins.dnm.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
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
public class DeusNexServiceUpdater {
  
  @Inject
  private Logger logger;

  @Inject
  private WorkspaceEntityController workspaceEntityController;
  
  @Inject
  private RestClient client;
  
  @Inject
  private DeusNexImportQueueController deusNexImportQueueController;

  @Schedule(hour = "*", minute = "*/1", second = "0", persistent = false)
  public void findDocuments() {
    List<Document> documents = null;
    Date since = getSince();
    
    if (since == null) {
      documents = Arrays.asList(client.listDocuments());
    } else {
      documents = Arrays.asList(client.listDocuments(since));
    }
    
    Collections.sort(documents, new Comparator<Document>() {
      
      @Override
      public int compare(Document o1, Document o2) {
        return o1.getPriority() - o2.getPriority();
      }
      
    });
    
    List<Long> importNos = deusNexImportQueueController.getImportNos();
    List<Long> newImports = new ArrayList<>();
    for (Document document : documents) {
      if (importNos != null && !importNos.contains(document.getId())) {
        continue;
      }
      
      String path = document.getPath();
      int slashIndex = path.indexOf('/');
      String workspaceName = slashIndex > -1 ? path.substring(0, slashIndex) : path;
      
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByUrlName(workspaceName);
      if (workspaceEntity != null) {
        newImports.add(document.getId());
      } else {
        logger.log(Level.WARNING, String.format("Postponing import because workspace for document %s could not be found", document.getPath()));
        return;
      }
    }
    
    if (!newImports.isEmpty()) {
      logger.info(String.format("Queued %d dnm imports", newImports.size()));
      deusNexImportQueueController.addPendingDownloads(newImports);
    }
    
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
