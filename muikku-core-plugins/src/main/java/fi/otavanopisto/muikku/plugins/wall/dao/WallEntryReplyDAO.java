package fi.otavanopisto.muikku.plugins.wall.dao;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.wall.model.WallEntryReply_;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.wall.model.Wall;
import fi.otavanopisto.muikku.plugins.wall.model.WallEntry;
import fi.otavanopisto.muikku.plugins.wall.model.WallEntryReply;



public class WallEntryReplyDAO extends CorePluginsDAO<WallEntryReply> {

	private static final long serialVersionUID = 4197097795887500969L;

	public WallEntryReply create(Wall wall, WallEntry wallEntry, String text, UserEntity creator) {
    WallEntryReply comment = new WallEntryReply();
    
    Date now = new Date();

    comment.setWallEntry(wallEntry);
    comment.setCreated(now);
    comment.setLastModified(now);
    comment.setCreator(creator.getId());
    comment.setLastModifier(creator.getId());
    comment.setWall(wall);
    comment.setText(text);
    
    getEntityManager().persist(comment);
    
    return comment;
  }

  public List<WallEntryReply> listByWallEntry(WallEntry wallEntry) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WallEntryReply> criteria = criteriaBuilder.createQuery(WallEntryReply.class);
    Root<WallEntryReply> root = criteria.from(WallEntryReply.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(WallEntryReply_.wallEntry), wallEntry),
            criteriaBuilder.equal(root.get(WallEntryReply_.archived), Boolean.FALSE)
        )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
  public Date findMaxDateByWallEntry(WallEntry wallEntry) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Date> criteria = criteriaBuilder.createQuery(Date.class);
    Root<WallEntryReply> root = criteria.from(WallEntryReply.class);
    criteria.select(criteriaBuilder.greatest(root.get(WallEntryReply_.created)));
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(WallEntryReply_.wallEntry), wallEntry),
            criteriaBuilder.equal(root.get(WallEntryReply_.archived), Boolean.FALSE)
        )
    );
    
    return entityManager.createQuery(criteria).getSingleResult();
  }
}
