package fi.otavanopisto.muikku.plugins.workspace.dao;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.model.workspace.WorkspaceMaterialFieldAnswerSnapshot;
import fi.otavanopisto.muikku.model.workspace.WorkspaceMaterialFieldAnswerSnapshot_;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;

public class WorkspaceMaterialFieldAnswerSnapshotDAO extends CorePluginsDAO<WorkspaceMaterialFieldAnswerSnapshot> {

  private static final long serialVersionUID = 4624151587633750125L;
  
  public WorkspaceMaterialFieldAnswerSnapshot create(Long workspaceMaterialFieldId, Long userEntityId, String value) {
    WorkspaceMaterialFieldAnswerSnapshot snapshot = new WorkspaceMaterialFieldAnswerSnapshot();
    snapshot.setDate(new Date());
    snapshot.setUserEntityId(userEntityId);
    snapshot.setValue(value);
    snapshot.setWorkspaceMaterialFieldId(workspaceMaterialFieldId);
    return persist(snapshot);
  }

  public List<WorkspaceMaterialFieldAnswerSnapshot> listByWorkspaceMaterialFieldIdAndUserEntityId(Long workspaceMaterialFieldId, Long userEntityId) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceMaterialFieldAnswerSnapshot> criteria = criteriaBuilder.createQuery(WorkspaceMaterialFieldAnswerSnapshot.class);
    Root<WorkspaceMaterialFieldAnswerSnapshot> root = criteria.from(WorkspaceMaterialFieldAnswerSnapshot.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
          criteriaBuilder.equal(root.get(WorkspaceMaterialFieldAnswerSnapshot_.workspaceMaterialFieldId), workspaceMaterialFieldId),
          criteriaBuilder.equal(root.get(WorkspaceMaterialFieldAnswerSnapshot_.userEntityId), userEntityId)
        )
    );

    return entityManager.createQuery(criteria).getResultList();
  }
  
  public void delete(WorkspaceMaterialFieldAnswerSnapshot workspaceMaterialFieldAnswerSnapshot) {
    super.delete(workspaceMaterialFieldAnswerSnapshot);
  }

}
