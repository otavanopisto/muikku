package fi.otavanopisto.muikku.plugins.dnm.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.ejb.Lock;
import javax.ejb.LockType;
import javax.ejb.Schedule;
import javax.ejb.Singleton;
import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.otavanopisto.muikku.events.ContextDestroyedEvent;
import fi.otavanopisto.muikku.events.ContextInitializedEvent;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.dnm.DeusNexMachinaController;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;

@Singleton
@Lock(LockType.READ)
public class DeusNexServiceUpdater {
  
  @Inject
  private Logger logger;

  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private DeusNexMachinaController deusNexMachinaController;
  
  @Inject
  private RestClient client;
  
  @Inject
  private DeusNexImportQueueController deusNexImportQueueController;

  @PostConstruct
  public void init() {
    running = false;
    contextInitialized = false;
  }
  
  public void onContextInitialized(@Observes ContextInitializedEvent event) {
    contextInitialized = true;
  }

  public void onContextDestroyed(@Observes ContextDestroyedEvent event) {
    contextInitialized = false;
  }
 
  @Schedule(hour = "*", minute = "*/1", second = "0", persistent = false)
  public void findDocuments() {
    if (contextInitialized) {
      if (!running) {
        try {
          running = true;
          List<Document> documents = Arrays.asList(client.listDocuments());
          
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
            
            if (deusNexImportQueueController.isDownloaded(document.getId())) {
              continue;
            }
            
            if (deusNexImportQueueController.isPendingDownload(document.getId())) {
              continue;
            }

            if (document.getPath() == null) {
              logger.log(Level.SEVERE, "Document " + document.getId() + " has no path");
            }

            String path = document.getPath();
            int slashIndex = path.indexOf('/');
            String dnmId = slashIndex > -1 ? path.substring(0, slashIndex) : path;
            Long workspaceEntityId = deusNexMachinaController.getWorkspaceEntityIdDnmId(dnmId);
            if (workspaceEntityId == null) {
              logger.log(Level.WARNING, String.format("Postponing import because dnm id <> workspace entity id mapping for document %s could not be found", document.getPath()));
              return;
            } else {
              WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
              if (workspaceEntity != null) {
                newImports.add(document.getId());
              } else {
                logger.log(Level.WARNING, String.format("Postponing import because workspace for document %s could not be found", document.getPath()));
                return;
              }              
            }
          }
          
          if (!newImports.isEmpty()) {
            logger.info(String.format("Queued %d dnm imports", newImports.size()));
            deusNexImportQueueController.addPendingDownloads(newImports);
          }
          
          deusNexImportQueueController.setLastUpdate(System.currentTimeMillis());
        } finally {
          running = false;
        }    
      }
    }
  }

  private boolean contextInitialized;
  private boolean running;
  
}
