package fi.otavanopisto.muikku.plugins.workspace.dao;

import java.util.Date;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceEntityFile;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceEntityFile_;

public class WorkspaceEntityFileDAO extends CorePluginsDAO<WorkspaceEntityFile> {

  private static final long serialVersionUID = -6603691652301118805L;

  public WorkspaceEntityFile create(WorkspaceEntity workspaceEntity, String fileIdentifier, 
      String diskName, String contentType, Date lastModified) {
    WorkspaceEntityFile file = new WorkspaceEntityFile();
    file.setWorkspaceEntity(workspaceEntity.getId());
    file.setFileIdentifier(fileIdentifier);
    file.setDiskName(diskName);
    file.setContentType(contentType);
    file.setLastModified(lastModified);
    return persist(file);
  }

  public WorkspaceEntityFile findByWorkspaceAndIdentifier(WorkspaceEntity workspaceEntity, String fileIdentifier) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceEntityFile> criteria = criteriaBuilder.createQuery(WorkspaceEntityFile.class);
    Root<WorkspaceEntityFile> root = criteria.from(WorkspaceEntityFile.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(WorkspaceEntityFile_.workspaceEntity), workspaceEntity.getId()),
            criteriaBuilder.equal(root.get(WorkspaceEntityFile_.fileIdentifier), fileIdentifier)
         )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }

  public WorkspaceEntityFile update(WorkspaceEntityFile workspaceEntityFile, String contentType, Date lastModified) {
    workspaceEntityFile.setContentType(contentType);
    workspaceEntityFile.setLastModified(lastModified);
    return persist(workspaceEntityFile);
  }

  public void delete(WorkspaceEntityFile workspaceEntityFile) {
    super.delete(workspaceEntityFile);
  }

}
