package fi.otavanopisto.muikku.dao.workspace;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.model.workspace.WorkspaceSettingsTemplateRolePermission_;
import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.model.security.Permission;
import fi.otavanopisto.muikku.model.users.RoleEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceSettingsTemplate;
import fi.otavanopisto.muikku.model.workspace.WorkspaceSettingsTemplateRolePermission;

public class WorkspaceSettingsTemplateRolePermissionDAO extends CoreDAO<WorkspaceSettingsTemplateRolePermission> {

  private static final long serialVersionUID = 3182148767968644506L;

  public WorkspaceSettingsTemplateRolePermission create(WorkspaceSettingsTemplate workspaceSettingsTemplate, RoleEntity roleEntity, Permission permission) {
    WorkspaceSettingsTemplateRolePermission wstrp = new WorkspaceSettingsTemplateRolePermission();
    wstrp.setWorkspaceSettingsTemplate(workspaceSettingsTemplate);
    wstrp.setRole(roleEntity);
    wstrp.setPermission(permission);
    getEntityManager().persist(wstrp);
    return wstrp;
  }
  
  public List<WorkspaceSettingsTemplateRolePermission> listByTemplate(WorkspaceSettingsTemplate workspaceSettingsTemplate) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceSettingsTemplateRolePermission> criteria = criteriaBuilder.createQuery(WorkspaceSettingsTemplateRolePermission.class);
    Root<WorkspaceSettingsTemplateRolePermission> root = criteria.from(WorkspaceSettingsTemplateRolePermission.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.equal(root.get(WorkspaceSettingsTemplateRolePermission_.workspaceSettingsTemplate), workspaceSettingsTemplate)
    );

    return entityManager.createQuery(criteria).getResultList();
  }
  
}
