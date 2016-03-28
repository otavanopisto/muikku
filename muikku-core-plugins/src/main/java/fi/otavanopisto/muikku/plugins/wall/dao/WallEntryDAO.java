package fi.otavanopisto.muikku.plugins.wall.dao;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.wall.model.WallEntry_;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.wall.model.Wall;
import fi.otavanopisto.muikku.plugins.wall.model.WallEntry;
import fi.otavanopisto.muikku.plugins.wall.model.WallEntryVisibility;



public class WallEntryDAO extends CorePluginsDAO<WallEntry> {

	private static final long serialVersionUID = 5562545925007839415L;

	public WallEntry create(Wall wall, String text, WallEntryVisibility visibility, UserEntity creator) {
    Date now = new Date();
    return create(wall, text, visibility, creator, creator, now, now, Boolean.FALSE);
  }
  
  public WallEntry create(Wall wall, String text, WallEntryVisibility visibility, UserEntity creator, UserEntity lastModfier, Date created, Date lastModified, Boolean archived) {
    WallEntry wallEntry = new WallEntry();
    
    wallEntry.setWall(wall);
    wallEntry.setVisibility(visibility);
    
    wallEntry.setCreated(created);
    wallEntry.setLastModified(lastModified);
    wallEntry.setCreator(creator.getId());
    wallEntry.setLastModifier(lastModfier.getId());
    wallEntry.setArchived(archived);
    wallEntry.setText(text);
    
    getEntityManager().persist(wallEntry);
    
    return wallEntry;
  }
  
  public List<WallEntry> listEntriesByWall(Wall wall) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WallEntry> criteria = criteriaBuilder.createQuery(WallEntry.class);
    Root<WallEntry> root = criteria.from(WallEntry.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(WallEntry_.wall), wall),
            criteriaBuilder.equal(root.get(WallEntry_.archived), Boolean.FALSE)
        )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public List<WallEntry> listPublicOrOwnedEntriesByWall(Wall wall, UserEntity owner) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WallEntry> criteria = criteriaBuilder.createQuery(WallEntry.class);
    Root<WallEntry> root = criteria.from(WallEntry.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(WallEntry_.wall), wall),
            criteriaBuilder.equal(root.get(WallEntry_.archived), Boolean.FALSE),
            criteriaBuilder.or(
                criteriaBuilder.equal(root.get(WallEntry_.creator), owner.getId()),
                criteriaBuilder.equal(root.get(WallEntry_.visibility), WallEntryVisibility.PUBLIC)
            )
        )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public List<WallEntry> listPublicEntriesByWall(Wall wall) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WallEntry> criteria = criteriaBuilder.createQuery(WallEntry.class);
    Root<WallEntry> root = criteria.from(WallEntry.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(WallEntry_.wall), wall),
            criteriaBuilder.equal(root.get(WallEntry_.archived), Boolean.FALSE),
            criteriaBuilder.equal(root.get(WallEntry_.visibility), WallEntryVisibility.PUBLIC)
        )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
}
