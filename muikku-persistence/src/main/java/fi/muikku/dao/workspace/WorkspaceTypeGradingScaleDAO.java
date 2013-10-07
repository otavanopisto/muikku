package fi.muikku.dao.workspace;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.CoreDAO;
import fi.muikku.dao.DAO;
import fi.muikku.model.grading.GradingScaleEntity;
import fi.muikku.model.workspace.WorkspaceTypeEntity;
import fi.muikku.model.workspace.WorkspaceTypeGradingScale;
import fi.muikku.model.workspace.WorkspaceTypeGradingScale_;

@DAO
public class WorkspaceTypeGradingScaleDAO extends CoreDAO<WorkspaceTypeGradingScale> {

	private static final long serialVersionUID = 2289284306254194974L;

	public WorkspaceTypeGradingScale create(WorkspaceTypeEntity workspaceType, GradingScaleEntity gradingScale) {
		WorkspaceTypeGradingScale workspaceTypeGradingScale = new WorkspaceTypeGradingScale();
		workspaceTypeGradingScale.setWorkspaceType(workspaceType);
		workspaceTypeGradingScale.setGradingScale(gradingScale);
    return persist(workspaceTypeGradingScale);
  }

	public List<GradingScaleEntity> listGradingScalesByWorkspaceType(WorkspaceTypeEntity workspaceType) {
		EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<GradingScaleEntity> criteria = criteriaBuilder.createQuery(GradingScaleEntity.class);
    Root<WorkspaceTypeGradingScale> root = criteria.from(WorkspaceTypeGradingScale.class);
    criteria.select(root.get(WorkspaceTypeGradingScale_.gradingScale));
    criteria.where(
        criteriaBuilder.and(          
          criteriaBuilder.equal(root.get(WorkspaceTypeGradingScale_.workspaceType), workspaceType)
        )
    );
   
    return entityManager.createQuery(criteria).getResultList();
	}
	
}
