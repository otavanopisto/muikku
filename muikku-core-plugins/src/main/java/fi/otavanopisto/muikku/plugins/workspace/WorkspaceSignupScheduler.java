package fi.otavanopisto.muikku.plugins.workspace;

import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import javax.ejb.Schedule;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.otavanopisto.muikku.model.workspace.WorkspaceAccess;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.search.WorkspaceIndexer;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.search.SearchProvider;
import fi.otavanopisto.muikku.search.SearchResult;

@Startup
@Singleton
public class WorkspaceSignupScheduler {
  
  @Inject
  private Logger logger;
  
  @Inject
  @Any
  private Instance<SearchProvider> searchProviders;

  @Inject 
  private WorkspaceEntityController workspaceEntityController;
  
  @Inject
  private WorkspaceIndexer workspaceIndexer;
  
  @Schedule (dayOfWeek="*") 
  public void cleanup() {
    
    SearchProvider elasticSearchProvider = null;
    Iterator<SearchProvider> searchProviderIterator = searchProviders.iterator();
    if (searchProviderIterator.hasNext()) {
      elasticSearchProvider = searchProviderIterator.next();
    }
    if (elasticSearchProvider == null) {
      logger.info(("Search provider not found"));
    }
    
    SearchResult searchResult = elasticSearchProvider.searchWorkspacesSignupEnd();
    List<Map<String, Object>> results = searchResult.getResults();
    for (Map<String, Object> result : results) {
      String searchId = (String) result.get("id");
      SchoolDataIdentifier workspaceIdentifier = SchoolDataIdentifier.fromString(searchId);
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByIdentifier(workspaceIdentifier);
      if (workspaceEntity != null) {
        workspaceEntityController.updateAccess(workspaceEntity, WorkspaceAccess.MEMBERS_ONLY);
        workspaceIndexer.indexWorkspace(workspaceEntity);
      } else {
        logger.info(String.format("Workspace entity % d not found.", workspaceIdentifier));

      }
    }
    logger.info(String.format("Access updated to %d workspaces", searchResult.getTotalHitCount()));
  }
  
}
