package fi.muikku.plugins.dnm.service;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.ejb.Lock;
import javax.ejb.LockType;
import javax.ejb.Schedule;
import javax.ejb.Singleton;
import javax.enterprise.event.Observes;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import fi.muikku.events.ContextDestroyedEvent;
import fi.muikku.events.ContextInitializedEvent;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.dnm.DeusNexMachinaController;
import fi.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.muikku.plugins.workspace.model.WorkspaceNode;
import fi.muikku.schooldata.WorkspaceEntityController;

@Singleton
@Lock(LockType.READ)
public class DeusNexServiceDownloadUpdater {
  
  @Inject
  private Logger logger;

  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private WorkspaceMaterialController workspaceMaterialController;
  
  @Inject
  private RestClient client;

  @Inject
  private DeusNexMachinaController deusNexMachinaController;

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

  @Schedule(hour = "*", minute = "*", second = "*/20", persistent = false)
  public void downloadNext() {
    if (contextInitialized) {
      if (!running) {
        running = true;
        try {
          Long pendingDownload = deusNexImportQueueController.getNextPendingDownload();
          if (pendingDownload != null) {
            logger.info(String.format("Processing dnm document #%d", pendingDownload));
            
            try {
              Document document = client.getDocument(pendingDownload);
              if (document != null) {
                logger.info(String.format("Downloading dnm document #%d (%s)", document.getId(), document.getPath()));
                
                String documentData = client.getDocumentData(pendingDownload);
                if (documentData != null) {
                  String path = document.getPath();
                  int slashIndex = path.indexOf('/');
                  String workspaceName = slashIndex > -1 ? path.substring(0, slashIndex) : path;
                  String workspacePath = slashIndex > -1 ? path.substring(slashIndex + 1) : null;
                      
                  WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByUrlName(workspaceName);
                  if (workspaceEntity != null) {
                    
                    WorkspaceNode parentNode = null;
                    if (StringUtils.isBlank(workspacePath)) {
                      parentNode = workspaceMaterialController.findWorkspaceRootFolderByWorkspaceEntity(workspaceEntity);
                    } else {
                      String[] pathElements = workspacePath.split("/");
                      parentNode = workspaceMaterialController.findWorkspaceRootFolderByWorkspaceEntity(workspaceEntity);
                      WorkspaceNode parent = parentNode;
                      
                      for (int i = 0, l = pathElements.length; i < l; i++) {
                        String pathElement = pathElements[i];
                        parentNode = workspaceMaterialController.findWorkspaceNodeByParentAndUrlName(parent, pathElement);
                        if (parentNode == null) {
                          parentNode = workspaceMaterialController.createWorkspaceFolder(parent, pathElement, pathElement);
                        }
        
                        parent = parentNode;
                      }
                    }
                    
                    logger.info(String.format("Importing dnm document #%d into workspace %s", document.getId(), workspaceEntity.getUrlName()));
                    
                    InputStream documentStream = new ByteArrayInputStream(documentData.getBytes("UTF-8"));
                    try {
                      deusNexMachinaController.importDeusNexDocument(parentNode, documentStream);
                    } finally {
                      documentStream.close();
                    }
                   
                    deusNexImportQueueController.removePendingDownload(pendingDownload);
      
                    logger.info(String.format("Processed dnm document #%d (%s)", document.getId(), document.getPath()));
                  } else {
                    logger.log(Level.WARNING, String.format("Ignoring import for document %s because maching workspace could not be found", document.getPath()));
                  }
                } else {
                  logger.severe(String.format("Pending dnm document %d did not contain any data", pendingDownload));
                }
              } else {
                logger.severe(String.format("Pending dnm document %d could not be found", pendingDownload));
              }
            } catch (Exception e) {
              logger.warning(String.format("Dnm document %d processing failed, added it back to queue: " + e.getMessage(), pendingDownload));
            }
          }
        } finally {
          running = false;
        }    
      }
    }
  }

  private boolean contextInitialized;
  private boolean running;
}
