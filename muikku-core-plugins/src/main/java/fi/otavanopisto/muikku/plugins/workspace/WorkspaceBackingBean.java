package fi.otavanopisto.muikku.plugins.workspace;

import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.search.SearchProvider;
import fi.otavanopisto.muikku.search.SearchResult;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.session.local.LocalSession;

@Named
@Stateful
@RequestScoped
public class WorkspaceBackingBean {

  @Inject
  private WorkspaceController workspaceController;

  @LocalSession
  @Inject
  private SessionController sessionController;

  @Inject
  @Any
  private Instance<SearchProvider> searchProviders;
  
  @PostConstruct
  public void init() {
    workspaceEntityId = null;
  }
  
  public String getWorkspaceUrlName() {
    return workspaceUrlName;
  }

  @Deprecated
  public Long getWorkspaceId() {
    return workspaceEntityId;
  }
  
  public Long getWorkspaceEntityId() {
    return workspaceEntityId;
  }
  
  public WorkspaceEntity getWorkspaceEntity() {
    if (getWorkspaceEntityId() == null) {
      return null;
    }
    
    return workspaceController.findWorkspaceEntityById(getWorkspaceEntityId());
  }

  public void setWorkspaceUrlName(String workspaceUrlName) {
    
    WorkspaceEntity workspaceEntity = resolveWorkspaceEntity(workspaceUrlName);
    if (workspaceEntity != null) {
      this.workspaceEntityId = workspaceEntity.getId();
      this.workspaceUrlName = workspaceEntity.getUrlName();
    }
    
    // Workspace name and extension via Elastic

    for (SearchProvider searchProvider : searchProviders) {
      if (StringUtils.equals(searchProvider.getName(), "elastic-search")) {
        SearchResult searchResult = searchProvider.findWorkspace(workspaceEntity.schoolDataIdentifier());
        if (searchResult.getTotalHitCount() > 0) {
          List<Map<String, Object>> results = searchResult.getResults();
          Map<String, Object> match = results.get(0);
          this.workspaceName = (String) match.get("name");
          this.workspaceNameExtension = (String) match.get("nameExtension");
        }
      }
    }
  }

  private WorkspaceEntity resolveWorkspaceEntity(String workspaceUrlName) {
    if (StringUtils.isBlank(workspaceUrlName)) {
      return null;
    }

    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityByUrlName(workspaceUrlName);
    if (workspaceEntity == null) {
      return null;
    }

    return workspaceEntity;
  }

  public String getWorkspaceName() {
    return workspaceName;
  }

  public String getWorkspaceNameExtension() {
    return workspaceNameExtension;
  }
  

  private Long workspaceEntityId;
  private String workspaceUrlName;
  private String workspaceName;
  private String workspaceNameExtension;

}
