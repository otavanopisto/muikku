package fi.muikku.plugins.wall.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.DAO;
import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.wall.model.AbstractWallEntry;
import fi.muikku.plugins.wall.model.WallEntryItem;
import fi.muikku.plugins.wall.model.WallEntryItem_;


@DAO
public class WallEntryItemDAO extends PluginDAO<WallEntryItem> {

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
