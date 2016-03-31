package fi.otavanopisto.muikku.plugins.dnm;

import java.io.IOException;
import java.util.Map;
import java.util.logging.Logger;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.event.Observes;
import javax.enterprise.event.TransactionPhase;
import javax.inject.Inject;

import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataWorkspaceDiscoveredEvent;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataWorkspaceUpdatedEvent;

@ApplicationScoped
public class DeusNexMachinaSchoolDataWorkspaceListener {
  
  @Inject
  private Logger logger;
  
  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private DeusNexMachinaController deusNexMachinaController;
  
  public void onDeusNexMachinaWorkspaceDiscoveredEvent(@Observes (during = TransactionPhase.BEFORE_COMPLETION) SchoolDataWorkspaceDiscoveredEvent event) {
    if (event.getExtra() != null && event.getExtra().containsKey("pyramusVariables")) {
      @SuppressWarnings("unchecked")
      Map<String, String> pyramusVariables = (Map<String, String>) event.getExtra().get("pyramusVariables");
      if (pyramusVariables != null && pyramusVariables.containsKey("dnmid")) {
        String dnmId = pyramusVariables.get("dnmid");
        Long workspaceEntityId = event.getDiscoveredWorkspaceEntityId();
        try {
          deusNexMachinaController.setWorkspaceEntityIdDnmId(dnmId, workspaceEntityId);
        } catch (IOException e) {
          logger.severe("Could not store workspace entity id dnmId map");
        }
      }
    }
  }
  
  public void onDeusNexMachinaWorkspaceUpdatedEvent(@Observes SchoolDataWorkspaceUpdatedEvent event) {
    if (event.getExtra() != null && event.getExtra().containsKey("pyramusVariables")) {
      @SuppressWarnings("unchecked")
      Map<String, String> pyramusVariables = (Map<String, String>) event.getExtra().get("pyramusVariables");
      if (pyramusVariables != null && pyramusVariables.containsKey("dnmid")) {
        String dnmId = pyramusVariables.get("dnmid");
        WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByDataSourceAndIdentifier(event.getDataSource(), event.getIdentifier());
        if (workspaceEntity != null) {
          try {
            deusNexMachinaController.setWorkspaceEntityIdDnmId(dnmId, workspaceEntity.getId());
          } catch (IOException e) {
            logger.severe("Could not store workspace entity id dnmId map");
          }
        }
      }
    }
  }
  
}
