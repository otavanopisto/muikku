package fi.muikku.dao.grading;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.CoreDAO;
import fi.muikku.dao.DAO;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.grading.GradingScaleEntity;
import fi.muikku.model.grading.GradingScaleEntity_;

@DAO
public class GradingScaleEntityDAO extends CoreDAO<GradingScaleEntity> {
  
	private static final long serialVersionUID = -5129003092406973620L;

	public GradingScaleEntity create(SchoolDataSource dataSource, String identifier, Boolean archived) {
    GradingScaleEntity gradingScaleEntity = new GradingScaleEntity();
    
    gradingScaleEntity.setDataSource(dataSource);
    gradingScaleEntity.setIdentifier(identifier);
    gradingScaleEntity.setArchived(archived);
    
    return persist(gradingScaleEntity);
  }

	public GradingScaleEntity findByDataSourceAndIdentifier(SchoolDataSource schoolDataSource, String identifier) {
		EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<GradingScaleEntity> criteria = criteriaBuilder.createQuery(GradingScaleEntity.class);
    Root<GradingScaleEntity> root = criteria.from(GradingScaleEntity.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(          
          criteriaBuilder.equal(root.get(GradingScaleEntity_.dataSource), schoolDataSource),
          criteriaBuilder.equal(root.get(GradingScaleEntity_.identifier), identifier)
        )
    );
   
    return getSingleResult( entityManager.createQuery(criteria) );
	}

}
