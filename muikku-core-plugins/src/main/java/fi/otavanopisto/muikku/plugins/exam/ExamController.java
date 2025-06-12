package fi.otavanopisto.muikku.plugins.exam;

import java.util.Collections;
import java.util.List;

import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialController;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceFolder;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterial;

public class ExamController {
  
  @Inject
  private WorkspaceMaterialController workspaceMaterialController;
  
  public List<WorkspaceMaterial> listContents(Long workspaceFolderId) {
    return Collections.emptyList();
  }
  
  private List<Long> randomizeAssignments(WorkspaceFolder folder) {
    List <WorkspaceMaterial> assignments = workspaceMaterialController.listVisibleWorkspaceAssignments(folder);
    return Collections.emptyList();
  }

}
