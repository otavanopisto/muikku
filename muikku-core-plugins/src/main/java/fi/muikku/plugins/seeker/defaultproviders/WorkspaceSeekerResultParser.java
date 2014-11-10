package fi.muikku.plugins.seeker.defaultproviders;

import java.util.Map;

import javax.inject.Inject;

import fi.muikku.i18n.LocaleController;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.seeker.SeekerResult;
import fi.muikku.plugins.seeker.SeekerResultParser;
import fi.muikku.schooldata.WorkspaceEntityController;
import fi.muikku.session.SessionController;

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
    return new WorkspaceSeekerResult(label, caption, "/workspace/" + workspaceEntity.getUrlName(), "");
  }

}
