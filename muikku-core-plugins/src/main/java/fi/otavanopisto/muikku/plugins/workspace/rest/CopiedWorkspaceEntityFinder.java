package fi.otavanopisto.muikku.plugins.workspace.rest;

import javax.inject.Inject;
import javax.transaction.Transactional;
import javax.transaction.Transactional.TxType;

import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.entity.Workspace;

public class CopiedWorkspaceEntityFinder {

  @Inject
  private WorkspaceController workspaceController;

  @Transactional (value = TxType.REQUIRES_NEW)
  public WorkspaceEntity findCopiedWorkspaceEntity(Workspace workspace) {
    return workspaceController.findWorkspaceEntity(workspace);
  }

}
