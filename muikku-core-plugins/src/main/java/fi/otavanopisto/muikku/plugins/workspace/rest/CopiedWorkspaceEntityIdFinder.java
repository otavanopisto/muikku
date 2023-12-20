package fi.otavanopisto.muikku.plugins.workspace.rest;

import javax.inject.Inject;
import javax.transaction.Transactional;
import javax.transaction.Transactional.TxType;

import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.entity.Workspace;

public class CopiedWorkspaceEntityIdFinder {

  @Inject
  private WorkspaceController workspaceController;

  @Transactional (value = TxType.REQUIRES_NEW)
  public Long findCopiedWorkspaceEntityId(Workspace workspace) {
    SchoolDataIdentifier workspaceIdentifier = new SchoolDataIdentifier(workspace.getIdentifier(), workspace.getSchoolDataSource());

    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntity(workspaceIdentifier);
    return workspaceEntity == null ? null : workspaceEntity.getId();
  }

}
