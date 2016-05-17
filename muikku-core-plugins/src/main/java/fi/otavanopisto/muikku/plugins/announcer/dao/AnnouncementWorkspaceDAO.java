package fi.otavanopisto.muikku.plugins.announcer.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.announcer.model.Announcement;
import fi.otavanopisto.muikku.plugins.announcer.workspace.model.AnnouncementWorkspace;
import fi.otavanopisto.muikku.plugins.announcer.workspace.model.AnnouncementWorkspace_;

public class AnnouncementWorkspaceDAO extends CorePluginsDAO<AnnouncementWorkspace> {
	
  private static final long serialVersionUID = -8721990589622544635L;
  
  public AnnouncementWorkspace create(
      Announcement announcement,
      Long workspaceEntityId,
      boolean archived
  ) {
    AnnouncementWorkspace announcemenWorkspace = new AnnouncementWorkspace();
    announcemenWorkspace.setAnnouncement(announcement);
    announcemenWorkspace.setWorkspaceEntityId(workspaceEntityId);
    announcemenWorkspace.setArchived(archived);
    
    return persist(announcemenWorkspace);
 }
  
  public void archive(AnnouncementWorkspace announcementWorkspace) {
    if(announcementWorkspace != null){
      announcementWorkspace.setArchived(true);
      getEntityManager().persist(announcementWorkspace);
    }
  }
  
  public List<AnnouncementWorkspace> listByArchived(boolean archived){
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<AnnouncementWorkspace> criteria = criteriaBuilder.createQuery(AnnouncementWorkspace.class);
    Root<AnnouncementWorkspace> root = criteria.from(AnnouncementWorkspace.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.equal(root.get(AnnouncementWorkspace_.archived), archived));
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
  public List<AnnouncementWorkspace> listByAnnouncementAndArchived(
      Announcement announcement,
      boolean archived
  ) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<AnnouncementWorkspace> criteria = criteriaBuilder.createQuery(AnnouncementWorkspace.class);
    Root<AnnouncementWorkspace> root = criteria.from(AnnouncementWorkspace.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
          criteriaBuilder.equal(root.get(AnnouncementWorkspace_.announcement), announcement),
          criteriaBuilder.equal(root.get(AnnouncementWorkspace_.archived), archived)));
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
  public void delete(AnnouncementWorkspace announcementWorkspace){
    super.delete(announcementWorkspace);
  }
  
}
