package fi.muikku.plugins.seeker.defaultproviders;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;

import fi.muikku.i18n.LocaleController;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.seeker.DefaultSeekerResultImpl;
import fi.muikku.plugins.seeker.SeekerResult;
import fi.muikku.plugins.seeker.SeekerResultProvider;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.entity.Workspace;
import fi.muikku.session.SessionController;


public class WorkspaceSeekerResultProvider implements SeekerResultProvider {

  @Inject
  private SessionController sessionController;
  
  @Inject
  private LocaleController localeController;
  
  @Inject
  private WorkspaceController workspaceController;
  
  @Override
  public List<SeekerResult> search(String searchTerm) {
    return seekerify(workspaceController.listWorkspaces(), searchTerm);
  }

  private List<SeekerResult> seekerify(List<Workspace> workspaces, String searchTerm) {
    List<SeekerResult> result = new ArrayList<SeekerResult>();

    searchTerm = searchTerm.toLowerCase();
    String caption = localeController.getText(sessionController.getLocale(), "plugin.seeker.category.courses");

    for (Workspace workspace : workspaces) {
      WorkspaceEntity e = workspaceController.findWorkspaceEntity(workspace);
      
      // TODO remove
      if ((workspace.getName().toLowerCase().contains(searchTerm)) || (workspace.getDescription().toLowerCase().contains(searchTerm)))
        result.add(new WorkspaceSeekerResult(workspace.getName(), caption, "/workspace/" + e.getUrlName(), ""));
    }
    
    return result;
  }
  
}
