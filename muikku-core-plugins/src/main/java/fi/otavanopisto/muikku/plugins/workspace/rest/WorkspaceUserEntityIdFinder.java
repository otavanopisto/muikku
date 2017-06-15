package fi.otavanopisto.muikku.plugins.workspace.rest;

import javax.inject.Inject;
import javax.transaction.Transactional;
import javax.transaction.Transactional.TxType;

import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;

public class WorkspaceUserEntityIdFinder {

  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;

  @Transactional (value = TxType.REQUIRES_NEW)
  public Long findWorkspaceUserEntityId(WorkspaceEntity workspaceEntity, SchoolDataIdentifier userIdentifier) {
    WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findWorkspaceUserByWorkspaceEntityAndUserIdentifier(workspaceEntity, userIdentifier);
    return workspaceUserEntity == null ? null : workspaceUserEntity.getId();
  }

}
