package fi.muikku.plugins.workspace.rest;

import javax.inject.Inject;
import javax.transaction.Transactional;
import javax.transaction.Transactional.TxType;

import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.entity.Workspace;

public class CopiedWorkspaceEntityFinder {

  @Inject
  private WorkspaceController workspaceController;

  @Transactional (value = TxType.REQUIRES_NEW)
  public WorkspaceEntity findCopiedWorkspaceEntity(Workspace workspace) {
    return workspaceController.findWorkspaceEntity(workspace);
  }

}
