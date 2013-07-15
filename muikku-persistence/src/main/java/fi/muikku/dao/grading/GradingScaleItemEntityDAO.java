package fi.muikku.dao.grading;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.CoreDAO;
import fi.muikku.dao.DAO;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.grading.GradingScaleItemEntity;
import fi.muikku.model.grading.GradingScaleItemEntity_;

@DAO
public class GradingScaleItemEntityDAO extends CoreDAO<GradingScaleItemEntity> {
  
	private static final long serialVersionUID = -5129003092406973620L;

	public GradingScaleItemEntity create(SchoolDataSource dataSource, String identifier, Boolean archived) {
    GradingScaleItemEntity gradingScaleItemEntity = new GradingScaleItemEntity();
    
    gradingScaleItemEntity.setDataSource(dataSource);
    gradingScaleItemEntity.setIdentifier(identifier);
    gradingScaleItemEntity.setArchived(archived);
    
    return persist(gradingScaleItemEntity);
  }

	public GradingScaleItemEntity findByDataSourceAndIdentifier(SchoolDataSource schoolDataSource, String identifier) {
		EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<GradingScaleItemEntity> criteria = criteriaBuilder.createQuery(GradingScaleItemEntity.class);
    Root<GradingScaleItemEntity> root = criteria.from(GradingScaleItemEntity.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(          
          criteriaBuilder.equal(root.get(GradingScaleItemEntity_.dataSource), schoolDataSource),
          criteriaBuilder.equal(root.get(GradingScaleItemEntity_.identifier), identifier)
        )
    );
   
    return getSingleResult( entityManager.createQuery(criteria) );
	}

}
