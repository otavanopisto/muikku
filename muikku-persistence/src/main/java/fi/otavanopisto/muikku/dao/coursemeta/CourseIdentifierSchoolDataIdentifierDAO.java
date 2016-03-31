package fi.otavanopisto.muikku.dao.coursemeta;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.model.coursemeta.CourseIdentifierSchoolDataIdentifier_;
import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.model.base.SchoolDataSource;
import fi.otavanopisto.muikku.model.coursemeta.CourseIdentifierEntity;
import fi.otavanopisto.muikku.model.coursemeta.CourseIdentifierSchoolDataIdentifier;

public class CourseIdentifierSchoolDataIdentifierDAO extends CoreDAO<CourseIdentifierSchoolDataIdentifier> {

	private static final long serialVersionUID = 5040808468841562299L;

	public CourseIdentifierSchoolDataIdentifier create(SchoolDataSource dataSource, String identifier, CourseIdentifierEntity courseIdentifierEntity) {
		CourseIdentifierSchoolDataIdentifier courseIdentifierSchoolDataIdentifier = new CourseIdentifierSchoolDataIdentifier();
		courseIdentifierSchoolDataIdentifier.setDataSource(dataSource);
		courseIdentifierSchoolDataIdentifier.setIdentifier(identifier);
		courseIdentifierSchoolDataIdentifier.setCourseIdentifierEntity(courseIdentifierEntity);
		return persist(courseIdentifierSchoolDataIdentifier);
	}
	

	public CourseIdentifierSchoolDataIdentifier findByDataSourceAndIdentifier(SchoolDataSource dataSource, String identifier) {
		EntityManager entityManager = getEntityManager();

		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<CourseIdentifierSchoolDataIdentifier> criteria = criteriaBuilder.createQuery(CourseIdentifierSchoolDataIdentifier.class);
		Root<CourseIdentifierSchoolDataIdentifier> root = criteria.from(CourseIdentifierSchoolDataIdentifier.class);
		criteria.select(root);
		criteria.where(
	    criteriaBuilder.and(
	      criteriaBuilder.equal(root.get(CourseIdentifierSchoolDataIdentifier_.dataSource), dataSource),
        criteriaBuilder.equal(root.get(CourseIdentifierSchoolDataIdentifier_.identifier), identifier)
	    )
    );

		return getSingleResult(entityManager.createQuery(criteria));
	}

	public CourseIdentifierSchoolDataIdentifier findByDataSourceAndUserEntity(SchoolDataSource dataSource, CourseIdentifierEntity courseIdentifierEntity) {
		EntityManager entityManager = getEntityManager();

		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<CourseIdentifierSchoolDataIdentifier> criteria = criteriaBuilder.createQuery(CourseIdentifierSchoolDataIdentifier.class);
		Root<CourseIdentifierSchoolDataIdentifier> root = criteria.from(CourseIdentifierSchoolDataIdentifier.class);
		criteria.select(root);
		criteria.where(
	    criteriaBuilder.and(
	      criteriaBuilder.equal(root.get(CourseIdentifierSchoolDataIdentifier_.dataSource), dataSource),
        criteriaBuilder.equal(root.get(CourseIdentifierSchoolDataIdentifier_.courseIdentifierEntity), courseIdentifierEntity)
	    )
    );

		return getSingleResult(entityManager.createQuery(criteria));
	}

	public List<CourseIdentifierSchoolDataIdentifier> listByCourseIdentifierEntity(CourseIdentifierEntity courseIdentifierEntity) {
		EntityManager entityManager = getEntityManager();

		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<CourseIdentifierSchoolDataIdentifier> criteria = criteriaBuilder.createQuery(CourseIdentifierSchoolDataIdentifier.class);
		Root<CourseIdentifierSchoolDataIdentifier> root = criteria.from(CourseIdentifierSchoolDataIdentifier.class);
		criteria.select(root);
		criteria.where(
      criteriaBuilder.equal(root.get(CourseIdentifierSchoolDataIdentifier_.courseIdentifierEntity), courseIdentifierEntity)
    );

		return entityManager.createQuery(criteria).getResultList();
	}
	
	@Override
	public void delete(CourseIdentifierSchoolDataIdentifier courseIdentifierSchoolDataIdentifier) {
		super.delete(courseIdentifierSchoolDataIdentifier);
	}

}
