package fi.muikku.dao.wall;

import java.util.Date;
import java.util.List;

import fi.muikku.dao.CoreDAO;
import fi.muikku.dao.DAO;
import fi.muikku.model.stub.users.UserEntity;
import fi.muikku.model.wall.Wall;
import fi.muikku.model.wall.WallEntry;
import fi.muikku.model.wall.WallEntryVisibility;
import fi.muikku.model.wall.WallEntry_;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;


@DAO
public class WallEntryDAO extends CoreDAO<WallEntry> {

	private static final long serialVersionUID = 5562545925007839415L;

	public WallEntry create(Wall wall, WallEntryVisibility visibility, UserEntity creator) {
    Date now = new Date();
    return create(wall, visibility, creator, creator, now, now, Boolean.FALSE);
  }
  
  public WallEntry create(Wall wall, WallEntryVisibility visibility, UserEntity creator, UserEntity lastModfier, Date created, Date lastModified, Boolean archived) {
    WallEntry wallEntry = new WallEntry();
    
    wallEntry.setWall(wall);
    wallEntry.setVisibility(visibility);
    
    wallEntry.setCreated(created);
    wallEntry.setLastModified(lastModified);
    wallEntry.setCreator(creator);
    wallEntry.setLastModifier(lastModfier);
    wallEntry.setArchived(archived);
    
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
                criteriaBuilder.equal(root.get(WallEntry_.creator), owner),
                criteriaBuilder.equal(root.get(WallEntry_.visibility), WallEntryVisibility.PUBLIC)
            )
        )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
}
