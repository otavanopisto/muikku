package fi.muikku.plugins.dnm.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Schedule;
import javax.ejb.Singleton;
import javax.inject.Inject;

import fi.muikku.controller.PluginSettingsController;
import fi.muikku.model.plugins.PluginSettingKey;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.dnm.DeusNexMachinaPluginDescriptor;
import fi.muikku.schooldata.WorkspaceController;
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
  private PluginSettingsController pluginSettingsController;
  
  @Schedule(hour = "*", minute = "*", second = "*/20")
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
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByUrlName(document.getName());
      if (workspaceEntity != null) {
        newImports.add(document.getId());
      } else {
        logger.log(Level.WARNING, String.format("Ignoring import for document %s because maching workspace could not be found", document.getName()));
      }
    }
    
    
  }
  
  private Date getSince() {
    return null;
  }
  
}
