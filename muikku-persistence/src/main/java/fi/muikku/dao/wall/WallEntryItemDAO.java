package fi.muikku.dao.wall;

import java.util.List;

import fi.muikku.dao.CoreDAO;
import fi.muikku.dao.DAO;
import fi.muikku.model.wall.AbstractWallEntry;
import fi.muikku.model.wall.WallEntryItem;
import fi.muikku.model.wall.WallEntryItem_;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;


@DAO
public class WallEntryItemDAO extends CoreDAO<WallEntryItem> {

	private static final long serialVersionUID = -2007591084552501172L;

	public List<WallEntryItem> listByWallEntry(AbstractWallEntry wallEntry) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WallEntryItem> criteria = criteriaBuilder.createQuery(WallEntryItem.class);
    Root<WallEntryItem> root = criteria.from(WallEntryItem.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(WallEntryItem_.wallEntry), wallEntry),
            criteriaBuilder.equal(root.get(WallEntryItem_.archived), Boolean.FALSE)
        )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }
}
