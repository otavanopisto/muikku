package fi.muikku.dao.workspace;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.CoreDAO;
import fi.muikku.dao.DAO;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.workspace.WorkspaceTypeEntity;
import fi.muikku.model.workspace.WorkspaceTypeSchoolDataIdentifier;
import fi.muikku.model.workspace.WorkspaceTypeSchoolDataIdentifier_;

@DAO
public class WorkspaceTypeSchoolDataIdentifierDAO extends CoreDAO<WorkspaceTypeSchoolDataIdentifier> {

	private static final long serialVersionUID = -1469329918761324465L;

	public WorkspaceTypeSchoolDataIdentifier findByDataSourceAndIdentifier(SchoolDataSource dataSource, String identifier) {
		EntityManager entityManager = getEntityManager();

		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<WorkspaceTypeSchoolDataIdentifier> criteria = criteriaBuilder.createQuery(WorkspaceTypeSchoolDataIdentifier.class);
		Root<WorkspaceTypeSchoolDataIdentifier> root = criteria.from(WorkspaceTypeSchoolDataIdentifier.class);
		criteria.select(root);
		criteria.where(
	    criteriaBuilder.and(
	      criteriaBuilder.equal(root.get(WorkspaceTypeSchoolDataIdentifier_.dataSource), dataSource),
        criteriaBuilder.equal(root.get(WorkspaceTypeSchoolDataIdentifier_.identifier), identifier)
	    )
    );

		return getSingleResult(entityManager.createQuery(criteria));
	}

	public WorkspaceTypeSchoolDataIdentifier findByDataSourceAndUserEntity(SchoolDataSource dataSource, WorkspaceTypeEntity workspaceTypeEntity) {
		EntityManager entityManager = getEntityManager();

		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<WorkspaceTypeSchoolDataIdentifier> criteria = criteriaBuilder.createQuery(WorkspaceTypeSchoolDataIdentifier.class);
		Root<WorkspaceTypeSchoolDataIdentifier> root = criteria.from(WorkspaceTypeSchoolDataIdentifier.class);
		criteria.select(root);
		criteria.where(
	    criteriaBuilder.and(
	      criteriaBuilder.equal(root.get(WorkspaceTypeSchoolDataIdentifier_.dataSource), dataSource),
        criteriaBuilder.equal(root.get(WorkspaceTypeSchoolDataIdentifier_.workspaceTypeEntity), workspaceTypeEntity)
	    )
    );

		return getSingleResult(entityManager.createQuery(criteria));
	}

	public List<WorkspaceTypeSchoolDataIdentifier> listByWorkspaceTypeEntity(WorkspaceTypeEntity workspaceTypeEntity) {
		EntityManager entityManager = getEntityManager();

		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<WorkspaceTypeSchoolDataIdentifier> criteria = criteriaBuilder.createQuery(WorkspaceTypeSchoolDataIdentifier.class);
		Root<WorkspaceTypeSchoolDataIdentifier> root = criteria.from(WorkspaceTypeSchoolDataIdentifier.class);
		criteria.select(root);
		criteria.where(
      criteriaBuilder.equal(root.get(WorkspaceTypeSchoolDataIdentifier_.workspaceTypeEntity), workspaceTypeEntity)
    );

		return entityManager.createQuery(criteria).getResultList();
	}

}
