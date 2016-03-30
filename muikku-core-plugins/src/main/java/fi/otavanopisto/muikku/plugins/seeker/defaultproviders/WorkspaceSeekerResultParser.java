package fi.otavanopisto.muikku.plugins.seeker.defaultproviders;

import java.util.Map;

import javax.inject.Inject;

import fi.otavanopisto.muikku.i18n.LocaleController;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.seeker.SeekerResult;
import fi.otavanopisto.muikku.plugins.seeker.SeekerResultParser;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.session.SessionController;

public class WorkspaceSeekerResultParser implements SeekerResultParser {

  @Inject
  private LocaleController localeController;

  @Inject
  private SessionController sessionController;

  @Inject
  private WorkspaceEntityController workspaceEntityController;
  
  @Override
  public String getIndexType() {
    return "Workspace";
  }

  @Override
  public SeekerResult parse(Map<String, Object> entry) {
    String caption = localeController.getText(sessionController.getLocale(), "plugin.seeker.category.courses");
    String label = String.valueOf(entry.get("name"));
    // TODO: Validate
    String[] id = ((String) entry.get("id")).split("/", 2);
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByDataSourceAndIdentifier(id[1], id[0]);
    
    if (workspaceEntity != null)
      return new WorkspaceSeekerResult(label, caption, "/workspace/" + workspaceEntity.getUrlName(), "");
    else
      return null;
  }

}
